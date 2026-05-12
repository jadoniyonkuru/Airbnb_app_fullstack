import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type {
  LoginRequest, RegisterRequest, AuthResponse,
  ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest,
} from './types';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>(ENDPOINTS.LOGIN, data).then(r => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>(ENDPOINTS.REGISTER, data).then(r => r.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post(ENDPOINTS.FORGOT_PASSWORD, data).then(r => r.data),

  resetPassword: (token: string, data: ResetPasswordRequest) =>
    apiClient.post(ENDPOINTS.RESET_PASSWORD(token), data).then(r => r.data),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post(ENDPOINTS.CHANGE_PASSWORD, data).then(r => r.data),
};
