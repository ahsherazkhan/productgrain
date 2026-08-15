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

test("publishes the eight sourced reference and product profiles", () => {
  const published = getPublishedCaseStudies();
  assert.equal(published.length, 8);
  assert.ok(published.every((item) => item.published));
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
    for (const video of item.videos ?? []) {
      assert.match(video.embedUrl, /^https:\/\/player\.vimeo\.com\/video\//);
      assert.ok(!video.embedUrl.includes("autoplay=1"));
      assert.ok(item.sourceUrls.includes(video.sourceUrl));
    }
    for (const result of item.results) {
      assert.ok(result.verificationNote.length > 0);
    }
  }
});

test("selects intentional featured and related reference records", () => {
  assert.deepEqual(
    getFeaturedCaseStudies().map((item) => item.slug),
    ["claimdeck", "fuze-health", "cost-plus-drugs"],
  );
  const claimdeck = getPublishedCaseStudyBySlug("claimdeck");
  assert.ok(claimdeck);
  assert.deepEqual(
    getRelatedCaseStudies(claimdeck).map((item) => item.slug),
    ["fuze-health", "cost-plus-drugs"],
  );
});

test("labels Codal references without claiming NeedFoundry delivery", () => {
  const references = caseStudies.filter(
    (item) => item.provenance.kind === "third-party-reference",
  );
  assert.equal(references.length, 5);
  for (const item of references) {
    assert.equal(item.provenance.sourceName, "Codal");
    assert.equal(item.permissionStatus, "not-requested");
    assert.doesNotMatch(item.solution, /^We\b/);
    assert.match(item.provenance.disclosure, /not as NeedFoundry client work/);
  }
});
