/**
 * Creates a company that is not in the README (source = 'manual', so the
 * README sync leaves it alone).
 *
 * Flags (or --file) first; in a terminal, prompts for whatever required
 * fields they leave out (everything, when nothing is passed). Without a
 * terminal, missing fields are an error. The site shows the company within
 * the companies-data cache window (up to 1 day).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  multiselect,
  note,
  outro,
  spinner,
  text,
} from "@clack/prompts";
import { createAdminClient } from "@tech-companies-portugal/supabase/server";
import {
  type ImportedCompany,
  normalizeReadmeCompanies,
} from "../src/company-import";
import { toCompanySlug } from "../src/company-slug";
import { getListedCompanyRows } from "../src/server/db/companies";
import { hydrateCompaniesWithLogos } from "../src/server/logos";
import type { CompanySource } from "../src/types";

// ---------------------------------------------------------------- validation

type ManualCompanyEntry = {
  name: string;
  websiteUrl: string;
  description: string;
  categories: string[];
  locations: string[];
  careersUrl?: string;
  githubUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
};

type PreparedManualCompany = ImportedCompany & {
  instagramUrl: string;
  facebookUrl: string;
};

type PrepareManualCompanyResult =
  | { ok: true; company: PreparedManualCompany }
  | { ok: false; reason: string };

/**
 * Validates a manual entry with the same rules as README rows (plus a
 * required description and social link hosts) and refuses slugs already in
 * the table, whatever their source. Pure: the script does the I/O.
 */
const prepareManualCompany = (
  entry: ManualCompanyEntry,
  existingSlugs: ReadonlySet<string>,
): PrepareManualCompanyResult => {
  const name = entry.name ?? "";

  const { companies, invalid } = normalizeReadmeCompanies([
    {
      slug: toCompanySlug(name.trim()),
      name,
      description: entry.description ?? "",
      websiteUrl: entry.websiteUrl ?? "",
      careersUrl: entry.careersUrl ?? "",
      githubUrl: entry.githubUrl ?? "",
      categories: entry.categories ?? [],
      locations: entry.locations ?? [],
      isFeatured: false,
    },
  ]);

  const [invalidEntry] = invalid;
  if (invalidEntry) return { ok: false, reason: invalidEntry.reason };

  const [company] = companies;
  if (!company) return { ok: false, reason: "invalid entry" };

  if (!company.description) {
    return { ok: false, reason: "missing description" };
  }

  if (company.careersUrl && !isHttpUrl(company.careersUrl)) {
    return { ok: false, reason: "careersUrl must be an http(s) URL" };
  }

  if (company.githubUrl && !isUrlOnHost(company.githubUrl, "github.com")) {
    return { ok: false, reason: "githubUrl must be a github.com URL" };
  }

  const instagramUrl = (entry.instagramUrl ?? "").trim();
  if (instagramUrl && !isUrlOnHost(instagramUrl, "instagram.com")) {
    return { ok: false, reason: "instagramUrl must be an instagram.com URL" };
  }

  const facebookUrl = (entry.facebookUrl ?? "").trim();
  if (facebookUrl && !isUrlOnHost(facebookUrl, "facebook.com")) {
    return { ok: false, reason: "facebookUrl must be a facebook.com URL" };
  }

  if (existingSlugs.has(company.slug)) {
    return { ok: false, reason: `slug "${company.slug}" already exists` };
  }

  return { ok: true, company: { ...company, instagramUrl, facebookUrl } };
};

const parseHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
};

const isHttpUrl = (value: string) => parseHttpUrl(value) !== null;

const isUrlOnHost = (value: string, host: string) => {
  const hostname = parseHttpUrl(value)?.hostname;
  return hostname === host || Boolean(hostname?.endsWith(`.${host}`));
};

const STRING_FIELDS = [
  "name",
  "websiteUrl",
  "description",
  "careersUrl",
  "githubUrl",
  "instagramUrl",
  "facebookUrl",
] as const satisfies (keyof ManualCompanyEntry)[];

