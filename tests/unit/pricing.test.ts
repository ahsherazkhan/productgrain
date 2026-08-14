import assert from "node:assert/strict";
import test from "node:test";
import { getPricingPackage, getPricingPackages } from "../../src/config/pricing";

test("selects manually configured UK prices without conversion", () => {
  const packages = getPricingPackages("uk");
  assert.equal(packages[0].price.display, "From £2,000");
  assert.equal(packages[1].price.display, "From £8,000");
  assert.equal(packages[2].price.display, "From £20,000");
  assert.ok(packages.every((item) => item.price.currency === "GBP"));
});

test("selects manually configured US prices without conversion", () => {
  const packages = getPricingPackages("us");
  assert.equal(packages[0].price.display, "From $2,500");
  assert.equal(packages[1].price.display, "From $10,000");
  assert.equal(packages[2].price.display, "From $25,000");
  assert.ok(packages.every((item) => item.price.currency === "USD"));
});

test("resolves an individual package and safely falls back for an invalid market", () => {
  assert.equal(
    getPricingPackage("focused-mvp", "not-a-market").price.display,
    "From £8,000",
  );
});
