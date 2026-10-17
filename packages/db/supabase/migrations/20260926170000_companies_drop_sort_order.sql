-- Drop `companies.sort_order`. The directory lists companies featured first,
-- then by name, so the README's position is no longer stored.
--
-- Its trigger existed only to keep reorders from bumping `updated_at`. The
-- import only writes rows that changed, so the generic trigger is enough.

drop trigger if exists handle_companies_updated_at on public.companies;

drop function if exists public.handle_companies_updated_at();

drop index if exists public.idx_companies_listed_order;

alter table "public"."companies" drop column "sort_order";

CREATE TRIGGER handle_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
