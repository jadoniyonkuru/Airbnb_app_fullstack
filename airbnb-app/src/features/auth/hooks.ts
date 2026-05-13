import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { users } from '../../data/mockData';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ChangePasswordRequest, AuthResponse } from './types';

// Mock auth API
const mockAuthApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = users.find(u => u.email.toLowerCase() === data.email.toLowerCase() && u.role.toUpperCase() === data.role.toUpperCase());
    if (!user) {
      throw new Error(`No ${data.role.toLowerCase()} account found with this email. Try: ${data.role === 'HOST' ? 'sarah.j@email.com' : 'kevin.m@email.com'}`);
    }
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          phone: user.phone,
          role: user.role.toUpperCase() as 'GUEST' | 'HOST' | 'ADMIN',
          hostStatus: null,
          avatar: null,
          bio: null,
          createdAt: user.joined,
        },
        token: `mock_token_${user.id}_${Date.now()}`,
      },
    };
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const newUser = {
      id: String(users.length + 1),
      name: data.name,
      email: data.email,
      username: data.username,
      phone: data.phone,
      role: data.role.toLowerCase() as 'guest' | 'host' | 'admin',
      status: 'active' as const,
      joined: new Date().toISOString().split('T')[0],
      avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      bookings: 0,
      revenue: 0,
    };
    
    return {
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          phone: newUser.phone,
          role: data.role,
          hostStatus: null,
          avatar: null,
          bio: null,
          createdAt: newUser.joined,
        },
        token: `mock_token_${newUser.id}_${Date.now()}`,
      },
    };
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, message: 'Reset link sent to your email' };
  },

  changePassword: async (data: ChangePasswordRequest) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, message: 'Password changed successfully' };
  },
};

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => mockAuthApi.login(data),
    onSuccess: (res) => {
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      qc.setQueryData(['me'], user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => mockAuthApi.register(data),
    onSuccess: (res) => {
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Account created! Welcome to StayEase.');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => mockAuthApi.forgotPassword(data),
    onSuccess: () => toast.success('Reset link sent — check your email.'),
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to send reset link';
      toast.error(message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => mockAuthApi.changePassword(data),
    onSuccess: () => toast.success('Password updated successfully.'),
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      toast.error(message);
    },
  });
}
