import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ArtistsPage from "@/pages/Artists";
import ArtistProfile from "@/pages/ArtistProfile";
import ArtistAdmin from "@/pages/ArtistAdmin";

const renderWithRoutes = (initialEntry: string) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/artistas" element={<ArtistsPage />} />
        <Route path="/artistas/:slug" element={<ArtistProfile />} />
        <Route path="/panel/artistas/:slug" element={<ArtistAdmin />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("Artist profile", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders profile sections and opens hiring modal", async () => {
    renderWithRoutes("/artistas/ana-de-armas");

    expect(await screen.findByRole("heading", { name: "ANA DE ARMAS" })).toBeInTheDocument();
    expect(screen.getByText("TRAYECTORIA")).toBeInTheDocument();
    expect(screen.getByText("TIMELINE")).toBeInTheDocument();
    expect(screen.getByText("INSTRUMENTOS")).toBeInTheDocument();
    expect(screen.getByText("DISPONIBILIDAD")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "CONTRATAR" }));
    expect(await screen.findByText(/CONTRATACIÓN/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Solicitar Cotización/i })).toBeInTheDocument();
  });

  it("admin changes persist (localStorage override simulation)", async () => {
    const admin = renderWithRoutes("/panel/artistas/ana-de-armas");

    const bio = await screen.findByLabelText("Bio");
    fireEvent.change(bio, { target: { value: "BIO NUEVA" } });
    fireEvent.click(screen.getByRole("button", { name: "GUARDAR" }));
    expect(await screen.findByText(/Cambios guardados/i)).toBeInTheDocument();

    admin.unmount();

    const profile = renderWithRoutes("/artistas/ana-de-armas");
    expect(await screen.findByText("BIO NUEVA")).toBeInTheDocument();
    profile.unmount();
  });
});
