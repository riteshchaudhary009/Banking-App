import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ role }) {
  const { role: currentRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentRole) return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  if (currentRole !== role) return <Navigate to={currentRole === 'admin' ? '/admin' : '/dashboard'} replace />;

  return <Outlet />;
}
