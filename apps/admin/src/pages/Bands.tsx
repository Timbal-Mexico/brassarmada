import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { fetchMyArtist } from "@/lib/artistApi";
import { supabase, useProfile } from "@brassarmada/supabase";
import { RoleGate, usePermissions } from "@brassarmada/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

type BandRow = {
  id: string;
  name: string;
  slug: string;
  genre: string | null;
  description: string | null;
  image_url: string | null;
  banner_image_url: string | null;
  is_active: boolean;
  created_at: string;
};

type BandMemberRow = {
  id: string;
  band_id: string;
  artist_id: string;
  role_in_band: string | null;
  status: "active" | "inactive" | "pending";
  joined_at: string | null;
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const Bands = () => {
  const queryClient = useQueryClient();
  const { role, isAdmin } = usePermissions();
  const profile = useProfile();
  const userId = profile.data?.id ?? null;

  const myArtist = useQuery({
    queryKey: ["artist-self", userId],
    enabled: role === "artista" && !!userId,
    queryFn: async () => fetchMyArtist(userId ?? ""),
    staleTime: 10_000,
  });

  const artistId = myArtist.data?.id ?? null;

  const memberships = useQuery({
    queryKey: ["band-memberships", artistId],
    enabled: role === "artista" && !!artistId,
    queryFn: async () => {
      const res = await supabase
        .from("band_members")
        .select("id,band_id,artist_id,role_in_band,status,joined_at")
        .eq("artist_id", artistId ?? "");
      if (res.error) throw res.error;
      return (res.data as BandMemberRow[]) ?? [];
    },
    staleTime: 10_000,
  });

  const myBands = useQuery({
    queryKey: ["my-bands", artistId, memberships.data?.length ?? 0],
    enabled: role === "artista" && !!artistId,
    queryFn: async () => {
      const ids = (memberships.data ?? []).map((m) => m.band_id);
      if (ids.length === 0) return [] as BandRow[];
      const res = await supabase
        .from("bands")
        .select("id,name,slug,genre,description,image_url,banner_image_url,is_active,created_at")
        .in("id", ids)
        .order("created_at", { ascending: false });
      if (res.error) throw res.error;
      return (res.data as BandRow[]) ?? [];
    },
    staleTime: 10_000,
  });

  const allBands = useQuery({
    queryKey: ["bands-admin"],
    enabled: isAdmin,
    queryFn: async () => {
      const res = await supabase
        .from("bands")
        .select("id,name,slug,genre,description,image_url,banner_image_url,is_active,created_at")
        .order("created_at", { ascending: false });
      if (res.error) throw res.error;
      return (res.data as BandRow[]) ?? [];
    },
    staleTime: 10_000,
  });

  const [joinSlug, setJoinSlug] = useState("");
  const [joinRole, setJoinRole] = useState("");
  const [newBandName, setNewBandName] = useState("");
  const [newBandGenre, setNewBandGenre] = useState("");
  const [newBandDescription, setNewBandDescription] = useState("");

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!artistId) throw new Error("Artista no encontrado");
      const slug = joinSlug.trim().toLowerCase();
      if (!slug) throw new Error("Escribe el slug de la banda");
      const bandRes = await supabase.from("bands").select("id,name,slug").eq("slug", slug).maybeSingle();
      if (bandRes.error) throw new Error(bandRes.error.message);
      if (!bandRes.data) throw new Error("Banda no encontrada");
      const band = bandRes.data as { id: string; name: string; slug: string };
      const insert = await supabase.from("band_members").insert({
        band_id: band.id,
        artist_id: artistId,
        role_in_band: joinRole.trim() || null,
        status: "pending",
      });
      if (insert.error) throw new Error(insert.error.message);
    },
    onSuccess: async () => {
      setJoinSlug("");
      setJoinRole("");
      await queryClient.invalidateQueries({ queryKey: ["band-memberships"] });
      toast({ title: "Solicitud enviada", description: "Tu solicitud quedó en estado PENDING." });
    },
    onError: (e) => toast({ title: "No se pudo unir", description: (e as Error).message }),
  });

  const leaveMutation = useMutation({
    mutationFn: async (membershipId: string) => {
      const res = await supabase.from("band_members").delete().eq("id", membershipId);
      if (res.error) throw new Error(res.error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["band-memberships"] });
      toast({ title: "Listo", description: "Saliste de la banda." });
    },
    onError: (e) => toast({ title: "No se pudo salir", description: (e as Error).message }),
  });

  const createBandMutation = useMutation({
    mutationFn: async () => {
      const name = newBandName.trim();
      if (!name) throw new Error("Nombre requerido");
      const slug = slugify(name);
      const res = await supabase.from("bands").insert({
        name,
        slug,
        genre: newBandGenre.trim() || null,
        description: newBandDescription.trim() || null,
        is_active: true,
      });
      if (res.error) throw new Error(res.error.message);
    },
    onSuccess: async () => {
      setNewBandName("");
      setNewBandGenre("");
      setNewBandDescription("");
      await queryClient.invalidateQueries({ queryKey: ["bands-admin"] });
      toast({ title: "Banda creada", description: "Registro creado en Supabase." });
    },
    onError: (e) => toast({ title: "No se pudo crear", description: (e as Error).message }),
  });

  const membershipByBandId = useMemo(() => {
    const map = new Map<string, BandMemberRow>();
    for (const m of memberships.data ?? []) map.set(m.band_id, m);
    return map;
  }, [memberships.data]);

  if (isAdmin) {
    return (
      <RoleGate roles={["admin", "super_admin"]}>
        <DashboardLayout>
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Bandas</h1>
              <p className="text-muted-foreground">Crea y administra bandas</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/50 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nueva banda</div>
            <div className="mt-4 grid gap-4 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nombre</label>
                <input value={newBandName} onChange={(e) => setNewBandName(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
              </div>
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Género</label>
                <input value={newBandGenre} onChange={(e) => setNewBandGenre(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
              </div>
              <div className="lg:col-span-5">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Descripción</label>
                <input value={newBandDescription} onChange={(e) => setNewBandDescription(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
              </div>
              <div className="lg:col-span-12 flex justify-end">
                <button type="button" onClick={() => createBandMutation.mutate()} className="h-10 rounded-md border border-border bg-background px-5 text-sm" disabled={createBandMutation.isPending}>
                  <Plus className="inline-block mr-2 h-4 w-4" />
                  Crear
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card/50 overflow-hidden">
            <div className="overflow-auto">
              <table className="min-w-[900px] w-full">
                <thead className="border-b border-border bg-muted/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Banda</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Slug</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Género</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Activo</th>
                  </tr>
                </thead>
                <tbody>
                  {(allBands.data ?? []).map((b) => (
                    <tr key={b.id} className="border-b border-border/60">
                      <td className="px-4 py-3 text-sm text-foreground">{b.name}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{b.slug}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{b.genre ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{b.is_active ? "SI" : "NO"}</td>
                    </tr>
                  ))}
                  {allBands.isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">Cargando…</td>
                    </tr>
                  ) : null}
                  {allBands.isError ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-sm text-red-700">{(allBands.error as Error).message}</td>
                    </tr>
                  ) : null}
                  {!allBands.isLoading && (allBands.data ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">No hay bandas.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </DashboardLayout>
      </RoleGate>
    );
  }

  return (
    <RoleGate roles={["artista"]}>
      <DashboardLayout>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Mis Bandas</h1>
            <p className="text-muted-foreground">Únete a una banda por slug y gestiona tus membresías</p>
          </div>
        </div>

        {myArtist.isLoading ? (
          <div className="rounded-lg border border-border bg-card/50 p-6 text-sm text-muted-foreground">Cargando…</div>
        ) : null}
        {myArtist.isError ? (
          <div className="rounded-lg border border-red-600 bg-red-50 p-6 text-sm text-red-700">Error: {(myArtist.error as Error).message}</div>
        ) : null}

        {!myArtist.isLoading && !myArtist.data ? (
          <div className="rounded-lg border border-border bg-card/50 p-6 text-sm text-muted-foreground">Primero crea tu perfil de artista en “Mi Perfil”.</div>
        ) : null}

        {myArtist.data ? (
          <>
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Unirse a banda</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Slug de la banda</label>
                  <input value={joinSlug} onChange={(e) => setJoinSlug(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" placeholder="neon-pulse" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rol</label>
                  <input value={joinRole} onChange={(e) => setJoinRole(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" placeholder="Guitarra" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button type="button" onClick={() => joinMutation.mutate()} className="h-10 rounded-md border border-border bg-background px-5 text-sm" disabled={joinMutation.isPending}>
                  Solicitar unión
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-border bg-card/50 overflow-hidden">
              <div className="overflow-auto">
                <table className="min-w-[900px] w-full">
                  <thead className="border-b border-border bg-muted/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Banda</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Slug</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rol</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Estado</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(myBands.data ?? []).map((b) => {
                      const m = membershipByBandId.get(b.id);
                      return (
                        <tr key={b.id} className="border-b border-border/60">
                          <td className="px-4 py-3 text-sm text-foreground">{b.name}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{b.slug}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{m?.role_in_band ?? "—"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{m?.status?.toUpperCase() ?? "—"}</td>
                          <td className="px-4 py-3 text-right">
                            {m ? (
                              <button type="button" onClick={() => leaveMutation.mutate(m.id)} className="h-9 rounded-md border border-border bg-background px-3 text-sm" disabled={leaveMutation.isPending}>
                                Salir
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                    {myBands.isLoading || memberships.isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">Cargando…</td>
                      </tr>
                    ) : null}
                    {myBands.isError || memberships.isError ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-red-700">{((myBands.error as Error) ?? (memberships.error as Error))?.message}</td>
                      </tr>
                    ) : null}
                    {!myBands.isLoading && (myBands.data ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">Aún no perteneces a ninguna banda.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </DashboardLayout>
    </RoleGate>
  );
};

export default Bands;
