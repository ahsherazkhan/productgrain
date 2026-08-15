import assert from "node:assert/strict";
import test from "node:test";

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
const verifiedProjectDisclosure =
  /Delivered by NeedFoundry and published with founder authorization\./i;

function readStructuredDataScripts(html) {
  return [...html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )].map((match) => JSON.parse(match[1]));
}

function readStructuredData(html, type) {
  const scripts = readStructuredDataScripts(html);
  const structuredData = scripts.find(
    (item) => item["@type"] === type,
  );
  assert.ok(structuredData, `${type} JSON-LD script`);
  return structuredData;
}

function withoutReactTextSeparators(html) {
  return html.replaceAll("<!-- -->", "");
}

function withoutAbsoluteUrls(html) {
  return html.replace(/https?:\/\/[^"'\\<>\s]+/gi, "");
}

function assertProductGrainShell(html) {
  const wordmarkLinks = [
    ...html.matchAll(/<a[^>]+aria-label="ProductGrain home"[^>]*>/gi),
  ];
  const wordmarkImages = [
    ...html.matchAll(
      /<img(?=[^>]*class="wordmark__mark")(?=[^>]*alt="")(?=[^>]*productgrain-mark\.svg)[^>]*>/gi,
    ),
  ];
  assert.equal(wordmarkLinks.length, 2);
  assert.equal(wordmarkImages.length, 2);
  assert.match(html, />ProductGrain<\/span>/);
  assert.doesNotMatch(html, /wordmark__mark[^>]*>\s*<i/i);
}

function assertMarketMetadata(html, { title, description, locale }) {
  assert.ok(html.includes(`<title>${title}</title>`), title);
  assert.ok(
    html.includes(`<meta property="og:title" content="${title}"/>`),
    "Open Graph title",
  );
  assert.ok(
    html.includes(`<meta property="og:description" content="${description}"/>`),
    "Open Graph description",
  );
  assert.ok(
    html.includes('<meta property="og:site_name" content="ProductGrain"/>'),
    "Open Graph site name",
  );
  assert.ok(
    html.includes(`<meta property="og:locale" content="${locale}"/>`),
    "Open Graph locale",
  );
  assert.match(html, /<meta property="og:image" content="[^">]*\/og\.png\?v=productgrain-20260816"/i);
  assert.match(html, /<meta property="og:image:width" content="1200"/i);
  assert.match(html, /<meta property="og:image:height" content="630"/i);
  assert.ok(
    html.includes(
      '<meta property="og:image:alt" content="ProductGrain — the product-first studio for AI-native software."/>',
    ),
    "Open Graph image alt",
  );
  assert.ok(
    html.includes('<meta name="twitter:card" content="summary_large_image"/>'),
    "Twitter card",
  );
  assert.ok(
    html.includes(`<meta name="twitter:title" content="${title}"/>`),
    "Twitter title",
  );
  assert.ok(
    html.includes(`<meta name="twitter:description" content="${description}"/>`),
    "Twitter description",
  );
  assert.match(html, /<meta name="twitter:image" content="[^">]*\/og\.png\?v=productgrain-20260816"/i);
  assert.ok(
    html.includes(
      '<meta name="twitter:image:alt" content="ProductGrain — the product-first studio for AI-native software."/>',
    ),
    "Twitter image alt",
  );
  assert.doesNotMatch(html, /\| ProductGrain \| ProductGrain/i);
}

function assertConciseEnquiryForm(html, selectedCurrency) {
  const content = withoutReactTextSeparators(html);
  assert.match(content, /About 2 minutes/i);
  assert.match(content, /No technical brief required/i);
  assert.match(content, /Tell us what you(?:’|&#x27;)d like to build or improve/i);
  assert.match(content, /Company or project name/i);
  assert.match(content, /What would you like to build or improve\?/i);
  assert.match(content, /Approximate first-phase budget/i);
  assert.match(content, /When would you like to start\?/i);
  assert.match(content, /I consent to ProductGrain contacting me about this enquiry/i);
  assert.match(content, /Optional and unchecked by default/i);
  assert.match(content, /Send project enquiry/i);
  assert.match(
    html,
    new RegExp(`aria-pressed="true"[^>]*>${selectedCurrency}</button>`, "i"),
  );
  assert.equal([...html.matchAll(/<form\b/gi)].length, 1);
  assert.equal([...html.matchAll(/aria-required="true"/gi)].length, 6);
  assert.doesNotMatch(html, />Continue</i);
  assert.doesNotMatch(
    html,
    /id="(?:country|role|industry|projectType|aiExpectation|currentWorkaround|intendedUsers|userDiscussions|userAccess|problemImpact|productStage|decisionAuthority)"/i,
  );
}

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the ProductGrain homepage and social identity", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  const content = withoutReactTextSeparators(html);
  assertProductGrainShell(html);
  assert.match(
    content,
    /<title>Product-First AI Software Studio \| ProductGrain<\/title>/i,
  );
  assert.match(html, /<meta name="application-name" content="ProductGrain"/i);
  assert.match(html, /<meta name="author" content="ProductGrain"/i);
  assert.match(html, /<meta property="og:site_name" content="ProductGrain"/i);
  assert.match(
    html,
    /<meta property="og:title" content="Product-First AI Software Studio \| ProductGrain"/i,
  );
  assert.match(
    html,
    /<meta property="og:description" content="ProductGrain helps industry experts and nontechnical founders validate product opportunities and build focused AI-native software around real market needs\."/i,
  );
  assert.match(html, /<meta property="og:image" content="[^">]*\/og\.png\?v=productgrain-20260816"/i);
  assert.match(html, /<meta property="og:image:width" content="1200"/i);
  assert.match(html, /<meta property="og:image:height" content="630"/i);
  assert.match(
    html,
    /<meta property="og:image:alt" content="ProductGrain — the product-first studio for AI-native software\."/i,
  );
  assert.match(
    html,
    /<meta name="twitter:title" content="Product-First AI Software Studio \| ProductGrain"/i,
  );
  assert.match(html, /<link rel="icon" href="\/favicon\.svg\?v=productgrain-20260816" type="image\/svg\+xml"/i);
  assert.match(html, /<link rel="shortcut icon" href="\/favicon\.ico\?v=productgrain-20260816"/i);
  assert.match(html, /The product-first studio for AI-native software/i);
  assert.match(
    html,
    /We help industry experts and nontechnical founders research real problems, validate product opportunities, and build software their market actually needs\./i,
  );
  assert.doesNotMatch(html, /Product-first, AI-native studio/i);
  assert.match(html, /Discuss your product idea/i);
  assert.match(html, /AI should improve the workflow/i);
  assert.match(html, /Start with the right level of product certainty/i);
  assert.match(html, /Selected work/i);
  assert.match(html, /Turn industry knowledge into focused software/i);
  assert.match(html, /Focused products built around real workflows/i);
  assert.match(html, /Selected products delivered by NeedFoundry/i);
  assert.doesNotMatch(
    html,
    /Your industry knowledge could become an AI-native product|Focused products, shaped around real operating problems/i,
  );
  assert.match(html, /NeedFoundry project/i);
  assert.match(html, /ClaimDeck/i);
  assert.match(html, /\/work\/projects\//i);
  assert.match(
    content,
    new RegExp(
      `© ${new Date().getFullYear()} ProductGrain\\. Founder-led product strategy, design, and engineering\\.`,
      "i",
    ),
  );
  assert.doesNotMatch(html, legacyReferenceFraming);
  assert.doesNotMatch(html, /Know what you are committing to before development begins/i);
  for (const slug of publishedWorkSlugs) {
    assert.match(html, new RegExp(`/work/${slug}`), slug);
  }
  for (const slug of [...archivedWorkSlugs, removedWorkSlug]) {
    assert.doesNotMatch(html, new RegExp(`/work/${slug}`), slug);
  }
  assert.doesNotMatch(html, /decision-map|Founder and team|Product possibilities/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);

  const homepageData = readStructuredDataScripts(html).find((item) =>
    Array.isArray(item["@graph"]),
  );
  assert.ok(homepageData);
  const organization = homepageData["@graph"].find(
    (item) => item["@type"] === "Organization",
  );
  const professionalService = homepageData["@graph"].find(
    (item) => item["@type"] === "ProfessionalService",
  );
  const service = homepageData["@graph"].find(
    (item) => item["@type"] === "Service",
  );
  assert.equal(organization?.name, "ProductGrain");
  assert.equal(professionalService?.name, "ProductGrain");
  assert.equal(service?.provider?.name, "ProductGrain");
});

test("server-renders market-specific campaign pricing", async () => {
  const [ukResponse, usResponse] = await Promise.all([
    render("/mvp-development/uk"),
    render("/mvp-development/us"),
  ]);
  assert.equal(ukResponse.status, 200);
  assert.equal(usResponse.status, 200);
  const [uk, us] = await Promise.all([ukResponse.text(), usResponse.text()]);
  assertProductGrainShell(uk);
  assertProductGrainShell(us);
  assertMarketMetadata(uk, {
    title: "Product-First AI MVP Development in the UK | ProductGrain",
    description:
      "ProductGrain helps UK industry experts, business owners, and nontechnical founders research real market problems, validate product opportunities, and build AI-native SaaS and focused software.",
    locale: "en_GB",
  });
  assertMarketMetadata(us, {
    title: "Product-First AI MVP Development in the US | ProductGrain",
    description:
      "ProductGrain helps US industry experts, business owners, and nontechnical founders research real market problems, validate product opportunities, and build AI-native SaaS and focused software.",
    locale: "en_US",
  });
  assert.equal(readStructuredData(uk, "Service").provider?.name, "ProductGrain");
  assert.equal(readStructuredData(us, "Service").provider?.name, "ProductGrain");
  assert.match(uk, /From £8,000/);
  assert.doesNotMatch(uk, /From \$10,000/);
  assert.match(us, /From \$10,000/);
  assert.doesNotMatch(us, /From £8,000/);
  assert.doesNotMatch(uk, /workflow-window|A familiar starting point|Founder and team/);
  assert.match(uk, /£8,000–£20,000/);
  assert.doesNotMatch(uk, /\$10,000–\$25,000/);
  assert.match(us, /\$10,000–\$25,000/);
  assert.doesNotMatch(us, /£8,000–£20,000/);
  assertConciseEnquiryForm(uk, "GBP");
  assertConciseEnquiryForm(us, "USD");
});

test("server-renders required core routes", async () => {
  for (const route of ["/services", "/process", "/pricing", "/work", "/about", "/apply", "/mvp-development", "/thank-you", "/privacy", "/terms", "/cookies"]) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
  }

  const applyResponse = await render("/apply");
  assert.equal(applyResponse.status, 200);
  const applyHtml = await applyResponse.text();
  assert.match(applyHtml, /A short note is enough to start/i);
  assert.match(applyHtml, /No technical specification/i);

  const aboutHtml = await (await render("/about")).text();
  const aboutContent = withoutReactTextSeparators(aboutHtml);
  assert.match(aboutHtml, /<title>About ProductGrain<\/title>/i);
  assert.doesNotMatch(aboutHtml, /\| ProductGrain \| ProductGrain/i);
  assert.match(aboutContent, /About ProductGrain/i);
  assert.match(aboutContent, /Built around how your market actually works\./i);
  assert.match(
    aboutContent,
    /ProductGrain helps people with deep industry knowledge turn real workflow problems into focused AI-native software\./i,
  );
  assert.match(aboutContent, /Why ProductGrain exists/i);
  assert.match(aboutContent, /Work with the grain of the market\./i);
  assert.match(
    aboutContent,
    /Every market has a grain: the workflows, constraints, decisions, and hard-won knowledge that shape how work really gets done\./i,
  );
  assert.match(
    aboutContent,
    /We learn that context before deciding what to build\. Then we connect research, validation, design, and engineering in one accountable path—from a promising problem to software people can use\./i,
  );
  const aboutHtmlWithoutUrls = withoutAbsoluteUrls(aboutHtml);
  assert.doesNotMatch(
    aboutHtmlWithoutUrls,
    /NeedFoundry|\b\d+[- ]person team\b/i,
  );

  const mvpHtml = await (await render("/mvp-development")).text();
  assert.match(
    mvpHtml,
    /<title>Product-First AI MVP Development \| ProductGrain<\/title>/i,
  );
  assert.doesNotMatch(mvpHtml, /\| ProductGrain \| ProductGrain/i);

  const legalExpectations = [
    {
      route: "/privacy",
      title: "Privacy Notice | ProductGrain",
      description:
        "How the ProductGrain website intends to collect, use, retain, and protect product-enquiry information.",
    },
    {
      route: "/terms",
      title: "Website Terms | ProductGrain",
      description:
        "Placeholder terms for using the ProductGrain website and product enquiry service.",
    },
    {
      route: "/cookies",
      title: "Cookie Notice | ProductGrain",
      description:
        "How necessary, analytics, and marketing technologies are controlled on the ProductGrain website.",
    },
  ];
  for (const { route, title, description } of legalExpectations) {
    const legalHtml = await (await render(route)).text();
    assert.ok(legalHtml.includes(`<title>${title}</title>`), route);
    assert.ok(
      legalHtml.includes(`<meta name="description" content="${description}"/>`),
      route,
    );
    assert.match(legalHtml, /Professional review required/i, route);
    assert.doesNotMatch(withoutAbsoluteUrls(legalHtml), /NeedFoundry/i, route);
  }
  const privacyHtml = await (await render("/privacy")).text();
  assert.match(
    privacyHtml,
    /ProductGrain is a public-facing brand in this draft, not a confirmed legal-entity or data-controller name\./i,
  );
  const termsHtml = await (await render("/terms")).text();
  assert.match(
    withoutReactTextSeparators(termsHtml),
    /The ProductGrain website and enquiry process do not guarantee product-market fit, adoption, revenue, funding, or commercial success\./i,
  );

  const thankYouHtml = await (await render("/thank-you")).text();
  assert.match(
    withoutReactTextSeparators(thankYouHtml),
    /Your ProductGrain project enquiry has been received/i,
  );
  assert.match(thankYouHtml, /<meta name="robots" content="noindex, nofollow"/i);
});

test("server-renders ProductGrain-authored pages for seven historical NeedFoundry projects", async () => {
  const workResponse = await render("/work");
  assert.equal(workResponse.status, 200);
  const workHtml = await workResponse.text();
  assertProductGrainShell(workHtml);
  assert.match(workHtml, /Selected work/i);
  assert.match(workHtml, /Focused products built around real workflows/i);
  assert.match(workHtml, /Selected products delivered by NeedFoundry/i);
  assert.match(workHtml, /NeedFoundry project/i);
  assert.match(workHtml, /\/work\/projects\//i);
  assert.doesNotMatch(workHtml, legacyReferenceFraming);
  assert.doesNotMatch(workHtml, /Unifying pharmacy operations for faster fulfillment and product iteration/i);

  const workStructuredData = readStructuredData(workHtml, "CollectionPage");
  assert.equal(workStructuredData["@type"], "CollectionPage");
  assert.equal(workStructuredData.hasPart.length, 7);
  for (const item of workStructuredData.hasPart) {
    assert.equal(item["@type"], "Article");
    assert.equal(item.author?.name, "ProductGrain");
    assert.equal(item.publisher?.name, "ProductGrain");
    assert.equal(item.about?.["@type"], "SoftwareApplication");
    assert.equal(item.about?.creator?.name, "NeedFoundry");
    assert.ok(!("citation" in item));
    assert.ok(!("isBasedOn" in item));
  }

  for (const slug of publishedWorkSlugs) {
    assert.match(workHtml, new RegExp(`/work/${slug}`), slug);
    const detailResponse = await render(`/work/${slug}`);
    assert.equal(detailResponse.status, 200, slug);
    const detailHtml = await detailResponse.text();
    assertProductGrainShell(detailHtml);
    assert.match(detailHtml, /NeedFoundry project/i);
    assert.match(detailHtml, verifiedProjectDisclosure);
    assert.match(detailHtml, /Project record/i);
    assert.match(detailHtml, /Client/i);
    assert.match(detailHtml, /Engagement/i);
    assert.match(detailHtml, /\/work\/projects\//i);
    assert.doesNotMatch(detailHtml, legacyReferenceFraming);
    assert.doesNotMatch(detailHtml, /Source:|Profile type|Published outcomes/i);

    const detailStructuredData = readStructuredData(detailHtml, "Article");
    assert.equal(detailStructuredData["@type"], "Article");
    assert.equal(detailStructuredData.author?.name, "ProductGrain");
    assert.equal(detailStructuredData.publisher?.name, "ProductGrain");
    assert.equal(detailStructuredData.about?.["@type"], "SoftwareApplication");
    assert.equal(detailStructuredData.about?.creator?.name, "NeedFoundry");
    assert.ok(!("citation" in detailStructuredData));
    assert.ok(!("isBasedOn" in detailStructuredData));
  }

  const cpapHtml = await (await render("/work/cpap")).text();
  assert.match(cpapHtml, /How the workflow fits together/i);
  assert.match(cpapHtml, /\/work\/projects\/cpap-ui\.webp/i);
  assert.doesNotMatch(cpapHtml, /player\.vimeo\.com/i);

  for (const slug of archivedWorkSlugs) {
    assert.doesNotMatch(workHtml, new RegExp(`/work/${slug}`));
    const detailResponse = await render(`/work/${slug}`);
    assert.equal(detailResponse.status, 404, slug);
    const detailHtml = await detailResponse.text();
    assert.doesNotMatch(detailHtml, /Project record|Profile type|Published outcomes/i);
  }

  assert.doesNotMatch(workHtml, new RegExp(`/work/${removedWorkSlug}`));
  const removedResponse = await render(`/work/${removedWorkSlug}`);
  assert.equal(removedResponse.status, 404, removedWorkSlug);
  const removedHtml = await removedResponse.text();
  assert.doesNotMatch(
    removedHtml,
    /Project record|Profile type|Published outcomes|Unifying pharmacy operations/i,
  );

  const missingResponse = await render("/work/not-a-real-project");
  assert.equal(missingResponse.status, 404);
});
