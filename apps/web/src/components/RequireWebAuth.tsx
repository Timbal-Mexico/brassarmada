import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/lib/supabase";

const RequireWebAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const user = useUser();

  if (user.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-body text-[10px] tracking-[0.2em] text-black uppercase">CARGANDO…</div>
      </div>
    );
  }

  if (!user.data) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
};

export default RequireWebAuth;

