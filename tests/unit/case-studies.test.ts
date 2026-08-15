import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
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

test("publishes exactly seven verified NeedFoundry projects", () => {
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
        item.permissionStatus === "confirmed" &&
        item.provenance.kind === "verified-client-work" &&
        item.provenance.label === "NeedFoundry project" &&
        item.provenance.deliveryName === "NeedFoundry" &&
        item.provenance.disclosure ===
          "Delivered by NeedFoundry and published with founder authorization." &&
        item.results.length === 0,
    ),
  );
  assert.doesNotMatch(
    JSON.stringify(published),
    /Codal|\breferences?\b|\/work\/codal\//i,
  );
  assert.doesNotMatch(
    JSON.stringify(published.map((item) => item.provenance)),
    /ProductGrain/i,
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
    assert.ok(item.provenance.disclosure.length > 40);
    if (item.provenance.kind === "public-product-profile") {
      assert.ok(item.sourceUrls.includes(item.provenance.sourceUrl));
    }
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
    assert.equal(item.results.length, 0);
    if (item.published) {
      assert.ok(item.images.every((image) => image.src.startsWith("/work/projects/")));
      assert.ok(!item.logo || item.logo.src.startsWith("/work/projects/"));
    }
  }

  assert.ok(!caseStudies.some((item) => item.slug === "cost-plus-drugs"));
  const workAssets = readdirSync(join(process.cwd(), "public", "work"), {
    recursive: true,
  });
  for (const asset of [
    "cost-plus-cover.webp",
    "cost-plus-logo.svg",
    "cost-plus-prescription.webp",
  ]) {
    assert.ok(!workAssets.some((entry) => String(entry).endsWith(asset)), asset);
  }
});

test("selects intentional featured and related verified projects", () => {
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

test("publishes verified client work and keeps independent profiles archived", () => {
  const publishedSlugs = new Set(
    getPublishedCaseStudies().map((item) => item.slug),
  );
  const verifiedProjects = caseStudies.filter(
    (item) => item.provenance.kind === "verified-client-work",
  );
  const independentProfiles = caseStudies.filter(
    (item) => item.provenance.kind === "public-product-profile",
  );

  assert.equal(verifiedProjects.length, 7);
  assert.equal(independentProfiles.length, 3);
  assert.ok(
    verifiedProjects.every(
      (item) =>
        item.permissionStatus === "confirmed" &&
        item.provenance.kind === "verified-client-work" &&
        item.provenance.deliveryName === "NeedFoundry" &&
        publishedSlugs.has(item.slug),
    ),
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
