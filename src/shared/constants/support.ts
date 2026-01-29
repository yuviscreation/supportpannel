/**
 * Support ticket constants and configuration
 */

export const TICKET_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
} as const;

export const TICKET_PRIORITY = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const;

export const REQUEST_TYPES = {
  IT_ADMIN: 'IT Admin / Data Correction Requests',
  NEW_FEATURE: 'New Feature Request',
  ENHANCEMENT: 'Change / Enhancement Request',
  BUG_REPORT: 'Bug Report',
} as const;

export const PRIORITY_CONFIG = {
  [TICKET_PRIORITY.CRITICAL]: {
    variant: 'destructive' as const,
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-300',
  },
  [TICKET_PRIORITY.HIGH]: {
    variant: 'warning' as const,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-300',
  },
  [TICKET_PRIORITY.MEDIUM]: {
    variant: 'default' as const,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-300',
  },
  [TICKET_PRIORITY.LOW]: {
    variant: 'secondary' as const,
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 border-gray-300',
  },
} as const;

export const STATUS_CONFIG = {
  [TICKET_STATUS.OPEN]: {
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-300',
  },
  [TICKET_STATUS.IN_PROGRESS]: {
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-300',
  },
  [TICKET_STATUS.DONE]: {
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-300',
  },
} as const;

export const API_ENDPOINTS = {
  TICKETS: '/api/admin/support',
  UPDATE_TICKET: '/api/admin/support',
} as const;

export const SUPPORT_PANELS = [
  {
    title: 'IT Admin / Data Correction Requests',
    description:
      'Small backend tasks like renaming vessels, updating / correcting data, permissions, changing requisition dates, new hardware request etc.',
    iconSrc: 'tech-req.png',
    href: '/support/it-admin-category',
    iconColor: 'bg-orange-500',
  },
  {
    title: 'Change / Enhancement Request',
    description:
      'Modify an existing feature (e.g., better filters, UI change, more data visibility).',
    iconSrc: 'development.png',
    href: '/support/enhancement-category',
    iconColor: 'bg-purple-500',
  },
] as const;

export const IT_ADMIN_OPTIONS = [
  {
    title: 'Submit New Request',
    description: 'Submit a new IT Admin or Data Correction request.',
    iconSrc: 'submit-req.png',
    href: '/support/it-admin',
    iconColor: 'bg-orange-500',
  },
  {
    title: 'View Request Status',
    description: 'Check the status of your submitted requests.',
    iconSrc: 'view-request.png',
    href: 'https://shipskart1-my.sharepoint.com/:x:/g/personal/abhimanyu_shipskart1_onmicrosoft_com/IQC-NHSFEIlvRJ5vg83sOQX7AXuUTMkjtuRIQgze4c6XHkg?e=iTGboz',
    iconColor: 'bg-sky-500',
  },
] as const;

export const ENHANCEMENT_OPTIONS = [
  {
    title: 'Submit New Request',
    description: 'Submit a new Enhancement or Change request.',
    iconSrc: 'submit-req.png',
    href: '/support/enhancement',
    iconColor: 'bg-purple-500',
  },
  {
    title: 'View Request Status',
    description: 'Check the status of your submitted requests.',
    iconSrc: 'view-request.png',
    href: 'https://shipskart1-my.sharepoint.com/:x:/g/personal/abhimanyu_shipskart1_onmicrosoft_com/IQC-NHSFEIlvRJ5vg83sOQX7AXuUTMkjtuRIQgze4c6XHkg?e=iTGboz',
    iconColor: 'bg-sky-500',
  },
] as const;
