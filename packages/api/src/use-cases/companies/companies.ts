import type { FilterDefinition } from "../../lib/filters";
import type { CatalogService } from "../../services/catalog/types";
import { NotFoundError, ValidationError } from "../errors";
import type { CompaniesUseCases } from "./types";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Cursors are opaque to clients: the last slug of a page, base64url-encoded,
// so the format can change without breaking them.
const encodeCursor = (slug: string) =>
  Buffer.from(slug, "utf8").toString("base64url");

const decodeCursor = (cursor: string) => {
  const slug = Buffer.from(cursor, "base64url").toString("utf8");
  if (!SLUG.test(slug)) {
    throw new ValidationError("Invalid cursor.", [
      {
        code: "invalid_cursor",
        message: "Pass meta.nextCursor from a previous response unchanged.",
        path: "cursor",
      },
    ]);
  }
  return slug;
};

/** Rejects a filter slug that matches no company's category or location. */
const assertKnownFilter = async (
  kind: "category" | "location",
  slug: string | undefined,
  listDefinitions: () => Promise<FilterDefinition[]>,
) => {
  if (!slug) return;

  const definitions = await listDefinitions();
  if (definitions.some((definition) => definition.slug === slug)) return;

  const route = kind === "category" ? "categories" : "locations";
  throw new ValidationError(`Unknown ${kind} filter.`, [
    {
      code: "unknown_value",
      message: `Use GET /api/v1/${route} to discover supported values.`,
      path: kind,
    },
  ]);
};

export const createCompaniesUseCases = ({
  catalogService,
}: {
  catalogService: CatalogService;
}): CompaniesUseCases => ({
  async getCompanyUseCase(slug: string) {
    const company = await catalogService.findCompanyBySlug(slug);

    if (!company) {
      throw new NotFoundError("Company not found.");
    }

    return company;
  },

  async listCompaniesUseCase({ category, location, limit, cursor }) {
    const after = cursor ? decodeCursor(cursor) : undefined;

    const page = await catalogService.listCompanies(
      { category, location },
      { limit, after },
    );

    // A match proves both filters exist (`total` ignores the cursor), so only
    // an empty result pays for loading the definitions: unknown filter or not.
    if (page.total === 0) {
      await Promise.all([
        assertKnownFilter("category", category, catalogService.listCategories),
        assertKnownFilter("location", location, catalogService.listLocations),
      ]);
    }
    const last = page.companies.at(-1);

    return {
      data: page.companies,
      meta: {
        total: page.total,
        nextCursor: page.hasMore && last ? encodeCursor(last.slug) : null,
        updatedAt: page.updatedAt,
      },
    };
  },

  listCategoriesUseCase() {
    return catalogService.listCategories();
  },

  listLocationsUseCase() {
    return catalogService.listLocations();
  },
});
