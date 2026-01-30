import { NextRequest, NextResponse } from 'next/server';
import type { SupportTicket } from '@/shared/types';

/**
 * MOCK API ROUTE - Replace with real database integration
 * 
 * This is a temporary mock implementation replacing Google Sheets integration.
 * For production, integrate with:
 * - PostgreSQL + Prisma
 * - MongoDB + Mongoose
 * - Supabase
 * - Firebase
 */

// Mock data store (in-memory) - will reset on server restart
let mockTickets: SupportTicket[] = [
  {
    ticketId: 'DEMO-001',
    timestamp: new Date().toISOString(),
    requestType: 'IT Admin / Data Correction Requests',
    summary: 'Demo Ticket - Update user permissions',
    description: 'Please update access permissions for the new team member.',
    priority: 'High',
    status: 'Open',
    approvedBy: '',
    approvedAt: '',
  },
  {
    ticketId: 'DEMO-002',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    requestType: 'Change / Enhancement Request',
    summary: 'Demo Ticket - Add new dashboard filter',
    description: 'Request to add date range filter to the analytics dashboard.',
    priority: 'Medium',
    status: 'In Progress',
    approvedBy: 'Admin User',
    approvedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    ticketId: 'DEMO-003',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    requestType: 'Bug Report',
    summary: 'Demo Ticket - Fix login issue',
    description: 'Users reporting login failures on mobile devices.',
    priority: 'Critical',
    status: 'Done',
    approvedBy: 'Admin User',
    approvedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * GET /api/admin/support
 * Fetch all support tickets
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      tickets: mockTickets,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        tickets: [],
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/support
 * Update ticket status
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, status, approvedBy, remarks } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { success: false, error: 'ticketId and status are required' },
        { status: 400 }
      );
    }

    // Find and update the ticket
    const ticketIndex = mockTickets.findIndex((t) => t.ticketId === ticketId);
    
    if (ticketIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Update ticket
    mockTickets[ticketIndex] = {
      ...mockTickets[ticketIndex],
      status,
      approvedBy: approvedBy || mockTickets[ticketIndex].approvedBy,
      approvedAt: new Date().toISOString(),
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: mockTickets[ticketIndex],
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/support
 * Create new ticket (optional - for future use)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTicket: SupportTicket = {
      ticketId: `TICKET-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...body,
      status: body.status || 'Open',
    };

    mockTickets.unshift(newTicket);

    return NextResponse.json({
      success: true,
      message: 'Ticket created successfully',
      ticket: newTicket,
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
