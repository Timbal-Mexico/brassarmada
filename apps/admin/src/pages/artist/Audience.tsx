import DashboardLayout from "@/components/DashboardLayout";
import { fetchMyArtist, listPlayEvents } from "@/lib/artistApi";
import { useProfile } from "@brassarmada/supabase";
import { RoleGate } from "@brassarmada/ui";
import { useQuery } from "@tanstack/react-query";
import { startOfDay, subDays } from "date-fns";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const lastDays = 30;

const ArtistAudience = () => {
  const profile = useProfile();
  const userId = profile.data?.id ?? null;

  const myArtist = useQuery({
    queryKey: ["artist-self", userId],
    enabled: !!userId,
    queryFn: async () => fetchMyArtist(userId ?? ""),
    staleTime: 10_000,
  });

  const artistId = myArtist.data?.id ?? null;
  const sinceISO = useMemo(() => subDays(startOfDay(new Date()), lastDays - 1).toISOString(), []);

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

  const topCountries = (() => {
    const counts = new Map<string, number>();
    for (const e of plays.data ?? []) {
      const c = (e.country ?? "").trim().toUpperCase() || "DESCONOCIDO";
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([country, plays]) => ({ country, plays }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 12);
  })();

  return (
    <RoleGate roles={["artista"]}>
      <DashboardLayout>
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Panel</div>
          <h1 className="mt-2 text-3xl font-display font-bold text-foreground">Audiencia</h1>
          <div className="mt-2 text-sm text-muted-foreground">{myArtist.data?.stage_name ?? ""}</div>
        </div>

        {!gate.ok ? gate.node : null}

        {gate.ok ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-lg border border-border bg-card/50 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Top países (30d)</div>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCountries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="plays" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {plays.isError ? (
                <div className="mt-4 text-sm text-red-700">Error: {(plays.error as Error).message}</div>
              ) : null}
              {topCountries.length === 0 && !plays.isLoading ? (
                <div className="mt-4 text-sm text-muted-foreground">Aún no hay reproducciones con datos de país.</div>
              ) : null}
            </div>

            <div className="lg:col-span-5 rounded-lg border border-border bg-card/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/20">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Detalle</div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-[520px] w-full">
                  <thead className="border-b border-border bg-muted/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">País</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Plays</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCountries.map((r) => (
                      <tr key={r.country} className="border-b border-border/60">
                        <td className="px-4 py-3 text-sm text-foreground">{r.country}</td>
                        <td className="px-4 py-3 text-right text-sm text-foreground">{r.plays}</td>
                      </tr>
                    ))}
                    {plays.isLoading ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-10 text-center text-sm text-muted-foreground">
                          Cargando…
                        </td>
                      </tr>
                    ) : null}
                    {!plays.isLoading && topCountries.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-10 text-center text-sm text-muted-foreground">
                          Sin datos
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </DashboardLayout>
    </RoleGate>
  );
};

export default ArtistAudience;
