import type { LeadSubmissionInput } from "../validation/lead";

export type QualificationStatus = "qualified" | "review" | "nurture";

export type LeadQualificationInput = Pick<
  LeadSubmissionInput,
  "budgetRange" | "timeline"
>;

export type LeadScoreBreakdown = {
  budget: number;
  timeline: number;
};

export type LeadScore = {
  total: number;
  status: QualificationStatus;
  breakdown: LeadScoreBreakdown;
};

const budgetScores: Record<LeadQualificationInput["budgetRange"], number> = {
  "us-under-2500": 0,
  "us-2500-5000": 10,
  "us-5000-10000": 25,
  "us-10000-25000": 45,
  "us-25000-50000": 50,
  "us-above-50000": 50,
  "uk-under-2000": 0,
  "uk-2000-4000": 10,
  "uk-4000-8000": 25,
  "uk-8000-20000": 45,
  "uk-20000-40000": 50,
  "uk-above-40000": 50,
  "not-sure": 30,
};

const timelineScores: Record<LeadQualificationInput["timeline"], number> = {
  "as-soon-as-possible": 20,
  "within-one-month": 20,
  "within-three-months": 15,
  "within-six-months": 10,
  "more-than-six-months": 5,
  exploring: 0,
};

export function qualificationStatus(total: number): QualificationStatus {
  if (total >= 60) return "qualified";
  if (total >= 30) return "review";
  return "nurture";
}

export function calculateLeadScore(input: LeadQualificationInput): LeadScore {
  const breakdown: LeadScoreBreakdown = {
    budget: budgetScores[input.budgetRange],
    timeline: timelineScores[input.timeline],
  };

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  return { total, status: qualificationStatus(total), breakdown };
}
