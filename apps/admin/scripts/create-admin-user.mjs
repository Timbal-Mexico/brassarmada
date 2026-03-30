import fs from "node:fs";
import path from "node:path";

const parseEnvFile = (content) => {
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    env[key] = value;
  }
  return env;
};

const envPath = path.join(process.cwd(), ".env");
const fileEnv = fs.existsSync(envPath) ? parseEnvFile(fs.readFileSync(envPath, "utf8")) : {};

const SUPABASE_URL = process.env.SUPABASE_URL ?? fileEnv.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_FULL_NAME ?? null;

if (!SUPABASE_URL) {
  console.error("Falta SUPABASE_URL (o VITE_SUPABASE_URL en .env).");
  process.exit(1);
}

if (!SERVICE_ROLE_KEY) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY (NO usar VITE_, debe ser secreto).");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Falta ADMIN_EMAIL o ADMIN_PASSWORD.");
  process.exit(1);
}

const base = SUPABASE_URL.replace(/\/$/, "");

const fetchJson = async (url, init) => {
  const res = await fetch(url, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = data?.msg || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const createAuthUser = async () => {
  const url = `${base}/auth/v1/admin/users`;
  const payload = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: ADMIN_NAME ? { full_name: ADMIN_NAME } : undefined,
  };

  const user = await fetchJson(url, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return user;
};

const waitForProfile = async (userId) => {
  const url = new URL(`${base}/rest/v1/profiles`);
  url.searchParams.set("select", "id,email,full_name,role");
  url.searchParams.set("id", `eq.${userId}`);

  for (let i = 0; i < 20; i++) {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Accept: "application/vnd.pgrst.object+json",
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
    if (res.status !== 406 && res.status !== 404) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    await sleep(250);
  }

  throw new Error("No se encontró profile para el usuario (trigger no corrió o RLS/config).");
};

const setAdminRole = async (userId) => {
  const url = new URL(`${base}/rest/v1/profiles`);
  url.searchParams.set("id", `eq.${userId}`);

  await fetchJson(url.toString(), {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ role: "admin" }),
  });
};

try {
  const created = await createAuthUser();
  const userId = created?.id;
  if (!userId) throw new Error("Respuesta inesperada creando usuario.");

  await waitForProfile(userId);
  await setAdminRole(userId);

  console.log("Usuario admin creado:");
  console.log(`- email: ${ADMIN_EMAIL}`);
  console.log(`- id: ${userId}`);
  console.log("Rol asignado: admin");
} catch (e) {
  console.error("Error:", e?.message ?? e);
  process.exit(1);
}

