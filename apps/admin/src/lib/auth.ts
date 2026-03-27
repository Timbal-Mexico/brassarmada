export const ADMIN_SESSION_KEY = "brassarmada_admin_session_v1";

type AdminEnv = ImportMetaEnv & {
  VITE_ADMIN_TEST_EMAIL?: string;
  VITE_ADMIN_TEST_PASSWORD?: string;
};

export const getAdminTestCredentials = () => {
  const env = import.meta.env as AdminEnv;
  const email = env.VITE_ADMIN_TEST_EMAIL ?? "demo@brassarmada.com.mx";
  const password = env.VITE_ADMIN_TEST_PASSWORD ?? "brassarmada";
  return { email, password };
};

export const readAdminSession = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { email?: string; createdAtISO?: string };
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const isAdminAuthed = () => !!readAdminSession();

export const setAdminSession = (email: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({ email, createdAtISO: new Date().toISOString() }),
  );
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
};

