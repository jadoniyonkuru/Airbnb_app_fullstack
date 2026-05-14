import { useAuth } from '../context/AuthContext';
import { HostDashboard } from './host/HostDashboard';
import { AdminDashboard } from './admin/AdminDashboard';
import { UserDashboard } from './user/UserDashboard';

export function Dashboard() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'HOST':
      return <HostDashboard />;
    case 'GUEST':
      return <UserDashboard />;
    default:
      return <UserDashboard />;
  }
}
