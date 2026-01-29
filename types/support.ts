export type RequestType = 
  | "IT Admin / Data Correction Requests"
  | "New Feature Request"
  | "Change / Enhancement Request"
  | "Bug Report";

export type Priority = "Critical" | "High" | "Medium" | "Low";

export type TicketStatus = "Open" | "In Progress" | "Done";

export interface SupportRequest {
  ticketId?: string;
  requestType: RequestType;
  summary: string;
  description: string;
  exactChange?: string;
  additionalEmails?: string;
  priority: Priority;
  impact?: string;
  attachments?: File[];
}

export interface SupportTicket {
  ticketId: string;
  timestamp: string;
  requestType: RequestType;
  summary: string;
  description: string;
  exactChange?: string;
  additionalEmails?: string;
  priority: Priority;
  impact?: string;
  attachmentLinks?: string;
  status: TicketStatus;
  approvedBy?: string;
  approvedAt?: string;
}

