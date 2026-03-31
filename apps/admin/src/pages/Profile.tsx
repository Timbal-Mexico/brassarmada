import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { supabase, useProfile } from "@brassarmada/supabase";
import { usePermissions } from "@brassarmada/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const artistSchema = z.object({
  stage_name: z.string().min(2),
  slug: z.string().min(2),
  bio: z.string().optional().or(z.literal("")),
  genre: z.string().optional().or(z.literal("")),
  profile_image_url: z.string().url().optional().or(z.literal("")),
  banner_image_url: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

type ArtistFormValues = z.infer<typeof artistSchema>;

type ArtistRow = {
  id: string;
  user_id: string | null;
  stage_name: string;
  slug: string;
  bio: string | null;
  profile_image_url: string | null;
  phone: string | null;
  website: string | null;
  banner_image_url: string | null;
  genre: string | null;
  social_links: Record<string, unknown> | null;
  is_active: boolean;
};

const Profile = () => {
  const queryClient = useQueryClient();
  const profile = useProfile();
  const { role } = usePermissions();

  const myArtist = useQuery({
    queryKey: ["my-artist-profile", profile.data?.id ?? null],
    enabled: role === "artista" && !!profile.data?.id,
    queryFn: async () => {
      const res = await supabase
        .from("artists")
        .select("id,user_id,stage_name,slug,bio,genre,phone,website,social_links,profile_image_url,banner_image_url,is_active")
        .eq("user_id", profile.data?.id ?? "")
        .maybeSingle();
      if (res.error) throw res.error;
      return (res.data as ArtistRow | null) ?? null;
    },
    staleTime: 10_000,
  });

  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      stage_name: "",
      slug: "",
      bio: "",
      genre: "",
      profile_image_url: "",
      banner_image_url: "",
      phone: "",
      instagram: "",
      website: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (role !== "artista") return;
    if (!myArtist.data) return;
    form.reset({
      stage_name: myArtist.data.stage_name ?? "",
      slug: myArtist.data.slug ?? "",
      bio: myArtist.data.bio ?? "",
      genre: myArtist.data.genre ?? "",
      profile_image_url: myArtist.data.profile_image_url ?? "",
      banner_image_url: myArtist.data.banner_image_url ?? "",
      phone: myArtist.data.phone ?? "",
      instagram: String(myArtist.data.social_links?.instagram ?? ""),
      website: myArtist.data.website ?? "",
    });
  }, [form, myArtist.data, role]);

  const saveArtistProfile = async (values: ArtistFormValues) => {
    const userId = profile.data?.id;
    if (!userId) return;

    const payload = {
      user_id: userId,
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
    };

    if (myArtist.data?.id) {
      const res = await supabase.from("artists").update(payload).eq("id", myArtist.data.id);
      if (res.error) {
        toast({ title: "No se pudo guardar", description: res.error.message });
        return;
      }
    } else {
      const res = await supabase.from("artists").insert(payload);
      if (res.error) {
        toast({ title: "No se pudo crear", description: res.error.message });
        return;
      }
    }

    await queryClient.invalidateQueries({ queryKey: ["my-artist-profile"] });
    toast({ title: "Guardado", description: "Tu perfil se actualizó." });
  };

  const headerSubtitle = useMemo(() => {
    if (!profile.data) return "";
    return `${profile.data.email ?? ""} · ${(role ?? "").toUpperCase()}`;
  }, [profile.data, role]);

  if (role === "artista") {
    const status = myArtist.data ? (myArtist.data.is_active ? "ACTIVO" : "INACTIVO") : "SIN PERFIL";
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">{headerSubtitle}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="glass-card p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Estado</div>
              <div className="mt-3 text-2xl font-display font-bold text-foreground">{status}</div>
              <div className="mt-6 text-xs text-muted-foreground">El admin controla si tu perfil está activo.</div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="glass-card p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Perfil público</div>
              <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(saveArtistProfile)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Nombre artístico</label>
                    <input
                      {...form.register("stage_name")}
                      onBlur={(e) => {
                        const next = e.target.value;
                        if (!form.getValues("slug")) form.setValue("slug", slugify(next), { shouldValidate: true });
                        form.register("stage_name").onBlur(e);
                      }}
                      className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug</label>
                    <input
                      {...form.register("slug")}
                      className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      placeholder="tu-slug"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                  <textarea
                    {...form.register("bio")}
                    rows={4}
                    className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Cuéntanos sobre ti…"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Foto (URL)</label>
                  <input
                    {...form.register("profile_image_url")}
                    className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://…"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Teléfono</label>
                    <input
                      {...form.register("phone")}
                      className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      placeholder="+52…"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Género</label>
                    <input
                      {...form.register("genre")}
                      className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Rock, Jazz…"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram</label>
                    <input
                      {...form.register("instagram")}
                      className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      placeholder="@usuario"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Website</label>
                    <input
                      {...form.register("website")}
                      className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      placeholder="https://…"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Banner (URL)</label>
                  <input
                    {...form.register("banner_image_url")}
                    className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://…"
                  />
                </div>

                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="mt-2 h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-40"
                >
                  Guardar
                </button>
              </form>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">{headerSubtitle}</p>
        <div className="mt-8 glass-card p-6">
          <div className="text-sm text-foreground">Este rol no tiene perfil de artista editable en esta pantalla.</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
