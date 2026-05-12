import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

export function ProtectedHostLayout() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}