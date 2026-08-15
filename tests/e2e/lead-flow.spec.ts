import { expect, test } from "@playwright/test";

const publishedWorkSlugs = [
  "claimdeck",
  "cpap",
  "callpotential",
  "built-by-girls",
  "fuze-health",
  "children-health",
  "mantl",
];
const archivedWorkSlugs = [
  "ticketrev",
  "tributi",
  "loopple",
];
const removedWorkSlug = "cost-plus-drugs";
const legacyReferenceFraming =
  /Codal|\breferences?\b|\/work\/codal(?:\/|%2f)/i;
const legacyEnrichmentFields = [
  "country",
  "role",
  "industry",
  "projectType",
  "aiExpectation",
  "currentWorkaround",
  "intendedUsers",
  "userDiscussions",
  "userAccess",
  "problemImpact",
  "productStage",
  "decisionAuthority",
];

test("homepage keeps a concise lead-generation path", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Necessary only" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "The product-first studio for AI-native software." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Discuss your product idea — free" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Start with the right level of product certainty." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Focused products, shaped around real operating problems." })).toBeVisible();
  await expect(page.getByRole("link", { name: "View the ClaimDeck case study" })).toBeVisible();
  await expect(page.locator("body")).toContainText("Selected work");
  await expect(page.locator("body")).toContainText("Products designed and built by NeedFoundry");
  await expect(page.locator("body")).toContainText("NeedFoundry project");
  await expect(page.locator("body")).not.toContainText(legacyReferenceFraming);
  await expect(page.locator('img[src^="/work/projects/"]').first()).toBeAttached();
  await expect(page.locator('[src*="/work/codal/"]')).toHaveCount(0);
  for (const slug of publishedWorkSlugs) {
    await expect(page.locator(`a[href="/work/${slug}"]`).first()).toBeAttached();
  }
  for (const slug of [...archivedWorkSlugs, removedWorkSlug]) {
    await expect(page.locator(`a[href="/work/${slug}"]`)).toHaveCount(0);
  }
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

