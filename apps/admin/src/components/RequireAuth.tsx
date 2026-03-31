import { Navigate, useLocation } from "react-router-dom";
import { useProfile } from "@brassarmada/supabase";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const profile = useProfile();

  if (profile.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cargando…</div>
      </div>
    );
  }
  if (!profile.data) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (profile.data.role === "cliente") {
    return <Navigate to="/login" replace state={{ from: location.pathname, reason: "unauthorized" }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
