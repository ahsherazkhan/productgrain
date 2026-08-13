import type { AttributionSnapshotInput, LeadSubmissionInput } from "../validation/lead";
import type {
  LeadScoreBreakdown,
  QualificationStatus,
} from "../scoring/lead-score";

export type LeadStatus = "new" | "contacted" | "closed";

export type LeadRecord = Omit<
  LeadSubmissionInput,
  | "submissionId"
  | "turnstileToken"
  | "eventId"
  | "fbp"
  | "fbc"
  | "firstTouch"
  | "lastTouch"
> & {
  id: string;
  submissionId: string;
  createdAt: string;
  updatedAt: string;
  score: number;
  scoreBreakdown: LeadScoreBreakdown;
  qualificationStatus: QualificationStatus;
  leadStatus: LeadStatus;
  firstTouch: AttributionSnapshotInput;
  lastTouch: AttributionSnapshotInput;
  retentionUntil: string;
};

export type LeadSubmissionResult = {
  leadId: string;
  status: QualificationStatus;
  bookingUrl?: string;
  message?: string;
};

export interface LeadRepository {
  save(lead: LeadRecord): Promise<{ id: string }>;
}

export interface LeadNotificationSink {
  send(lead: LeadRecord): Promise<void>;
}

export interface LeadAnalyticsSink {
  trackLead(input: {
    lead: LeadRecord;
    eventId: string;
    eventSourceUrl?: string;
    fbp?: string;
    fbc?: string;
    clientIp?: string;
    userAgent?: string;
  }): Promise<void>;
}

export type LeadSubmissionContext = {
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
};
