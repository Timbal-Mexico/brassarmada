import DashboardLayout from "@/components/DashboardLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@brassarmada/supabase";
import type { Profile, Role } from "@brassarmada/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RoleGate } from "@brassarmada/ui";

const roleOptions: Role[] = ["admin", "editor", "viewer"];

const Users = () => {
  const queryClient = useQueryClient();

  const profiles = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const res = await supabase
        .from("profiles")
        .select("id,email,full_name,role,created_at,updated_at")
        .order("email");
      if (res.error) throw res.error;
      return (res.data as Profile[]) ?? [];
    },
    staleTime: 30_000,
  });

  const updateRole = async (id: string, role: Role) => {
    const res = await supabase.from("profiles").update({ role }).eq("id", id);
    if (res.error) {
      toast({ title: "No se pudo actualizar", description: res.error.message });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["profiles"] });
    toast({ title: "Actualizado", description: `Rol cambiado a ${role}` });
  };

  return (
    <RoleGate roles={["admin"]}>
      <DashboardLayout>
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Administración</div>
          <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Usuarios</h1>
        </div>

        <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[720px] w-full">
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
                  </tr>
                ))}
                {profiles.isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-sm text-muted-foreground">
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
