import DashboardLayout from "@/components/DashboardLayout";
import { fetchMyArtist, listPlayEvents, listTracks, listVideos } from "@/lib/artistApi";
import type { ArtistPlayEvent } from "@/lib/artistApi";
import { useProfile } from "@brassarmada/supabase";
import { RoleGate } from "@brassarmada/ui";
import { useQuery } from "@tanstack/react-query";
import { addDays, format, startOfDay, subDays } from "date-fns";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const lastDays = 30;

const ArtistStats = () => {
  const profile = useProfile();
  const userId = profile.data?.id ?? null;

  const myArtist = useQuery({
    queryKey: ["artist-self", userId],
    enabled: !!userId,
    queryFn: async () => fetchMyArtist(userId ?? ""),
    staleTime: 10_000,
  });

  const artistId = myArtist.data?.id ?? null;
  const since = useMemo(() => subDays(startOfDay(new Date()), lastDays - 1), []);
  const sinceISO = useMemo(() => since.toISOString(), [since]);

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

  const plays = useQuery({
    queryKey: ["artist-plays", artistId, sinceISO],
    enabled: !!artistId,
    queryFn: async () => listPlayEvents(artistId ?? "", sinceISO),
    staleTime: 10_000,
  });

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

  const events: ArtistPlayEvent[] = plays.data ?? [];
  const dayKey = (d: Date) => format(d, "yyyy-MM-dd");

  const series = (() => {
    const map = new Map<string, { day: string; tracks: number; videos: number; total: number }>();
    for (let i = 0; i < lastDays; i++) {
      const d = addDays(startOfDay(since), i);
      const key = dayKey(d);
      map.set(key, { day: format(d, "MM/dd"), tracks: 0, videos: 0, total: 0 });
    }
    for (const e of events) {
      const d = startOfDay(new Date(e.played_at));
      const key = dayKey(d);
      const row = map.get(key);
      if (!row) continue;
      if (e.content_type === "track") row.tracks += 1;
      if (e.content_type === "video") row.videos += 1;
      row.total += 1;
    }
    return Array.from(map.values());
  })();

  const totals = (() => {
    const total = events.length;
    const trackPlays = events.filter((e) => e.content_type === "track").length;
    const videoPlays = events.filter((e) => e.content_type === "video").length;
    return { total, trackPlays, videoPlays };
  })();

  const topContent = (() => {
    const trackTitleById = new Map((tracks.data ?? []).map((t) => [t.id, t.title] as const));
    const videoTitleById = new Map((videos.data ?? []).map((v) => [v.id, v.title] as const));
    const counter = new Map<string, { label: string; count: number }>();

    for (const e of events) {
      const id = e.content_id ?? "";
      if (!id) continue;
      const key = `${e.content_type}:${id}`;
      const label =
        e.content_type === "track"
          ? trackTitleById.get(id) ?? "Track"
          : videoTitleById.get(id) ?? "Video";
      const existing = counter.get(key);
      if (existing) existing.count += 1;
      else counter.set(key, { label, count: 1 });
    }

    return Array.from(counter.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  })();

  return (
    <RoleGate roles={["artista"]}>
      <DashboardLayout>
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Panel</div>
          <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Estadísticas</h1>
          <div className="mt-2 text-sm text-muted-foreground">{myArtist.data?.stage_name ?? ""}</div>
        </div>

        {!gate.ok ? gate.node : null}

        {gate.ok ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reproducciones (30d)</div>
                <div className="mt-2 text-3xl font-display font-bold text-foreground">{totals.total}</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tracks (30d)</div>
                <div className="mt-2 text-3xl font-display font-bold text-foreground">{totals.trackPlays}</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Videos (30d)</div>
                <div className="mt-2 text-3xl font-display font-bold text-foreground">{totals.videoPlays}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8 rounded-lg border border-border bg-card/50 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Reproducciones por día</div>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="tracks" stroke="hsl(var(--chart-2, 210 80% 55%))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="videos" stroke="hsl(var(--chart-3, 140 65% 45%))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {plays.isError ? (
                  <div className="mt-4 text-sm text-red-700">Error: {(plays.error as Error).message}</div>
                ) : null}
              </div>

              <div className="lg:col-span-4 rounded-lg border border-border bg-card/50 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Top contenido (30d)</div>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topContent}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" hide />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {(topContent.length === 0 && !plays.isLoading) ? (
                  <div className="mt-4 text-sm text-muted-foreground">Aún no hay reproducciones.</div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </DashboardLayout>
    </RoleGate>
  );
};

export default ArtistStats;
