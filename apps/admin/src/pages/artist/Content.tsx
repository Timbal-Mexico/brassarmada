import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { fetchMyArtist, listAlbums, listTracks, listVideos, upsertAlbum, upsertTrack, upsertVideo, deleteAlbum, deleteTrack, deleteVideo } from "@/lib/artistApi";
import type { ArtistAlbum, ArtistTrack, ArtistVideo } from "@/lib/artistApi";
import { useProfile } from "@brassarmada/supabase";
import { RoleGate } from "@brassarmada/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const albumSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  release_date: z.string().optional().or(z.literal("")),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  is_published: z.boolean(),
});

const trackSchema = z.object({
  id: z.string().optional(),
  album_id: z.string().optional().or(z.literal("")),
  title: z.string().min(2),
  slug: z.string().min(2),
  duration_seconds: z.coerce.number().int().positive().optional().or(z.literal(0)),
  audio_url: z.string().url().optional().or(z.literal("")),
  is_published: z.boolean(),
});

const videoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  video_url: z.string().url(),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  platform: z.enum(["youtube", "vimeo", "custom"]),
  is_published: z.boolean(),
});

type AlbumForm = z.infer<typeof albumSchema>;
type TrackForm = z.infer<typeof trackSchema>;
type VideoForm = z.infer<typeof videoSchema>;

