import apiClient from '../../api/client.js';
import ENDPOINTS from '../../api/endpoints.js';

export const adminService = {
  getStats: () => apiClient.get(ENDPOINTS.SUPERADMIN.STATS),
  getUsers: (params?: any) => apiClient.get(ENDPOINTS.SUPERADMIN.USERS, { ...params }),
  getOrganizations: () => apiClient.get(ENDPOINTS.SUPERADMIN.ORGANIZATIONS),
  getVerifications: () => apiClient.get(ENDPOINTS.SUPERADMIN.VERIFICATIONS),
  getAuditLogs: () => apiClient.get(ENDPOINTS.SUPERADMIN.AUDIT_LOGS)
};

export default adminService;
