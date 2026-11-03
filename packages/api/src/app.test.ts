import type { Company } from "@tech-companies-portugal/core";
import { hashApiKey } from "@tech-companies-portugal/security";
import { describe, expect, it, vi } from "vitest";
import { app } from "./app";

const TEST_API_KEY = `tcp_live_${"a".repeat(43)}`;

const company = (slug: string, overrides: Partial<Company> = {}): Company => ({
  slug,
  name: slug[0]?.toUpperCase() + slug.slice(1),
  description: `${slug} description`,
  websiteUrl: `https://${slug}.example.com`,
  careersUrl: "",
  githubUrl: "",
  categories: ["SaaS"],
  locations: ["Lisboa"],
  ...overrides,
});

const companies = [
  company("alpha", { categories: ["FinTech 💳"], locations: ["Lisboa"] }),
  company("bravo", {
    categories: ["FinTech 💳", "SaaS"],
    locations: ["Porto"],
  }),
  company("charlie", { categories: ["SaaS"], locations: ["Lisboa"] }),
];

vi.mock("@tech-companies-portugal/core/server", () => ({
  getParsedCompaniesData: async () => ({
    companies,
    updatedAtISODate: "2026-10-01T00:00:00.000Z",
  }),
}));

vi.mock("@tech-companies-portugal/db/server", () => ({
  createAdminClient: async () => ({}),
}));

vi.mock("@tech-companies-portugal/db/queries", () => ({
  getActiveApiKeyByHash: async (_client: unknown, keyHash: string) =>
    keyHash === hashApiKey(TEST_API_KEY)
      ? {
          id: "11111111-1111-4111-8111-111111111111",
          user_id: "22222222-2222-4222-8222-222222222222",
          key_prefix: "tcp_live_test",
          permission: "read",
          rate_limit_per_minute: 60,
          expires_at: null,
        }
      : null,
  markApiKeyUsed: async () => {},
}));

