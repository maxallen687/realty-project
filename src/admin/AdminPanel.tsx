import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { useAdmin } from '../hooks/useAdmin';

export default function AdminPanel() {
  const { isAuthenticated, authLoading } = useAdmin();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-brand-orange rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
