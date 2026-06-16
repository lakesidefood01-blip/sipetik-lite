import { Navigate, Outlet } from 'react-router-dom';
import { useMembership } from '@/src/hooks/useMembership';

export default function MemberGuard() {
  const { isActive, loading } = useMembership();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Memeriksa status paket...</p>
      </div>
    );
  }

  if (!isActive) {
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
}
