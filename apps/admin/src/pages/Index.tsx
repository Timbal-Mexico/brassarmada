import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import EarningsChart from "@/components/dashboard/EarningsChart";
import UpcomingGigs from "@/components/dashboard/UpcomingGigs";
import ClientChat from "@/components/dashboard/ClientChat";
import BannerCTA from "@/components/dashboard/BannerCTA";
import { Circle } from "lucide-react";
import { usePermissions } from "@brassarmada/ui";
import { supabase, useProfile } from "@brassarmada/supabase";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

type MyArtistRow = {
  id: string;
  stage_name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type BandIdRow = { band_id: string };

const Index = () => {
  const { role } = usePermissions();
  const profile = useProfile();

  const myArtist = useQuery<MyArtistRow | null>({
    queryKey: ["my-artist", profile.data?.id ?? null],
    enabled: role === "artista" && !!profile.data?.id,
    queryFn: async () => {
      const res = await supabase
        .from("artists")
        .select("id,stage_name,slug,is_active,created_at,updated_at")
        .eq("user_id", profile.data?.id ?? "")
        .maybeSingle();
      if (res.error) return null;
      return (res.data as MyArtistRow | null) ?? null;
    },
    staleTime: 10_000,
  });

  const bandsCount = useQuery<number>({
    queryKey: ["my-bands-count", myArtist.data?.id ?? null, profile.data?.id ?? null],
    enabled: role === "artista" && !!myArtist.data?.id,
    queryFn: async () => {
      const artistId = myArtist.data?.id ?? null;
      const membersPromise = artistId
        ? (supabase.from("band_members").select("band_id").eq("artist_id", artistId) as unknown as Promise<{
            data: BandIdRow[] | null;
            error: { message: string } | null;
          }>)
        : Promise.resolve({ data: [] as BandIdRow[], error: null });
      const [members] = await Promise.all([membersPromise]);
      const set = new Set<string>();
      for (const row of members.data ?? []) set.add(String(row.band_id));
      return set.size;
    },
    staleTime: 10_000,
  });

  if (role === "artista") {
    const status = myArtist.data ? (myArtist.data.is_active ? "ACTIVO" : "INACTIVO") : "SIN PERFIL";
    return (
      <DashboardLayout>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1">Dashboard</p>
            <h1 className="text-4xl font-display font-bold text-foreground">Artista</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {profile.data?.full_name ?? profile.data?.email ?? ""}
            </p>
          </div>
          <div className="glass-card px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estado del Perfil</p>
            <div className="flex items-center gap-2">
              <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
              <span className="text-sm font-semibold text-foreground">{status}</span>
            </div>
          </div>
        </div>

        {!myArtist.data && !myArtist.isLoading ? (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Acción requerida</div>
            <div className="mt-2 text-sm text-foreground">Crea tu perfil de artista para que el admin lo pueda revisar.</div>
            <div className="mt-4">
              <Link
                to="/profile"
                className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm"
              >
                Ir a Mi Perfil
              </Link>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Perfil</div>
            <div className="mt-2 text-sm text-foreground">{myArtist.data?.stage_name ?? "—"}</div>
            <div className="mt-4">
              <Link to="/profile" className="text-sm text-primary hover:opacity-70 transition-opacity">
                Editar
              </Link>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Bandas</div>
            <div className="mt-2 text-3xl font-display font-bold text-foreground">{bandsCount.data ?? 0}</div>
            <div className="mt-4">
              <Link to="/bands" className="text-sm text-primary hover:opacity-70 transition-opacity">
                Ver bandas
              </Link>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Publicación</div>
            <div className="mt-2 text-sm text-foreground">
              {myArtist.data?.slug ? `Slug: ${myArtist.data.slug}` : "—"}
            </div>
            <div className="mt-4">
              <Link to="/artistas" className="text-sm text-primary hover:opacity-70 transition-opacity">
                Ver estado en Admin
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1">
            Centro de Comando del Artista
          </p>
          <h1 className="text-4xl font-display font-bold text-foreground">The Pulse</h1>
        </div>
        <div className="glass-card px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estado en Vivo</p>
          <div className="flex items-center gap-2">
            <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
            <span className="text-sm font-semibold text-foreground">De Gira</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <EarningsChart />
          <UpcomingGigs />
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          <StatsCards />
          <ClientChat />
        </div>
      </div>

      <BannerCTA />
    </DashboardLayout>
  );
};

export default Index;
