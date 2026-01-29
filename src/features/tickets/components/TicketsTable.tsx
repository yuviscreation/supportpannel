'use client';

/**
 * Tickets Table Component
 * Displays support tickets in a table format
 */

import { SupportTicket, TicketStatus } from '@/shared/types';
import { Badge } from '@/components/ui/Badge';
import { StatusDropdown } from './StatusDropdown';
import { formatDate } from '@/shared/utils';
import { PRIORITY_CONFIG } from '@/shared/constants';
import { EmptyState, LoadingSpinner } from '@/shared/components';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { ExternalLink, Loader2 } from 'lucide-react';

interface TicketsTableProps {
  tickets: SupportTicket[];
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
  updatingTickets: Set<string>;
  loading?: boolean;
}

export function TicketsTable({
  tickets,
  onStatusChange,
  updatingTickets,
  loading = false,
}: TicketsTableProps) {
  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner message="Loading tickets..." />
      </div>
    );
  }

  if (tickets.length === 0) {
    return <EmptyState message="No support tickets found." />;
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Attachments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => {
            const isUpdating = updatingTickets.has(ticket.ticketId);
            const priorityConfig = PRIORITY_CONFIG[ticket.priority];

            return (
              <TableRow key={ticket.ticketId}>
                <TableCell className="font-mono text-sm font-medium">
                  {ticket.ticketId}
                </TableCell>
                <TableCell className="max-w-[180px]">
                  <span className="text-sm text-gray-700">
                    {ticket.requestType}
                  </span>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      {ticket.summary}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityConfig.variant}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Updating...</span>
                    </div>
                  ) : (
                    <StatusDropdown
                      value={ticket.status}
                      onChange={(newStatus) =>
                        onStatusChange(ticket.ticketId, newStatus)
                      }
                    />
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(ticket.timestamp)}
                </TableCell>
                <TableCell>
                  {ticket.attachmentLinks &&
                  ticket.attachmentLinks.trim() !== '' ? (
                    <a
                      href={ticket.attachmentLinks.split(',')[0].trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">None</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
