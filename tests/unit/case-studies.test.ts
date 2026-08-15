import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  caseStudies,
  getFeaturedCaseStudies,
  getPublishedCaseStudies,
  getPublishedCaseStudyBySlug,
  getRelatedCaseStudies,
} from "../../src/content/case-studies";

test("publishes only approved client work or founder-authorized references", () => {
  const published = getPublishedCaseStudies();
  assert.equal(published.length, 8);
  assert.ok(published.every((item) => item.published));
  assert.ok(
    published.every(
      (item) =>
        item.permissionStatus === "confirmed" &&
        (item.provenance.kind === "verified-client-work" ||
          item.provenance.kind === "third-party-reference"),
    ),
  );
  assert.equal(getPublishedCaseStudyBySlug("claimdeck")?.clientName, "ClaimDeck");
  assert.equal(getPublishedCaseStudyBySlug("fitish"), undefined);
});

test("keeps project identifiers, order, sources, and media valid", () => {
  const slugs = caseStudies.map((item) => item.slug);
  const orders = caseStudies.map((item) => item.featuredOrder);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(orders).size, orders.length);

  for (const item of caseStudies) {
    assert.match(item.productUrl, /^https:\/\//);
    assert.ok(item.sourceUrls.every((url) => url.startsWith("https://")));
    assert.ok(item.sourceUrls.includes(item.provenance.sourceUrl));
    assert.ok(item.provenance.disclosure.length > 40);
    for (const leader of item.publicLeadership) {
      assert.match(leader.sourceUrl, /^https:\/\//);
      assert.ok(item.sourceUrls.includes(leader.sourceUrl));
    }
    assert.ok(item.images.length > 0);
    for (const image of item.images) {
      assert.ok(image.alt.length > 20);
      assert.ok(image.src.startsWith("/work/"));
      assert.ok(existsSync(join(process.cwd(), "public", image.src)));
    }
    if (item.logo) {
      assert.ok(item.logo.src.startsWith("/work/"));
      assert.ok(existsSync(join(process.cwd(), "public", item.logo.src)));
    }
    for (const result of item.results) {
      assert.ok(result.verificationNote.length > 0);
    }
  }
});

test("selects intentional featured and related approved references", () => {
  assert.deepEqual(
    getFeaturedCaseStudies().map((item) => item.slug),
    ["claimdeck", "cpap", "callpotential"],
  );
  const claimdeck = getPublishedCaseStudyBySlug("claimdeck");
  assert.ok(claimdeck);
  assert.deepEqual(
    getRelatedCaseStudies(claimdeck).map((item) => item.slug),
    ["cpap", "callpotential"],
  );
});

test("keeps unapproved independent product profiles out of published work", () => {
  const publishedSlugs = new Set(
    getPublishedCaseStudies().map((item) => item.slug),
  );
  const independentProfiles = caseStudies.filter(
    (item) => item.provenance.kind === "public-product-profile",
  );

  assert.equal(independentProfiles.length, 3);
  assert.ok(
    independentProfiles.every((item) => !publishedSlugs.has(item.slug)),
  );
});

test("includes verified image galleries and business logic for enriched projects", () => {
  assert.ok((getPublishedCaseStudyBySlug("cpap")?.images.length ?? 0) >= 6);
  assert.ok((getPublishedCaseStudyBySlug("claimdeck")?.images.length ?? 0) >= 5);
  assert.ok(
    getPublishedCaseStudies()
      .filter((item) => item.workflow)
      .every((item) => item.workflow?.length === 3),
  );
});
