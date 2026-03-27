import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders contact links and location", () => {
    render(<Footer />);

    const email = screen.getByRole("link", { name: /info@brassarmada\.com\.mx/i });
    expect(email).toHaveAttribute("href", "mailto:info@brassarmada.com.mx");

    const phone = screen.getByRole("link", { name: /3328110531/i });
    expect(phone).toHaveAttribute("href", "tel:+523328110531");

    const whatsapp = screen.getByRole("link", { name: /whatsapp brass armada/i });
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/523328110531");

    expect(screen.getByText("GUADALAJARA, JALISCO")).toBeInTheDocument();
  });
});
