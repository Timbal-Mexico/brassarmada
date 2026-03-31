import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Role = "super_admin" | "admin" | "editor" | "viewer" | "artista" | "cliente";

type Payload =
  | { action: "create"; email: string; password: string; role: Role; full_name?: string | null }
  | { action: "delete"; userId: string }
  | { action: "set_role"; userId: string; role: Role }
  | { action: "set_password"; userId: string; password: string };

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) return json(500, { message: "Missing server configuration" });

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
  if (!token) return json(401, { message: "Missing Authorization token" });

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const who = await supabase.auth.getUser(token);
  if (who.error || !who.data.user) return json(401, { message: "Invalid token" });

  const requester = await supabase.from("users").select("role").eq("id", who.data.user.id).maybeSingle();
  if (requester.error) return json(403, { message: "Not authorized" });
  if (requester.data?.role !== "super_admin") return json(403, { message: "Super admin required" });

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return json(400, { message: "Invalid JSON" });
  }

  if (payload.action === "create") {
    const email = String(payload.email ?? "").trim();
    const password = String(payload.password ?? "");
    const role = payload.role;
    const full_name = payload.full_name ? String(payload.full_name).trim() : null;

    if (!email || !password || !role) return json(400, { message: "Missing fields" });

    const created = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: full_name ? { full_name } : undefined,
    });
    if (created.error || !created.data.user) return json(400, { message: created.error?.message ?? "Create failed" });

    const userId = created.data.user.id;
    const updated = await supabase.from("users").update({ role, full_name }).eq("id", userId);
    if (updated.error) return json(400, { message: updated.error.message });

    return json(200, { userId });
  }

  if (payload.action === "delete") {
    const userId = String(payload.userId ?? "").trim();
    if (!userId) return json(400, { message: "Missing userId" });

    const deleted = await supabase.auth.admin.deleteUser(userId);
    if (deleted.error) return json(400, { message: deleted.error.message });
    return json(200, { ok: true });
  }

  if (payload.action === "set_role") {
    const userId = String(payload.userId ?? "").trim();
    const role = payload.role;
    if (!userId || !role) return json(400, { message: "Missing fields" });

    const updated = await supabase.from("users").update({ role }).eq("id", userId);
    if (updated.error) return json(400, { message: updated.error.message });
    return json(200, { ok: true });
  }

  if (payload.action === "set_password") {
    const userId = String(payload.userId ?? "").trim();
    const password = String(payload.password ?? "");
    if (!userId || !password) return json(400, { message: "Missing fields" });

    const updated = await supabase.auth.admin.updateUserById(userId, { password });
    if (updated.error) return json(400, { message: updated.error.message });
    return json(200, { ok: true });
  }

  return json(400, { message: "Unknown action" });
});

