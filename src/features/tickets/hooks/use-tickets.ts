/**
 * Custom hook for managing support tickets
 * Separates business logic from UI components
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchTickets, updateTicketStatus } from '@/features/tickets/services';
import type { SupportTicket, TicketStatus } from '@/shared/types';

interface UseTicketsOptions {
  autoFetch?: boolean;
}

interface UseTicketsReturn {
  tickets: SupportTicket[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStatus: (
    ticketId: string,
    status: TicketStatus,
    approvedBy?: string
  ) => Promise<void>;
  updatingTickets: Set<string>;
}

export function useTickets(
  options: UseTicketsOptions = {}
): UseTicketsReturn {
  const { autoFetch = true } = options;

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingTickets, setUpdatingTickets] = useState<Set<string>>(
    new Set()
  );

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetchTickets();
      if (response.success) {
        setTickets(response.tickets || []);
      } else {
        throw new Error(response.error || 'Failed to fetch tickets');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load tickets';
      setError(errorMessage);
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  const updateStatus = useCallback(
    async (
      ticketId: string,
      status: TicketStatus,
      approvedBy: string = 'Admin User'
    ) => {
      setUpdatingTickets((prev) => new Set(prev).add(ticketId));
      setError(null);

      try {
        const response = await updateTicketStatus(
          ticketId,
          status,
          approvedBy
        );

        if (!response.success) {
          throw new Error(response.error || 'Failed to update ticket');
        }

        // Refresh tickets after successful update
        await fetchData(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update ticket status';
        setError(errorMessage);
        console.error('Error updating ticket:', err);
        throw err; // Re-throw to allow component-level error handling
      } finally {
        setUpdatingTickets((prev) => {
          const next = new Set(prev);
          next.delete(ticketId);
          return next;
        });
      }
    },
    [fetchData]
  );

  return {
    tickets,
    loading,
    refreshing,
    error,
    refetch,
    updateStatus,
    updatingTickets,
  };
}
