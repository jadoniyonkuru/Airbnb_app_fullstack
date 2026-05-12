export type Role = 'GUEST' | 'HOST' | 'ADMIN';
export type HostStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  role: Role;
  hostStatus?: HostStatus | null;
  avatar?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: Role;
}

export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
