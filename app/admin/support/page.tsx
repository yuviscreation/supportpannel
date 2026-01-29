'use client';

/**
 * Admin Support Page - Refactored with lazy loading
 * Separated concerns: UI, business logic, and data fetching
 */

import dynamic from 'next/dynamic';
import { useTickets } from '@/features/tickets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { ErrorBoundary, ErrorAlert, LoadingSpinner } from '@/shared/components';

// Lazy load heavy components
const TicketsTable = dynamic(
  () =>
    import('@/features/tickets').then((mod) => ({ default: mod.TicketsTable })),
  {
    loading: () => (
      <div className="py-12">
        <LoadingSpinner message="Loading table..." />
      </div>
    ),
    ssr: false,
  }
);

export default function AdminSupportPage() {
  const {
    tickets,
    loading,
    refreshing,
    error,
    refetch,
    updateStatus,
    updatingTickets,
  } = useTickets();

  return (
    <ErrorBoundary>
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
              onClick={refetch}
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

          {error && (
            <div className="mb-6">
              <ErrorAlert message={error} />
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketsTable
                tickets={tickets}
                onStatusChange={updateStatus}
                updatingTickets={updatingTickets}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}
