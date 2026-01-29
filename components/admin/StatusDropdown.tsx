"use client";

import { TicketStatus } from "@/types/support";
import { cn } from "@/lib/utils";

interface StatusDropdownProps {
  value: TicketStatus;
  onChange: (value: TicketStatus) => void;
  disabled?: boolean;
}

const statusConfig: Record<TicketStatus, { color: string; bgColor: string }> = {
  Open: { color: "text-blue-700", bgColor: "bg-blue-50 border-blue-300" },
  "In Progress": { color: "text-yellow-700", bgColor: "bg-yellow-50 border-yellow-300" },
  Done: { color: "text-green-700", bgColor: "bg-green-50 border-green-300" },
};

export function StatusDropdown({ value, onChange, disabled }: StatusDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TicketStatus)}
      disabled={disabled}
      className={cn(
        "px-3 py-1.5 rounded-md border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
        statusConfig[value].color,
        statusConfig[value].bgColor
      )}
    >
      <option value="Open">Open</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>
  );
}
