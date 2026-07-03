import { expect, test } from "@playwright/test";
import {
  createUser,
  deleteRows,
  deleteUser,
  insertRow,
  signIn,
} from "./helpers/supabase";

// Runs only against the local Supabase stack (the helpers refuse anything
// else). Seeds an owner with an approved company and checks the
// authenticated /my-companies flow end to end.
const runId = Date.now();
const email = `e2e-owner-${runId}@example.com`;
const password = "e2e-password-123!";
const companyName = `E2E Test Co ${runId}`;
const slug = `e2e-test-co-${runId}`;

let userId: string;
let companyId: string;

test.describe("My companies (authenticated)", () => {
  test.beforeAll(async () => {
    userId = await createUser(email, password);
    const company = await insertRow<{ id: string }>("companies", {
      name: companyName,
      slug,
      description: "Seeded by the e2e suite",
      status: "approved",
      submitted_by: userId,
    });
    companyId = company.id;
    await insertRow("company_members", {
      company_id: companyId,
      user_id: userId,
      role: "owner",
    });
  });

  test.afterAll(async () => {
    if (companyId) {
      await deleteRows("companies", `id=eq.${companyId}`);
    }
    if (userId) {
      await deleteUser(userId);
    }
  });

  test("owner sees their company and can open the manage page", async ({
    context,
    page,
  }) => {
    await signIn(context, email, password);

    await page.goto("/my-companies");
    await expect(
      page.getByRole("heading", { name: "My Companies", level: 1 }),
    ).toBeVisible();

    const card = page.getByRole("link", { name: `Manage ${companyName}` });
    await expect(card).toBeVisible();
    await expect(card.getByText("owner")).toBeVisible();

    await card.click();
    await expect(page).toHaveURL(`/my-companies/${slug}`);
    await expect(
      page.getByRole("heading", { name: companyName }),
    ).toBeVisible();
  });

  test("unauthenticated visit redirects to login", async ({ page }) => {
    await page.goto("/my-companies");
    await expect(page).toHaveURL(/\/login\?next=/);
  });
});
