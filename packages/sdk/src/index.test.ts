import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient, getClient } from ".";

const API_KEY = `tcp_live_${"a".repeat(43)}`;
const PRODUCTION_BASE_URL = "https://techcompaniesportugal.fyi/api/v1";

const recordingFetch = (body: unknown, status = 200) => {
  const requests: Request[] = [];
  const fetch = async (request: Request) => {
    requests.push(request);
    return Response.json(body, { status });
  };
  return { fetch, requests };
};

describe("createClient", () => {
  it("sends the API key and query to the production API by default", async () => {
    const { fetch, requests } = recordingFetch({
      data: [],
      meta: { total: 0, nextCursor: null },
    });
    const client = createClient({ apiKey: API_KEY, fetch });

    const { data } = await client.GET("/companies", {
      params: { query: { category: "fintech", limit: 10 } },
    });

    expect(data?.meta.total).toBe(0);
    expect(requests[0]?.url).toBe(
      `${PRODUCTION_BASE_URL}/companies?category=fintech&limit=10`,
    );
    expect(requests[0]?.headers.get("Authorization")).toBe(`Bearer ${API_KEY}`);
  });

  it("fills path params and uses a custom base URL", async () => {
    const { fetch, requests } = recordingFetch({
      data: {
        slug: "acme",
        name: "Acme",
        description: "",
        categories: [],
        locations: [],
      },
    });
    const client = createClient({
      apiKey: API_KEY,
      baseUrl: "http://localhost:3000/api/v1",
      fetch,
    });

    await client.GET("/companies/{slug}", {
      params: { path: { slug: "acme" } },
    });

    expect(requests[0]?.url).toBe(
      "http://localhost:3000/api/v1/companies/acme",
    );
  });

  it("returns the API error body instead of throwing", async () => {
    const { fetch } = recordingFetch(
      { error: { code: "not_found", message: "Company not found" } },
      404,
    );
    const client = createClient({ apiKey: API_KEY, fetch });

    const { data, error, response } = await client.GET("/companies/{slug}", {
      params: { path: { slug: "missing" } },
    });

    expect(data).toBeUndefined();
    expect(response.status).toBe(404);
    expect(error?.error.code).toBe("not_found");
  });

  it("sends no Authorization header without a key, so callers can add their own", async () => {
    const { fetch, requests } = recordingFetch({ data: [] });
    const client = createClient({ fetch });
    client.use({
      onRequest({ request }) {
        request.headers.set("Authorization", "Bearer session-token");
        return request;
      },
    });

    await client.GET("/categories");

    expect(requests[0]?.headers.get("Authorization")).toBe(
      "Bearer session-token",
    );
  });

  it("applies middleware passed in a request's options to that request only", async () => {
    const { fetch, requests } = recordingFetch({ data: [] });
    const client = createClient({ apiKey: API_KEY, fetch });
    const tagRequest = {
      onRequest({ request }: { request: Request }) {
        request.headers.set("X-Request-Id", "req_1");
        return request;
      },
    };

    await client.GET("/categories", { middleware: [tagRequest] });
    await client.GET("/categories");

    expect(requests[0]?.headers.get("X-Request-Id")).toBe("req_1");
    expect(requests[1]?.headers.get("X-Request-Id")).toBeNull();
  });

  it("lets a request's own Authorization header override the client key", async () => {
    const { fetch, requests } = recordingFetch({ data: [] });
    const client = createClient({ apiKey: API_KEY, fetch });

    await client.GET("/categories", {
      headers: { Authorization: "Bearer other-key" },
    });
    await client.GET("/categories");

    expect(requests[0]?.headers.get("Authorization")).toBe("Bearer other-key");
    expect(requests[1]?.headers.get("Authorization")).toBe(`Bearer ${API_KEY}`);
  });
});

describe("getClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("is configured from TCP_API_KEY and TCP_BASE_URL and created once", async () => {
    vi.stubEnv("TCP_API_KEY", API_KEY);
    vi.stubEnv("TCP_BASE_URL", "http://localhost:3000/api/v1");
    const { fetch, requests } = recordingFetch({ data: [] });
    // Stubbed before the first call: getClient builds the client lazily.
    vi.stubGlobal("fetch", fetch);

    expect(getClient()).toBe(getClient());
    await getClient().GET("/locations");

    expect(requests[0]?.url).toBe("http://localhost:3000/api/v1/locations");
    expect(requests[0]?.headers.get("Authorization")).toBe(`Bearer ${API_KEY}`);
  });
});
