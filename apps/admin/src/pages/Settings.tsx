import DashboardLayout from "@/components/DashboardLayout";
import { supabase, useProfile } from "@brassarmada/supabase";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { RoleGate } from "@brassarmada/ui";

const Settings = () => {
  const profile = useProfile();
  const [fullName, setFullName] = useState("");

  const current = profile.data;
  const isAdmin = current?.role === "admin";

  useEffect(() => {
    if (current && fullName === "") setFullName(current.full_name ?? "");
  }, [current, fullName]);

  const save = async () => {
    if (!current) return;
    const res = await supabase.from("profiles").update({ full_name: fullName }).eq("id", current.id);
    if (res.error) {
      toast({ title: "No se pudo guardar", description: res.error.message });
      return;
    }
    await profile.refetch();
    toast({ title: "Guardado", description: "Configuración actualizada." });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Administración</div>
        <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Configuración</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card/50 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tu Rol</div>
          <div className="mt-2 text-lg font-semibold text-foreground">{current?.role?.toUpperCase() ?? "—"}</div>
          <div className="mt-4 text-sm text-muted-foreground">{current?.email ?? ""}</div>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Perfil</div>
          <div className="mt-4">
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Nombre completo
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isAdmin}
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground disabled:opacity-50"
              aria-label="Nombre completo"
            />
            {!isAdmin ? (
              <div className="mt-3 text-xs tracking-wide text-muted-foreground">
                Solo un admin puede editar esta sección.
              </div>
            ) : null}
          </div>
          <RoleGate roles={["admin"]}>
            <button type="button" onClick={save} className="mt-6 h-11 w-full bg-primary text-primary-foreground">
              Guardar
            </button>
          </RoleGate>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
