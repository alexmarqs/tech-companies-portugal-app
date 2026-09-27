-- Companies catalogue: the database becomes the source of truth for the
-- company directory (jobs plan, phase 1).
--
-- Until direct DB editing is ready, rows are kept in sync with the
-- `marmelo/tech-companies-in-portugal` README by the scheduled
-- `sync-companies` workflow. The weekly digest's `companies_snapshot` table
-- stays as it is: it is a history marker, not the catalogue.
--
-- - `slug` preserves the existing `/company/[slug]` URLs.
-- - `sort_order` preserves the README's curated listing order.
-- - `archived_at` hides a company without deleting it; the import archives
--   companies that leave the README and restores ones that come back.
-- - `updated_at` only moves on a visible change (it feeds sitemap `lastmod`),
--   so reordering the README does not touch every row's timestamp.
--
-- Only the server reads and writes this table (service_role), so no grants
-- to anon/authenticated yet.

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
  "sort_order" integer not null default 0,
  "archived_at" timestamp with time zone,
  "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);

alter table "public"."companies" enable row level security;

create unique index companies_pkey on public.companies using btree (id);
create unique index companies_slug_key on public.companies using btree (slug);
create index idx_companies_listed_order on public.companies using btree (is_featured desc, sort_order) where (archived_at is null);

alter table "public"."companies" add constraint "companies_pkey" primary key using index "companies_pkey";
alter table "public"."companies" add constraint "companies_slug_key" unique using index "companies_slug_key";
alter table "public"."companies" add constraint "companies_slug_check" check (slug <> '');
alter table "public"."companies" add constraint "companies_name_check" check (name <> '');

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_companies_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    -- sort_order is deliberately left out: it is not a visible change.
    IF (NEW.slug, NEW.name, NEW.description, NEW.website_url, NEW.careers_url,
        NEW.github_url, NEW.categories, NEW.locations, NEW.logo_url,
        NEW.is_featured, NEW.archived_at)
       IS DISTINCT FROM
       (OLD.slug, OLD.name, OLD.description, OLD.website_url, OLD.careers_url,
        OLD.github_url, OLD.categories, OLD.locations, OLD.logo_url,
        OLD.is_featured, OLD.archived_at)
    THEN
        NEW.updated_at = timezone('utc'::text, now());
    ELSE
        NEW.updated_at = OLD.updated_at;
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE TRIGGER handle_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.handle_companies_updated_at();

grant select, insert, update, delete on table "public"."companies" to "service_role";

create policy "Allow service role full access to companies"
  on "public"."companies"
  as permissive
  for all
  to service_role
using (true)
with check (true);
