import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

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

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en apps/admin/.env");
  process.exit(1);
}

const base = SUPABASE_URL.replace(/\/$/, "");

const ask = async (prompt) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => rl.question(prompt, resolve));
  rl.close();
  return String(answer);
};

const askHidden = async (prompt) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const stdin = process.stdin;

  const onData = (char) => {
    const c = char.toString();
    if (c === "\n" || c === "\r" || c === "\u0004") {
      rl.output.write("\n");
    } else {
      rl.output.write("*");
    }
  };

  stdin.on("data", onData);
  const value = await new Promise((resolve) => rl.question(prompt, resolve));
  stdin.removeListener("data", onData);
  rl.close();
  return String(value);
};

const fetchJson = async (url, init) => {
  const res = await fetch(url, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { status: res.status, ok: res.ok, data };
};

const email = (process.env.TEST_EMAIL ?? (await ask("Email: "))).trim();
const password = process.env.TEST_PASSWORD ?? (await askHidden("Password: "));

const tokenUrl = `${base}/auth/v1/token?grant_type=password`;
const tokenRes = await fetchJson(tokenUrl, {
  method: "POST",
  headers: {
    apikey: ANON_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});

if (!tokenRes.ok) {
  console.error(`Login falló (HTTP ${tokenRes.status}).`);
  console.error(tokenRes.data?.message ?? tokenRes.data?.msg ?? "Error desconocido");
  process.exit(1);
}

const accessToken = tokenRes.data?.access_token;
if (!accessToken) {
  console.error("Login respondió sin access_token.");
  process.exit(1);
}

const userUrl = new URL(`${base}/rest/v1/users`);
userUrl.searchParams.set("select", "id,email,full_name,role");
userUrl.searchParams.set("id", `eq.${tokenRes.data?.user?.id ?? ""}`);

const userRes = await fetch(userUrl.toString(), {
  method: "GET",
  headers: {
    apikey: ANON_KEY,
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.pgrst.object+json",
  },
});

const userText = await userRes.text();
const userData = userText ? JSON.parse(userText) : null;

console.log("Login OK");
console.log(`- user_id: ${tokenRes.data?.user?.id ?? "—"}`);
console.log(`- user_row: ${userRes.status === 200 ? "OK" : `HTTP ${userRes.status}`}`);
if (userRes.status === 200) {
  console.log(`- role: ${userData?.role ?? "—"}`);
}
