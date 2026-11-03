import type { ApiReferenceConfiguration } from "@scalar/hono-api-reference";
import { API_TITLE } from "./config";

/** Scalar theme overrides matching the web app's palette (globals.css). */
const customCss = `
@import url("https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&display=swap");

:root {
  --scalar-font: "Gabarito", ui-sans-serif, system-ui, sans-serif;
  --scalar-radius: 0.5rem;
  --scalar-radius-lg: 1rem;
}

.light-mode {
  --scalar-color-1: oklch(0.245 0.018 50);
  --scalar-color-2: oklch(0.45 0.025 50);
  --scalar-color-3: oklch(0.56 0.025 50);
  --scalar-color-accent: oklch(0.68 0.15 38);
  --scalar-background-1: oklch(0.988 0.009 70);
  --scalar-background-2: oklch(0.965 0.012 65);
  --scalar-background-3: oklch(0.94 0.018 62);
  --scalar-background-accent: oklch(0.94 0.045 45);
  --scalar-border-color: oklch(0.91 0.018 62);
  --scalar-sidebar-color-active: oklch(0.68 0.15 38);
  --scalar-sidebar-background-1: oklch(0.975 0.012 65);
  --scalar-sidebar-item-active-background: oklch(0.94 0.045 45);
}

/* Brand mark above the sidebar search, inserted by onLoaded. */
.tcp-home-link {
  display: flex;
  align-items: center;
  min-height: 28px;
  padding: 16px 12px 4px 48px;
  background: url("/assets/images/logo.svg") no-repeat 12px calc(50% + 6px) /
    28px;
  color: var(--scalar-color-1);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.tcp-home-link:hover {
  color: var(--scalar-color-accent);
}

/* "Generate SDK" upsell buttons have no config option. */
.selected-client-action,
.generate-sdk-button {
  display: none !important;
}
`;

/**
 * Scalar has no logo option, so the brand mark is a link to the site added to
 * the sidebar once the reference renders. Scalar serializes it with
 * `toString()` into the page, so it must not reference anything outside itself.
 */
const onLoaded = () => {
  const sidebar = document.querySelector(".t-doc__sidebar");
  if (!sidebar || sidebar.querySelector(".tcp-home-link")) return;

  const link = document.createElement("a");
  link.className = "tcp-home-link";
  link.href = "/";
  link.textContent = "Tech Companies Portugal";
  sidebar.prepend(link);
};

export const scalarConfig: Partial<ApiReferenceConfiguration> = {
  url: "/api/v1/openapi.json",
  pageTitle: `${API_TITLE} Reference`,
  favicon: "/favicon.ico",
  metaData: {
    title: `${API_TITLE} Reference`,
    description:
      "Authenticated REST API for discovering technology companies in Portugal.",
  },
  theme: "default",
  // The site is light-only.
  forceDarkModeState: "light",
  hideDarkModeToggle: true,
  withDefaultFonts: false,
  customCss,
  onLoaded,
  agent: { disabled: true },
  mcp: { disabled: true },
  showDeveloperTools: "never",
  hideClientButton: true,
};
