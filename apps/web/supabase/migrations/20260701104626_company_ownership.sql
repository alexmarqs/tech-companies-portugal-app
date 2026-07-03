-- Supervised companies + ownership feature.
--
-- The `companies` table becomes the source of truth for company listings:
-- rows are either synced from the GitHub README (source = 'github') or
-- submitted through the app (source = 'submitted', pending moderation).
-- Ownership is modelled with `company_members` (owner/editor), invitations
-- with `company_invitations`, and unpublished edits with `company_drafts`
-- (one working copy per company, saved by any member, published by owners).
--
-- Ownership claims on submission:
-- The submit form asks whether the submitter wants to claim ownership of the
-- company, and why. Not every submitter is part of the company they list:
-- unclaimed submissions start orphaned (zero owners, claimable later), so
-- submitters are NOT auto-owned on insert. Ownership is instead granted when
-- moderation approves a company whose submitter claimed it — approval is the
-- confirmation ("If ownership is confirmed, this company will be added to
-- your profile"). If moderation approves the listing but not the claim,
-- service_role removes the membership afterwards.
--
-- Moderation invariants:
-- - Pending companies are frozen until moderation approves them: what a
--   moderator reviewed must be what goes live. Without this, an owner could
--   submit an innocuous listing and rewrite its content (directly via the
--   API, bypassing the UI) between review and approval. Editing resumes once
--   the company is approved — via drafts, published by owners.
-- - Moderation-owned columns (status, source, is_featured, published_at) are
--   only writable by service_role via column-scoped grants.
--
-- Cross-table visibility:
-- - Company members can see each other's basic profile (the members list on
--   /my-companies); users RLS otherwise only allows viewing your own row.
-- - The /invitations/[token] accept page loads the invitation with its
--   company and inviter embedded, so invitees can see the inviter's profile
--   and the invited company (even while pending) while the invitation is
--   live: pending, unexpired, and addressed to the signed-in user's email.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type "public"."company_source" as enum ('github', 'submitted');
create type "public"."company_status" as enum ('pending', 'approved', 'rejected');
create type "public"."company_member_role" as enum ('owner', 'editor');
create type "public"."company_invitation_status" as enum ('pending', 'accepted', 'declined', 'expired');

-- ---------------------------------------------------------------------------
-- companies (canonical listing)
-- ---------------------------------------------------------------------------
create table "public"."companies" (
  "id" uuid not null default gen_random_uuid(),
  "slug" text not null,
  "name" text not null,
  "description" text not null default '',
  "website_url" text not null default '',
  "careers_url" text not null default '',
  "github_url" text not null default '',
  "categories" text[] not null default '{}',
  "locations" text[] not null default '{}',
  "logo_url" text,
  "is_featured" boolean not null default false,
  "source" public.company_source not null default 'submitted',
  "status" public.company_status not null default 'pending',
  "submitted_by" uuid,
  "ownership_claimed" boolean not null default false,
  "ownership_reason" text,
  "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "published_at" timestamp with time zone
);

alter table "public"."companies" enable row level security;

create unique index companies_pkey on public.companies using btree (id); -- PK
create unique index companies_slug_key on public.companies using btree (slug); -- Unique slug.
-- Case-insensitive unique name so "Acme" and "acme" can't both be listed.
create unique index companies_name_key on public.companies using btree (lower(name)); -- Name index.
create index idx_companies_status on public.companies using btree (status); -- Status index.

alter table "public"."companies" add constraint "companies_pkey" primary key using index "companies_pkey";
alter table "public"."companies" add constraint "companies_slug_key" unique using index "companies_slug_key";
alter table "public"."companies" add constraint "companies_submitted_by_fkey" foreign key (submitted_by) references public.users(id) on delete set null;

