export type UserRole = 'ADMIN' | 'STAFF' | 'DOCTOR' | 'USER' | 'UNKNOWN';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  email: string;
  clientName: string;
  role: UserRole;
  authorities: string[];
  profilePicUrl?: string;
}

export interface ApiError {
  status: number;
  message: string;
}
