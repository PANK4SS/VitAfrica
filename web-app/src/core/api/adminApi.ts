import type {
  AdminDashboardResponse,
  DepartmentResponse,
  PendingRequestResponse,
  PersonnelResponse,
} from '../types/api';
import { httpRequest } from './httpClient';

export const adminApi = {
  getStats(token: string): Promise<AdminDashboardResponse> {
    return httpRequest('/api/admin/stats', { token });
  },

  getPendingRequests(token: string): Promise<PendingRequestResponse[]> {
    return httpRequest('/api/admin/requests', { token });
  },

  approveRequest(
    token: string,
    profileId: number,
    payload: { role: string; department?: string },
  ): Promise<void> {
    return httpRequest(`/api/admin/requests/${profileId}/approve`, {
      method: 'POST',
      token,
      body: payload,
    });
  },

  rejectRequest(token: string, profileId: number): Promise<void> {
    return httpRequest(`/api/admin/requests/${profileId}/reject`, {
      method: 'POST',
      token,
    });
  },

  getPersonnel(token: string): Promise<PersonnelResponse[]> {
    return httpRequest('/api/admin/personnel', { token });
  },

  getDepartments(token: string): Promise<DepartmentResponse[]> {
    return httpRequest('/api/admin/departments', { token });
  },

  createDepartment(token: string, name: string): Promise<void> {
    return httpRequest('/api/admin/departments', {
      method: 'POST',
      token,
      body: { name },
    });
  },

  deleteDepartment(token: string, departmentId: number): Promise<void> {
    return httpRequest(`/api/admin/departments/${departmentId}`, {
      method: 'DELETE',
      token,
    });
  },
};
