-- Match the future Supabase default (rolling out Oct 30, 2026): new tables in
-- `public` no longer auto-grant access to API roles. Forces every new table to
-- declare explicit grants, so a missing grant fails loudly in local dev with
-- 42501 rather than silently shipping and breaking after the rollout.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
