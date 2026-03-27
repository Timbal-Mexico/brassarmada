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
if (!fs.existsSync(envPath)) {
  console.error("No se encontró .env en apps/admin");
  process.exit(1);
}

const env = parseEnvFile(fs.readFileSync(envPath, "utf8"));
const url = env.VITE_SUPABASE_URL;
const anon = env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const base = url.replace(/\/$/, "");
const authEndpoint = `${base}/auth/v1/settings`;
const restEndpoint = `${base}/rest/v1/`;

try {
  const authRes = await fetch(authEndpoint, {
    method: "GET",
    headers: {
      apikey: anon,
    },
  });

  console.log(`Supabase URL OK: ${url}`);
  console.log(`Auth status: ${authRes.status}`);

  const restRes = await fetch(restEndpoint, {
    method: "GET",
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
  });
  console.log(`REST status: ${restRes.status}`);

  if (authRes.status >= 200 && authRes.status < 300) process.exit(0);
  process.exit(1);
} catch (e) {
  console.error("Error conectando a Supabase REST:", e?.message ?? e);
  process.exit(1);
}
