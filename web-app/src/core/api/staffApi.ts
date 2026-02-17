import type {
  CreateAppointmentPayload,
  DoctorSummaryResponse,
  PatientSummaryResponse,
  StaffDashboardResponse,
  RecordVitalSignsPayload,
} from '../types/api';
import { httpRequest } from './httpClient';

export const staffApi = {
  getDashboard(token: string): Promise<StaffDashboardResponse> {
    return httpRequest('/api/staff/dashboard', { token });
  },

  getPatients(token: string, search?: string): Promise<PatientSummaryResponse[]> {
    const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
    return httpRequest(`/api/staff/patients${query}`, { token });
  },

  getDoctors(token: string): Promise<DoctorSummaryResponse[]> {
    return httpRequest('/api/staff/doctors', { token });
  },

  createAppointment(token: string, payload: CreateAppointmentPayload): Promise<void> {
    return httpRequest('/api/staff/appointments', {
      method: 'POST',
      token,
      body: payload,
    });
  },

  recordVitalSigns(token: string, payload: RecordVitalSignsPayload): Promise<void> {
    return httpRequest('/api/staff/vital-signs', {
      method: 'POST',
      token,
      body: payload,
    });
  },
};
