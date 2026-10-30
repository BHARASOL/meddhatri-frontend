// Global Platform Constants
export const APP_NAME = 'MedDhatri AI';
export const APP_TAGLINE = 'Intelligent Healthcare Career & Talent Marketplace';

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORGANIZATION_ADMIN: 'ORGANIZATION_ADMIN',
  RECRUITER: 'RECRUITER',
  PROFESSIONAL: 'PROFESSIONAL'
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const PORTAL_ROUTES = {
  PUBLIC: '/',
  AUTH_LOGIN: '/login',
  AUTH_REGISTER: '/register',
  SUPERADMIN: '/superadmin',
  ORGANIZATION: '/organization',
  PROFESSIONALS: '/professionals',
  RECRUITERS: '/recruiters'
} as const;

export const PIPELINE_STAGES = [
  'Applied',
  'Screening',
  'Shortlisted',
  'Interview Scheduled',
  'Interview Completed',
  'Selected',
  'Offer Sent',
  'Hired / Joined',
  'Rejected / Withdrawn'
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];