const LIST_FIELDS = [
  "categories",
  "locations",
] as const satisfies (keyof ManualCompanyEntry)[];

type ParseManualCompanyEntryResult =
  | { ok: true; entry: Partial<ManualCompanyEntry> }
  | { ok: false; reason: string };

/**
 * Checks the shape of untrusted input (a `--file` JSON) before it reaches
 * `prepareManualCompany`, so a typo gets a clear reason instead of a
 * TypeError. Fields may be missing (flags or prompts fill them); a single
 * category or location string becomes a one-item list.
 */
const parseManualCompanyEntry = (
  raw: unknown,
): ParseManualCompanyEntryResult => {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, reason: "the file must contain a JSON object" };
  }

  const input = raw as Record<string, unknown>;
  const entry: Partial<ManualCompanyEntry> = {};

  for (const field of STRING_FIELDS) {
    const value = input[field];
    if (value === undefined) continue;
    if (typeof value !== "string") {
      return { ok: false, reason: `${field} must be a string` };
    }
    entry[field] = value;
  }

  for (const field of LIST_FIELDS) {
    const value = input[field];
    if (value === undefined) continue;
    const list = typeof value === "string" ? [value] : value;
    if (
      !Array.isArray(list) ||
      !list.every((item) => typeof item === "string")
    ) {
      return {
        ok: false,
        reason: `${field} must be a string or a list of strings`,
      };
    }
    entry[field] = list;
  }

  return { ok: true, entry };
};

// ---------------------------------------------------------------- usage

const USAGE = `Usage: create-manual-company [options]

In a terminal, asks for any required field not passed (everything, if
nothing is passed). Without a terminal, all required fields and --yes are
needed.

Fields:
  --name <text>          Company name (required)
  --website <url>        Website (required)
  --description <text>   One sentence, English (required)
  --category <text>      Category; repeat for several (required)
  --location <text>      Location; repeat for several (required)
  --careers <url>        Careers page
  --github <url>         GitHub organisation
  --instagram <url>      Instagram profile
  --facebook <url>       Facebook page

Options:
  -f, --file <path>      Read fields from a JSON file (flags override it)
  -y, --yes              Insert without asking for confirmation
  -h, --help             Show this help`;

type Field = keyof ManualCompanyEntry;

const REQUIRED: { field: Field; flag: string }[] = [
  { field: "name", flag: "--name" },
  { field: "websiteUrl", flag: "--website" },
  { field: "description", flag: "--description" },
  { field: "categories", flag: "--category" },
  { field: "locations", flag: "--location" },
];

const isMissing = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.length === 0 : !value?.trim();

// ---------------------------------------------------------------- args

const readArgs = () => {
  // pnpm can forward a literal `--` before the script's own arguments.
  const argv = process.argv.slice(2);
  const args = argv[0] === "--" ? argv.slice(1) : argv;

  try {
    return parseArgs({
      args,
      options: {
        file: { type: "string", short: "f" },
        yes: { type: "boolean", short: "y", default: false },
        help: { type: "boolean", short: "h", default: false },
        name: { type: "string" },
        website: { type: "string" },
        description: { type: "string" },
        category: { type: "string", multiple: true },
        location: { type: "string", multiple: true },
        careers: { type: "string" },
        github: { type: "string" },
        instagram: { type: "string" },
        facebook: { type: "string" },
      },
      allowPositionals: false,
      strict: true,
    }).values;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    console.error(`\n${USAGE}`);
    process.exit(1);
  }
};

const readEntryFile = async (
  file: string,
): Promise<Partial<ManualCompanyEntry>> => {
  // pnpm runs scripts from packages/core; resolve against where it was invoked.
  const resolved = path.resolve(process.env.INIT_CWD ?? process.cwd(), file);

  let raw: unknown;
  try {
    raw = JSON.parse(await readFile(resolved, "utf8"));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`${file}: ${reason}`);
    process.exit(1);
  }

  const result = parseManualCompanyEntry(raw);

  if (!result.ok) {
    console.error(`${file}: ${result.reason}`);
    process.exit(1);
  }

  return result.entry;
};

