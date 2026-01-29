"use client";

import { useEffect, useState } from "react";
import { SupportTicket, TicketStatus } from "@/types/support";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SupportTable } from "@/components/admin/SupportTable";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/admin/support");
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert("Failed to load tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      const response = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId,
          status: newStatus,
          approvedBy: "Admin User", // Replace with actual admin user
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Refresh tickets after update
      await fetchTickets(true);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update ticket status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/help-center"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Help Center
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Support Ticket Management
            </h1>
            <p className="text-gray-600">
              View and manage all support requests from users
            </p>
          </div>

          <Button
            onClick={() => fetchTickets(true)}
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">Loading tickets...</p>
              </div>
            ) : (
              <SupportTable tickets={tickets} onStatusChange={handleStatusChange} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
