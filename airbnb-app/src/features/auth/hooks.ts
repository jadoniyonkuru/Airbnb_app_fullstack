import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from './api';
import { parseApiError } from '../../api/errorHandler';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ChangePasswordRequest } from './types';

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      qc.setQueryData(['me'], user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
    },
    onError: (err) => {
      const { message } = parseApiError(err);
      toast.error(message);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (res) => {
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Account created! Welcome to StayEase.');
    },
    onError: (err) => {
      const { message } = parseApiError(err);
      toast.error(message);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: () => toast.success('Reset link sent — check your email.'),
    onError: (err) => toast.error(parseApiError(err).message),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => toast.success('Password updated successfully.'),
    onError: (err) => toast.error(parseApiError(err).message),
  });
}
