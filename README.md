# Tech Companies in Portugal 🇵🇹

The main goal is to provide a better way to explore tech companies in Portugal.

![ci workflow](https://github.com/alexmarqs/tech-companies-portugal-app/actions/workflows/ci.yml/badge.svg)

## Features 🚀

- List of tech companies in Portugal synced with the opensource [tech-companies-in-portugal](https://github.com/marmelo/tech-companies-in-portugal) repository
- Fast search capabilities
- Notifications
- SEO friendly
- Responsive design

## Tech stack 🧑‍💻

- [Next.js 16](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/)
- [Shadcn UI](https://ui.shadcn.com) - UI components
- [Vercel](https://vercel.com/) - Hosting and CI/CD
- [Playwright](https://playwright.dev/) - E2E testing
- [Biome](https://biomejs.dev/) - Formatting and linting
- [Nuqs](https://nuqs.47ng.com) - URL query state management (client and server support + some other cool features out of the box)
- [Plunk](https://useplunk.com/) - Email service
- [Turbo](https://turbo.build/) - Monorepo build system
- [Vercel](https://vercel.com/) - Hosting and CI/CD
- [PostHog](https://posthog.com/) - Analytics
- [Upstash](https://upstash.com/) - Redis for caching, low latency storage
- [Supabase](https://supabase.com/) - Auth, DB, Storage, Database (with RLS), migrations
- [React Email](https://react.email/) - Email components
- [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) - Basic support for PWA. Coming next, usage of [next-pwa](https://github.com/shadowwalker/next-pwa) to add more features
- [LLMs.txt](https://llmstxt.org/) - Support for the proposed standard that acts as a guide for large language models (LLMs)
- [Arcjet](https://arcjet.com/) - Rate limiting
- [Inngest](https://inngest.com/) - Event-driven architecture for serverless functions | Used for notifications
- [Biome](https://biomejs.dev/) / [React Doctor](https://www.react-doctor.com/) - Formatting and linting
- MCP's used locally: Posthog, Supabase and Playwright.
- [React Hook Form](https://react-hook-form.com/) - Form handling

## Development 💻

```bash
corepack enable pnpm
pnpm dev
```

### Testing against the local Supabase stack

`pnpm dev` points the app at the remote Supabase project (`.env.local`). To develop against the local stack instead — e.g. for schema that is not on the remote yet, or to test destructively:

1. `pnpm exec supabase start` (from `apps/web`, requires Docker)
2. `pnpm exec supabase db reset` — applies all migrations and loads `supabase/seed.sql`, which seeds test companies, users, memberships and an invitation for the ownership flows (accounts and URLs are documented in the seed file header)
3. `pnpm run dev:local` — same app, pointed at the local stack (the inlined keys are the public Supabase demo keys, identical for every local install)
4. Sign in via `http://localhost:3000/api/dev/login?email=owner@local.test` — OAuth providers are not configured locally, so this dev-only route creates/reuses a confirmed user and sets the session cookies directly (use any of the seeded emails, e.g. `owner@local.test`, `editor@local.test`). It 404s unless running `next dev` against a local Supabase.

The local stack ships its own web UIs (URLs printed by `supabase start` / `supabase status`):

Useful Supabase CLI commands while developing locally:

`pnpm exec supabase status` — shows the local API, Studio, database connection details and confirms the stack is running.
`pnpm exec supabase stop` — stops the local Supabase stack (run `pnpm exec supabase start` again to resume with the same data).
`pnpm exec supabase logs` — tails logs from the local services when debugging startup or runtime issues.

Re-run `pnpm exec supabase db reset` any time to wipe local data back to a clean seeded state.

E2E tests also run against the local stack: `pnpm run test:e2e:local` (from `apps/web`, stop any running dev server first — it builds and starts on port 3000). Authenticated specs seed data and sign in via `tests/helpers/supabase.ts` (service-role seeding + session cookie injection, local-only by design). CI does the same: the `web-e2e-tests` job starts a local Supabase in the runner, so migrations are exercised on every PR and no production secrets are needed for E2E.

### Best practices

The database layer should return readable business types (DTOs), keeping database concerns out of the rest of the app:

- Data-access functions live in `apps/web/src/lib/db/*` and are the only place that deals with raw Supabase rows (snake_case columns, joins, RLS quirks).
- Each function maps rows to the UI/business shapes defined in `apps/web/src/lib/types.ts` (e.g. `CompanyInvitation`, `ConnectedCompanySummary`) before returning — components and hooks never consume raw rows.
- Types shared with the database (enums like `CompanyMemberRole`, `CompanyStatus`) are derived from the generated `database.types.ts` via the `Tables<>` / `Enums<>` helpers instead of being redefined by hand, so they stay in sync with the schema (`pnpm run db:types`).

### Database migrations

Migration files live in `apps/web/supabase/migrations/` and are managed with the Supabase CLI (run the commands below from `apps/web`). Develop and test against the local stack first, then push to the remote project.

```bash
pnpm exec supabase start                    # start the local stack (requires Docker)
pnpm exec supabase migration new <name>     # create a blank migration to write manually
pnpm exec supabase migration up --local     # apply pending migrations locally
pnpm exec supabase gen types typescript --local --schema public > src/lib/supabase/database.types.ts
pnpm exec supabase db push                  # push migrations to the remote project (linked)
pnpm run db:types                           # regenerate types from the remote after pushing
```

Guidelines:

- Never edit an already-applied migration file — always create a new one.
- Any new table in `public` must enable row level security with policies, plus explicit `grant` statements for the API roles that need access (typically `authenticated` and `service_role`; avoid `anon` unless the table is intentionally public). A missing grant surfaces as a `42501` error from supabase-js.
- Regenerate `database.types.ts` after any schema change and format it (`pnpm exec biome format --write`) — never edit it by hand.

## How to contribute 🤝

No requirements, just open a pull request with your changes.
If you want to add a new feature, please open an issue first to discuss it.