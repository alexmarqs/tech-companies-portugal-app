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
- [Playwright](https://playwright.dev/) - E2E testing
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

## Project structure 🗂️

Turbo monorepo:

- `apps/web` - the Next.js site
- `packages/core` - company domain logic: README parser, logos, companies data access
- `packages/supabase` - Supabase clients, generated database types and migrations
- `packages/workflows` - durable background jobs (`sync-companies`, `weekly-digest`)
- `packages/email` - React Email templates and the Plunk email service
- `packages/analytics` - PostHog wrapper
- `tooling/*` - shared TypeScript and Tailwind config

## Development 💻

Requires Node.js 22 (see `.nvmrc`). Environment variables live in `apps/web/.env.local`.

```bash
corepack enable pnpm
pnpm install
pnpm dev
```

To preview email templates on port 3002:

```bash
pnpm --filter @tech-companies-portugal/email email:dev
```

## Adding a company manually ➕

Most companies come from the [tech-companies-in-portugal](https://github.com/marmelo/tech-companies-in-portugal) README via the daily sync. For a company that isn't listed there (for example, one that asked to be added by email), we use the `create-manual-company` script. For now this is the way to add companies directly, and it also serves as a fallback until companies can be managed in the app - soon available.

```bash
pnpm --filter @tech-companies-portugal/core script:create-manual-company
```

Run without flags, it asks for each field. You can also pass the fields as flags (`--name`, `--website`, `--description`, `--category`, `--location`, plus optional `--careers`, `--github`, `--instagram`, `--facebook`); it then asks only for what's missing. See `--help` for all options.

The company is saved with `source = 'manual'`, so the README sync never archives or overwrites it. It writes to the database configured in `apps/web/.env.local` and shows on the site within a day.

## Database migrations 🗄️

Migrations live in `packages/supabase/supabase/migrations/`. Run the commands below from `packages/supabase`, or from the root with `pnpm --filter @tech-companies-portugal/supabase <script>`.

1. **Start the local stack.** It applies every migration to a local Postgres:

   ```bash
   pnpm run db:start
   ```

2. **Create a migration.** Write one by hand:

   ```bash
   pnpm run db:migration:new <name>
   ```

   Or, if you changed the schema in the dashboard, generate one from the difference:

   ```bash
   pnpm run db:diff <name>
   ```

   New tables in `public` need explicit `grant` statements for the roles that use them (usually `service_role`, plus `authenticated` if the browser reads them). They also need `alter table … enable row level security` and policies. Default privileges are revoked, so a missing grant fails with `42501`.

3. **Apply it locally and test.** Use `pnpm exec supabase migration up --local` to apply only the new migration. Use `pnpm exec supabase db reset --local` to rebuild the database from scratch; it wipes local data.

4. **Regenerate the TypeScript types.** They are written to `packages/supabase/src/types/database.types.ts`; don't edit that file by hand.

   ```bash
   pnpm exec supabase gen types typescript --local --schema public > src/types/database.types.ts
   ```

   To generate from the linked remote project, use `pnpm run db:types`.

5. **Push to the remote project** once the change is ready. Link it once, preview the push, then apply it:

   ```bash
   pnpm run db:link <project-ref>
   pnpm exec supabase db push --dry-run
   pnpm run db:push
   ```

   Push before deploying code that depends on the new schema.

Rules:

- Never edit a migration that has already been applied. Add a new one instead.
- `pnpm run db:migration:list` shows which migrations the remote has applied.

## How to contribute 🤝

No requirements, just open a pull request with your changes.
If you want to add a new feature, please open an issue first to discuss it.

## License 📄

This project is licensed under the [MIT License](LICENSE).
