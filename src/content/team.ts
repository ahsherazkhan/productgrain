import { siteConfig } from "@/src/config/site";

export type FounderProfile = {
  readonly name: string | null;
  readonly role: string;
  readonly biography: string | null;
  readonly photograph: string | null;
  readonly photographAlt: string | null;
  readonly linkedInUrl: string | null;
  readonly yearsOfExperience: number | null;
  readonly areasOfExpertise: readonly string[];
  readonly introductionVideo: string | null;
  readonly videoPoster: string | null;
  readonly videoCaptions: string | null;
  readonly published: boolean;
};

export type TeamMember = {
  readonly name: string;
  readonly role: string;
  readonly photograph: string | null;
  readonly photographAlt: string | null;
  readonly biography: string;
  readonly linkedInUrl: string | null;
  readonly published: boolean;
};

export const founderSection = {
  heading: "Founder-led, backed by a senior team",
  copy: `${siteConfig.brandName} works directly with industry experts, business owners, and founders to turn unclear product ideas into focused software. The founder remains involved from the first product discussion through delivery, while a senior team supports product design, engineering, quality assurance, and launch.`,
} as const;

export const founderProfile: FounderProfile = {
  name: null,
  role: "Founder & Product Engineer",
  biography: null,
  photograph: null,
  photographAlt: null,
  linkedInUrl: null,
  yearsOfExperience: null,
  areasOfExpertise: [],
  introductionVideo: null,
  videoPoster: null,
  videoCaptions: null,
  published: false,
};

// Intentionally empty until real team details and publication approval are supplied.
export const teamMembers: readonly TeamMember[] = [];

export function getPublishedTeamMembers(): readonly TeamMember[] {
  return teamMembers.filter((member) => member.published);
}
