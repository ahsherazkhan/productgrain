export type WorkingPrinciple = {
  readonly title: string;
  readonly copy: string;
};

export const workingPrinciples = [
  {
    title: "Start with the workflow",
    copy: "Understand what happens today, who is involved, and where value is lost before recommending features.",
  },
  {
    title: "Build one complete outcome",
    copy: "A focused first release should still let a real user complete something meaningful from beginning to end.",
  },
  {
    title: "Keep decisions visible",
    copy: "Share progress, trade-offs, risks, and exclusions throughout delivery so scope does not drift silently.",
  },
] as const satisfies readonly WorkingPrinciple[];
