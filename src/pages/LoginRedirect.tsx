import { useEffect } from "react";

const LoginRedirect = () => {
  useEffect(() => {
    window.location.assign("https://brassaarmada-admin.vercel.app/");
  }, []);

  return null;
};

export default LoginRedirect;
