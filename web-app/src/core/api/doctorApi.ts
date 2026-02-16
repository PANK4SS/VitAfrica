import type {
  AddPrescriptionPayload,
  ConsultationDetailResponse,
  ConsultationSummaryResponse,
  DoctorDashboardResponse,
} from '../types/api';
import { httpRequest } from './httpClient';

export const doctorApi = {
  getDashboard(token: string): Promise<DoctorDashboardResponse> {
    return httpRequest('/api/doctor/dashboard', { token });
  },

  getConsultations(token: string): Promise<ConsultationSummaryResponse[]> {
    return httpRequest('/api/doctor/consultations', { token });
  },

  getConsultationDetail(
    token: string,
    appointmentId: number,
  ): Promise<ConsultationDetailResponse> {
    return httpRequest(`/api/doctor/consultations/${appointmentId}`, { token });
  },

  addPrescription(
    token: string,
    appointmentId: number,
    payload: AddPrescriptionPayload,
  ): Promise<void> {
    return httpRequest(`/api/doctor/consultations/${appointmentId}/prescription`, {
      method: 'POST',
      token,
      body: payload,
    });
  },

  uploadLabResult(token: string, appointmentId: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    return httpRequest(`/api/doctor/consultations/${appointmentId}/lab-result`, {
      method: 'POST',
      token,
      formData,
    });
  },

  completeConsultation(token: string, appointmentId: number): Promise<void> {
    return httpRequest(`/api/doctor/consultations/${appointmentId}/complete`, {
      method: 'PATCH',
      token,
    });
  },
};
