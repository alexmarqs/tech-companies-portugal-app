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
- From `apps/web`: `pnpm run db:types` - Generate TypeScript types from Supabase schema
- From `apps/web`: `pnpm run email:dev` - React Email dev server on port 3002

### Database Migrations (from `apps/web`)
- `pnpm exec supabase link --project-ref <ref>` - Link to remote project (one-time setup)
- `pnpm exec supabase db diff -f <name>` - Generate migration from remote/dashboard changes
- `pnpm exec supabase migration new <name>` - Create blank migration to write manually
- `pnpm exec supabase db push` - Push migrations to remote
- `pnpm run db:types` - Regenerate TypeScript types after schema changes
- Never edit already-applied migration files — always create a new one
- Migration files live in `apps/web/supabase/migrations/`

## Architecture

Turbo monorepo: `apps/*`, `packages/*`, `tooling/*`.

### Web App (`apps/web`) - Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 + Shadcn UI components
- **State**: Nuqs for URL query state, React Query for server state
- **Auth & Database**: Supabase (client: `src/lib/supabase/client.ts`, server: `src/lib/supabase/server.ts`)
- **Background Jobs**: Inngest for scheduled tasks (e.g., weekly new companies email cron)
- **Rate Limiting**: Arcjet for API protection
- **Caching**: Upstash Redis for logo caching; Next.js `unstable_cache` with 1-day revalidation for company data
- **Email**: React Email templates in `src/emails/templates/`, sent via Plunk
- **Animation**: Motion (formerly Framer Motion)

### Data Flow
- Company data is fetched from the GitHub API (`marmelo/tech-companies-in-portugal` README), parsed with Cheerio, and hydrated with logos (`src/lib/parser.ts` → `src/lib/parser/companies.ts`)
- Data is cached with `unstable_cache` (tag: `companies-data`, 1-day revalidation)
- Featured companies defined in `src/lib/featured.ts`
- Search uses URL state management via Nuqs (`src/lib/search-params.ts`)
- Dynamic routes: `/category/[category]`, `/location/[location]`, `/company/[slug]`

### Supabase Integration
- Database types auto-generated in `src/lib/supabase/database.types.ts` (do not edit manually)
- Middleware for auth in `src/lib/supabase/middleware.ts`
- Separate client/server configurations for SSR

### Other Packages
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