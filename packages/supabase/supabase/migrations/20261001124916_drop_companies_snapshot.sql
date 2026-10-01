-- The weekly digest now selects companies by `companies.created_at` over a
-- fixed 7-day window, so the slug snapshot it used to diff against is unused.
-- Dropping the table also drops its policy and index.

drop table if exists "public"."companies_snapshot";
