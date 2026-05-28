import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f4f5f7] text-charcoal">
        <div className="w-10 h-10 rounded-full border-2 border-[#2d4a32]/20 border-t-[#2d4a32] animate-spin" />
        <p className="text-sm text-[#8a8580]">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