const ArtistContent = () => {
  const queryClient = useQueryClient();
  const profile = useProfile();
  const userId = profile.data?.id ?? null;

  const myArtist = useQuery({
    queryKey: ["artist-self", userId],
    enabled: !!userId,
    queryFn: async () => fetchMyArtist(userId ?? ""),
    staleTime: 10_000,
  });

  const artistId = myArtist.data?.id ?? null;

  const albums = useQuery({
    queryKey: ["artist-albums", artistId],
    enabled: !!artistId,
    queryFn: async () => listAlbums(artistId ?? ""),
    staleTime: 10_000,
  });

  const tracks = useQuery({
    queryKey: ["artist-tracks", artistId],
    enabled: !!artistId,
    queryFn: async () => listTracks(artistId ?? ""),
    staleTime: 10_000,
  });

  const videos = useQuery({
    queryKey: ["artist-videos", artistId],
    enabled: !!artistId,
    queryFn: async () => listVideos(artistId ?? ""),
    staleTime: 10_000,
  });

  const [editingAlbum, setEditingAlbum] = useState<ArtistAlbum | null>(null);
  const [editingTrack, setEditingTrack] = useState<ArtistTrack | null>(null);
  const [editingVideo, setEditingVideo] = useState<ArtistVideo | null>(null);

  const albumForm = useForm<AlbumForm>({
    resolver: zodResolver(albumSchema),
    defaultValues: { title: "", slug: "", release_date: "", cover_image_url: "", is_published: false },
    mode: "onBlur",
  });

  const trackForm = useForm<TrackForm>({
    resolver: zodResolver(trackSchema),
    defaultValues: { album_id: "", title: "", slug: "", duration_seconds: 0, audio_url: "", is_published: false },
    mode: "onBlur",
  });

  const videoForm = useForm<VideoForm>({
    resolver: zodResolver(videoSchema),
    defaultValues: { title: "", video_url: "", thumbnail_url: "", platform: "youtube", is_published: false },
    mode: "onBlur",
  });

  const upsertAlbumMutation = useMutation({
    mutationFn: async (values: AlbumForm) => {
      if (!artistId) return;
      await upsertAlbum(artistId, {
        id: values.id,
        title: values.title.trim(),
        slug: values.slug.trim(),
        release_date: values.release_date?.trim() || null,
        cover_image_url: values.cover_image_url?.trim() || null,
        is_published: !!values.is_published,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artist-albums"] });
      setEditingAlbum(null);
      albumForm.reset({ title: "", slug: "", release_date: "", cover_image_url: "", is_published: false });
      toast({ title: "Guardado", description: "Álbum actualizado." });
    },
    onError: (e) => toast({ title: "Error", description: (e as Error).message }),
  });

  const upsertTrackMutation = useMutation({
    mutationFn: async (values: TrackForm) => {
      if (!artistId) return;
      await upsertTrack(artistId, {
        id: values.id,
        album_id: values.album_id?.trim() ? values.album_id.trim() : null,
        title: values.title.trim(),
        slug: values.slug.trim(),
        duration_seconds: values.duration_seconds && values.duration_seconds > 0 ? values.duration_seconds : null,
        audio_url: values.audio_url?.trim() || null,
        is_published: !!values.is_published,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artist-tracks"] });
      setEditingTrack(null);
      trackForm.reset({ album_id: "", title: "", slug: "", duration_seconds: 0, audio_url: "", is_published: false });
      toast({ title: "Guardado", description: "Canción actualizada." });
    },
    onError: (e) => toast({ title: "Error", description: (e as Error).message }),
  });

  const upsertVideoMutation = useMutation({
    mutationFn: async (values: VideoForm) => {
      if (!artistId) return;
      await upsertVideo(artistId, {
        id: values.id,
        title: values.title.trim(),
        video_url: values.video_url.trim(),
        thumbnail_url: values.thumbnail_url?.trim() || null,
        platform: values.platform,
        is_published: !!values.is_published,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artist-videos"] });
      setEditingVideo(null);
      videoForm.reset({ title: "", video_url: "", thumbnail_url: "", platform: "youtube", is_published: false });
      toast({ title: "Guardado", description: "Video actualizado." });
    },
    onError: (e) => toast({ title: "Error", description: (e as Error).message }),
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: async (id: string) => deleteAlbum(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artist-albums"] });
      toast({ title: "Eliminado", description: "Álbum eliminado." });
    },
    onError: (e) => toast({ title: "Error", description: (e as Error).message }),
  });

  const deleteTrackMutation = useMutation({
    mutationFn: async (id: string) => deleteTrack(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artist-tracks"] });
      toast({ title: "Eliminado", description: "Canción eliminada." });
    },
    onError: (e) => toast({ title: "Error", description: (e as Error).message }),
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => deleteVideo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artist-videos"] });
      toast({ title: "Eliminado", description: "Video eliminado." });
    },
    onError: (e) => toast({ title: "Error", description: (e as Error).message }),
  });

  const albumOptions = useMemo(() => (albums.data ?? []).map((a) => ({ id: a.id, title: a.title })), [albums.data]);

  const ensureArtist = () => {
    if (myArtist.isLoading) return { ok: false, node: <div className="rounded-lg border border-border bg-card/50 p-6 text-sm text-muted-foreground">Cargando…</div> };
    if (myArtist.isError) return { ok: false, node: <div className="rounded-lg border border-red-600 bg-red-50 p-6 text-sm text-red-700">Error: {(myArtist.error as Error).message}</div> };
    if (!myArtist.data) {
      return {
        ok: false,
        node: (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <div className="text-sm text-foreground">Primero crea tu perfil de artista.</div>
            <Link to="/profile" className="mt-4 inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm">
              Ir a Mi Perfil
            </Link>
          </div>
        ),
      };
    }
    return { ok: true, node: null };
  };

  const gate = ensureArtist();

  return (
    <RoleGate roles={["artista"]}>
      <DashboardLayout>
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Panel</div>
          <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Gestión de Contenido</h1>
          <div className="mt-2 text-sm text-muted-foreground">{myArtist.data?.stage_name ?? ""}</div>
        </div>

        {!gate.ok ? gate.node : null}

        {gate.ok ? (
          <Tabs defaultValue="albums">
            <TabsList>
              <TabsTrigger value="albums">Álbumes</TabsTrigger>
              <TabsTrigger value="tracks">Canciones</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="albums">
              <div className="rounded-lg border border-border bg-card/50 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {editingAlbum ? "Editar álbum" : "Nuevo álbum"}
                </div>
                <form
                  className="mt-4 grid gap-4 sm:grid-cols-2"
                  onSubmit={albumForm.handleSubmit((v) => upsertAlbumMutation.mutate({ ...v, id: editingAlbum?.id }))}
                >
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Título</label>
                    <input
                      {...albumForm.register("title")}
                      onBlur={(e) => {
                        if (!albumForm.getValues("slug")) albumForm.setValue("slug", slugify(e.target.value), { shouldValidate: true });
                        albumForm.register("title").onBlur(e);
                      }}
                      className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Slug</label>
                    <input {...albumForm.register("slug")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Release date</label>
                    <input {...albumForm.register("release_date")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" placeholder="YYYY-MM-DD" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cover (URL)</label>
                    <input {...albumForm.register("cover_image_url")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <input type="checkbox" {...albumForm.register("is_published")} className="h-4 w-4 accent-primary" />
                    <span className="text-sm text-muted-foreground">Publicado</span>
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    {editingAlbum ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAlbum(null);
                          albumForm.reset({ title: "", slug: "", release_date: "", cover_image_url: "", is_published: false });
                        }}
                        className="h-10 rounded-md border border-border bg-background px-4 text-sm"
                      >
                        Cancelar
                      </button>
                    ) : null}
                    <button type="submit" className="h-10 rounded-md border border-border bg-background px-4 text-sm" disabled={upsertAlbumMutation.isPending}>
                      Guardar
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-card/50 overflow-hidden">
                <div className="overflow-auto">
                  <table className="min-w-[900px] w-full">
                    <thead className="border-b border-border bg-muted/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Título</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Slug</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Publicado</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(albums.data ?? []).map((a) => (
                        <tr key={a.id} className="border-b border-border/60">
                          <td className="px-4 py-3 text-sm text-foreground">{a.title}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{a.slug}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{a.is_published ? "SI" : "NO"}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                onClick={() => {
                                  setEditingAlbum(a);
                                  albumForm.reset({
                                    title: a.title,
                                    slug: a.slug,
                                    release_date: a.release_date ?? "",
                                    cover_image_url: a.cover_image_url ?? "",
                                    is_published: !!a.is_published,
                                  });
                                }}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                onClick={() => {
                                  const confirm = window.prompt(`Escribe ELIMINAR para borrar "${a.title}":`) ?? "";
                                  if (confirm !== "ELIMINAR") return;
                                  deleteAlbumMutation.mutate(a.id);
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {albums.isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            Cargando…
                          </td>
                        </tr>
                      ) : null}
                      {albums.isError ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-red-700">
                            {(albums.error as Error).message}
                          </td>
                        </tr>
                      ) : null}
                      {!albums.isLoading && (albums.data ?? []).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            No hay álbumes.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tracks">
              <div className="rounded-lg border border-border bg-card/50 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {editingTrack ? "Editar canción" : "Nueva canción"}
                </div>
                <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={trackForm.handleSubmit((v) => upsertTrackMutation.mutate({ ...v, id: editingTrack?.id }))}>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Título</label>
                    <input
                      {...trackForm.register("title")}
                      onBlur={(e) => {
                        if (!trackForm.getValues("slug")) trackForm.setValue("slug", slugify(e.target.value), { shouldValidate: true });
                        trackForm.register("title").onBlur(e);
                      }}
                      className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Slug</label>
                    <input {...trackForm.register("slug")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Álbum</label>
                    <select {...trackForm.register("album_id")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
                      <option value="">Sin álbum</option>
                      {albumOptions.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Duración (seg)</label>
                    <input {...trackForm.register("duration_seconds")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Audio (URL)</label>
                    <input {...trackForm.register("audio_url")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <input type="checkbox" {...trackForm.register("is_published")} className="h-4 w-4 accent-primary" />
                    <span className="text-sm text-muted-foreground">Publicado</span>
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    {editingTrack ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTrack(null);
                          trackForm.reset({ album_id: "", title: "", slug: "", duration_seconds: 0, audio_url: "", is_published: false });
                        }}
                        className="h-10 rounded-md border border-border bg-background px-4 text-sm"
                      >
                        Cancelar
                      </button>
                    ) : null}
                    <button type="submit" className="h-10 rounded-md border border-border bg-background px-4 text-sm" disabled={upsertTrackMutation.isPending}>
                      Guardar
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-card/50 overflow-hidden">
                <div className="overflow-auto">
                  <table className="min-w-[980px] w-full">
                    <thead className="border-b border-border bg-muted/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Título</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Slug</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Publicado</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(tracks.data ?? []).map((t) => (
                        <tr key={t.id} className="border-b border-border/60">
                          <td className="px-4 py-3 text-sm text-foreground">{t.title}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{t.slug}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{t.is_published ? "SI" : "NO"}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                onClick={() => {
                                  setEditingTrack(t);
                                  trackForm.reset({
                                    album_id: t.album_id ?? "",
                                    title: t.title,
                                    slug: t.slug,
                                    duration_seconds: t.duration_seconds ?? 0,
                                    audio_url: t.audio_url ?? "",
                                    is_published: !!t.is_published,
                                  });
                                }}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                onClick={() => {
                                  const confirm = window.prompt(`Escribe ELIMINAR para borrar "${t.title}":`) ?? "";
                                  if (confirm !== "ELIMINAR") return;
                                  deleteTrackMutation.mutate(t.id);
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {tracks.isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            Cargando…
                          </td>
                        </tr>
                      ) : null}
                      {tracks.isError ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-red-700">
                            {(tracks.error as Error).message}
                          </td>
                        </tr>
                      ) : null}
                      {!tracks.isLoading && (tracks.data ?? []).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            No hay canciones.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="rounded-lg border border-border bg-card/50 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {editingVideo ? "Editar video" : "Nuevo video"}
                </div>
                <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={videoForm.handleSubmit((v) => upsertVideoMutation.mutate({ ...v, id: editingVideo?.id }))}>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Título</label>
                    <input {...videoForm.register("title")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Video URL</label>
                    <input {...videoForm.register("video_url")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Platform</label>
                    <select {...videoForm.register("platform")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Thumb URL</label>
                    <input {...videoForm.register("thumbnail_url")} className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <input type="checkbox" {...videoForm.register("is_published")} className="h-4 w-4 accent-primary" />
                    <span className="text-sm text-muted-foreground">Publicado</span>
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    {editingVideo ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingVideo(null);
                          videoForm.reset({ title: "", video_url: "", thumbnail_url: "", platform: "youtube", is_published: false });
                        }}
                        className="h-10 rounded-md border border-border bg-background px-4 text-sm"
                      >
                        Cancelar
                      </button>
                    ) : null}
                    <button type="submit" className="h-10 rounded-md border border-border bg-background px-4 text-sm" disabled={upsertVideoMutation.isPending}>
                      Guardar
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-card/50 overflow-hidden">
                <div className="overflow-auto">
                  <table className="min-w-[980px] w-full">
                    <thead className="border-b border-border bg-muted/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Título</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Platform</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Publicado</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(videos.data ?? []).map((v) => (
                        <tr key={v.id} className="border-b border-border/60">
                          <td className="px-4 py-3 text-sm text-foreground">{v.title}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{v.platform}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{v.is_published ? "SI" : "NO"}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                onClick={() => {
                                  setEditingVideo(v);
                                  videoForm.reset({
                                    title: v.title,
                                    video_url: v.video_url,
                                    thumbnail_url: v.thumbnail_url ?? "",
                                    platform: v.platform,
                                    is_published: !!v.is_published,
                                  });
                                }}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                                onClick={() => {
                                  const confirm = window.prompt(`Escribe ELIMINAR para borrar "${v.title}":`) ?? "";
                                  if (confirm !== "ELIMINAR") return;
                                  deleteVideoMutation.mutate(v.id);
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {videos.isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            Cargando…
                          </td>
                        </tr>
                      ) : null}
                      {videos.isError ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-red-700">
                            {(videos.error as Error).message}
                          </td>
                        </tr>
                      ) : null}
                      {!videos.isLoading && (videos.data ?? []).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            No hay videos.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : null}
      </DashboardLayout>
    </RoleGate>
  );
};

export default ArtistContent;
