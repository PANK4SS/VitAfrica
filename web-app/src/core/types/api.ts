export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  profilePicUrl: string;
}

export interface UploadProfilePictureResponse {
  url: string;
  message: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  clientName: string;
}

export interface WebCurrentUserResponse {
  email: string;
  clientName: string;
  profilePicUrl: string | null;
}

export interface AdminDashboardResponse {
  patientNumber: number;
  doctorNumber: number;
  staffNumber: number;
  waitingRequestNumber: number;
}

export interface PendingRequestResponse {
  profileId: number;
  fullName: string;
  email: string;
  profilePicUrl: string;
  status: string;
}

export interface PersonnelResponse {
  clientId: number;
  fullName: string;
  email: string;
  profilePicUrl: string;
  role: string;
  status: string;
  department: string | null;
}

export interface DepartmentResponse {
  departmentId: number;
  name: string;
  doctorCount: number;
}

export interface StaffDashboardResponse {
  totalPatients: number;
}

export interface PatientSummaryResponse {
  patientId: number;
  fullName: string;
  phone: string;
  locationAddress: string;
  profilePicUrl: string;
}

export interface DoctorSummaryResponse {
  doctorId: number;
  fullName: string;
  department: string;
  profilePicUrl: string | null;
}

export interface CreateAppointmentPayload {
  patientId: number;
  doctorId: number;
  dateTime: string;
}

export interface DoctorDashboardResponse {
  upcomingConsultations: number;
  completedConsultations: number;
}

export interface ConsultationSummaryResponse {
  appointmentId: number;
  patientName: string;
  patientPhone: string;
  date: string;
  hour: string;
  status: string;
}

export interface ConsultationDetailResponse {
  appointmentId: number;
  patientName: string;
  patientPhone: string;
  patientLocation: string;
  patientProfilePic: string;
  date: string;
  hour: string;
  status: string;
}

export interface DrugRequest {
  drugName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
}

export interface AddPrescriptionPayload {
  patientId: number;
  drugs: DrugRequest[];
}
