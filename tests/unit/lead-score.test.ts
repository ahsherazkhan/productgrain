import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateLeadScore,
  qualificationStatus,
} from "../../src/lib/scoring/lead-score";
import { validLead } from "../fixtures/lead";

test("scores a qualified commercial lead deterministically", () => {
  const score = calculateLeadScore(validLead());

  assert.deepEqual(score, {
    total: 100,
    status: "qualified",
    breakdown: {
      role: 15,
      stage: 15,
      budget: 25,
      timeline: 15,
      userAccess: 15,
      impact: 15,
    },
  });
});

test("routes review and nurture leads at exact thresholds", () => {
  assert.equal(qualificationStatus(60), "qualified");
  assert.equal(qualificationStatus(59), "review");
  assert.equal(qualificationStatus(40), "review");
  assert.equal(qualificationStatus(39), "nurture");
});

test("does not treat an uncertain budget as an automatic rejection", () => {
  const score = calculateLeadScore(
    validLead({
      role: "technical-founder",
      productStage: "early-idea",
      budgetRange: "not-sure",
      timeline: "within-six-months",
      userAccess: "probably",
      problemImpact: "moderate-inefficiency",
    }),
  );

  assert.equal(score.breakdown.budget, 8);
  assert.equal(score.total, 45);
  assert.equal(score.status, "review");
});

test("caps role points when the applicant is researching for someone else", () => {
  const score = calculateLeadScore(
    validLead({
      role: "founder",
      decisionAuthority: "researching-for-someone",
    }),
  );

  assert.equal(score.breakdown.role, 3);
});

test("recognizes a primary user even when stakeholder access is not applicable", () => {
  const score = calculateLeadScore(
    validLead({
      userDiscussions: "primary-user",
      userAccess: "not-applicable",
    }),
  );

  assert.equal(score.breakdown.userAccess, 10);
});
