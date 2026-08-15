import { escapeHtml, IntegrationError } from "../security";
import type { QualificationStatus } from "../scoring";
import type { LeadRecord } from "../leads/types";
import { siteConfig } from "../../config/site";

export type EmailMessage = {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export interface EmailService {
  send(message: EmailMessage): Promise<void>;
}

export class ResendEmailService implements EmailService {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {
    if (!apiKey || !from || /[\r\n]/.test(from)) {
      throw new IntegrationError("email", "invalid-configuration");
    }
  }

  async send(message: EmailMessage): Promise<void> {
    let response: Response;
    try {
      response = await this.fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${this.apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: this.from,
          to: message.to,
          subject: message.subject,
          text: message.text,
          html: message.html,
          reply_to: message.replyTo,
        }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new IntegrationError("email", "request-failed");
    }
    if (!response.ok) {
      throw new IntegrationError("email", `http-${response.status}`);
    }
  }
}

function firstName(fullName: string): string {
  return fullName.split(/\s+/)[0] || "there";
}

function displayValue(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function applicantCopy(
  lead: LeadRecord,
  bookingUrl?: string,
): { subject: string; paragraphs: string[]; link?: string } {
  const name = firstName(lead.fullName);
  if (lead.qualificationStatus === "qualified") {
    return {
      subject: "Your product looks like a potential fit",
      paragraphs: [
        `Hi ${name},`,
        "Based on the information you shared, your project looks like a potential fit for a product discussion.",
        bookingUrl
          ? "Use the link below to choose a suitable time for a free thirty-minute call."
          : "We will follow up with the most practical next step.",
        "Before the call, it is useful to think about the current workflow, intended users, and the most important outcome the first version should create.",
        "The initial Product Clarity Call is free. No payment is required unless you later approve a defined scope, timeline, and milestone plan.",
        siteConfig.brandName,
      ],
      link: bookingUrl,
    };
  }
  if (lead.qualificationStatus === "review") {
    return {
      subject: "We are reviewing your project enquiry",
      paragraphs: [
        `Hi ${name},`,
        "Thanks for telling us about the problem you are trying to solve.",
        "Your project may be suitable, but we would like to review the details before recommending the right call. We will follow up after that review.",
        "The initial Product Clarity Call is free. No payment is required unless you later approve a defined scope, timeline, and milestone plan.",
        siteConfig.brandName,
      ],
    };
  }
  return {
    subject: "We received your project enquiry",
    paragraphs: [
      `Hi ${name},`,
      "Thanks for telling us what you would like to build or improve. We have received your enquiry and will review the most practical next step.",
      "We will follow up by email after reviewing your note, budget range, and desired start.",
      "The initial Product Clarity Call is free. No payment is required unless you later approve a defined scope, timeline, and milestone plan.",
      siteConfig.brandName,
    ],
  };
}

export function applicantMessage(
  lead: LeadRecord,
  bookingUrl?: string,
): EmailMessage {
  const copy = applicantCopy(lead, bookingUrl);
  const text = [
    ...copy.paragraphs,
    ...(copy.link ? [`Book a time: ${copy.link}`] : []),
  ].join("\n\n");
  const htmlParagraphs = copy.paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  const htmlLink = copy.link
    ? `<p><a href="${escapeHtml(copy.link)}">Choose a suitable time</a></p>`
    : "";

  return {
    to: [lead.email],
    subject: copy.subject,
    text,
    html: `${htmlParagraphs}${htmlLink}`,
  };
}

export function internalLeadMessage(
  lead: LeadRecord,
  internalAddress: string,
): EmailMessage {
  const details: Array<[string, string]> = [
    ["Name", lead.fullName],
    ["Email", lead.email],
    ...(lead.company ? [["Company or project", lead.company] as [string, string]] : []),
    ["Market", lead.market.toUpperCase()],
    ["Package interest", lead.packageInterest ? displayValue(lead.packageInterest) : "Not selected"],
    ["Budget", displayValue(lead.budgetRange)],
    ["Desired start", displayValue(lead.timeline)],
    ["Score", String(lead.score)],
    ["Qualification", displayValue(lead.qualificationStatus)],
    ["Landing page", lead.landingPage ?? "Not captured"],
    ["UTM campaign", lead.utmCampaign ?? "Not captured"],
    ["Lead ID", lead.id],
  ];
  const text = details.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<table>${details
    .map(
      ([label, value]) =>
        `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;

  return {
    to: [internalAddress],
    subject: `New ${lead.qualificationStatus} lead: ${lead.fullName}`,
    text,
    html,
    replyTo: lead.email,
  };
}

export async function sendLeadEmails(options: {
  service?: EmailService;
  lead: LeadRecord;
  bookingUrl?: string;
  internalAddress?: string;
}): Promise<Array<{ recipient: "applicant" | "internal"; error: unknown }>> {
  if (!options.service) return [];
  const messages: Array<{
    recipient: "applicant" | "internal";
    message: EmailMessage;
  }> = [
    {
      recipient: "applicant",
      message: applicantMessage(options.lead, options.bookingUrl),
    },
  ];
  if (options.internalAddress) {
    messages.push({
      recipient: "internal",
      message: internalLeadMessage(options.lead, options.internalAddress),
    });
  }

  const results = await Promise.allSettled(
    messages.map(({ message }) => options.service!.send(message)),
  );
  return results.flatMap((result, index) =>
    result.status === "rejected"
      ? [{ recipient: messages[index].recipient, error: result.reason as unknown }]
      : [],
  );
}

export function emailStatusMessage(
  status: QualificationStatus,
  bookingAvailable = false,
): string {
  if (status === "qualified") {
    return bookingAvailable
      ? "Your project looks like a potential fit. Choose a suitable time for a free product discussion."
      : "Your project looks like a potential fit. We’ll follow up using the work email in your enquiry.";
  }
  if (status === "review") {
    return "Thanks. Your project may be suitable, but we would like to review the details before recommending the right call.";
  }
  return "Thanks for getting in touch. We’ll review your project note and follow up by email with the most practical next step.";
}