/** Drops undefined values so they don't override the file's. */
const definedOnly = <T extends object>(value: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as Partial<T>;

// ------------------------------------------------------------- prompts

/** Ctrl+C at any prompt: say so and stop without writing anything. */
const orExit = <T>(value: T): Exclude<T, symbol> => {
  if (isCancel(value)) {
    cancel("Cancelled — nothing was added.");
    process.exit(0);
  }

  // `isCancel` narrows to the cancel symbol, not back to a generic `T`.
  return value as Exclude<T, symbol>;
};

const askText = async (
  message: string,
  {
    placeholder,
    optional = false,
  }: { placeholder?: string; optional?: boolean } = {},
): Promise<string> => {
  const value = orExit(
    await text({
      message,
      placeholder,
      validate: optional
        ? undefined
        : (input) => (input?.trim() ? undefined : "Required"),
    }),
  );

  // clack 1.x can return undefined for an empty optional answer.
  return value?.trim() ?? "";
};

/** Pick from the values already on the site, plus any new ones typed in. */
const askMany = async (label: string, existing: string[]) => {
  const picked = orExit(
    await multiselect({
      message: `${label} (space to select, enter to continue)`,
      options: existing.map((value) => ({ value, label: value })),
      required: false,
    }),
  );

  const typed = await askText(
    `New ${label.toLowerCase()} not in the list (comma-separated)`,
    { placeholder: "leave empty for none", optional: true },
  );

  return [
    ...picked,
    ...typed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ];
};

const uniqueSorted = (values: string[]) =>
  Array.from(new Set(values)).sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );

/**
 * Asks only for what `given` lacks: required fields always, optional links
 * only when `askOptional` (the run with nothing passed).
 */
const promptMissing = async (
  given: Partial<ManualCompanyEntry>,
  askOptional: boolean,
): Promise<ManualCompanyEntry> => {
  const rows = await getListedCompanyRows();
  const categories = uniqueSorted(rows.flatMap((row) => row.categories));
  const locations = uniqueSorted(rows.flatMap((row) => row.locations));

  const optional = async (value: string | undefined, message: string) => {
    if (!isMissing(value)) return value ?? "";
    return askOptional ? askText(message, { optional: true }) : "";
  };

  return {
    name: isMissing(given.name)
      ? await askText("Company name")
      : (given.name ?? ""),
    websiteUrl: isMissing(given.websiteUrl)
      ? await askText("Website", { placeholder: "https://example.com" })
      : (given.websiteUrl ?? ""),
    description: isMissing(given.description)
      ? await askText("Description (one sentence, English)", {
          placeholder: "What the company does, ~50–70 characters.",
        })
      : (given.description ?? ""),
    categories: isMissing(given.categories)
      ? await askMany("Categories", categories)
      : (given.categories ?? []),
    locations: isMissing(given.locations)
      ? await askMany("Locations", locations)
      : (given.locations ?? []),
    careersUrl: await optional(given.careersUrl, "Careers URL"),
    githubUrl: await optional(given.githubUrl, "GitHub URL"),
    instagramUrl: await optional(given.instagramUrl, "Instagram URL"),
    facebookUrl: await optional(given.facebookUrl, "Facebook URL"),
  };
};

// ------------------------------------------------------------------- db

/** Every slug in the table, archived and any source included. */
const getAllCompanySlugs = async (): Promise<Set<string>> => {
  const supabase = await createAdminClient();

  const { data, error } = await supabase.from("companies").select("slug");

  if (error) {
    console.error("Error fetching company slugs", error);
    throw error;
  }

  return new Set(data.map((row) => row.slug));
};

const MANUAL_SOURCE: CompanySource = "manual";

/**
 * Inserts a maintainer-added company. `source = 'manual'` keeps the README
 * sync from archiving or overwriting it. Fails on a duplicate slug
 * (unique constraint) rather than overwriting.
 */
