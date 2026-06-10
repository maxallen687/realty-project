import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { useAdmin } from '../hooks/useAdmin';

export default function AdminPanel() {
  const { isAuthenticated } = useAdmin();
  const [authed, setAuthed] = useState(isAuthenticated);

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return <AdminDashboard />;
}
