-- Companies can now come from somewhere other than the README.
--
-- - `source` says who owns the row's content. The `sync-companies` import
--   only manages `readme` rows; `manual` rows are added by the maintainer
--   with the `create-manual-company` script; `app` is reserved for companies
--   created in the app (owners / claims, not built yet).
-- - `instagram_url` / `facebook_url` follow the `careers_url` convention:
--   '' means none. The README has no social links, so the import never
--   writes them.
--
-- `updated_at` is kept by the generic `handle_updated_at` trigger. The table
-- stays service_role only, so no new grants.

alter table "public"."companies"
  add column "source" text not null default 'readme',
  add column "instagram_url" text not null default '',
  add column "facebook_url" text not null default '';

alter table "public"."companies"
  add constraint "companies_source_check"
  check (source in ('readme', 'manual', 'app'));