const insertManualCompany = async (company: PreparedManualCompany) => {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("companies")
    .insert({
      slug: company.slug,
      name: company.name,
      description: company.description,
      website_url: company.websiteUrl,
      careers_url: company.careersUrl,
      github_url: company.githubUrl,
      instagram_url: company.instagramUrl,
      facebook_url: company.facebookUrl,
      categories: company.categories,
      locations: company.locations,
      logo_url: company.logoUrl ?? null,
      is_featured: false,
      source: MANUAL_SOURCE,
    })
    .select("slug, created_at")
    .single();

  if (error) {
    console.error("Error inserting company", error);
    throw error;
  }

  return data;
};

// ---------------------------------------------------------------- main

const summarise = (company: PreparedManualCompany) =>
  [
    `Slug         ${company.slug}`,
    `Name         ${company.name}`,
    `Website      ${company.websiteUrl}`,
    `Description  ${company.description}`,
    `Categories   ${company.categories.join(", ")}`,
    `Locations    ${company.locations.join(", ")}`,
    `Careers      ${company.careersUrl || "—"}`,
    `GitHub       ${company.githubUrl || "—"}`,
    `Instagram    ${company.instagramUrl || "—"}`,
    `Facebook     ${company.facebookUrl || "—"}`,
  ].join("\n");

const main = async () => {
  const args = readArgs();

  if (args.help) {
    console.log(USAGE);
    return;
  }

  // Prompts need a terminal both to read answers (stdin) and to draw them
  // (stdout). Without one (CI, pipes, agents) clack would hang or fail.
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);

  // Flags override the file.
  const given: Partial<ManualCompanyEntry> = {
    ...(args.file ? await readEntryFile(args.file) : {}),
    ...definedOnly({
      name: args.name,
      websiteUrl: args.website,
      description: args.description,
      categories: args.category,
      locations: args.location,
      careersUrl: args.careers,
      githubUrl: args.github,
      instagramUrl: args.instagram,
      facebookUrl: args.facebook,
    }),
  };

  const passedAnything = Object.keys(given).length > 0;
  const missingFlags = REQUIRED.filter(({ field }) =>
    isMissing(given[field]),
  ).map(({ flag }) => flag);

  if (!interactive && missingFlags.length > 0) {
    console.error(
      `Missing ${missingFlags.join(", ")} and no terminal to ask.\n\n${USAGE}`,
    );
    process.exit(1);
  }

  if (!interactive && !args.yes) {
    console.error("No terminal to confirm: pass --yes to insert.");
    process.exit(1);
  }

  intro("Create a manual company");

  if (passedAnything && missingFlags.length > 0) {
    log.info(`Asking for what was not passed: ${missingFlags.join(", ")}`);
  }

  const entry =
    missingFlags.length === 0
      ? // Every required field is present (checked above).
        (given as ManualCompanyEntry)
      : await promptMissing(given, !passedAnything);

  const result = prepareManualCompany(entry, await getAllCompanySlugs());

  if (!result.ok) {
    log.error(`Not added: ${result.reason}`);
    process.exit(1);
  }

  note(summarise(result.company), "Company");

  if (!args.yes) {
    const proceed = await confirm({ message: "Create this company?" });

    if (isCancel(proceed) || !proceed) {
      cancel("Nothing was added.");
      process.exit(0);
    }
  }

  const progress = spinner();

  progress.start("Fetching logo");

  const [company = result.company] = await hydrateCompaniesWithLogos([
    result.company,
  ]);
  progress.stop(company.logoUrl ? `Logo: ${company.logoUrl}` : "No logo found");

  progress.start("Inserting");
  const inserted = await insertManualCompany(company);
  progress.stop(`Inserted (created_at ${inserted.created_at})`);

  outro(
    `Created /company/${inserted.slug} — visible max 1 day (cache window).`,
  );
};

// ---------------------------------------------------------------- main entry point

main().catch((error) => {
  log.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
