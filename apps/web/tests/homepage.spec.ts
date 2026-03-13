import { expect, test } from "@playwright/test";

test.describe("Homepage e2e tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Check if all relevant elements are visible in the page", async ({
    page,
  }) => {
    // check if navbar is visible
    await expect(page.getByTestId("navbar")).toBeVisible();

    // check if hero section is visible with correct heading
    const header = page.getByTestId("companies-header");
    await expect(header).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Find your next tech company in Portugal",
        level: 1,
      }),
    ).toBeVisible();

    // check if companies list is visible
    await expect(page.getByTestId("companies-list")).toBeVisible();

    // check if there are companies in the list
    const companyItems = await page.getByTestId("company-item").all();
    expect(companyItems.length).toBeGreaterThan(1);

    // check if filters are visible and reset button is disabled
    await expect(
      page.getByRole("combobox", { name: "Industry" }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Search by name or description" }),
    ).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "Location" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Reset filters" }),
    ).toBeDisabled();

    // check if pagination is visible with correct format
    await expect(page.getByText("Showing", { exact: false })).toBeVisible();
    await expect(page.getByText("1 / 30", { exact: false })).toBeVisible();
  });

  test("Check if footer sections are visible", async ({ page }) => {
    // check if sponsors section is visible
    await expect(
      page.getByRole("heading", {
        name: "Want more visibility for your company?",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Become a Sponsor" }),
    ).toBeVisible();

    // check if footer navigation links are visible
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Privacy Policy" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Terms of Service" }),
    ).toBeVisible();

    // check if footer has location and category sections
    await expect(
      page.getByRole("heading", { name: "Companies by Location" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Companies by Category" }),
    ).toBeVisible();
  });

  test("Company cards link to company detail pages", async ({ page }) => {
    // check that company cards are clickable links to detail pages
    const firstCompanyLink = page
      .getByRole("link", { name: /View details for/ })
      .first();
    await expect(firstCompanyLink).toBeVisible();
    const href = await firstCompanyLink.getAttribute("href");
    expect(href).toMatch(/^\/company\//);
  });

  test("Search filter works", async ({ page }) => {
    const searchBox = page.getByRole("textbox", {
      name: "Search by name or description",
    });
    await searchBox.fill("Bosch");

    // wait for the list to update
    await expect(page.getByText("Showing", { exact: false })).toBeVisible();

    // reset button should now be enabled
    await expect(
      page.getByRole("button", { name: "Reset filters" }),
    ).toBeEnabled();

    // should find Bosch in the results
    await expect(
      page.getByRole("heading", { name: "Bosch", level: 3 }),
    ).toBeVisible();
  });
});
