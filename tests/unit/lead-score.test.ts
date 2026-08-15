import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateLeadScore,
  qualificationStatus,
} from "../../src/lib/scoring/lead-score";
import type { LeadSubmissionInput } from "../../src/lib/validation/lead";
import { enrichedLead, validLead } from "../fixtures/lead";

test("scores a qualified concise enquiry from budget and timeline only", () => {
  const score = calculateLeadScore(validLead());

  assert.deepEqual(score, {
    total: 70,
    status: "qualified",
    breakdown: {
      budget: 50,
      timeline: 20,
    },
  });
});

test("routes review and nurture leads at exact thresholds", () => {
  assert.equal(qualificationStatus(60), "qualified");
  assert.equal(qualificationStatus(59), "review");
  assert.equal(qualificationStatus(30), "review");
  assert.equal(qualificationStatus(29), "nurture");
});

test("maps every US and UK budget range consistently", () => {
  const cases: Array<[LeadSubmissionInput["budgetRange"], number]> = [
    ["us-under-2500", 0],
    ["us-2500-5000", 10],
    ["us-5000-10000", 25],
    ["us-10000-25000", 45],
    ["us-25000-50000", 50],
    ["us-above-50000", 50],
    ["uk-under-2000", 0],
    ["uk-2000-4000", 10],
    ["uk-4000-8000", 25],
    ["uk-8000-20000", 45],
    ["uk-20000-40000", 50],
    ["uk-above-40000", 50],
    ["not-sure", 30],
  ];

  for (const [budgetRange, expected] of cases) {
    const score = calculateLeadScore({ budgetRange, timeline: "exploring" });
    assert.equal(score.breakdown.budget, expected, budgetRange);
    assert.equal(score.total, expected, budgetRange);
  }
});

test("maps every desired-start option consistently", () => {
  const cases: Array<[LeadSubmissionInput["timeline"], number]> = [
    ["as-soon-as-possible", 20],
    ["within-one-month", 20],
    ["within-three-months", 15],
    ["within-six-months", 10],
    ["more-than-six-months", 5],
    ["exploring", 0],
  ];

  for (const [timeline, expected] of cases) {
    const score = calculateLeadScore({
      budgetRange: "us-under-2500",
      timeline,
    });
    assert.equal(score.breakdown.timeline, expected, timeline);
    assert.equal(score.total, expected, timeline);
  }
});

test("keeps an uncertain budget eligible for manual review", () => {
  const score = calculateLeadScore({
    budgetRange: "not-sure",
    timeline: "exploring",
  });

  assert.deepEqual(score, {
    total: 30,
    status: "review",
    breakdown: { budget: 30, timeline: 0 },
  });
});

test("qualifies exactly at 60 points", () => {
  const score = calculateLeadScore({
    budgetRange: "uk-8000-20000",
    timeline: "within-three-months",
  });

  assert.equal(score.total, 60);
  assert.equal(score.status, "qualified");
});

test("does not qualify a high budget without a reasonably near start", () => {
  const score = calculateLeadScore({
    budgetRange: "us-above-50000",
    timeline: "exploring",
  });

  assert.equal(score.total, 50);
  assert.equal(score.status, "review");
});

test("legacy enrichment does not affect qualification", () => {
  const concise = validLead({
    budgetRange: "us-5000-10000",
    timeline: "within-six-months",
  });
  const enriched = enrichedLead({
    budgetRange: concise.budgetRange,
    timeline: concise.timeline,
    role: "student-researcher",
    productStage: "early-idea",
    userAccess: "not-currently",
    problemImpact: "opportunity",
    decisionAuthority: "researching-for-someone",
  });

  assert.deepEqual(calculateLeadScore(enriched), calculateLeadScore(concise));
});
