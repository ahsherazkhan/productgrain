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
  eyebrow: "How the work is shaped",
  heading: "Product decisions you can see before scope expands",
  copy:
    "Until approved client work is available to publish, here is the practical evidence created during a focused engagement.",
  items: [
    {
      title: "A defined problem and user",
      copy:
        "The product direction starts with the current workflow, intended user, and outcome—not an untested feature list.",
    },
    {
      title: "A deliberately focused first release",
      copy:
        "The scope identifies one complete high-value workflow and records what is intentionally left for later.",
    },
    {
      title: "A visible route to launch",
      copy:
        "Milestones connect product design, engineering, quality assurance, deployment, and early-user learning.",
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
  return getPublishedCaseStudies().length < 2;
}
