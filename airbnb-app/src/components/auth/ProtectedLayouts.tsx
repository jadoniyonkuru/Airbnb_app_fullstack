import { HostLayout } from '../../app/pages/host/HostLayout';
import { AdminLayout } from '../../app/pages/admin/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

export function ProtectedHostLayout() {
  return (
    <ProtectedRoute requiredRole="HOST">
      <HostLayout />
    </ProtectedRoute>
  );
}

export function ProtectedAdminLayout() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminLayout />
    </ProtectedRoute>
  );
}