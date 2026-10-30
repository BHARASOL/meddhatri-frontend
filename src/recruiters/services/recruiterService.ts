import apiClient from '../../api/client.js';
import ENDPOINTS from '../../api/endpoints.js';

export const recruiterService = {
  getDashboard: () => apiClient.get(ENDPOINTS.RECRUITERS.DASHBOARD),
  getAssignedJobs: () => apiClient.get(ENDPOINTS.RECRUITERS.ASSIGNED_JOBS),
  getCandidates: () => apiClient.get(ENDPOINTS.RECRUITERS.CANDIDATES),
  getInterviews: () => apiClient.get(ENDPOINTS.RECRUITERS.INTERVIEWS),
  getTasks: () => apiClient.get(ENDPOINTS.RECRUITERS.TASKS),
  getTalentPool: () => apiClient.get(ENDPOINTS.RECRUITERS.TALENT_POOL),
  getReports: () => apiClient.get(ENDPOINTS.RECRUITERS.REPORTS)
};

export default recruiterService;
