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
        name: "Discover tech companies in Portugal.",
        level: 1,
      }),
    ).toBeVisible();

    // check if companies list is visible
    await expect(page.getByTestId("companies-list")).toBeVisible();

    // check if there are companies in the list
    const companyItems = await page.getByTestId("company-item").all();
    expect(companyItems.length).toBeGreaterThan(1);

    // check if filters are visible; reset is hidden until a filter is applied
    await expect(
      page.getByRole("combobox", { name: "Category" }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Search by name or description" }),
    ).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "Location" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Clear all filters" }),
    ).toHaveCount(0);

    // Last page number tracks the live dataset — don't hardcode it.
    await expect(page.getByTestId("companies-list-footer")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next page" })).toBeEnabled();
    const lastPageButton = page
      .getByRole("button", { name: /^Go to page \d+$/ })
      .last();
    await expect(lastPageButton).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await lastPageButton.click();
    await expect(lastPageButton).toHaveAttribute("aria-current", "page");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("Check if footer sections are visible", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "List your company" }),
    ).toBeVisible();

    // check if footer navigation links are visible
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "About" })).toBeVisible();
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
    await searchBox.pressSequentially("Bosch", { delay: 40 });

    await expect(searchBox).toHaveValue("Bosch");
    await expect(page).toHaveURL(/query=Bosch/);
    await expect(
      page.getByRole("heading", { name: "Bosch", level: 3 }),
    ).toBeVisible();
    await expect(page.getByTestId("company-item")).toHaveCount(1);

    // clear-all button should now appear once a filter is active
    await expect(
      page.getByRole("button", { name: "Clear all filters" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(searchBox).toHaveValue("");
    await expect(page).not.toHaveURL(/query=/);
    await expect(page.getByTestId("company-item")).toHaveCount(12);
  });

  test("Category and location filters apply immediately", async ({ page }) => {
    const resultsCount = page.getByTestId("results-count");

    // Unfiltered total tracks the live dataset — read it, don't hardcode it.
    const unfilteredTotal = ((await resultsCount.textContent()) ?? "").match(
      /of\s+\d+/,
    )?.[0];
    expect(unfilteredTotal).toBeTruthy();

    const category = page.getByRole("combobox", { name: "Category" });
    await expect(category).toHaveCSS("gap", "12px");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await category.click();
    const categoryOption = page.getByRole("option").nth(1);
    await expect(categoryOption).toHaveCSS("cursor", "pointer");
    const categoryName = (await categoryOption.textContent())?.trim();
    expect(categoryName).toBeTruthy();
    await categoryOption.click();
    await expect(category).toContainText(categoryName as string);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(resultsCount).not.toContainText(unfilteredTotal as string);
    await expect(
      page.getByRole("button", { name: "Clear all filters" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Clear all filters" }).click();
    await expect(resultsCount).toContainText(unfilteredTotal as string);

    const location = page.getByRole("combobox", { name: "Location" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await location.click();
    const locationOption = page.getByRole("option").nth(1);
    const locationName = (await locationOption.textContent())?.trim();
    expect(locationName).toBeTruthy();
    await locationOption.click();
    await expect(location).toContainText(locationName as string);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(resultsCount).not.toContainText(unfilteredTotal as string);
  });
});
