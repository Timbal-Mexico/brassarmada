import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactPage from "@/pages/Contact";

describe("Contact page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("validates email and phone in real time and enables submit", async () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    );

    const phone = screen.getByLabelText("Teléfono");
    const email = screen.getByLabelText("Email");
    const submit = screen.getByRole("button", { name: /COMENZAR PROCESO/i });

    expect(submit).toBeDisabled();

    fireEvent.blur(phone);
    expect(await screen.findByText(/teléfono válido/i)).toBeInTheDocument();

    fireEvent.change(phone, { target: { value: "+52 33 3466 9630" } });
    fireEvent.change(email, { target: { value: "test@example.com" } });

    expect(submit).not.toBeDisabled();
  });
});

