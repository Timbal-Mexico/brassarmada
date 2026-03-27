import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StorePage from "@/pages/Store";

describe("Store page", () => {
  it("renders products and links out to Shopify", async () => {
    render(
      <MemoryRouter>
        <StorePage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "TIENDA" })).toBeInTheDocument();

    const link = screen.getAllByRole("link", { name: /Abrir en Shopify:/i })[0];
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("href")).toMatch(/^https:\/\/brassarmada\.myshopify\.com\/products\//);
  });
});
