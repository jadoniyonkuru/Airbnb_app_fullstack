// Legacy shim — kept for backward compatibility.
export type { LoginRequest, RegisterRequest, AuthResponse } from '../../features/auth/types';

import { authApi } from '../../features/auth/api';
export const login    = (data: Parameters<typeof authApi.login>[0])    => authApi.login(data);
export const register = (data: Parameters<typeof authApi.register>[0]) => authApi.register(data);
