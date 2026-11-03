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
- `pnpm run typecheck` - TypeScript type checking across all workspaces

### Testing
- `pnpm run test` - Run all tests in parallel
- `pnpm run test:e2e:web` - Run Playwright E2E tests (builds first, then starts server)
- From `apps/web`: `pnpm run test:e2e:ui` - E2E tests with Playwright UI

### Email
- From `packages/email` (or `pnpm --filter @tech-companies-portugal/email email:dev` from root): `pnpm run email:dev` - React Email dev server on port 3002

### Companies
- `pnpm --filter @tech-companies-portugal/core script:create-manual-company [--name … --website … --description … --category … --location …]` - Create a company that is not in the README (`source = 'manual'`, the sync leaves it alone). In a terminal, prompts for missing required fields (everything with no flags); without one, all required flags and `--yes` are needed. `--file <entry.json>`, `--help`. Writes to the database in `apps/web/.env.local`

### Database Migrations (from `packages/db`, or `pnpm --filter @tech-companies-portugal/db <script>` from root)
- `pnpm run db:link <ref>` - Link to remote project (one-time setup)
- `pnpm run db:start` / `db:stop` / `db:reset` - Local Supabase stack
- `pnpm run db:diff <name>` - Generate migration from remote/dashboard changes
- `pnpm run db:migration:new <name>` - Create blank migration to write manually
- `pnpm run db:migration:list` - Compare local vs remote migrations
- `pnpm run db:push` - Push migrations to remote
- `pnpm run db:types` - Regenerate `src/types/database.types.ts` after schema changes
- Never edit already-applied migration files — always create a new one
- Migration files live in `packages/db/supabase/migrations/`
- Any new table in `public` must include explicit `grant` statements for the API roles that need access (typically `authenticated` and `service_role`; avoid granting to `anon` unless the table is intentionally public), plus `alter table … enable row level security` and policies. `supabase db diff` emits the grants automatically; hand-written migrations must include them. Default privileges for `public` are revoked, so a missing grant returns `42501` from supabase-js.

## Architecture

Turbo monorepo: `apps/*`, `packages/*`, `tooling/*`.

### Web App (`apps/web`) - Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 + Shadcn UI components
- **State**: Nuqs for URL query state, React Query for server state
- **Auth & Database**: Supabase via `@tech-companies-portugal/db` (`/client`, `/server`, `/middleware`, `/types`, `/queries`)
- **Background Jobs**: Vercel Workflow SDK (`workflow`) for durable jobs. Workflows live in `packages/workflows/src/workflows/` (exported from `@tech-companies-portugal/workflows`; `withWorkflow()` discovers them there); `apps/web` keeps `workflow` as a direct dependency because `next.config.ts` is wrapped in `withWorkflow()`, which generates routes that import it to enable the `"use workflow"` / `"use step"` directives. Scheduling is Vercel Cron (`apps/web/vercel.json`) hitting a route handler that calls `start()`, authenticated with `CRON_SECRET`. Inspect runs with `pnpm exec workflow inspect runs` (from `apps/web`); `pnpm run workflow:health` checks the setup.
- **Caching**: Upstash Redis for logo caching; Next.js `unstable_cache` with 1-day revalidation for company data
- **Email**: `@tech-companies-portugal/email` - React Email templates in `packages/email/src/templates/` (subpath `./templates/*`), sent via Plunk (`emailService`, `render` and defaults from the `.` barrel)
- **Animation**: Motion (formerly Framer Motion)

### Data Flow
- Company data is fetched from the GitHub API (`marmelo/tech-companies-in-portugal` README), parsed with Cheerio, and hydrated with logos (`packages/core/src/server/readme-parser.ts`, `logos.ts`); the site reads it back via `getParsedCompaniesData` in `packages/core/src/server/companies-data.ts`
- `companies.source` marks who owns a row: `readme` (managed by the daily sync), `manual` (created with `create-manual-company`), `app` (reserved for in-app creation). The sync never updates or archives non-`readme` rows
- Data is cached with `unstable_cache` (tag: `companies-data`, 1-day revalidation)
- Featured companies defined in `packages/core/src/featured.ts`
- Search uses URL state management via Nuqs (`src/lib/search-params.ts`)
- Dynamic routes: `/category/[category]`, `/location/[location]`, `/company/[slug]`

### Supabase Integration
- Database types auto-generated in `packages/db/src/types/database.types.ts` (do not edit manually)
- Middleware for auth in `packages/db/src/server/middleware.ts`, used by `apps/web/src/proxy.ts`
- All data access lives in `packages/db/src/queries/` (`@tech-companies-portugal/db/queries`): table reads/writes, Storage (`storage.ts`) and Auth admin operations (`auth.ts`). Each query takes the client as its first argument (`DbClient` from `/types`), so the caller picks the privilege: browser, server or admin. Don't call `.from(...)`, `.storage` or `.auth.admin` elsewhere. Session handling stays inline: OAuth sign-in, code exchange, `getClaims`/`getSession`, `onAuthStateChange`, sign-out. Queries only `throw error`; they never log
- `apps/web` uses the Supabase clients only for auth (OAuth sign-in, `/api/auth/callback`, session refresh in `proxy.ts`, `onAuthStateChange`, sign-out) and the avatar Storage upload (`uploadAvatarFile` from `/queries`, with the browser client). Table reads/writes from the web app go through `/api/internal` (see `packages/api`), never directly from the browser. No Next server actions
- Separate client/server configurations for SSR

