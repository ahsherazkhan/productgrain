export type CaseStudyPermissionStatus =
  | "confirmed"
  | "pending"
  | "not-requested";

export type CaseStudyResult = {
  readonly value: string;
  readonly label: string;
  readonly verificationNote?: string;
};

export type CaseStudyImage = {
  readonly src: string;
  readonly alt: string;
};

export type CaseStudy = {
  readonly slug: string;
  readonly title: string;
  readonly industry: string;
  readonly clientType: string;
  readonly summary: string;
  readonly originalProblem: string;
  readonly existingWorkflow: string;
  readonly importantAssumptions: readonly string[];
  readonly productDecision: string;
  readonly deliberateExclusions: readonly string[];
  readonly solution: string;
  readonly founderRole: string;
  readonly teamRole: string;
  readonly results: readonly CaseStudyResult[];
  readonly images: readonly CaseStudyImage[];
  readonly testimonialId?: string;
  readonly permissionStatus: CaseStudyPermissionStatus;
  readonly published: boolean;
};

// Intentionally empty until verifiable project material and publication permission exist.
export const caseStudies: readonly CaseStudy[] = [];

export const capabilityLedWorkAlternative = {
  eyebrow: "Clear commitments",
  heading: "Know what you are committing to before development begins",
  copy:
    "The engagement is designed to make scope, progress, and product risk visible before the next commitment is made.",
  items: [
    {
      title: "Scope before spend",
      copy:
        "Paid work begins only after priorities, exclusions, milestones, responsibilities, timeline, and price are agreed.",
    },
    {
      title: "Visible progress",
      copy:
        "Milestone reviews keep working progress, trade-offs, decisions, and risks visible throughout delivery.",
    },
    {
      title: "Honest product risk",
      copy:
        "No studio can guarantee adoption. A focused release creates real evidence for the next product decision.",
    },
  ],
} as const;

export function getPublishedCaseStudies(): readonly CaseStudy[] {
  return caseStudies.filter(
    (caseStudy) =>
      caseStudy.published && caseStudy.permissionStatus === "confirmed",
  );
}

export function getPublishedCaseStudyBySlug(
  slug: string,
): CaseStudy | undefined {
  return getPublishedCaseStudies().find(
    (caseStudy) => caseStudy.slug === slug,
  );
}

export function shouldUseCapabilityLedWork(): boolean {
  return getPublishedCaseStudies().length === 0;
}
