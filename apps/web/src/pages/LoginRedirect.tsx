import { useEffect } from "react";

type WebEnv = ImportMetaEnv & {
  VITE_ADMIN_URL?: string;
};

const LoginRedirect = () => {
  useEffect(() => {
    const envUrl = (import.meta.env as WebEnv).VITE_ADMIN_URL;
    const target = envUrl ?? "https://app.brassarmada.com.mx/login";
    window.location.assign(target);
  }, []);

  return null;
};

export default LoginRedirect;
