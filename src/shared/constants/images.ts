/**
 * Image paths and asset configuration
 */

export const IMAGES = {
  LOGO: '/images/shipskart-logo.png',
  TECH_REQ: '/images/tech-req.png',
  DEVELOPMENT: '/images/development.png',
  SUBMIT_REQ: '/images/submit-req.png',
  VIEW_REQUEST: '/images/view-request.png',
} as const;

export const getImagePath = (fileName: string) => `/images/${fileName}`;
