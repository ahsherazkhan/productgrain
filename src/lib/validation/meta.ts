import { z } from "zod";

export const publicMetaEvents = [
  "PageView",
  "ViewContent",
  "LeadFormStart",
  "Schedule",
  "Contact",
] as const;

export const metaEventSchema = z
  .object({
    eventName: z.enum(publicMetaEvents),
    eventId: z
      .string()
      .trim()
      .min(8)
      .max(100)
      .regex(/^[A-Za-z0-9._:-]+$/),
    eventSourceUrl: z.url().max(1_000),
    marketingConsent: z.literal(true),
    market: z.enum(["us", "uk", "international"]).optional(),
    leadId: z.uuid().optional(),
    fbp: z.string().trim().max(200).optional(),
    fbc: z.string().trim().max(200).optional(),
  })
  .strict();

export type PublicMetaEventInput = z.infer<typeof metaEventSchema>;