const apiRequest = (path: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${TEST_API_KEY}`);
  return app.request(path, { ...init, headers });
};

describe("authenticated API", () => {
  it("publishes an OpenAPI 3.1 contract with stable operation IDs", async () => {
    const response = await app.request(
      "https://preview.example.com/api/v1/openapi.json",
    );
    const document = await response.json();

    expect(response.status).toBe(200);
    expect(document.openapi).toBe("3.1.0");
    expect(document.servers).toEqual([
      { url: "https://preview.example.com/api/v1" },
    ]);
    expect(document.security).toEqual([{ bearerAuth: [] }]);
    expect(document.components.securitySchemes.bearerAuth).toMatchObject({
      type: "http",
      scheme: "bearer",
    });
    expect(document.paths["/companies"].get.operationId).toBe("listCompanies");
    expect(document.paths["/companies/{slug}"].get.operationId).toBe(
      "getCompany",
    );
    expect(document.paths["/categories"].get.operationId).toBe(
      "listCategories",
    );
    expect(document.paths["/locations"].get.operationId).toBe("listLocations");
  });

  it("keeps documentation public but requires a key for data", async () => {
    const specResponse = await app.request("/api/v1/openapi.json");
    const dataResponse = await app.request("/api/v1/companies");

    expect(specResponse.status).toBe(200);
    expect(dataResponse.status).toBe(401);
    expect(dataResponse.headers.get("www-authenticate")).toContain("Bearer");
    expect((await dataResponse.json()).error.code).toBe("invalid_api_key");
  });

  it("requires a key on every documented route", async () => {
    const document = await (await app.request("/api/v1/openapi.json")).json();
    const paths = Object.keys(document.paths);

    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      const url = `/api/v1${path.replace(/\{[^}]+\}/g, "alpha")}`;
      expect((await app.request(url)).status, url).toBe(401);
    }
  });

  it("sends security headers, cross-origin readable, even on errors", async () => {
    for (const response of [
      await apiRequest("/api/v1/companies"),
      await app.request("/api/v1/companies"),
    ]) {
      expect(response.headers.get("x-content-type-options")).toBe("nosniff");
      expect(response.headers.get("cross-origin-resource-policy")).toBe(
        "cross-origin",
      );
    }
  });

  it("rejects a malformed API key", async () => {
    const response = await app.request("/api/v1/companies", {
      headers: { Authorization: "Bearer not-a-tcp-key" },
    });

    expect(response.status).toBe(401);
    expect((await response.json()).error.code).toBe("invalid_api_key");
  });

  it("rejects an unknown well-formed API key", async () => {
    const response = await app.request("/api/v1/companies", {
      headers: { Authorization: `Bearer tcp_live_${"b".repeat(43)}` },
    });

    expect(response.status).toBe(401);
    expect((await response.json()).error.code).toBe("invalid_api_key");
  });

  it("lists the first page of companies with meta", async () => {
    const response = await apiRequest("/api/v1/companies");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.map(({ slug }: { slug: string }) => slug)).toEqual([
      "alpha",
      "bravo",
      "charlie",
    ]);
    expect(body.meta).toEqual({
      total: 3,
      nextCursor: null,
      updatedAt: "2026-10-01T00:00:00.000Z",
    });
  });

  it("pages through companies by following nextCursor", async () => {
    const first = await (await apiRequest("/api/v1/companies?limit=2")).json();
    expect(first.data.map(({ slug }: { slug: string }) => slug)).toEqual([
      "alpha",
      "bravo",
    ]);
    expect(first.meta.nextCursor).toEqual(expect.any(String));

    const second = await (
      await apiRequest(
        `/api/v1/companies?limit=2&cursor=${first.meta.nextCursor}`,
      )
    ).json();
    expect(second.data.map(({ slug }: { slug: string }) => slug)).toEqual([
      "charlie",
    ]);
    expect(second.meta).toMatchObject({ total: 3, nextCursor: null });
  });

  it("rejects an out-of-range limit and a malformed cursor", async () => {
    for (const query of [
      "limit=0",
      "limit=101",
      "limit=abc",
      "cursor=%2E%2E",
    ]) {
      const response = await apiRequest(`/api/v1/companies?${query}`);
      expect(response.status, query).toBe(400);
      expect((await response.json()).error.code, query).toBe(
        "validation_error",
      );
    }
  });

  it("returns 304 when the ETag still matches", async () => {
    const first = await apiRequest("/api/v1/companies");
    const etagValue = first.headers.get("etag");

    expect(etagValue).toEqual(expect.any(String));

    const second = await apiRequest("/api/v1/companies", {
      headers: { "If-None-Match": etagValue ?? "" },
    });

    expect(second.status).toBe(304);
  });

  it("uses exact discovered slugs for structured filters", async () => {
    const response = await apiRequest(
      "/api/v1/companies?category=fintech&location=porto",
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].slug).toBe("bravo");
    expect(body.data[0].categories).toContainEqual({
      slug: "fintech",
      name: "FinTech",
    });
  });

  it("rejects unknown filters with a discovery hint", async () => {
    const response = await apiRequest("/api/v1/companies?category=not-real");
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("validation_error");
    expect(body.error.details[0].path).toBe("category");
  });

  it("returns a uniform validation error", async () => {
    const response = await apiRequest("/api/v1/companies?category=Not_Valid");

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("validation_error");
  });

  it("returns company details and a uniform not-found response", async () => {
    const foundResponse = await apiRequest("/api/v1/companies/alpha");
    const missingResponse = await apiRequest("/api/v1/companies/missing");

    expect(foundResponse.status).toBe(200);
    expect((await foundResponse.json()).data.slug).toBe("alpha");
    expect(missingResponse.status).toBe(404);
    expect((await missingResponse.json()).error.code).toBe("not_found");
  });

  it("returns a uniform not-found for unknown routes", async () => {
    const response = await app.request("/api/nope");

    expect(response.status).toBe(404);
    expect((await response.json()).error.code).toBe("route_not_found");
  });

  it("lists filter definitions with company counts", async () => {
    const categoriesResponse = await apiRequest("/api/v1/categories");
    const locationsResponse = await apiRequest("/api/v1/locations");
    const categoriesBody = await categoriesResponse.json();
    const locationsBody = await locationsResponse.json();

    expect(categoriesBody.data).toContainEqual({
      slug: "fintech",
      name: "FinTech",
      companyCount: 2,
    });
    expect(locationsBody.data).toContainEqual({
      slug: "lisboa",
      name: "Lisboa",
      companyCount: 2,
    });
  });
});
