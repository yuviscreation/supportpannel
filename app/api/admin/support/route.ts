import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      throw new Error("GOOGLE_APPS_SCRIPT_URL is not configured");
    }

    // Call Google Apps Script to fetch all tickets
    const response = await fetch(`${scriptUrl}?action=getTickets`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tickets from Google Apps Script");
    }

    const data = await response.json();

    // Map sheet-returned tickets (keys are sheet headers) into internal SupportTicket shape
    const rawTickets: any[] = data.tickets || [];
    const tickets = rawTickets.map((t: any) => ({
      ticketId: t['ID'] || t.ID || t['id'] || '',
      timestamp: t['Created On'] || t['CreatedOn'] || t.timestamp || '',
      requestType: t['Type of Request'] || t['Request Type'] || '',
      summary: t['Summary'] || '',
      description: t['Request Details'] || t['Request'] || '',
      exactChange: t['Exact Change Needed'] || '',
      additionalEmails: t['Additional Emails'] || '',
      priority: t['Priority'] || 'Medium',
      impact: t['Impact on Work'] || '',
      attachmentLinks: t['Attachments'] || '',
      status: t['Status'] || 'Open',
      approvedBy: t['ApprovedBy'] || '',
      approvedAt: t['ApprovedAt'] || ''
    }));

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
        tickets: [],
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, status, approvedBy, remarks } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { success: false, error: "ticketId and status are required" },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      throw new Error("GOOGLE_APPS_SCRIPT_URL is not configured");
    }

    // Call Google Apps Script to update ticket
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateTicket",
        ticketId,
        status,
        approvedBy,
        approvedAt: new Date().toISOString(),
        remarks,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update ticket in Google Apps Script");
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Ticket updated successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
