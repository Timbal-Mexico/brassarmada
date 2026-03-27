import { useEffect } from "react";

type WebEnv = ImportMetaEnv & {
  VITE_ADMIN_URL?: string;
};

const LoginRedirect = () => {
  useEffect(() => {
    const envUrl = (import.meta.env as WebEnv).VITE_ADMIN_URL;
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    const isLocal = host === "localhost" || host === "127.0.0.1";
    const target = envUrl ?? (isLocal ? "http://localhost:8080/login" : "https://brassaarmada-admin.vercel.app/");
    window.location.assign(target);
  }, []);

  return null;
};

export default LoginRedirect;
