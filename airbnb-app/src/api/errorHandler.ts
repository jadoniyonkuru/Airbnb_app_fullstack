import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status: number;
  field?: string;
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    const serverMessage =
      data?.message || data?.error || data?.msg || null;

    const messages: Record<number, string> = {
      400: serverMessage || 'Please check your input and try again.',
      401: 'Invalid credentials. Please check your email and password.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: serverMessage || 'This email or username is already taken.',
      422: serverMessage || 'Validation failed. Please check your input.',
      500: 'Server error. Please try again in a moment.',
    };

    return {
      message: messages[status] || serverMessage || 'Something went wrong. Please try again.',
      status,
    };
  }

  return { message: 'Network error. Please check your connection.', status: 0 };
}