### API (`packages/api`)
- One plain Hono router (`src/app.ts`) mounted by `apps/web/src/app/api/[[...route]]/route.ts`; specific Next routes (`api/auth`, `api/cron`) take precedence over the catch-all. It only mounts sub-apps (`src/routes/*`, each an `OpenAPIHono` owning its middleware) and holds the shared `notFound` / `onError`. Auth middleware lives in `src/middleware/` (`api-key.ts`, `session.ts`)
- **Public** `/api/v1/*` (`src/routes/v1/`: `index.ts` holds the middleware, spec and mounts; one folder per resource, e.g. `companies/index.ts` for routes and `companies/schemas.ts` for its zod schemas, route paths relative to the mount; `src/openapi-schema-helpers.ts` keeps the shared error shape, `jsonContent` and `jsonBody`; `routes/v1/responses.ts` the error responses every v1 route documents): API-key auth (`withRequireApiKey`, per-key Upstash rate limit), CORS `*`, documented in `/api/v1/openapi.json` (registered before `withRequireApiKey` so it stays public) and `/api-reference` (Scalar, its own `app/api-reference/route.ts` since it sits outside the `/api` catch-all)
- **Internal** `/api/internal/*` (`src/routes/internal/`, one sub-app folder per resource: `api-keys/`, `me/`, same `index.ts` + `schemas.ts` split): Supabase session cookie (`withRequireSession`), `csrf()`, no CORS, its own `OpenAPIHono` (validation and typed `hc` responses) kept out of the public OpenAPI document; it can serve its own spec later. The web app calls them with the typed client from `@tech-companies-portugal/api/internal-client` (`createInternalClient`, browser-safe: the app is imported as a type only), wrapped in `apps/web/src/lib/api/*` and React Query hooks (`src/hooks/*`). Never import the package root (`.`, server code) from client components
- Layers: `src/services/<name>/` are adapters only (a `types.ts` port plus one implementation, e.g. Redis cache, rate limit, companies catalog). Name each port for its role: `*Repository` for persistence of one kind of domain data (`ApiKeysRepository`, `UsersRepository`), `*Storage` for files (`AvatarStorage`), `*Service` for infrastructure and other gateways (`CacheService`, `RateLimitService`, `CatalogService`), and use the same name for its type, file, factory and variable; `src/use-cases/<resource>/` hold the application logic, one factory per resource (`createCompaniesUseCases({ catalogService })`) taking its adapters as arguments (split a use case into its own file only once it grows or needs different adapters). Use-case methods are full names ending in `UseCase` (`listCompaniesUseCase`, `revokeApiKeyUseCase`) so they never read like the port methods they call (`catalogService.listCompanies`); `src/composition-root.ts` (next to `app.ts`) is the single composition root: it builds the adapter singletons and wires them into the use cases. Supabase adapters call `createAdminClient()` per operation (stateless and cheap, Supabase's own recommendation); shared clients like Redis are built there and injected. Routes import use cases from it; middleware takes them as arguments (`withRequireApiKey(apiKeysUseCases)`). Never instantiate adapters elsewhere
- Errors: only use cases throw `UseCaseError` or its subclasses (`ValidationError`, `NotFoundError`, `ConflictError`), all in `src/use-cases/errors.ts`. Their `code` (`validation_error`, `not_found`, `unauthorized`, `conflict`) is what clients see; `middleware/errors.ts` maps each code to its HTTP status. Adapters never throw them (their failures become 500s). Routes and middleware return their own error responses with `c.json(errorBody(...), status)` (`src/lib/api-error.ts`)
- Handlers use the admin client, which bypasses RLS: every query on user-owned rows must take the owner id from the session (or API key), never from the request, and filter on it. Whitelist writable fields in the body schema
- New internal routes: add them to the resource's sub-app and keep the `.openapi()` / `.route()` calls chained, or `hc` loses their types
- Postman: `packages/api/postman/tech-companies-portugal-api.postman_collection.json` mirrors `/api/v1`. Any change to a v1 route, query param, auth or error response updates it in the same change (add, edit or remove the request, plus its `Errors` example). It never holds a key: keys live in git-ignored `*.local.postman_environment.json` files

### Other Packages
- `packages/security` - API key generation/hashing and timing-safe comparison
- `packages/workflows` - Durable workflows (`syncCompaniesWorkflow`, `weeklyDigestWorkflow`). `next` and `workflow` are required peers; the cron routes call `start()` from `workflow/api` directly
- `packages/core` - Company domain logic shared by the site and workflows (its table access goes through `db/queries`). `.` is pure (types, import planning, catalogue, name and slug rules shared by the site and the API: `toCompanySlug`, `toFilterSlug`, `normalizeText`, `getCategoryList`, shared constants like `APP_URL` / `SettingsTab`); `./server` is server-only (README parser, logos + Upstash cache, cached accessor)
- `packages/email` - React Email templates + Plunk email service. `react`/`react-dom` are peers (templates + `@react-email/render` need both at runtime)
- `packages/analytics` - PostHog analytics wrapper
- `tooling/typescript` - Shared TypeScript config

## Code Standards

- **Biome** (not ESLint/Prettier): 2-space indent, 80 char width, double quotes, semicolons, trailing commas
- `useImportType: "error"` - always use `import type` for type-only imports
- `noDangerouslySetInnerHtml` is intentionally off (used for JSON-LD structured data)
- Node.js >=22, pnpm as package manager
- Environment variables in `apps/web/.env.local`

## Testing Notes

- E2E tests use Playwright with Chromium on `http://localhost:3000`
- The `test:e2e` task depends on `build` completing first (configured in `turbo.json`)