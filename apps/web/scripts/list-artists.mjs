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
const ANON_KEY = process.env.SUPABASE_ANON_KEY ?? fileEnv.VITE_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || (!ANON_KEY && !SERVICE_ROLE_KEY)) {
  console.error("Faltan VITE_SUPABASE_URL y (VITE_SUPABASE_ANON_KEY o SUPABASE_SERVICE_ROLE_KEY) en apps/web/.env");
  process.exit(1);
}

const base = SUPABASE_URL.replace(/\/$/, "");

const headers = {
  apikey: SERVICE_ROLE_KEY ?? ANON_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY ?? ANON_KEY}`,
  Accept: "application/json",
};

const url = new URL(`${base}/rest/v1/artists`);
url.searchParams.set("select", "id,stage_name,slug,genre,is_active,created_at");
url.searchParams.set("order", "created_at.desc");

const res = await fetch(url.toString(), { method: "GET", headers });
const text = await res.text();
if (!res.ok) {
  console.error(`HTTP ${res.status}`);
  console.error(text);
  process.exit(1);
}

const data = text ? JSON.parse(text) : [];
console.log(JSON.stringify(data, null, 2));
