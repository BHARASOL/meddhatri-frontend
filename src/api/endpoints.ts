// Centralized API Endpoints for All Portals
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_OTP: '/auth/verify-otp'
  },
  SUPERADMIN: {
    STATS: '/admin/dashboard/stats',
    USERS: '/admin/users',
    ORGANIZATIONS: '/admin/organizations',
    VERIFICATIONS: '/admin/verifications',
    JOBS: '/admin/jobs',
    AUDIT_LOGS: '/admin/audit-logs',
    PLATFORM_SETTINGS: '/admin/settings',
    COMPLAINTS: '/admin/complaints'
  },
  ORGANIZATION: {
    PROFILE: '/organization/profile',
    VERIFICATION: '/organization/verification',
    FACILITIES: '/organization/facilities',
    TEAM: '/organization/team',
    JOBS: '/organization/jobs',
    APPLICANTS: '/organization/applicants',
    PIPELINE: '/organization/pipeline',
    REPORTS: '/organization/reports',
    BILLING: '/organization/billing'
  },
  PROFESSIONALS: {
    PROFILE: '/professionals/me',
    UPDATE_PROFILE: '/professionals/me',
    RESUME: '/professionals/resume',
    CONFIRM_RESUME: '/professionals/resume/confirm',
    PREVIEW: '/professionals/me/preview',
    PRIVACY: '/professionals/me/privacy',
    EXPORT: '/professionals/me/export',
    DELETE_REQUEST: '/professionals/me/delete-request',
    APPLICATIONS: '/applications/me',
    WITHDRAW_APPLICATION: (id: string) => `/applications/${id}/withdraw`,
    SAVED_JOBS: '/saved-jobs',
    TOGGLE_SAVED_JOB: (jobId: string) => `/saved-jobs/${jobId}`,
    APPLY: (jobId: string) => `/jobs/${jobId}/apply`,
    INTERVIEWS: '/interviews',
    RESPOND_INTERVIEW: (id: string) => `/interviews/${id}/respond`,
    VERIFICATIONS: '/verifications/me',
    SUBMIT_VERIFICATION: '/verifications/submit',
    OFFERS: '/professionals/offers'
  },
  RECRUITERS: {
    DASHBOARD: '/recruiters/dashboard',
    ASSIGNED_JOBS: '/recruiters/jobs',
    CANDIDATES: '/recruiters/candidates',
    SCREENING: '/recruiters/screening',
    PIPELINE: '/recruiters/pipeline',
    INTERVIEWS: '/recruiters/interviews',
    TASKS: '/recruiters/tasks',
    TALENT_POOL: '/recruiters/talent-pool',
    COLLABORATION: '/recruiters/collaboration',
    REPORTS: '/recruiters/reports'
  },
  SHARED: {
    NOTIFICATIONS: '/notifications',
    READ_NOTIFICATION: (id: string) => `/notifications/${id}/read`,
    READ_ALL_NOTIFICATIONS: '/notifications/read-all',
    MESSAGES: '/messages',
    SEARCH_JOBS: '/jobs',
    JOB_DETAILS: (id: string) => `/jobs/${id}`
  }
} as const;

export default ENDPOINTS;
