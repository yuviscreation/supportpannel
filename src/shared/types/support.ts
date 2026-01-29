export type RequestType =
  | 'IT Admin / Data Correction Requests'
  | 'New Feature Request'
  | 'Change / Enhancement Request'
  | 'Bug Report';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TicketStatus = 'Open' | 'In Progress' | 'Done';

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

export interface TicketsResponse {
  success: boolean;
  tickets: SupportTicket[];
  error?: string;
}

export interface UpdateTicketRequest {
  ticketId: string;
  status: TicketStatus;
  approvedBy?: string;
  remarks?: string;
}

export interface UpdateTicketResponse {
  success: boolean;
  message?: string;
  error?: string;
}
