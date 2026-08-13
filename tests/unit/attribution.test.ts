import assert from "node:assert/strict";
import test from "node:test";

import {
  captureAttribution,
  mergeAttribution,
} from "../../src/lib/attribution/index";

test("captures campaign fields without URL credentials or fragments", () => {
  const snapshot = captureAttribution(
    new URL(
      "https://needfoundry.example/mvp-development/uk?utm_source=meta&utm_medium=paid-social&utm_campaign=uk-launch&fbclid=abc123",
    ),
    "https://user:secret@publisher.example/article#private",
    new Date("2026-08-14T12:00:00.000Z"),
  );

  assert.equal(snapshot.landingPage, "/mvp-development/uk?utm_source=meta&utm_medium=paid-social&utm_campaign=uk-launch&fbclid=abc123");
  assert.equal(snapshot.utmSource, "meta");
  assert.equal(snapshot.utmCampaign, "uk-launch");
  assert.equal(snapshot.fbclid, "abc123");
  assert.equal(snapshot.referrer, "https://publisher.example/article");
});

test("preserves first touch while replacing last touch", () => {
  const first = captureAttribution(
    new URL("https://needfoundry.example/?utm_source=meta"),
  );
  const second = captureAttribution(
    new URL("https://needfoundry.example/apply?utm_source=email"),
  );

  const state = mergeAttribution(mergeAttribution(undefined, first), second);
  assert.equal(state.firstTouch.utmSource, "meta");
  assert.equal(state.lastTouch.utmSource, "email");
});

test("drops unsafe referrer protocols", () => {
  const snapshot = captureAttribution(
    new URL("https://needfoundry.example/apply"),
    "javascript:alert(1)",
  );
  assert.equal(snapshot.referrer, undefined);
});

test("strips arbitrary query values from attribution and referrers", () => {
  const snapshot = captureAttribution(
    new URL("https://needfoundry.example/thank-you?ref=private-lead-id&utm_source=email&token=secret"),
    "https://publisher.example/article?email=person%40example.com#private",
  );

  assert.equal(snapshot.landingPage, "/thank-you?utm_source=email");
  assert.equal(snapshot.referrer, "https://publisher.example/article");
});

test("preserves allowlisted application context", () => {
  const snapshot = captureAttribution(
    new URL("https://needfoundry.example/apply?market=us&package=focused-mvp&token=secret"),
  );
  assert.equal(snapshot.landingPage, "/apply?market=us&package=focused-mvp");
});
