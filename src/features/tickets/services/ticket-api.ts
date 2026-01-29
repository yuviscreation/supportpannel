/**
 * Ticket API Service
 * Handles all ticket-related API calls
 */

import { api } from '@/shared/utils/api-client';
import { API_ENDPOINTS } from '@/shared/constants';
import type {
  TicketsResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
  TicketStatus,
} from '@/shared/types';

/**
 * Fetch all support tickets
 */
export async function fetchTickets(): Promise<TicketsResponse> {
  return api.get<TicketsResponse>(API_ENDPOINTS.TICKETS);
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus,
  approvedBy?: string,
  remarks?: string
): Promise<UpdateTicketResponse> {
  const payload: UpdateTicketRequest = {
    ticketId,
    status,
    approvedBy,
    remarks,
  };

  return api.patch<UpdateTicketResponse>(API_ENDPOINTS.UPDATE_TICKET, payload);
}
