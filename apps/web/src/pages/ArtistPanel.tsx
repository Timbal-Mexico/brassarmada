import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { from, useUser } from "@/lib/supabase";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  bio: z.string().min(10),
  profile_image_url: z.string().url(),
  categories: z.array(z.string().min(1)).min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type ArtistRow = {
  id: string;
  user_id: string | null;
  name: string;
  slug: string;
  bio: string | null;
  profile_image_url: string | null;
  categories: string[];
  phone: string | null;
  email: string | null;
  social_links: Record<string, unknown> | null;
  approval_status: "pending" | "approved" | "rejected";
};

type WorkRow = {
  id: string;
  artist_id: string;
  title: string;
  image_url: string;
  sort_order: number;
};

const ArtistPanel = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  const myArtist = useQuery({
    queryKey: ["my-artist", user.data?.id ?? null],
    enabled: !!user.data?.id,
    queryFn: async () => {
      const res = await from("artists")
        .select("id,user_id,name,slug,bio,profile_image_url,categories,phone,email,social_links,approval_status")
        .eq("user_id", user.data?.id ?? "")
        .maybeSingle<ArtistRow>();
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    staleTime: 10_000,
  });

  const works = useQuery({
    queryKey: ["my-artist-works", myArtist.data?.id ?? null],
    enabled: !!myArtist.data?.id,
    queryFn: async () => {
      const query = from("artist_works")
        .select("id,artist_id,title,image_url,sort_order")
        .eq("artist_id", myArtist.data?.id ?? "")
        .order("sort_order");
      const res = await (query as unknown as Promise<{ data: WorkRow[] | null; error: { message: string } | null }>);
      if (res.error) throw new Error(res.error.message);
      return res.data ?? [];
    },
    staleTime: 10_000,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      bio: "",
      profile_image_url: "",
      categories: [],
      email: "",
      phone: "",
      instagram: "",
      website: "",
    },
    mode: "onBlur",
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [workTitle, setWorkTitle] = useState("");
  const [workImageUrl, setWorkImageUrl] = useState("");

  useEffect(() => {
    if (!myArtist.data) return;
    form.reset({
      name: myArtist.data.name ?? "",
      slug: myArtist.data.slug ?? "",
      bio: myArtist.data.bio ?? "",
      profile_image_url: myArtist.data.profile_image_url ?? "",
      categories: myArtist.data.categories ?? [],
      email: myArtist.data.email ?? "",
      phone: myArtist.data.phone ?? "",
      instagram: String(myArtist.data.social_links?.instagram ?? ""),
      website: String(myArtist.data.social_links?.website ?? ""),
    });
  }, [form, myArtist.data]);

  const statusLabel = myArtist.data?.approval_status?.toUpperCase() ?? "SIN PERFIL";

  const addCategory = () => {
    const v = categoryInput.trim().toUpperCase();
    if (!v) return;
    const current = form.getValues("categories");
    if (current.includes(v)) return;
    form.setValue("categories", [...current, v], { shouldValidate: true });
    setCategoryInput("");
  };

  const removeCategory = (v: string) => {
    const current = form.getValues("categories");
    form.setValue(
      "categories",
      current.filter((c) => c !== v),
      { shouldValidate: true },
    );
  };

  const canSave = useMemo(() => !form.formState.isSubmitting, [form.formState.isSubmitting]);

  const saveProfile = async (values: FormValues) => {
    if (!user.data) return;
    const payload = {
      user_id: user.data.id,
      name: values.name.trim().toUpperCase(),
      slug: values.slug.trim().toLowerCase(),
      bio: values.bio.trim(),
      profile_image_url: values.profile_image_url.trim(),
      categories: values.categories,
      email: values.email?.trim() || null,
      phone: values.phone?.trim() || null,
      social_links: {
        instagram: values.instagram?.trim() || null,
        website: values.website?.trim() || null,
      },
      approval_status: myArtist.data?.approval_status ?? "pending",
    };

    if (myArtist.data?.id) {
      const res = await (from("artists").update(payload).eq("id", myArtist.data.id) as unknown as Promise<{
        data: ArtistRow[] | null;
        error: { message: string } | null;
      }>);
      if (res.error) {
        toast({ title: "No se pudo guardar", description: res.error.message });
        return;
      }
    } else {
      const res = await (from("artists").insert(payload) as unknown as Promise<{
        data: ArtistRow[] | null;
        error: { message: string } | null;
      }>);
      if (res.error) {
        toast({ title: "No se pudo crear", description: res.error.message });
        return;
      }
    }

    await queryClient.invalidateQueries({ queryKey: ["my-artist"] });
    toast({ title: "Guardado", description: "Tu perfil se actualizó." });
  };

  const addWork = async () => {
    if (!myArtist.data?.id) return;
    const title = workTitle.trim();
    const image_url = workImageUrl.trim();
    if (!title || !image_url) {
      toast({ title: "Faltan datos", description: "Título e imagen son obligatorios." });
      return;
    }

    const nextOrder = (works.data ?? []).reduce((m, w) => Math.max(m, w.sort_order), 0) + 1;
    const res = await (from("artist_works").insert({ artist_id: myArtist.data.id, title, image_url, sort_order: nextOrder }) as unknown as Promise<{
      data: WorkRow[] | null;
      error: { message: string } | null;
    }>);
    if (res.error) {
      toast({ title: "No se pudo agregar", description: res.error.message });
      return;
    }
    setWorkTitle("");
    setWorkImageUrl("");
    await queryClient.invalidateQueries({ queryKey: ["my-artist-works"] });
  };

  const removeWork = async (id: string) => {
    const res = await (from("artist_works").delete().eq("id", id) as unknown as Promise<{
      data: WorkRow[] | null;
      error: { message: string } | null;
    }>);
    if (res.error) {
      toast({ title: "No se pudo eliminar", description: res.error.message });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["my-artist-works"] });
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">Panel</div>
              <h1 className="mt-2 font-heading text-4xl font-black tracking-tighter text-black">PERFIL DE ARTISTA</h1>
            </div>
            <div className="border border-black bg-white px-3 py-2 font-body text-[10px] tracking-[0.2em] text-black uppercase">
              {statusLabel}
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="border border-black bg-white p-8">
              <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">Datos</div>
              <form
                className="mt-6 grid gap-4"
                onSubmit={form.handleSubmit(saveProfile)}
                aria-label="Formulario de perfil de artista"
              >
                <div>
                  <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                    Nombre artístico
                  </label>
                  <input
                    {...form.register("name")}
                    onBlur={(e) => {
                      const next = e.target.value;
                      if (!form.getValues("slug")) form.setValue("slug", slugify(next), { shouldValidate: true });
                      form.register("name").onBlur(e);
                    }}
                    className="mt-2 h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                  />
                  {form.formState.errors.name ? (
                    <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                      {form.formState.errors.name.message}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                    Slug
                  </label>
                  <input
                    {...form.register("slug")}
                    className="mt-2 h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                  />
                  {form.formState.errors.slug ? (
                    <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                      {form.formState.errors.slug.message}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                    Bio
                  </label>
                  <textarea
                    {...form.register("bio")}
                    className="mt-2 min-h-32 w-full border border-black bg-white px-3 py-2 font-body text-[10px] tracking-[0.2em] text-black"
                  />
                  {form.formState.errors.bio ? (
                    <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                      {form.formState.errors.bio.message}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                    Foto (URL)
                  </label>
                  <input
                    {...form.register("profile_image_url")}
                    className="mt-2 h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                  />
                  {form.formState.errors.profile_image_url ? (
                    <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                      {form.formState.errors.profile_image_url.message}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                    Categorías
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="h-11 flex-1 border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                      placeholder="PINTURA, MURAL…"
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="h-11 border border-black bg-black px-4 font-heading text-[10px] font-black tracking-[0.2em] text-white"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(form.watch("categories") ?? []).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => removeCategory(c)}
                        className="border border-black bg-white px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase hover:bg-black hover:text-white transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {form.formState.errors.categories ? (
                    <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase">
                      {form.formState.errors.categories.message as string}
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                      Email
                    </label>
                    <input
                      {...form.register("email")}
                      className="mt-2 h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                      Teléfono
                    </label>
                    <input
                      {...form.register("phone")}
                      className="mt-2 h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                      Instagram
                    </label>
                    <input
                      {...form.register("instagram")}
                      className="mt-2 h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">
                      Website
                    </label>
                    <input
                      {...form.register("website")}
                      className="mt-2 h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSave || !user.data}
                  className="mt-4 h-11 border border-black bg-black px-6 font-heading text-[10px] font-black tracking-[0.2em] text-white uppercase disabled:opacity-40"
                >
                  Guardar
                </button>
              </form>
            </div>

            <div className="border border-black bg-white p-8">
              <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">Obras</div>

              {!myArtist.data?.id ? (
                <div className="mt-6 font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">
                  Guarda tu perfil primero para agregar obras.
                </div>
              ) : null}

              <div className="mt-6 grid gap-3">
                <input
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                  className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                  placeholder="TÍTULO"
                  aria-label="Título de obra"
                  disabled={!myArtist.data?.id}
                />
                <input
                  value={workImageUrl}
                  onChange={(e) => setWorkImageUrl(e.target.value)}
                  className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                  placeholder="URL IMAGEN"
                  aria-label="URL de imagen"
                  disabled={!myArtist.data?.id}
                />
                <button
                  type="button"
                  onClick={addWork}
                  disabled={!myArtist.data?.id}
                  className="h-11 border border-black bg-black px-6 font-heading text-[10px] font-black tracking-[0.2em] text-white uppercase disabled:opacity-40"
                >
                  Agregar obra
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {(works.data ?? []).map((w) => (
                  <div key={w.id} className="border border-black bg-white">
                    <div className="aspect-[4/3] overflow-hidden bg-black border-b border-black">
                      <img src={w.image_url} alt={w.title} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="font-heading text-xs font-black tracking-[0.2em] text-black uppercase">{w.title}</div>
                      <button
                        type="button"
                        onClick={() => removeWork(w.id)}
                        className="mt-3 h-9 w-full border border-black bg-white font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase hover:bg-black hover:text-white transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtistPanel;

