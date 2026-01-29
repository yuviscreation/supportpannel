"use client";

import { useState } from "react";
import { SupportTicket, TicketStatus } from "@/types/support";
import { Badge } from "@/components/ui/Badge";
import { StatusDropdown } from "./StatusDropdown";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Loader2 } from "lucide-react";

interface SupportTableProps {
  tickets: SupportTicket[];
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
}

const priorityVariant: Record<string, "default" | "destructive" | "warning" | "secondary"> = {
  Critical: "destructive",
  High: "warning",
  Medium: "default",
  Low: "secondary",
};

export function SupportTable({ tickets, onStatusChange }: SupportTableProps) {
  const [updatingTickets, setUpdatingTickets] = useState<Set<string>>(new Set());

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    setUpdatingTickets((prev) => new Set(prev).add(ticketId));
    try {
      await onStatusChange(ticketId, newStatus);
    } finally {
      setUpdatingTickets((prev) => {
        const next = new Set(prev);
        next.delete(ticketId);
        return next;
      });
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-600">No support tickets found.</p>
      </div>
    );
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
          {tickets.map((ticket) => (
            <TableRow key={ticket.ticketId}>
              <TableCell className="font-mono text-sm font-medium">
                {ticket.ticketId}
              </TableCell>
              <TableCell className="max-w-[180px]">
                <span className="text-sm text-gray-700">{ticket.requestType}</span>
              </TableCell>
              <TableCell className="max-w-[300px]">
                <div>
                  <p className="font-medium text-gray-900 mb-1">{ticket.summary}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={priorityVariant[ticket.priority]}>
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {updatingTickets.has(ticket.ticketId) ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Updating...</span>
                  </div>
                ) : (
                  <StatusDropdown
                    value={ticket.status}
                    onChange={(newStatus) =>
                      handleStatusChange(ticket.ticketId, newStatus)
                    }
                  />
                )}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatDate(ticket.timestamp)}
              </TableCell>
              <TableCell>
                {ticket.attachmentLinks && ticket.attachmentLinks.trim() !== "" ? (
                  <a
                    href={ticket.attachmentLinks.split(",")[0].trim()}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