-- ---------------------------------------------------------------------------
-- company_members (ownership); Many-to-many between companies and users.
-- ---------------------------------------------------------------------------
create table "public"."company_members" (
  "id" uuid not null default gen_random_uuid(),
  "company_id" uuid not null,
  "user_id" uuid not null,
  "role" public.company_member_role not null default 'editor',
  "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);

alter table "public"."company_members" enable row level security;

create unique index company_members_pkey on public.company_members using btree (id);
create unique index company_members_company_id_user_id_key on public.company_members using btree (company_id, user_id);
create index idx_company_members_user_id on public.company_members using btree (user_id);

alter table "public"."company_members" add constraint "company_members_pkey" primary key using index "company_members_pkey";
alter table "public"."company_members" add constraint "company_members_company_id_user_id_key" unique using index "company_members_company_id_user_id_key";
alter table "public"."company_members" add constraint "company_members_company_id_fkey" foreign key (company_id) references public.companies(id) on delete cascade;
alter table "public"."company_members" add constraint "company_members_user_id_fkey" foreign key (user_id) references public.users(id) on delete cascade;

-- ---------------------------------------------------------------------------
-- company_invitations
-- ---------------------------------------------------------------------------
create table "public"."company_invitations" (
  "id" uuid not null default gen_random_uuid(),
  "company_id" uuid not null,
  "email" text not null,
  "role" public.company_member_role not null default 'editor',
  -- Supplied by the app on insert: crypto.randomBytes(32).toString("hex")
  -- (256-bit, URL-safe). No DB default so a missing token fails loudly.
  -- Stored in plaintext by design, not hashed: accepting also requires being
  -- signed in as the matching invited email (see accept_company_invitation),
  -- so the token is a second factor rather than a standalone credential.
  -- If we ever want it hashed at rest, do it app-side (no pgcrypto needed):
  --   const tokenHash = createHash("sha256").update(token).digest("hex");
  -- store tokenHash here, email the raw token, look up by hash on accept.
  "token" text not null,
  "status" public.company_invitation_status not null default 'pending',
  "invited_by" uuid,
  "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "expires_at" timestamp with time zone not null default (timezone('utc'::text, now()) + interval '7 days'),
  "responded_at" timestamp with time zone
);

alter table "public"."company_invitations" enable row level security;

create unique index company_invitations_pkey on public.company_invitations using btree (id);
create unique index company_invitations_token_key on public.company_invitations using btree (token);
create index idx_company_invitations_company_id on public.company_invitations using btree (company_id);
create index idx_company_invitations_email on public.company_invitations using btree (lower(email));
-- Only one live (pending) invitation per company + email; declined/expired ones
-- don't block re-inviting.
create unique index company_invitations_pending_key on public.company_invitations using btree (company_id, lower(email)) where (status = 'pending');

alter table "public"."company_invitations" add constraint "company_invitations_pkey" primary key using index "company_invitations_pkey";
alter table "public"."company_invitations" add constraint "company_invitations_token_key" unique using index "company_invitations_token_key";
alter table "public"."company_invitations" add constraint "company_invitations_company_id_fkey" foreign key (company_id) references public.companies(id) on delete cascade;
alter table "public"."company_invitations" add constraint "company_invitations_invited_by_fkey" foreign key (invited_by) references public.users(id) on delete set null;

-- ---------------------------------------------------------------------------
-- company_drafts (one unpublished working copy per company)
-- ---------------------------------------------------------------------------
create table "public"."company_drafts" (
  "id" uuid not null default gen_random_uuid(),
  "company_id" uuid not null,
  "name" text not null,
  "description" text not null default '',
  "website_url" text not null default '',
  "careers_url" text not null default '',
  "github_url" text not null default '',
  "categories" text[] not null default '{}',
  "locations" text[] not null default '{}',
  "created_by" uuid,
  "updated_by" uuid,
  "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);

alter table "public"."company_drafts" enable row level security;

create unique index company_drafts_pkey on public.company_drafts using btree (id);
create unique index company_drafts_company_id_key on public.company_drafts using btree (company_id);

alter table "public"."company_drafts" add constraint "company_drafts_pkey" primary key using index "company_drafts_pkey";
alter table "public"."company_drafts" add constraint "company_drafts_company_id_key" unique using index "company_drafts_company_id_key";
alter table "public"."company_drafts" add constraint "company_drafts_company_id_fkey" foreign key (company_id) references public.companies(id) on delete cascade;
alter table "public"."company_drafts" add constraint "company_drafts_created_by_fkey" foreign key (created_by) references public.users(id) on delete set null;
alter table "public"."company_drafts" add constraint "company_drafts_updated_by_fkey" foreign key (updated_by) references public.users(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Helper functions.
-- All SECURITY DEFINER so they bypass RLS on the tables they consult and can
-- be used inside other tables' policies without nested policy evaluation
-- recursing.
-- ---------------------------------------------------------------------------
set check_function_bodies = off;

-- The signed-in user's role for a company.
create or replace function public.user_company_role(_company_id uuid)
 returns public.company_member_role
 language sql
 stable
 security definer
 set search_path to 'public'
as $function$
  select role
  from public.company_members
  where company_id = _company_id
    and user_id = auth.uid()
  limit 1;
$function$;

-- Whether the signed-in user shares at least one company with _user_id.
-- Used by the users policy so co-members can see each other's profile.
create or replace function public.shares_company_with(_user_id uuid)
 returns boolean
 language sql
 stable
 security definer
 set search_path to 'public'
as $function$
  select exists (
    select 1
    from public.company_members mine
    join public.company_members theirs
      on theirs.company_id = mine.company_id
    where mine.user_id = auth.uid()
      and theirs.user_id = _user_id
  );
$function$;

-- Whether a company is approved, without re-evaluating the companies RLS
-- policies per row inside the drafts policies below.
create or replace function public.company_is_approved(_company_id uuid)
 returns boolean
 language sql
 stable
 security definer
 set search_path to 'public'
as $function$
  select exists (
    select 1
    from public.companies
    where id = _company_id
      and status = 'approved'
  );
$function$;

-- Whether _user_id has a live invitation addressed to the signed-in user's
-- email. Used by the users policy so invitees can see who invited them.
create or replace function public.has_pending_invitation_from(_user_id uuid)
 returns boolean
 language sql
 stable
 security definer
 set search_path to 'public'
as $function$
  select exists (
    select 1
    from public.company_invitations
    where invited_by = _user_id
      and status = 'pending'
      and expires_at >= timezone('utc'::text, now())
      and lower(email) = lower((select auth.jwt() ->> 'email'))
  );
$function$;

-- Whether the signed-in user has a live invitation to _company_id. Used by
-- the companies policy so invitees can see the company they were invited to.
create or replace function public.has_pending_invitation_to(_company_id uuid)
 returns boolean
 language sql
 stable
 security definer
 set search_path to 'public'
as $function$
  select exists (
    select 1
    from public.company_invitations
    where company_id = _company_id
      and status = 'pending'
      and expires_at >= timezone('utc'::text, now())
      and lower(email) = lower((select auth.jwt() ->> 'email'))
  );
$function$;

-- On approval, make the submitter the first owner — but only if they claimed
-- ownership at submit time (see the header: unclaimed submissions stay
-- orphaned and claimable).
create or replace function public.handle_company_approved()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if new.status = 'approved'
     and (tg_op = 'INSERT' or old.status is distinct from new.status)
     and new.ownership_claimed
     and new.submitted_by is not null then
    insert into public.company_members (company_id, user_id, role)
    values (new.id, new.submitted_by, 'owner')
    on conflict (company_id, user_id) do nothing;
  end if;
  return new;
end;
$function$;

-- Accept an invitation from an email link: verifies the token, that it is still
-- pending and not expired, and that the signed-in user's email matches. Grants
-- membership and marks the invitation accepted. Returns the company id.
create or replace function public.accept_company_invitation(_token text)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  _invitation public.company_invitations;
  _user_email text := lower(auth.jwt() ->> 'email');
begin
  if _user_email is null then
    raise exception 'Not authenticated';
  end if;

  select * into _invitation
  from public.company_invitations
  where token = _token
  for update;

  if not found then
    raise exception 'Invitation not found';
  end if;

  if _invitation.status <> 'pending' then
    raise exception 'Invitation is no longer pending';
  end if;

  if _invitation.expires_at < timezone('utc'::text, now()) then
    update public.company_invitations
      set status = 'expired', updated_at = timezone('utc'::text, now())
      where id = _invitation.id;
    raise exception 'Invitation has expired';
  end if;

  if lower(_invitation.email) <> _user_email then
    raise exception 'Invitation was issued for a different email';
  end if;

  insert into public.company_members (company_id, user_id, role)
  values (_invitation.company_id, auth.uid(), _invitation.role)
  on conflict (company_id, user_id) do nothing;

  update public.company_invitations
    set status = 'accepted',
        responded_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    where id = _invitation.id;

  return _invitation.company_id;
end;
$function$;

-- Decline an invitation from an email link.
create or replace function public.decline_company_invitation(_token text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  _user_email text := lower(auth.jwt() ->> 'email');
begin
  update public.company_invitations
    set status = 'declined',
        responded_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    where token = _token
      and status = 'pending'
      and lower(email) = _user_email;
end;
$function$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create trigger companies_updated_at before update on public.companies for each row execute function public.handle_updated_at();
create trigger company_members_updated_at before update on public.company_members for each row execute function public.handle_updated_at();
create trigger company_invitations_updated_at before update on public.company_invitations for each row execute function public.handle_updated_at();
create trigger company_drafts_updated_at before update on public.company_drafts for each row execute function public.handle_updated_at();

-- Fires on insert too so a company created directly as approved (seeds,
-- service_role backfills) still gets its claimed owner. status is only
-- writable by service_role (column-scoped grants), so users cannot trigger
-- the approval path themselves.
create trigger on_company_approved
  after insert or update of status on public.companies
  for each row execute function public.handle_company_approved();

-- ---------------------------------------------------------------------------
-- Grants (default privileges for public are revoked, so declare explicitly).
-- companies is publicly readable; the rest are members-only.
-- ---------------------------------------------------------------------------
grant select on table "public"."companies" to "anon";
-- Column-scoped so authenticated users can never write the moderation-owned
-- columns (status, source, is_featured, published_at) — those keep their safe
-- defaults on insert and are only writable by service_role (moderation).
-- Attempting to set them fails loudly with 42501 instead of being silently
-- dropped. slug is set on submit but not editable afterwards (it's the URL).
-- Like the rest of a pending company, the ownership claim (ownership_claimed,
-- ownership_reason) is written once at submit and then frozen for moderation
-- to review: insert-only, never in the update grant.
grant select on table "public"."companies" to "authenticated";
grant insert (slug, name, description, website_url, careers_url, github_url, categories, locations, logo_url, submitted_by, ownership_claimed, ownership_reason)
  on table "public"."companies" to "authenticated";
grant update (name, description, website_url, careers_url, github_url, categories, locations, logo_url)
  on table "public"."companies" to "authenticated";
grant select, insert, update, delete on table "public"."companies" to "service_role";

grant select, insert, update, delete on table "public"."company_members" to "authenticated";
grant select, insert, update, delete on table "public"."company_members" to "service_role";

grant select, insert, update, delete on table "public"."company_invitations" to "authenticated";
grant select, insert, update, delete on table "public"."company_invitations" to "service_role";

grant select, insert, update, delete on table "public"."company_drafts" to "authenticated";
grant select, insert, update, delete on table "public"."company_drafts" to "service_role";

-- The companies SELECT policy is `to public` and calls user_company_role, so
-- anon must be able to execute it (returns null for the anon/no-session case).
grant execute on function public.user_company_role(uuid) to "anon", "authenticated";
grant execute on function public.shares_company_with(uuid) to "authenticated";
grant execute on function public.company_is_approved(uuid) to "authenticated";
grant execute on function public.has_pending_invitation_from(uuid) to "authenticated";
grant execute on function public.has_pending_invitation_to(uuid) to "authenticated";
grant execute on function public.accept_company_invitation(text) to "authenticated";
grant execute on function public.decline_company_invitation(text) to "authenticated";

-- ---------------------------------------------------------------------------
-- RLS policies: companies
-- ---------------------------------------------------------------------------
-- Anyone can read approved listings; members and the submitter can also see
-- their own company while it is still pending/rejected.
create policy "Anyone can view approved companies"
  on "public"."companies"
  as permissive for select to public
  using (
    status = 'approved'
    or submitted_by = (select auth.uid())
    or public.user_company_role(id) is not null
  );

-- Invitees can see the company they were invited to, even while it is still
-- pending moderation.
create policy "Invitees can view invited companies"
  on "public"."companies"
  as permissive for select to authenticated
  using (public.has_pending_invitation_to(id));

-- Authenticated users can submit a new company; it always starts pending and
-- attributed to them.
create policy "Users can submit companies"
  on "public"."companies"
  as permissive for insert to authenticated
  with check (
    submitted_by = (select auth.uid())
    and status = 'pending'
    and source = 'submitted'
  );

-- Owners can update (publish to) the live listing, but only once it is
-- approved — pending companies are frozen for moderation. status itself stays
-- protected by the column-scoped grants (only service_role can write it), so
-- `with check` on status = 'approved' cannot be escaped by flipping the
-- status in the same update.
create policy "Owners can update their company"
  on "public"."companies"
  as permissive for update to authenticated
  using (
    public.user_company_role(id) = 'owner'
    and status = 'approved'
  )
  with check (
    public.user_company_role(id) = 'owner'
    and status = 'approved'
  );

-- ---------------------------------------------------------------------------
-- RLS policies: company_members
-- ---------------------------------------------------------------------------
create policy "Members can view co-members"
  on "public"."company_members"
  as permissive for select to authenticated
  using (public.user_company_role(company_id) is not null);

create policy "Owners can add members"
  on "public"."company_members"
  as permissive for insert to authenticated
  with check (public.user_company_role(company_id) = 'owner');

create policy "Owners can update members"
  on "public"."company_members"
  as permissive for update to authenticated
  using (public.user_company_role(company_id) = 'owner')
  with check (public.user_company_role(company_id) = 'owner');

-- Owners can remove members; anyone can remove their own membership (leave).
create policy "Owners or self can remove members"
  on "public"."company_members"
  as permissive for delete to authenticated
  using (
    public.user_company_role(company_id) = 'owner'
    or user_id = (select auth.uid())
  );

-- ---------------------------------------------------------------------------
-- RLS policies: company_invitations
-- ---------------------------------------------------------------------------
-- Owners of the company, or the invitee (matched by email), can see it.
create policy "Owners and invitees can view invitations"
  on "public"."company_invitations"
  as permissive for select to authenticated
  using (
    public.user_company_role(company_id) = 'owner'
    or lower(email) = lower((select auth.jwt() ->> 'email'))
  );

create policy "Owners can create invitations"
  on "public"."company_invitations"
  as permissive for insert to authenticated
  with check (
    public.user_company_role(company_id) = 'owner'
    and invited_by = (select auth.uid())
  );

-- Owners can revoke/update pending invitations. (Invitee accept/decline goes
-- through the SECURITY DEFINER RPCs above.)
create policy "Owners can update invitations"
  on "public"."company_invitations"
  as permissive for update to authenticated
  using (public.user_company_role(company_id) = 'owner')
  with check (public.user_company_role(company_id) = 'owner');

create policy "Owners can delete invitations"
  on "public"."company_invitations"
  as permissive for delete to authenticated
  using (public.user_company_role(company_id) = 'owner');

-- ---------------------------------------------------------------------------
-- RLS policies: company_drafts
-- ---------------------------------------------------------------------------
-- Any member (owner or editor) can view, save, and discard the draft. Drafts
-- can only be created/edited against approved companies (pending ones are
-- frozen for moderation). The delete policy intentionally stays
-- membership-only so a draft left behind (e.g. on a company later
-- un-approved by moderation) can still be discarded.
create policy "Members can view drafts"
  on "public"."company_drafts"
  as permissive for select to authenticated
  using (public.user_company_role(company_id) is not null);

create policy "Members can create drafts"
  on "public"."company_drafts"
  as permissive for insert to authenticated
  with check (
    public.user_company_role(company_id) is not null
    and public.company_is_approved(company_id)
  );

create policy "Members can update drafts"
  on "public"."company_drafts"
  as permissive for update to authenticated
  using (
    public.user_company_role(company_id) is not null
    and public.company_is_approved(company_id)
  )
  with check (
    public.user_company_role(company_id) is not null
    and public.company_is_approved(company_id)
  );

create policy "Members can delete drafts"
  on "public"."company_drafts"
  as permissive for delete to authenticated
  using (public.user_company_role(company_id) is not null);

-- ---------------------------------------------------------------------------
-- RLS policies: users (cross-feature visibility)
-- ---------------------------------------------------------------------------
-- Company members can see each other's basic profile (the members list on
-- /my-companies). users RLS otherwise only allows viewing your own row, so
-- embedded co-member profiles came back null.
create policy "Members can view co-member profiles"
  on "public"."users"
  as permissive for select to authenticated
  using (public.shares_company_with(id));

-- Invitees can see who invited them while the invitation is live.
create policy "Invitees can view inviter profile"
  on "public"."users"
  as permissive for select to authenticated
  using (public.has_pending_invitation_from(id));
