import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ArtistsPage from "@/pages/Artists";

describe("Artists catalog", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("filters by real-time search (artist name)", async () => {
    render(
      <MemoryRouter>
        <ArtistsPage />
      </MemoryRouter>,
    );

    const search = screen.getByLabelText("Buscar artistas");
    fireEvent.change(search, { target: { value: "ANA" } });

    expect(await screen.findByText("ANA DE ARMAS")).toBeInTheDocument();
  });

  it("search matches band name and genre", async () => {
    render(
      <MemoryRouter>
        <ArtistsPage />
      </MemoryRouter>,
    );

    const search = screen.getByLabelText("Buscar artistas");
    fireEvent.change(search, { target: { value: "CONZATTI" } });
    expect(await screen.findByText("SOFÍA RIVERA")).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "FUSIÓN" } });
    expect(await screen.findByText("DIEGO LUNA")).toBeInTheDocument();
  });

  it("applies cumulative band filters and keeps them when switching views", async () => {
    render(
      <MemoryRouter>
        <ArtistsPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /FILTRO BANDAS/i }));
    fireEvent.click(screen.getByLabelText("Filtrar por LA CONZATTI"));

    const search = screen.getByLabelText("Buscar artistas");
    fireEvent.change(search, { target: { value: "SOFÍA" } });

    expect(await screen.findByRole("heading", { name: "SOFÍA RIVERA" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ANA DE ARMAS" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "TABLA" }));
    const table = await screen.findByRole("table");
    expect(within(table).getByText("SOFÍA RIVERA")).toBeInTheDocument();
    expect(within(table).queryByText("ANA DE ARMAS")).not.toBeInTheDocument();
  });

  it("paginates results", async () => {
    render(
      <MemoryRouter>
        <ArtistsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/1\s*\/\s*\d+/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "→" }));
    expect(await screen.findByText(/2\s*\/\s*\d+/)).toBeInTheDocument();
  });
});
