import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';
import { parseApiError } from '../../api/errorHandler';

const uploadsApi = {
  uploadAvatar: (userId: string, file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return apiClient.post(ENDPOINTS.USER_AVATAR(userId), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  deleteAvatar: (userId: string) =>
    apiClient.delete(ENDPOINTS.USER_AVATAR(userId)).then(r => r.data),

  uploadListingPhotos: (userId: string, files: File[]) => {
    const form = new FormData();
    files.forEach(f => form.append('photos', f));
    return apiClient.post(ENDPOINTS.USER_PHOTOS(userId), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};

export function useUploadAvatar(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadsApi.uploadAvatar(userId, file),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: queryKeys.user(userId) });
      // Sync localStorage
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        localStorage.setItem('user', JSON.stringify({ ...user, avatar: res.data?.avatar }));
      }
      toast.success('Avatar updated.');
    },
    onError: (err) => toast.error(parseApiError(err).message),
  });
}

export function useDeleteAvatar(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => uploadsApi.deleteAvatar(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.user(userId) });
      toast.success('Avatar removed.');
    },
    onError: (err) => toast.error(parseApiError(err).message),
  });
}

export function useUploadListingPhotos(userId: string) {
  return useMutation({
    mutationFn: (files: File[]) => uploadsApi.uploadListingPhotos(userId, files),
    onSuccess: () => toast.success('Photos uploaded.'),
    onError: (err) => toast.error(parseApiError(err).message),
  });
}
