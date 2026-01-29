'use client';

/**
 * Status Dropdown Component
 * Allows changing ticket status
 */

import { TicketStatus } from '@/shared/types';
import { STATUS_CONFIG } from '@/shared/constants';
import { cn } from '@/shared/utils';

interface StatusDropdownProps {
  value: TicketStatus;
  onChange: (value: TicketStatus) => void;
  disabled?: boolean;
}

export function StatusDropdown({
  value,
  onChange,
  disabled,
}: StatusDropdownProps) {
  const config = STATUS_CONFIG[value];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TicketStatus)}
      disabled={disabled}
      className={cn(
        'px-3 py-1.5 rounded-md border-2 text-sm font-medium',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        config.color,
        config.bgColor
      )}
    >
      <option value="Open">Open</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>
  );
}
