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

test("publishes only the six confirmed and verifiable client products", () => {
  const published = getPublishedCaseStudies();
  assert.equal(published.length, 6);
  assert.ok(
    published.every(
      (item) => item.published && item.permissionStatus === "confirmed",
    ),
  );
  assert.equal(getPublishedCaseStudyBySlug("fitish"), undefined);
});

test("keeps project identifiers, order, sources, and local images valid", () => {
  const slugs = caseStudies.map((item) => item.slug);
  const orders = caseStudies.map((item) => item.featuredOrder);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(orders).size, orders.length);

  for (const item of caseStudies) {
    assert.match(item.productUrl, /^https:\/\//);
    assert.ok(item.sourceUrls.every((url) => url.startsWith("https://")));
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
    for (const result of item.results) {
      assert.ok(result.verificationNote.length > 0);
    }
  }
});

test("selects intentional featured and related project records", () => {
  assert.deepEqual(
    getFeaturedCaseStudies().map((item) => item.slug),
    ["duro", "genuity", "purpose"],
  );
  const duro = getPublishedCaseStudyBySlug("duro");
  assert.ok(duro);
  assert.deepEqual(
    getRelatedCaseStudies(duro).map((item) => item.slug),
    ["genuity", "ticketrev"],
  );
});
