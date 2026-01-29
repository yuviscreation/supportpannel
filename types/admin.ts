import { TicketStatus } from "./support";

export interface AdminUpdateRequest {
  ticketId: string;
  status?: TicketStatus;
  approvedBy?: string;
  remarks?: string;
}

export interface AdminTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}
