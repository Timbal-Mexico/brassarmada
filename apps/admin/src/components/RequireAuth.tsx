import { Navigate, useLocation } from "react-router-dom";
import { useProfile } from "@brassarmada/supabase";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const profile = useProfile();

  if (profile.isLoading) return null;
  if (!profile.data) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
