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
- [Supabase](https://supabase.com/) - Auth, DB, Storage, Database migrations
- [React Email](https://react.email/) - Email components
- [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) - Basic support for PWA
- [LLMs.txt](https://llmstxt.org/) - Support for the proposed standard that acts as a guide for large language models (LLMs)
- [Vercel Workflow](https://workflow-sdk.dev/) - Durable, resumable background jobs
- [Biome](https://biomejs.dev/) / [React Doctor](https://www.react-doctor.com/) - Formatting and linting
- [Portless](https://port1355.dev/) - Portless replaces port numbers with stable, named .localhost URLs for local development

## Development 💻

```bash
corepack enable pnpm
pnpm dev
```

## Database migrations 🗄️

1. **Start the local stack.** It applies every migration to a local Postgres:

   ```bash
   pnpm exec supabase start
   ```

2. **Create a migration.** Write one by hand:

   ```bash
   pnpm exec supabase migration new <name>
   ```

   Or, if you changed the schema in the dashboard, generate one from the difference:

   ```bash
   pnpm exec supabase db diff -f <name>
   ```

   New tables in `public` need explicit `grant` statements for the roles that use them (usually `service_role`, plus `authenticated` if the browser reads them). They also need `alter table … enable row level security` and policies. Default privileges are revoked, so a missing grant fails with `42501`.

3. **Apply it locally and test.** Use `pnpm exec supabase migration up --local` to apply only the new migration. Use `pnpm exec supabase db reset --local` to rebuild the database from scratch; it wipes local data.

4. **Regenerate the TypeScript types.** 

   ```bash
   pnpm exec supabase gen types typescript --local --schema public > src/lib/supabase/database.types.ts
   ```

   To generate from the linked remote project, use `pnpm run db:types`.

5. **Push to the remote project** once the change is ready. Link it once, preview the push, then apply it:

   ```bash
   pnpm exec supabase link --project-ref <project-ref>
   pnpm exec supabase db push --dry-run
   pnpm exec supabase db push
   ```

   Push before deploying code that depends on the new schema.

Rules:

- Never edit a migration that has already been applied. Add a new one instead.
- `pnpm exec supabase migration list --linked` shows which migrations the remote has applied.

### Companies data

The site reads companies from the `companies` table. The `sync-companies` workflow keeps that table in sync with the README of [tech-companies-in-portugal](https://github.com/marmelo/tech-companies-in-portugal). It runs daily through Vercel Cron and calls `/api/cron/sync-companies`.

On a fresh database, the table starts empty and the build fails until it is filled. Run the import once before building or deploying:

```bash
pnpm dev:web
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync-companies
```

## How to contribute 🤝

No requirements, just open a pull request with your changes.
If you want to add a new feature, please open an issue first to discuss it.