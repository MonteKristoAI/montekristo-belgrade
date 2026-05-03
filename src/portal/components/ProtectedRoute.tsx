import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/portal/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMkAdmin?: boolean;
}

export function ProtectedRoute({ children, requireMkAdmin }: ProtectedRouteProps) {
  const { session, loading, isMkAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary text-lg animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/reports/portal/login" state={{ from: location.pathname }} replace />;
  }

  if (requireMkAdmin && !isMkAdmin) {
    return <Navigate to="/reports/portal" replace />;
  }

  return <>{children}</>;
}
