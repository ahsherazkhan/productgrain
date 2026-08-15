import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { GET as faviconResponse } from "../../app/favicon.ico/route";
import { markets } from "../../src/config/markets";
import {
  brandColors,
  siteConfig,
  siteMetadata,
} from "../../src/config/site";

const legacyOpenGraphHash =
  "7f8e1330b3148ed54d0e24a9a1799d762391b81d3ec837101ebd72fd92ed7623";

function assetPath(...parts: string[]): string {
  return join(process.cwd(), "public", ...parts);
}

function relativeLuminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255);
  assert.ok(channels);
  const linear = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

test("configures the approved ProductGrain identity and accessible palette", () => {
  assert.deepEqual(
    {
      brandName: siteConfig.brandName,
      tagline: siteConfig.tagline,
      positioning: siteConfig.positioning,
      description: siteConfig.description,
      footerDescriptor: siteConfig.footerDescriptor,
      title: siteMetadata.title,
      openGraphAlt: siteMetadata.openGraphAlt,
    },
    {
      brandName: "ProductGrain",
      tagline: "The product-first studio for AI-native software.",
      positioning:
        "ProductGrain is a product-first studio for AI-native software. We help industry experts and nontechnical founders research real problems, validate product opportunities, and build software their market actually needs.",
      description:
        "ProductGrain helps industry experts and nontechnical founders validate product opportunities and build focused AI-native software around real market needs.",
      footerDescriptor:
        "Founder-led product strategy, design, and engineering.",
      title: "Product-First AI Software Studio | ProductGrain",
      openGraphAlt:
        "ProductGrain — the product-first studio for AI-native software.",
    },
  );
  assert.deepEqual(
    {
      cobalt: brandColors.cobalt,
      cobaltDark: brandColors.cobaltDark,
      apricot: brandColors.apricot,
      success: brandColors.success,
    },
    {
      cobalt: "#3F51D9",
      cobaltDark: "#303FAE",
      apricot: "#F3A56F",
      success: "#1F8A5B",
    },
  );
  assert.ok(contrastRatio(brandColors.paper, brandColors.cobalt) >= 4.5);
});

test("brands UK and US campaign metadata without changing market behavior", () => {
  assert.equal(
    markets.uk.landingTitle,
    "Product-First AI MVP Development in the UK | ProductGrain",
  );
  assert.equal(
    markets.us.landingTitle,
    "Product-First AI MVP Development in the US | ProductGrain",
  );
  assert.match(markets.uk.landingDescription, /^ProductGrain helps UK /);
  assert.match(markets.us.landingDescription, /^ProductGrain helps US /);
  assert.doesNotMatch(
    [
      markets.uk.landingTitle,
      markets.uk.landingDescription,
      markets.us.landingTitle,
      markets.us.landingDescription,
    ].join(" "),
    /NeedFoundry/,
  );
});

test("ships the supplied ProductGrain marks and simplified favicon geometry", async () => {
  for (const asset of [
    "productgrain-mark.svg",
    "productgrain-favicon.svg",
    "productgrain-logo.svg",
    "productgrain-logo-light.svg",
    "productgrain-mark-mono-dark.svg",
    "productgrain-mark-mono-light.svg",
  ]) {
    assert.ok(existsSync(assetPath("brand", asset)), asset);
  }

  const suppliedFavicon = readFileSync(
    assetPath("brand", "productgrain-favicon.svg"),
    "utf8",
  );
  const publicFavicon = readFileSync(assetPath("favicon.svg"), "utf8");
  assert.equal(publicFavicon, suppliedFavicon);
  assert.match(publicFavicon, /viewBox="0 0 64 64"/);
  assert.match(publicFavicon, /fill="#3F51D9"/);
  assert.match(publicFavicon, /stroke="#FFFFFF"/);
  assert.match(publicFavicon, /M46 18C42\.3 14\.7/);
  assert.doesNotMatch(publicFavicon, /#415CF6|#BFF078/);

  const response = faviconResponse();
  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^image\/svg\+xml\b/,
  );
  const dynamicFavicon = await response.text();
  assert.match(dynamicFavicon, /fill="#3F51D9"/);
  assert.match(dynamicFavicon, /M46 18C42\.3 14\.7/);
  assert.doesNotMatch(dynamicFavicon, /#415CF6|#BFF078/);
});

test("ships a new 1200 by 630 ProductGrain Open Graph image", () => {
  const image = readFileSync(assetPath("og.png"));
  assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(image.readUInt32BE(16), 1_200);
  assert.equal(image.readUInt32BE(20), 630);
  assert.notEqual(
    createHash("sha256").update(image).digest("hex"),
    legacyOpenGraphHash,
  );
});

test("preserves legacy integration and browser identifiers through the rebrand", () => {
  const transitionSource = [
    "src/components/analytics/attribution-capture.tsx",
    "src/components/analytics/consent-analytics.tsx",
    "src/components/forms/application-form.tsx",
    "src/components/forms/thank-you-result.tsx",
    "src/components/layout/cookie-consent.tsx",
    "src/components/layout/site-footer.tsx",
    "src/lib/attribution/index.ts",
    "src/lib/leads/repositories.ts",
  ]
    .map((file) => readFileSync(join(process.cwd(), file), "utf8"))
    .join("\n");

  for (const identifier of [
    "needfoundry-consent-v1",
    "needfoundry-attribution-v1",
    "needfoundry-result:",
    "needfoundry:consent",
    "needfoundry:cookie-settings",
    "needfoundry-ga",
    "needfoundry-meta",
    "needfoundry.invalid",
    "x-needfoundry-signature",
  ]) {
    assert.ok(transitionSource.includes(identifier), identifier);
  }

  const packageManifest = JSON.parse(
    readFileSync(join(process.cwd(), "package.json"), "utf8"),
  ) as { name?: unknown };
  assert.equal(packageManifest.name, "needfoundry-website");
});
