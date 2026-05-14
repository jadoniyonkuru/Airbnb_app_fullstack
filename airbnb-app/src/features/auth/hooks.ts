import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from './api';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ChangePasswordRequest, AuthResponse } from './types';

// Using real backend `authApi` for all auth operations

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      // authApi returns the response data object directly
      const { token, user } = res;
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (user) qc.setQueryData(['me'], user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Login failed';
      const anyErr = err as any;
      const serverMsg = anyErr?.response?.data?.message;
      toast.error(serverMsg ?? message);
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (res) => {
      const { token, user } = res;
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (user) qc.setQueryData(['me'], user);
      toast.success('Account created! Welcome to StayEase.');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Registration failed';
      const anyErr = err as any;
      const serverMsg = anyErr?.response?.data?.message;
      toast.error(serverMsg ?? message);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: () => toast.success('Reset link sent — check your email.'),
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to send reset link';
      const anyErr = err as any;
      const serverMsg = anyErr?.response?.data?.message;
      toast.error(serverMsg ?? message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => toast.success('Password updated successfully.'),
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      const anyErr = err as any;
      const serverMsg = anyErr?.response?.data?.message;
      toast.error(serverMsg ?? message);
    },
  });
}
