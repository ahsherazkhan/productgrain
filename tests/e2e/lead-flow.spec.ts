import { expect, test } from "@playwright/test";

test("homepage keeps a concise lead-generation path", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Necessary only" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "The product-first studio for AI-native software." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Discuss your product idea — free" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Start with the right level of product certainty." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Know what you are committing to before development begins" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore your AI product opportunity" }).locator("svg")).toHaveCount(1);
  await expect(page.locator(".decision-map")).toHaveCount(0);
  const mobileMenu = page.getByRole("button", { name: "Open navigation" });
  if (await mobileMenu.isVisible()) {
    await mobileMenu.click();
    const workLink = page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Work" });
    await expect(workLink).toBeVisible();
    await workLink.click();
  } else {
    const workLink = page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Work" });
    await expect(workLink).toBeVisible();
    await workLink.click();
  }
  await expect(page).toHaveURL(/\/work$/);
});

test("work shows approved portfolio references and sourced project media", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("button", { name: "Necessary only" }).click();
  await expect(page.getByRole("heading", { name: "Digital products shaped around real operating problems." })).toBeVisible();
  await expect(page.getByRole("link", { name: "View the ClaimDeck project profile" })).toBeVisible();
  await expect(page.locator("body")).toContainText("Project delivered by Codal");

  const response = await page.goto("/work/claimdeck");
  expect(response?.status()).toBe(200);
  await expect(page.getByText("Project record")).toBeVisible();
  await expect(page.getByRole("heading", { name: "How the workflow fits together" })).toBeVisible();
});

test("UK landing shows configured pricing and reaches a qualified booking result", async ({ page }) => {
  await page.route("**/api/leads", async (route) => {
    const payload = route.request().postDataJSON();
    expect(payload.market).toBe("uk");
    expect(payload.budgetRange).toBe("uk-8000-20000");
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        leadId: "11111111-1111-4111-8111-111111111111",
        status: "qualified",
        bookingUrl: "https://example.com/book",
      }),
    });
  });

  await page.goto("/mvp-development/uk");
  await page.getByRole("button", { name: "Necessary only" }).click();
  await expect(page.getByText("From £8,000", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Check your product fit" }).click();
  await page.getByLabel("Full name").fill("Alex Founder");
  await page.getByLabel("Work email").fill("alex@example.com");
  await page.getByLabel("Country").fill("United Kingdom");
  await page.getByLabel("Role").selectOption("founder");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Industry").fill("Logistics");
  await page.getByLabel("How defined is the solution?").selectOption("b2b-saas");
  await page.getByLabel("How do you currently see AI fitting into the opportunity?").selectOption("ai-core");
  await page.getByLabel("What problem are you trying to solve?").fill("Important delivery work is fragmented across email and spreadsheets every day.");
  await page.getByLabel("What evidence do you currently have?").fill("Spreadsheets, manual email follow-ups, and weekly delivery reports.");
  await page.getByLabel("Who would use the product?").fill("Operations teams and delivery managers.");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("group", { name: "Have you discussed" }).getByLabel("Yes", { exact: true }).check();
  await page.getByRole("group", { name: "Can you provide access" }).getByLabel("Yes", { exact: true }).check();
  await page.getByLabel("It creates significant manual work or operational cost").check();
  await page.getByLabel("Existing business process that needs software").check();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("£8,000–£20,000").check();
  await page.getByLabel("Within one month").check();
  await page.getByLabel("I make the final decision").check();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByText("I consent to NeedFoundry contacting me").click();
  await page.getByRole("button", { name: "Request my free Product Clarity Call" }).click();
  await expect(page).toHaveURL(/thank-you/);
  await expect(page.getByRole("link", { name: "Choose a time for the free call" })).toBeVisible();
});

test("US landing uses US prices", async ({ page }) => {
  await page.goto("/mvp-development/us");
  await page.getByRole("button", { name: "Necessary only" }).click();
  await expect(page.getByText("From $10,000", { exact: true })).toBeVisible();
  await expect(page.getByText("From £8,000", { exact: true })).toHaveCount(0);
});