test("work shows seven verified NeedFoundry projects and archives unpublished profiles", async ({ page, request }) => {
  await page.goto("/work");
  await page.getByRole("button", { name: "Necessary only" }).click();
  await expect(page.getByRole("heading", { name: "Focused products, shaped around real operating problems." })).toBeVisible();
  await expect(page.locator("body")).toContainText("Selected work");
  await expect(page.locator("body")).toContainText("Products designed and built by NeedFoundry");
  await expect(page.locator("body")).toContainText("NeedFoundry project");
  await expect(page.locator("body")).not.toContainText(legacyReferenceFraming);
  await expect(page.locator('img[src^="/work/projects/"]').first()).toBeAttached();
  await expect(page.locator('[src*="/work/codal/"]')).toHaveCount(0);

  for (const slug of publishedWorkSlugs) {
    await expect(page.locator(`a[href="/work/${slug}"]`).first()).toBeAttached();
    const response = await request.get(`/work/${slug}`);
    expect(response.status(), slug).toBe(200);
  }
  for (const slug of [...archivedWorkSlugs, removedWorkSlug]) {
    await expect(page.locator(`a[href="/work/${slug}"]`)).toHaveCount(0);
  }

  const claimdeckResponse = await page.goto("/work/claimdeck");
  expect(claimdeckResponse?.status()).toBe(200);
  await expect(page.locator("body")).toContainText("NeedFoundry project");
  await expect(page.locator("body")).toContainText(
    "Delivered by NeedFoundry and published with founder authorization.",
  );
  await expect(page.getByText("Client", { exact: true })).toBeVisible();
  await expect(page.getByText("Engagement", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How the workflow fits together" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(legacyReferenceFraming);
  await expect(page.locator("body")).not.toContainText(/Source:|Profile type|Published outcomes/i);
  await expect(page.locator('img[src^="/work/projects/"]').first()).toBeAttached();
  await expect(page.locator('[src*="/work/codal/"]')).toHaveCount(0);
  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) =>
      nodes
        .map((node) => JSON.parse(node.textContent ?? "{}"))
        .find((item) => item["@type"] === "Article"),
    );
  expect(structuredData?.author?.name).toBe("NeedFoundry");
  expect(structuredData?.publisher?.name).toBe("NeedFoundry");
  expect(structuredData?.about?.["@type"]).toBe("SoftwareApplication");
  expect(structuredData?.about?.creator?.name).toBe("NeedFoundry");
  expect(structuredData?.citation).toBeUndefined();
  expect(structuredData?.isBasedOn).toBeUndefined();

  for (const slug of archivedWorkSlugs) {
    const response = await request.get(`/work/${slug}`);
    expect(response.status(), slug).toBe(404);
  }

  const removedResponse = await page.goto(`/work/${removedWorkSlug}`);
  expect(removedResponse?.status(), removedWorkSlug).toBe(404);
  await expect(page.getByText("Project record")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(
    "Unifying pharmacy operations for faster fulfillment and product iteration",
  );
});

test("UK landing shows configured pricing and reaches a qualified booking result", async ({ page }) => {
  await page.route("**/api/leads", async (route) => {
    const payload = route.request().postDataJSON();
    expect(payload.fullName).toBe("Alex Founder");
    expect(payload.email).toBe("alex@example.com");
    expect(payload.problemDescription).toBe(
      "Important delivery work is fragmented across email and spreadsheets every day.",
    );
    expect(payload.market).toBe("uk");
    expect(payload.budgetRange).toBe("uk-8000-20000");
    expect(payload.timeline).toBe("within-one-month");
    expect(payload.contactConsent).toBe(true);
    expect(payload.marketingConsent).toBe(false);
    expect(payload).not.toHaveProperty("company");
    for (const field of legacyEnrichmentFields) {
      expect(payload).not.toHaveProperty(field);
    }
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
  await page.getByRole("link", { name: "Start your enquiry" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Tell us what you’d like to build or improve.",
    }),
  ).toBeVisible();
  const currency = page.getByRole("group", { name: "Budget currency" });
  await expect(currency.getByRole("button", { name: "GBP" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(currency.getByRole("button", { name: "USD" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.getByLabel("Full name").fill("Alex Founder");
  await page.getByLabel("Work email").fill("alex@example.com");
  await page.getByLabel("What would you like to build or improve?").fill(
    "Important delivery work is fragmented across email and spreadsheets every day.",
  );
  await page
    .getByLabel("Approximate first-phase budget")
    .selectOption("uk-8000-20000");
  await page
    .getByLabel("When would you like to start?")
    .selectOption("within-one-month");
  await page.getByLabel(/I consent to NeedFoundry contacting me/).check();
  await page.getByRole("button", { name: "Send project enquiry" }).click();
  await expect(page).toHaveURL(/thank-you/);
  await expect(page.getByRole("link", { name: "Choose a time for the free call" })).toBeVisible();
});

test("US landing keeps its currency toggle and submitted market aligned", async ({ page }) => {
  await page.route("**/api/leads", async (route) => {
    const payload = route.request().postDataJSON();
    expect(payload.market).toBe("us");
    expect(payload.budgetRange).toBe("us-10000-25000");
    expect(payload.timeline).toBe("within-three-months");
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        leadId: "22222222-2222-4222-8222-222222222222",
        status: "qualified",
        bookingUrl: "https://example.com/book-us",
      }),
    });
  });

  await page.goto("/mvp-development/us");
  await page.getByRole("button", { name: "Necessary only" }).click();
  await expect(page.getByText("From $10,000", { exact: true })).toBeVisible();
  await expect(page.getByText("From £8,000", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Start your enquiry" }).click();

  const currency = page.getByRole("group", { name: "Budget currency" });
  const gbp = currency.getByRole("button", { name: "GBP" });
  const usd = currency.getByRole("button", { name: "USD" });
  const budget = page.getByLabel("Approximate first-phase budget");
  await expect(usd).toHaveAttribute("aria-pressed", "true");
  await expect(gbp).toHaveAttribute("aria-pressed", "false");
  await expect(
    budget.getByRole("option", { name: "$10,000–$25,000" }),
  ).toBeAttached();

  await gbp.click();
  await expect(gbp).toHaveAttribute("aria-pressed", "true");
  await expect(
    budget.getByRole("option", { name: "£8,000–£20,000" }),
  ).toBeAttached();
  await expect(
    budget.getByRole("option", { name: "$10,000–$25,000" }),
  ).toHaveCount(0);

  await usd.click();
  await expect(usd).toHaveAttribute("aria-pressed", "true");
  await expect(
    budget.getByRole("option", { name: "$10,000–$25,000" }),
  ).toBeAttached();

  await page.getByLabel("Full name").fill("Taylor Operator");
  await page.getByLabel("Work email").fill("taylor@example.com");
  await page.getByLabel("What would you like to build or improve?").fill(
    "We need one dependable workflow for customer requests, approvals, and delivery handoffs.",
  );
  await budget.selectOption("us-10000-25000");
  await page
    .getByLabel("When would you like to start?")
    .selectOption("within-three-months");
  await page.getByLabel(/I consent to NeedFoundry contacting me/).check();
  await page.getByRole("button", { name: "Send project enquiry" }).click();
  await expect(page).toHaveURL(/thank-you/);
});
