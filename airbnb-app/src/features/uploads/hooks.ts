import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '../../api/queryKeys';

const uploadsApi = {
  uploadAvatar: async (userId: string, file: File) => {
    await new Promise(r => setTimeout(r, 500));
    return { data: { avatar: URL.createObjectURL(file) } };
  },
  deleteAvatar: async (userId: string) => {
    await new Promise(r => setTimeout(r, 200));
    return { success: true };
  },
  uploadListingPhotos: async (userId: string, files: File[]) => {
    await new Promise(r => setTimeout(r, 800));
    return { data: files.map((_, i) => ({ url: URL.createObjectURL(files[0]) })) };
  },
};

export function useUploadAvatar(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadsApi.uploadAvatar(userId, file),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: queryKeys.user(userId) });
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        localStorage.setItem('user', JSON.stringify({ ...user, avatar: res.data?.avatar }));
      }
      toast.success('Avatar updated.');
    },
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
  });
}

export function useUploadListingPhotos(userId: string) {
  return useMutation({
    mutationFn: (files: File[]) => uploadsApi.uploadListingPhotos(userId, files),
    onSuccess: () => toast.success('Photos uploaded.'),
  });
}