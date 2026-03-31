import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/components/DashboardLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@brassarmada/ui", () => ({
  RoleGate: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@brassarmada/supabase", () => ({
  useProfile: () => ({ data: { id: "u1", email: "artist@test.com", full_name: "ARTIST" } }),
}));

const artistApi = vi.hoisted(() => ({
  fetchMyArtist: vi.fn(),
  listAlbums: vi.fn(),
  listTracks: vi.fn(),
  listVideos: vi.fn(),
  upsertAlbum: vi.fn(),
  upsertTrack: vi.fn(),
  upsertVideo: vi.fn(),
  deleteAlbum: vi.fn(),
  deleteTrack: vi.fn(),
  deleteVideo: vi.fn(),
  listPlayEvents: vi.fn(),
  listRevenueEvents: vi.fn(),
  createRevenueEvent: vi.fn(),
}));

vi.mock("@/lib/artistApi", () => artistApi);

import ArtistContent from "@/pages/artist/Content";
import ArtistStats from "@/pages/artist/Stats";
import ArtistMonetization from "@/pages/artist/Monetization";

const renderWithQuery = (ui: ReactElement) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("artist panel", () => {
  it("shows CTA when artist profile is missing", async () => {
    artistApi.fetchMyArtist.mockResolvedValueOnce(null);
    renderWithQuery(<ArtistContent />);
    expect(await screen.findByText("Primero crea tu perfil de artista.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir a Mi Perfil" })).toBeInTheDocument();
  });

  it("renders content tabs when artist profile exists", async () => {
    artistApi.fetchMyArtist.mockResolvedValueOnce({ id: "a1", stage_name: "TEST", slug: "test", is_active: true });
    artistApi.listAlbums.mockResolvedValueOnce([]);
    artistApi.listTracks.mockResolvedValueOnce([]);
    artistApi.listVideos.mockResolvedValueOnce([]);
    renderWithQuery(<ArtistContent />);
    expect(await screen.findByText("Gestión de Contenido")).toBeInTheDocument();
    expect(await screen.findByRole("tab", { name: "Álbumes" })).toBeInTheDocument();
    expect(await screen.findByRole("tab", { name: "Canciones" })).toBeInTheDocument();
    expect(await screen.findByRole("tab", { name: "Videos" })).toBeInTheDocument();
  });

  it("renders stats summary with events", async () => {
    artistApi.fetchMyArtist.mockResolvedValueOnce({ id: "a1", stage_name: "TEST", slug: "test", is_active: true });
    artistApi.listTracks.mockResolvedValueOnce([{ id: "t1", title: "Track 1" }]);
    artistApi.listVideos.mockResolvedValueOnce([{ id: "v1", title: "Video 1" }]);
    const now = new Date().toISOString();
    artistApi.listPlayEvents.mockResolvedValueOnce([
      { id: "p1", artist_id: "a1", content_type: "track", content_id: "t1", played_at: now, country: "MX", platform: "web" },
      { id: "p2", artist_id: "a1", content_type: "video", content_id: "v1", played_at: now, country: "MX", platform: "web" },
    ]);
    renderWithQuery(<ArtistStats />);
    expect(await screen.findByText("Estadísticas")).toBeInTheDocument();
    const label = await screen.findByText("Reproducciones (30d)");
    await waitFor(() => expect(label.parentElement?.textContent).toContain("2"));
  });

  it("renders monetization totals with revenue events", async () => {
    artistApi.fetchMyArtist.mockResolvedValueOnce({ id: "a1", stage_name: "TEST", slug: "test", is_active: true });
    const now = new Date().toISOString();
    artistApi.listRevenueEvents.mockResolvedValueOnce([
      { id: "r1", artist_id: "a1", source: "streaming", amount_cents: 12300, currency: "MXN", occurred_at: now, note: null },
    ]);
    renderWithQuery(<ArtistMonetization />);
    expect(await screen.findByText("Monetización")).toBeInTheDocument();
    const matches = await screen.findAllByText(/\$123/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
