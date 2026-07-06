-- Local-only seed for the ownership feature. Auto-loaded after migrations on
-- `supabase db reset` (see [db.seed] in config.toml). NEVER runs against remote.
--
-- Sign in on the local stack with the dev login (no OAuth configured locally):
--   /api/dev/login?email=owner@local.test&next=/my-companies
-- The route reuses these pre-seeded users (createUser is idempotent).
--
-- Accounts:
--   owner@local.test     — owns "Acme Corp" (approved); submitted "Gamma" (pending, claimed)
--   editor@local.test    — editor of "Acme Corp"
--   bystander@local.test — registered, not a member of anything (disclosure-test target)
--   invited@local.test   — NOT pre-created; the pending Acme invitation is addressed to it,
--                          created on first dev login when accepting /invitations/<token>
--
-- Companies:
--   Acme Corp    — approved, owned (owner + editor). Edit/publish/invite flows.
--   Beta Labs    — approved but ORPHANED (source=github, zero owners) → claimable.
--   Gamma Startup— pending, submitted by owner with ownership_claimed → approve it as
--                  moderation (service_role) to watch handle_company_approved grant ownership.
--
-- Pending invitation: owner invites invited@local.test as editor to Acme.
--   Accept at: /invitations/dev-invite-token-acme-000000000000000000000000000000

-- Fixed UUIDs so memberships/companies can reference users deterministically.
-- The empty-string token columns matter: GoTrue scans them into non-nullable
-- strings, so leaving them NULL breaks the dev login with "Database error
-- finding user". They have no DB default, so set them explicitly.
insert into auth.users (
  id, instance_id, aud, role, email, email_confirmed_at, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token
)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'owner@local.test',     timezone('utc', now()), '{"full_name":"Olivia Owner"}',     timezone('utc', now()), timezone('utc', now()), '', '', '', '', '', '', '', ''),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'editor@local.test',    timezone('utc', now()), '{"full_name":"Ed Editor"}',        timezone('utc', now()), timezone('utc', now()), '', '', '', '', '', '', '', ''),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bystander@local.test', timezone('utc', now()), '{"full_name":"Bianca Bystander"}', timezone('utc', now()), timezone('utc', now()), '', '', '', '', '', '', '', '')
on conflict (id) do nothing;
-- public.users + notification_settings are created by the handle_new_user trigger.

-- Acme Corp: inserted already-approved with a claimed submitter, so the
-- on_company_approved trigger auto-grants owner@ the 'owner' membership.
insert into public.companies (id, slug, name, description, website_url, source, status, submitted_by, ownership_claimed, published_at)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'acme-corp', 'Acme Corp', 'Seeded owned company for local testing.', 'https://acme.local', 'submitted', 'approved', '11111111-1111-1111-1111-111111111111', true, timezone('utc', now())),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'beta-labs', 'Beta Labs', 'Seeded README-synced company with no owner (claimable).', 'https://beta.local', 'github', 'approved', null, false, timezone('utc', now())),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'gamma-startup', 'Gamma Startup', 'Seeded pending submission with an ownership claim (approve as moderation).', 'https://gamma.local', 'submitted', 'pending', '11111111-1111-1111-1111-111111111111', true, null)
on conflict (id) do nothing;

-- Acme's editor (owner membership comes from the approval trigger above).
insert into public.company_members (company_id, user_id, role)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'editor')
on conflict (company_id, user_id) do nothing;

-- Pending invitation to Acme for a not-yet-registered email.
insert into public.company_invitations (company_id, email, role, token, invited_by)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'invited@local.test', 'editor', 'dev-invite-token-acme-000000000000000000000000000000', '11111111-1111-1111-1111-111111111111')
on conflict (token) do nothing;
