# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm run dev` - Start development server for all apps (Turbo parallel)
- `pnpm run dev:web` - Start only the web app (Next.js with Turbopack)

### Building & Quality
- `pnpm run build` - Build all apps and packages
- `pnpm run lint` - Run Biome linting (auto-fixes with `--write --unsafe` in web app)
- `pnpm run format` - Format code with Biome
- `pnpm run check-types` - TypeScript type checking across all workspaces

### Testing
- `pnpm run test` - Run all tests in parallel
- `pnpm run test:e2e:web` - Run Playwright E2E tests (builds first, then starts server)
- From `apps/web`: `pnpm run test:e2e:ui` - E2E tests with Playwright UI

### Database & Email
- From `apps/web`: `pnpm run db:types` - Generate TypeScript types from Supabase schema (delegates to `packages/supabase`)
- From `apps/web`: `pnpm run email:dev` - React Email dev server on port 3002

### Database Migrations (from `packages/supabase`, or `pnpm --filter @tech-companies-portugal/supabase <script>` from root)
- `pnpm run db:link <ref>` - Link to remote project (one-time setup)
- `pnpm run db:start` / `db:stop` / `db:reset` - Local Supabase stack
- `pnpm run db:diff <name>` - Generate migration from remote/dashboard changes
- `pnpm run db:migration:new <name>` - Create blank migration to write manually
- `pnpm run db:migration:list` - Compare local vs remote migrations
- `pnpm run db:push` - Push migrations to remote
- `pnpm run db:types` - Regenerate `src/types/database.types.ts` after schema changes
- Never edit already-applied migration files — always create a new one
- Migration files live in `packages/supabase/supabase/migrations/`
- Any new table in `public` must include explicit `grant` statements for the API roles that need access (typically `authenticated` and `service_role`; avoid granting to `anon` unless the table is intentionally public), plus `alter table … enable row level security` and policies. `supabase db diff` emits the grants automatically; hand-written migrations must include them. Default privileges for `public` are revoked, so a missing grant returns `42501` from supabase-js.

## Architecture

Turbo monorepo: `apps/*`, `packages/*`, `tooling/*`.

### Web App (`apps/web`) - Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 + Shadcn UI components
- **State**: Nuqs for URL query state, React Query for server state
- **Auth & Database**: Supabase via `@tech-companies-portugal/supabase` (`/client`, `/server`, `/middleware`, `/types`)
- **Background Jobs**: Vercel Workflow SDK (`workflow`) for durable jobs. Workflows live in `packages/workflows/src/workflows/` (exported from `@tech-companies-portugal/workflows`; `withWorkflow()` discovers them there); `apps/web` keeps `workflow` as a direct dependency because `next.config.ts` is wrapped in `withWorkflow()`, which generates routes that import it to enable the `"use workflow"` / `"use step"` directives. Scheduling is Vercel Cron (`apps/web/vercel.json`) hitting a route handler that calls `start()`, authenticated with `CRON_SECRET`. Inspect runs with `pnpm run workflow:web` / `pnpm exec workflow inspect runs`.
- **Caching**: Upstash Redis for logo caching; Next.js `unstable_cache` with 1-day revalidation for company data
- **Email**: React Email templates in `src/emails/templates/`, sent via Plunk
- **Animation**: Motion (formerly Framer Motion)

### Data Flow
- Company data is fetched from the GitHub API (`marmelo/tech-companies-in-portugal` README), parsed with Cheerio, and hydrated with logos (`packages/core/src/server/readme-parser.ts`, `logos.ts`); the site reads it back via `getParsedCompaniesData` in `packages/core/src/server/companies-data.ts`
- Data is cached with `unstable_cache` (tag: `companies-data`, 1-day revalidation)
- Featured companies defined in `packages/core/src/featured.ts`
- Search uses URL state management via Nuqs (`src/lib/search-params.ts`)
- Dynamic routes: `/category/[category]`, `/location/[location]`, `/company/[slug]`

### Supabase Integration
- Database types auto-generated in `packages/supabase/src/types/database.types.ts` (do not edit manually)
- Middleware for auth in `packages/supabase/src/server/middleware.ts`, used by `apps/web/src/proxy.ts`
- Separate client/server configurations for SSR

### Other Packages
- `packages/workflows` - Durable workflows (`syncCompaniesWorkflow`, `weeklyDigestWorkflow`). `next` and `workflow` are required peers; the cron routes call `start()` from `workflow/api` directly
- `packages/core` - Company domain logic and data access shared by the site and workflows. `.` is pure (types, import planning, catalogue); `./server` is server-only (README parser, logos + Upstash cache, companies DB, cached accessor)
- `packages/analytics` - PostHog analytics wrapper
- `tooling/typescript` - Shared TypeScript config
- `tooling/tailwind` - Shared Tailwind config

## Code Standards

- **Biome** (not ESLint/Prettier): 2-space indent, 80 char width, double quotes, semicolons, trailing commas
- `useImportType: "error"` - always use `import type` for type-only imports
- `noDangerouslySetInnerHtml` is intentionally off (used for JSON-LD structured data)
- Node.js >=22, pnpm as package manager
- Environment variables in `apps/web/.env.local`

## Testing Notes

- E2E tests use Playwright with Chromium on `http://localhost:3000`
- The `test:e2e` task depends on `build` completing first (configured in `turbo.json`)