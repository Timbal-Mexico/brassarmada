import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@brassarmada/supabase";
import { RoleGate } from "@brassarmada/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type ArtistRow = {
  id: string;
  stage_name: string;
  slug: string;
  genre: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const pageSize = 20;

const Artists = () => {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo(() => ({ q: q.trim(), page }), [q, page]);

  const artists = useQuery({
    queryKey: ["artists", filters],
    queryFn: async () => {
      const fromIdx = (filters.page - 1) * pageSize;
      const toIdx = fromIdx + pageSize - 1;

      const query = supabase
        .from("artists")
        .select("id,stage_name,slug,genre,is_active,created_at,updated_at")
        .order("created_at", { ascending: false })
        .range(fromIdx, toIdx);

      if (filters.q) query.ilike("stage_name", `%${filters.q}%`);

      const res = await (query as unknown as Promise<{ data: ArtistRow[] | null; error: { message: string } | null }>);
      if (res.error) throw new Error(res.error.message);
      return res.data ?? [];
    },
    staleTime: 10_000,
  });

  const toggleActive = async (id: string, is_active: boolean) => {
    const res = await (supabase
      .from("artists")
      .update({ is_active })
      .eq("id", id) as unknown as Promise<{ data: ArtistRow[] | null; error: { message: string } | null }>);
    if (res.error) {
      toast({ title: "No se pudo actualizar", description: res.error.message });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["artists"] });
    toast({ title: "Actualizado", description: is_active ? "Marcado como activo" : "Marcado como inactivo" });
  };

  return (
    <RoleGate roles={["admin", "super_admin"]}>
      <DashboardLayout>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Administración</div>
            <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Artistas</h1>
            <div className="mt-2 text-xs tracking-wide text-muted-foreground">Listado de perfiles registrados</div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              placeholder="Buscar por nombre…"
              aria-label="Buscar"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[980px] w-full">
              <thead className="border-b border-border bg-muted/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Artista
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Género
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Activo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {(artists.data ?? []).map((a) => (
                  <tr key={a.id} className="border-b border-border/60">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-foreground">
                        <Link to={`/artists/${a.slug}`} className="text-primary hover:opacity-70">{a.stage_name}</Link>
                      </div>
                      <div className="text-xs tracking-wide text-muted-foreground">{a.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-xs tracking-wide text-muted-foreground">{a.genre ?? "—"}</td>
                    <td className="px-4 py-3 text-xs tracking-wide text-muted-foreground">{a.is_active ? "SI" : "NO"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleActive(a.id, !a.is_active)}
                          className="h-9 rounded-md border border-border bg-background px-3 text-sm disabled:opacity-40"
                        >
                          {a.is_active ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {artists.isLoading ? (
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

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="h-10 rounded-md border border-border bg-background px-4 text-sm disabled:opacity-40"
          >
            Anterior
          </button>
          <div className="text-xs tracking-wide text-muted-foreground">Página {page}</div>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={(artists.data?.length ?? 0) < pageSize}
            className="h-10 rounded-md border border-border bg-background px-4 text-sm disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </DashboardLayout>
    </RoleGate>
  );
};

export default Artists;
