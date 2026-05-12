import { useAuth } from '../context/AuthContext';
import { HostDashboard } from './host/HostDashboard';
import { AdminDashboard } from './admin/AdminDashboard';

export function Dashboard() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'HOST':
      return <HostDashboard />;
    default:
      return <HostDashboard />;
  }
}
