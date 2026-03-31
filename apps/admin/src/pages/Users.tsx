import DashboardLayout from "@/components/DashboardLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@brassarmada/supabase";
import type { Profile, Role } from "@brassarmada/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RoleGate } from "@brassarmada/ui";
import { useMemo, useState } from "react";

const roleOptions: Role[] = ["super_admin", "admin", "artista", "cliente", "editor", "viewer"];

const Users = () => {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newRole, setNewRole] = useState<Role>("admin");
  const [isCreating, setIsCreating] = useState(false);

  const profiles = useQuery({
    queryKey: ["users", q],
    queryFn: async () => {
      const res = await supabase
        .from("users")
        .select("id,email,full_name,role,created_at,updated_at")
        .order("email");
      if (res.error) throw res.error;
      const rows = ((res.data as Profile[]) ?? []).filter((u) => {
        if (!q.trim()) return true;
        const needle = q.trim().toLowerCase();
        return `${u.email ?? ""} ${u.full_name ?? ""} ${u.role ?? ""}`.toLowerCase().includes(needle);
      });
      return rows;
    },
    staleTime: 30_000,
  });

  const createUser = async () => {
    const email = newEmail.trim().toLowerCase();
    const password = newPassword;
    const full_name = newFullName.trim() || null;
    if (!email || !password) {
      toast({ title: "Faltan datos", description: "Email y contraseña son obligatorios." });
      return;
    }
    setIsCreating(true);
    const res = await supabase.functions.invoke<{ userId: string }>("admin-users", {
      action: "create",
      email,
      password,
      role: newRole,
      full_name,
    });
    setIsCreating(false);
    if (res.error) {
      toast({ title: "No se pudo crear", description: res.error.message });
      return;
    }
    setNewEmail("");
    setNewPassword("");
    setNewFullName("");
    setNewRole("admin");
    await queryClient.invalidateQueries({ queryKey: ["users"] });
    toast({ title: "Usuario creado", description: "Cuenta creada y rol asignado." });
  };

  const updateRole = async (id: string, role: Role) => {
    const res = await supabase.functions.invoke("admin-users", { action: "set_role", userId: id, role });
    if (res.error) {
      toast({ title: "No se pudo actualizar", description: res.error.message });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["users"] });
    toast({ title: "Actualizado", description: `Rol cambiado a ${role}` });
  };

  const resetPassword = async (id: string, email: string | null) => {
    const password = window.prompt(`Nueva contraseña para ${email ?? id}:`) ?? "";
    if (!password.trim()) return;
    const res = await supabase.functions.invoke("admin-users", { action: "set_password", userId: id, password });
    if (res.error) {
      toast({ title: "No se pudo cambiar", description: res.error.message });
      return;
    }
    toast({ title: "Actualizado", description: "Contraseña actualizada." });
  };

  const deleteUser = async (id: string, email: string | null) => {
    const confirm = window.prompt(`Escribe ELIMINAR para borrar ${email ?? id}:`) ?? "";
    if (confirm !== "ELIMINAR") return;
    const res = await supabase.functions.invoke("admin-users", { action: "delete", userId: id });
    if (res.error) {
      toast({ title: "No se pudo eliminar", description: res.error.message });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["users"] });
    toast({ title: "Eliminado", description: "Usuario eliminado." });
  };

  const counts = useMemo(() => {
    const list = profiles.data ?? [];
    return list.reduce(
      (acc, u) => {
        acc.total += 1;
        acc[u.role] = (acc[u.role] ?? 0) + 1;
        return acc;
      },
      { total: 0 } as Record<string, number>,
    );
  }, [profiles.data]);

  return (
    <RoleGate roles={["super_admin"]}>
      <DashboardLayout>
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Administración</div>
          <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Usuarios</h1>
          <div className="mt-2 text-xs tracking-wide text-muted-foreground">
            Total: {counts.total} · Super Admin: {counts.super_admin ?? 0} · Admin: {counts.admin ?? 0} · Artista:{" "}
            {counts.artista ?? 0} · Cliente: {counts.cliente ?? 0}
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-border bg-card/50 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Crear usuario</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                placeholder="email@dominio.com"
                aria-label="Email"
              />
            </div>
            <div className="lg:col-span-3">
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                placeholder="Contraseña"
                type="password"
                aria-label="Contraseña"
              />
            </div>
            <div className="lg:col-span-3">
              <input
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                placeholder="Nombre (opcional)"
                aria-label="Nombre"
              />
            </div>
            <div className="lg:col-span-2">
              <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                <SelectTrigger className="h-10 rounded-md border border-border bg-background text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={createUser}
              disabled={isCreating}
              className="h-10 rounded-md border border-border bg-background px-4 text-sm disabled:opacity-40"
            >
              {isCreating ? "Creando…" : "Crear"}
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm sm:max-w-sm"
            placeholder="Buscar…"
            aria-label="Buscar"
          />
        </div>

        <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[920px] w-full">
              <thead className="border-b border-border bg-muted/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {(profiles.data ?? []).map((p) => (
                  <tr key={p.id} className="border-b border-border/60">
                    <td className="px-4 py-3 text-sm text-foreground">{p.email}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{p.full_name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Select value={p.role} onValueChange={(v) => updateRole(p.id, v as Role)}>
                        <SelectTrigger className="h-9 w-44 rounded-md border border-border bg-background text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => resetPassword(p.id, p.email)}
                          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                        >
                          Password
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteUser(p.id, p.email)}
                          disabled={p.role === "super_admin"}
                          className="h-9 rounded-md border border-border bg-background px-3 text-sm disabled:opacity-40"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {profiles.isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      Cargando…
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </RoleGate>
  );
};

export default Users;
