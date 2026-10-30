import apiClient from '../../api/client.js';
import ENDPOINTS from '../../api/endpoints.js';

export const organizationService = {
  getProfile: () => apiClient.get(ENDPOINTS.ORGANIZATION.PROFILE),
  updateProfile: (data: any) => apiClient.put(ENDPOINTS.ORGANIZATION.PROFILE, data),
  getJobs: () => apiClient.get(ENDPOINTS.ORGANIZATION.JOBS),
  createJob: (jobData: any) => apiClient.post(ENDPOINTS.ORGANIZATION.JOBS, jobData),
  getApplicants: (jobId?: string) =>
    apiClient.get(jobId ? `${ENDPOINTS.ORGANIZATION.APPLICANTS}?jobId=${encodeURIComponent(jobId)}` : ENDPOINTS.ORGANIZATION.APPLICANTS),
  getTeam: () => apiClient.get(ENDPOINTS.ORGANIZATION.TEAM)
};

export default organizationService;
