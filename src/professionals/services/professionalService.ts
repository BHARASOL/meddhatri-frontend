import apiClient, { ApiResponse } from '../../api/client.js';
import ENDPOINTS from '../../api/endpoints.js';

export interface EducationItem {
  degree: string;
  institution: string;
  yearOfPassing: number | string;
  country?: string;
  fieldOfStudy?: string;
}

export interface LicenseItem {
  registrationNumber: string;
  councilName: string;
  council?: string;
  yearOfRegistration?: number | string;
  year?: number | string;
  state?: string;
  expiryDate?: string;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'UNVERIFIED' | 'REJECTED' | string;
}

export interface ExperienceItem {
  institution: string;
  designation: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  department?: string;
  rolesResponsibilities?: string;
}

export interface ProfessionalProfileData {
  id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  profession?: string;
  primarySpecialty?: string;
  subSpecialization?: string;
  subSpecialty?: string;
  specialization?: string;
  city?: string;
  state?: string;
  country?: string;
  location?: string;
  headline?: string;
  avatar?: string;
  bio?: string;
  languages?: string[];
  education?: EducationItem[];
  medicalCouncilRegistrations?: LicenseItem[];
  licenses?: LicenseItem[];
  certifications?: any[];
  experienceTimeline?: ExperienceItem[];
  workExperience?: ExperienceItem[];
  totalExperienceYears?: number;
  experienceYears?: number;
  relevantExperienceYears?: number;
  skills?: string[];
  employmentTypes?: string[];
  shifts?: string[];
  availability?: string;
  expectedSalary?: number;
  profileCompletenessScore?: number;
  profileCompletion?: number;
  verificationStatus?: string;
  missingItems?: string[];
  visibility?: 'SEARCHABLE' | 'VISIBLE_ON_APPLICATION' | 'HIDDEN';
  privacySettings?: {
    hideFromCurrentEmployer?: boolean;
    blockedEmployers?: string[];
    showSalaryExpectation?: boolean;
  };
  communicationPreferences?: {
    emailAlerts?: boolean;
    smsAlerts?: boolean;
    whatsappUpdates?: boolean;
  };
  resumeUrl?: string;
  parsedResumeData?: any;
  user?: any;
}

export const professionalService = {
  // Profile Management
  getProfile: (): Promise<ApiResponse<ProfessionalProfileData>> =>
    apiClient.get(ENDPOINTS.PROFESSIONALS.PROFILE),

  updateProfile: (data: Partial<ProfessionalProfileData>): Promise<ApiResponse<ProfessionalProfileData>> =>
    apiClient.put(ENDPOINTS.PROFESSIONALS.UPDATE_PROFILE, data),

  // Resume Upload & Extraction
  uploadResume: (file: File): Promise<ApiResponse<{ resumeUrl: string; parsedData: any; completionScore: number }>> => {
    const formData = new FormData();
    formData.append('resume', file);
    return apiClient.upload(ENDPOINTS.PROFESSIONALS.RESUME, formData);
  },

  confirmParsedResume: (confirmedData: any): Promise<ApiResponse<{ message: string; profile: any; completionScore: number }>> =>
    apiClient.post(ENDPOINTS.PROFESSIONALS.CONFIRM_RESUME, confirmedData),

  // Recruiter Preview
  getRecruiterPreview: (): Promise<ApiResponse<{ recruiterPreview: any; profileCompletenessScore: number; missingItems: string[] }>> =>
    apiClient.get(ENDPOINTS.PROFESSIONALS.PREVIEW),

  // Privacy & GDPR
  updatePrivacy: (settings: {
    visibility?: 'SEARCHABLE' | 'VISIBLE_ON_APPLICATION' | 'HIDDEN';
    privacySettings?: {
      hideFromCurrentEmployer?: boolean;
      blockedEmployers?: string[];
      showSalaryExpectation?: boolean;
    };
    communicationPreferences?: {
      emailAlerts?: boolean;
      smsAlerts?: boolean;
      whatsappUpdates?: boolean;
    };
  }): Promise<ApiResponse<any>> =>
    apiClient.patch(ENDPOINTS.PROFESSIONALS.PRIVACY, settings),

  exportData: (): Promise<ApiResponse<any>> =>
    apiClient.get(ENDPOINTS.PROFESSIONALS.EXPORT),

  requestDeletion: (reason?: string): Promise<ApiResponse<any>> =>
    apiClient.post(ENDPOINTS.PROFESSIONALS.DELETE_REQUEST, { reason }),

  // Applications
  getApplications: (): Promise<ApiResponse<any[]>> =>
    apiClient.get(ENDPOINTS.PROFESSIONALS.APPLICATIONS),

  withdrawApplication: (applicationId: string, reason?: string): Promise<ApiResponse<any>> =>
    apiClient.post(ENDPOINTS.PROFESSIONALS.WITHDRAW_APPLICATION(applicationId), { reason }),

  applyToJob: (jobId: string, data?: any): Promise<ApiResponse<any>> =>
    apiClient.post(ENDPOINTS.PROFESSIONALS.APPLY(jobId), data),

  // Saved Jobs
  getSavedJobs: (): Promise<ApiResponse<any[]>> =>
    apiClient.get(ENDPOINTS.PROFESSIONALS.SAVED_JOBS),

  toggleSavedJob: (jobId: string): Promise<ApiResponse<{ saved: boolean }>> =>
    apiClient.post(ENDPOINTS.PROFESSIONALS.TOGGLE_SAVED_JOB(jobId)),

  // Interviews
  getInterviews: (): Promise<ApiResponse<any[]>> =>
    apiClient.get(ENDPOINTS.PROFESSIONALS.INTERVIEWS),

  respondToInterview: (
    interviewId: string,
    status: 'CONFIRMED' | 'RESCHEDULE_REQUESTED',
    notes?: string
  ): Promise<ApiResponse<any>> =>
    apiClient.patch(ENDPOINTS.PROFESSIONALS.RESPOND_INTERVIEW(interviewId), { status, notes }),

  // Verifications
  getVerifications: (): Promise<ApiResponse<any>> =>
    apiClient.get(ENDPOINTS.PROFESSIONALS.VERIFICATIONS),

  submitVerification: (data: any): Promise<ApiResponse<any>> =>
    apiClient.post(ENDPOINTS.PROFESSIONALS.SUBMIT_VERIFICATION, data),

  // Notifications
  getNotifications: (): Promise<ApiResponse<any[]>> =>
    apiClient.get(ENDPOINTS.SHARED.NOTIFICATIONS),

  markNotificationAsRead: (id: string): Promise<ApiResponse<any>> =>
    apiClient.patch(ENDPOINTS.SHARED.READ_NOTIFICATION(id)),

  markAllNotificationsAsRead: (): Promise<ApiResponse<any>> =>
    apiClient.patch(ENDPOINTS.SHARED.READ_ALL_NOTIFICATIONS),

  getOffers: (): Promise<ApiResponse<any[]>> =>
    apiClient.get(ENDPOINTS.PROFESSIONALS.OFFERS)
};

export default professionalService;
