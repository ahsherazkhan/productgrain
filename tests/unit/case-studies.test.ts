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

test("publishes only verified client work with confirmed permission", () => {
  const published = getPublishedCaseStudies();
  assert.equal(caseStudies.length, 10);
  assert.equal(published.length, 0);
  assert.ok(caseStudies.every((item) => !item.published));
  assert.ok(
    published.every(
      (item) =>
        item.permissionStatus === "confirmed" &&
        item.provenance.kind === "verified-client-work",
    ),
  );
  assert.equal(getPublishedCaseStudyBySlug("claimdeck"), undefined);
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

test("returns no featured or related work while profiles remain unverified", () => {
  assert.deepEqual(getFeaturedCaseStudies(), []);
  const claimdeck = caseStudies.find((item) => item.slug === "claimdeck");
  assert.ok(claimdeck);
  assert.deepEqual(getRelatedCaseStudies(claimdeck), []);
});

test("keeps third-party and independent profiles out of published work", () => {
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
    [...thirdPartyProfiles, ...independentProfiles].every(
      (item) => !publishedSlugs.has(item.slug),
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
