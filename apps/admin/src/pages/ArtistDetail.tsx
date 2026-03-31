import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { RoleGate } from "@brassarmada/ui";
import { supabase } from "@brassarmada/supabase";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const schema = z.object({
  stage_name: z.string().min(2),
  slug: z.string().min(2),
  bio: z.string().optional().or(z.literal("")),
  genre: z.string().optional().or(z.literal("")),
  profile_image_url: z.string().url().optional().or(z.literal("")),
  banner_image_url: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type ArtistRow = {
  id: string;
  stage_name: string;
  slug: string;
  bio: string | null;
  genre: string | null;
  profile_image_url: string | null;
  banner_image_url: string | null;
  phone: string | null;
  website: string | null;
  social_links: Record<string, unknown> | null;
  is_active: boolean;
};

type BandRow = { id: string; name: string; slug: string; is_active: boolean };
type BandMemberRow = {
  id: string;
  band_id: string;
  artist_id: string;
  role_in_band: string | null;
  status: "active" | "inactive" | "pending";
};

const ArtistDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const artist = useQuery({
    queryKey: ["admin-artist", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await supabase
        .from("artists")
        .select("id,stage_name,slug,bio,genre,profile_image_url,banner_image_url,phone,website,social_links,is_active")
        .eq("slug", slug ?? "")
        .maybeSingle();
      if (res.error) throw res.error;
      return res.data as ArtistRow | null;
    },
    staleTime: 10_000,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      stage_name: "",
      slug: "",
      bio: "",
      genre: "",
      profile_image_url: "",
      banner_image_url: "",
      phone: "",
      website: "",
      instagram: "",
      is_active: false,
    },
    mode: "onBlur",
  });

  const a = artist.data;
  const id = a?.id ?? null;

  const allBands = useQuery({
    queryKey: ["bands-admin"],
    queryFn: async () => {
      const res = await supabase.from("bands").select("id,name,slug,is_active").order("name");
      if (res.error) throw res.error;
      return (res.data as BandRow[]) ?? [];
    },
    staleTime: 10_000,
  });

  const members = useQuery({
    queryKey: ["artist-band-members", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await supabase
        .from("band_members")
        .select("id,band_id,artist_id,role_in_band,status")
        .eq("artist_id", id ?? "");
      if (res.error) throw res.error;
      return (res.data as BandMemberRow[]) ?? [];
    },
    staleTime: 10_000,
  });

  const [newBandId, setNewBandId] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState<BandMemberRow["status"]>("active");

  const bandById = useMemo(() => {
    const map = new Map<string, BandRow>();
    for (const b of allBands.data ?? []) map.set(b.id, b);
    return map;
  }, [allBands.data]);

  const addMembership = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Artista no encontrado");
      if (!newBandId) throw new Error("Selecciona una banda");
      const res = await supabase.from("band_members").insert({
        band_id: newBandId,
        artist_id: id,
        role_in_band: newRole.trim() || null,
        status: newStatus,
      });
      if (res.error) throw new Error(res.error.message);
    },
    onSuccess: async () => {
      setNewBandId("");
      setNewRole("");
      setNewStatus("active");
      await queryClient.invalidateQueries({ queryKey: ["artist-band-members", id] });
      toast({ title: "Agregado", description: "Membresía creada." });
    },
    onError: (e) => toast({ title: "No se pudo agregar", description: (e as Error).message }),
  });

  const updateMembership = useMutation({
    mutationFn: async (payload: { id: string; role_in_band: string | null; status: BandMemberRow["status"] }) => {
      const res = await supabase.from("band_members").update(payload).eq("id", payload.id);
      if (res.error) throw new Error(res.error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artist-band-members", id] });
      toast({ title: "Actualizado", description: "Membresía actualizada." });
    },
    onError: (e) => toast({ title: "No se pudo actualizar", description: (e as Error).message }),
  });

  const removeMembership = useMutation({
    mutationFn: async (membershipId: string) => {
      const res = await supabase.from("band_members").delete().eq("id", membershipId);
      if (res.error) throw new Error(res.error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artist-band-members", id] });
      toast({ title: "Eliminado", description: "Membresía eliminada." });
    },
    onError: (e) => toast({ title: "No se pudo eliminar", description: (e as Error).message }),
  });

  useEffect(() => {
    if (!a) return;
    form.reset({
      stage_name: a.stage_name ?? "",
      slug: a.slug ?? "",
      bio: a.bio ?? "",
      genre: a.genre ?? "",
      profile_image_url: a.profile_image_url ?? "",
      banner_image_url: a.banner_image_url ?? "",
      phone: a.phone ?? "",
      website: a.website ?? "",
      instagram: String(a.social_links?.instagram ?? ""),
      is_active: !!a.is_active,
    });
  }, [a, form]);

  const save = async (values: FormValues) => {
    if (!id) return;
    const payload = {
      stage_name: values.stage_name.trim(),
      slug: values.slug.trim().toLowerCase(),
      bio: values.bio?.trim() || null,
      genre: values.genre?.trim() || null,
      profile_image_url: values.profile_image_url?.trim() || null,
      banner_image_url: values.banner_image_url?.trim() || null,
      phone: values.phone?.trim() || null,
      website: values.website?.trim() || null,
      social_links: {
        instagram: values.instagram?.trim() || null,
      },
      is_active: !!values.is_active,
    };
    const res = await supabase.from("artists").update(payload).eq("id", id);
    if (res.error) {
      toast({ title: "No se pudo guardar", description: res.error.message });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-artist", slug] });
    await queryClient.invalidateQueries({ queryKey: ["artists"] });
    toast({ title: "Guardado", description: "Perfil actualizado." });
  };

  return (
    <RoleGate roles={["admin", "super_admin"]}>
      <DashboardLayout>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Administración</div>
            <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Perfil de Artista</h1>
            <div className="mt-1 text-xs tracking-wide text-muted-foreground">{slug}</div>
          </div>
          <Link to="/artists" className="h-10 rounded-md border border-border bg-background px-4 text-sm">
            Volver
          </Link>
        </div>

        {!artist.data && !artist.isLoading ? (
          <div className="rounded-lg border border-border bg-card/50 p-6 text-sm text-muted-foreground">No encontrado</div>
        ) : null}

        {artist.isLoading ? (
          <div className="rounded-lg border border-border bg-card/50 p-6 text-sm text-muted-foreground">Cargando…</div>
        ) : null}

        {artist.data ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="rounded-lg border border-border bg-card/50 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Estado</div>
                <div className="mt-3 text-sm text-foreground">{a?.is_active ? "ACTIVO" : "INACTIVO"}</div>
                <div className="mt-4">
                  <img
                    src={a?.profile_image_url ?? "/placeholder.svg"}
                    alt={a?.stage_name ?? ""}
                    className="h-auto w-full rounded-lg border border-border object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-lg border border-border bg-card/50 p-6">
                <form className="grid gap-4" onSubmit={form.handleSubmit(save)}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nombre artístico</label>
                      <input
                        {...form.register("stage_name")}
                        className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Slug</label>
                      <input
                        {...form.register("slug")}
                        className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Bio</label>
                    <textarea
                      {...form.register("bio")}
                      rows={4}
                      className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Género</label>
                      <input
                        {...form.register("genre")}
                        className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Teléfono</label>
                      <input
                        {...form.register("phone")}
                        className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Website</label>
                      <input
                        {...form.register("website")}
                        className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Instagram</label>
                      <input
                        {...form.register("instagram")}
                        className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Foto (URL)</label>
                    <input
                      {...form.register("profile_image_url")}
                      className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Banner (URL)</label>
                    <input
                      {...form.register("banner_image_url")}
                      className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input type="checkbox" {...form.register("is_active")} className="h-4 w-4 accent-primary" />
                    <span className="text-sm text-muted-foreground">Activo</span>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button type="submit" className="h-10 rounded-md border border-border bg-background px-5 text-sm">
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-card/50 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Bandas</div>

                <div className="mt-4 grid gap-4 lg:grid-cols-12">
                  <div className="lg:col-span-6">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Agregar a banda</label>
                    <select
                      value={newBandId}
                      onChange={(e) => setNewBandId(e.target.value)}
                      className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    >
                      <option value="">Selecciona…</option>
                      {(allBands.data ?? []).map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rol</label>
                    <input
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                      placeholder="Batería, Voz…"
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Estado</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as BandMemberRow["status"])}
                      className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    >
                      <option value="active">active</option>
                      <option value="pending">pending</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </div>
                  <div className="lg:col-span-12 flex justify-end">
                    <button
                      type="button"
                      onClick={() => addMembership.mutate()}
                      className="h-10 rounded-md border border-border bg-background px-5 text-sm"
                      disabled={addMembership.isPending}
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                <div className="mt-6 overflow-auto rounded-lg border border-border bg-background/50">
                  <table className="min-w-[900px] w-full">
                    <thead className="border-b border-border bg-muted/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Banda</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rol</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Estado</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(members.data ?? []).map((m) => {
                        const b = bandById.get(m.band_id);
                        return (
                          <tr key={m.id} className="border-b border-border/60">
                            <td className="px-4 py-3 text-sm text-foreground">{b ? `${b.name} (${b.slug})` : m.band_id}</td>
                            <td className="px-4 py-3">
                              <input
                                defaultValue={m.role_in_band ?? ""}
                                onBlur={(e) =>
                                  updateMembership.mutate({ id: m.id, role_in_band: e.target.value.trim() || null, status: m.status })
                                }
                                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <select
                                defaultValue={m.status}
                                onChange={(e) =>
                                  updateMembership.mutate({
                                    id: m.id,
                                    role_in_band: m.role_in_band ?? null,
                                    status: e.target.value as BandMemberRow["status"],
                                  })
                                }
                                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                              >
                                <option value="active">active</option>
                                <option value="pending">pending</option>
                                <option value="inactive">inactive</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => removeMembership.mutate(m.id)}
                                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                disabled={removeMembership.isPending}
                              >
                                Quitar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {members.isLoading || allBands.isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">Cargando…</td>
                        </tr>
                      ) : null}
                      {members.isError ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-red-700">{(members.error as Error).message}</td>
                        </tr>
                      ) : null}
                      {!members.isLoading && (members.data ?? []).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">Sin membresías</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DashboardLayout>
    </RoleGate>
  );
};

export default ArtistDetail;

