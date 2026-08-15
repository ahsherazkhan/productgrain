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

const publishedWorkSlugs = [
  "claimdeck",
  "cpap",
  "callpotential",
  "built-by-girls",
  "fuze-health",
  "children-health",
  "mantl",
];

test("publishes only sourced Codal industry references", () => {
  const published = getPublishedCaseStudies();
  assert.equal(caseStudies.length, 10);
  assert.deepEqual(
    published.map((item) => item.slug),
    publishedWorkSlugs,
  );
  assert.ok(
    published.every(
      (item) =>
        item.published &&
        item.provenance.kind === "third-party-reference" &&
        item.provenance.label === "Industry reference" &&
        item.provenance.sourceName === "Codal" &&
        item.provenance.disclosure ===
          "Industry reference compiled from Codal's public case study and credited product media." &&
        item.sourceUrls.includes(item.provenance.sourceUrl),
    ),
  );
  assert.ok(
    published.every(
      (item) =>
        !/(?:delivered|built|designed|developed|created) by NeedFoundry|NeedFoundry (?:delivered|built|designed|developed|created)/i.test(
          [
            item.summary,
            item.originalProblem,
            item.publicProductDirection,
            item.solution,
            item.provenance.disclosure,
          ].join(" "),
        ),
    ),
  );
  assert.equal(getPublishedCaseStudyBySlug("claimdeck")?.clientName, "ClaimDeck");
  assert.equal(getPublishedCaseStudyBySlug("cost-plus-drugs"), undefined);
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

  assert.ok(!caseStudies.some((item) => item.slug === "cost-plus-drugs"));
  for (const asset of [
    "cost-plus-cover.webp",
    "cost-plus-logo.svg",
    "cost-plus-prescription.webp",
  ]) {
    assert.equal(
      existsSync(join(process.cwd(), "public", "work", "codal", asset)),
      false,
      asset,
    );
  }
});

test("selects intentional featured and related industry references", () => {
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

test("publishes Codal references and keeps independent profiles archived", () => {
  const publishedSlugs = new Set(
    getPublishedCaseStudies().map((item) => item.slug),
  );
  const thirdPartyProfiles = caseStudies.filter(
    (item) => item.provenance.kind === "third-party-reference",
  );
  const independentProfiles = caseStudies.filter(
    (item) => item.provenance.kind === "public-product-profile",
  );

  assert.equal(thirdPartyProfiles.length, 7);
  assert.equal(independentProfiles.length, 3);
  assert.ok(
    thirdPartyProfiles.every((item) => publishedSlugs.has(item.slug)),
  );
  assert.ok(
    independentProfiles.every(
      (item) => !item.published && !publishedSlugs.has(item.slug),
    ),
  );
});

test("includes verified image galleries and business logic for enriched projects", () => {
  const cpap = caseStudies.find((item) => item.slug === "cpap");
  const claimdeck = caseStudies.find((item) => item.slug === "claimdeck");

  assert.ok((cpap?.images.length ?? 0) >= 6);
  assert.ok((claimdeck?.images.length ?? 0) >= 5);
  assert.ok(
    caseStudies
      .filter((item) => item.workflow)
      .every((item) => item.workflow?.length === 3),
  );
});
