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

  getPersonnel(
    token: string,
    filters: { role?: string; search?: string } = {},
  ): Promise<PersonnelResponse[]> {
    const params = new URLSearchParams();
    if (filters.role?.trim()) {
      params.set('role', filters.role.trim());
    }
    if (filters.search?.trim()) {
      params.set('search', filters.search.trim());
    }
    const query = params.toString();
    const path = query ? `/api/admin/personnel?${query}` : '/api/admin/personnel';
    return httpRequest(path, { token });
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

  deletePersonnel(token: string, clientId: number): Promise<void> {
    return httpRequest(`/api/admin/personnel/${clientId}`, {
      method: 'DELETE',
      token,
    });
  },
};
