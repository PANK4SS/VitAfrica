import type {
  AuthenticationResponse,
  LoginPayload,
  RegisterPayload,
  UploadProfilePictureResponse,
} from '../types/api';
import { httpRequest } from './httpClient';

export const authApi = {
  login(payload: LoginPayload): Promise<AuthenticationResponse> {
    return httpRequest('/api/authentication/web/login', {
      method: 'POST',
      body: payload,
    });
  },

  register(payload: RegisterPayload): Promise<string> {
    return httpRequest('/api/authentication/web/register', {
      method: 'POST',
      body: payload,
    });
  },

  uploadProfilePicture(file: File): Promise<UploadProfilePictureResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return httpRequest('/api/patients/mobile/upload-profile-pic', {
      method: 'POST',
      formData,
    });
  },
};
