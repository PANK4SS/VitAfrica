import type {
  CreateAppointmentPayload,
  DoctorSummaryResponse,
  PatientSummaryResponse,
  StaffDashboardResponse,
} from '../types/api';
import { httpRequest } from './httpClient';

export const staffApi = {
  getDashboard(token: string): Promise<StaffDashboardResponse> {
    return httpRequest('/api/staff/dashboard', { token });
  },

  getPatients(token: string): Promise<PatientSummaryResponse[]> {
    return httpRequest('/api/staff/patients', { token });
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
};
