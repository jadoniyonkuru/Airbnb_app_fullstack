import axios from 'axios';

const envBase = import.meta.env.VITE_API_URL as string | undefined;
export const BASE_URL = envBase ?? 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // When sending FormData, remove the default application/json Content-Type so
  // Axios can auto-set multipart/form-data with the correct boundary string.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);
