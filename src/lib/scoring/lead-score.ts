import type { LeadSubmissionInput } from "../validation/lead";

export type QualificationStatus = "qualified" | "review" | "nurture";

export type LeadScoreBreakdown = {
  role: number;
  stage: number;
  budget: number;
  timeline: number;
  userAccess: number;
  impact: number;
};

export type LeadScore = {
  total: number;
  status: QualificationStatus;
  breakdown: LeadScoreBreakdown;
};

const roleScores: Record<LeadSubmissionInput["role"], number> = {
  "business-owner": 15,
  founder: 15,
  executive: 15,
  consultant: 12,
  "industry-professional": 12,
  "product-operations": 7,
  "technical-founder": 10,
  "student-researcher": 0,
  other: 0,
};

const stageScores: Record<LeadSubmissionInput["productStage"], number> = {
  "existing-process": 15,
  "existing-product": 15,
  "validated-idea": 12,
  prototype: 10,
  "early-idea": 4,
};

const budgetScores: Record<LeadSubmissionInput["budgetRange"], number> = {
  "us-under-2500": 0,
  "us-2500-5000": 7,
  "us-5000-10000": 12,
  "us-10000-25000": 20,
  "us-25000-50000": 25,
  "us-above-50000": 25,
  "uk-under-2000": 0,
  "uk-2000-4000": 7,
  "uk-4000-8000": 12,
  "uk-8000-20000": 20,
  "uk-20000-40000": 25,
  "uk-above-40000": 25,
  "not-sure": 8,
};

const timelineScores: Record<LeadSubmissionInput["timeline"], number> = {
  "as-soon-as-possible": 15,
  "within-one-month": 15,
  "within-three-months": 12,
  "within-six-months": 8,
  "more-than-six-months": 4,
  exploring: 2,
};

const impactScores: Record<LeadSubmissionInput["problemImpact"], number> = {
  "financial-loss": 15,
  "manual-cost": 15,
  "sales-delivery-delay": 12,
  "business-risk": 15,
  "moderate-inefficiency": 7,
  opportunity: 3,
};

function scoreUserAccess(input: LeadSubmissionInput): number {
  if (input.userAccess === "yes") return 15;
  if (input.userDiscussions === "primary-user") return 10;
  if (input.userAccess === "probably") return 8;
  return 0;
}

export function qualificationStatus(total: number): QualificationStatus {
  if (total >= 60) return "qualified";
  if (total >= 40) return "review";
  return "nurture";
}

export function calculateLeadScore(input: LeadSubmissionInput): LeadScore {
  const baseRoleScore = roleScores[input.role];
  const role =
    input.decisionAuthority === "researching-for-someone"
      ? Math.min(baseRoleScore, 3)
      : baseRoleScore;

  const breakdown: LeadScoreBreakdown = {
    role,
    stage: stageScores[input.productStage],
    budget: budgetScores[input.budgetRange],
    timeline: timelineScores[input.timeline],
    userAccess: scoreUserAccess(input),
    impact: impactScores[input.problemImpact],
  };

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  return { total, status: qualificationStatus(total), breakdown };
}
