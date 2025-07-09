vi.mock("@mui/material/ButtonBase/TouchRipple", () => ({
  __esModule: true,
  default: () => null,
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContainerLogin from "../login/ContainerLogin/ContainerLogin";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ApplicationProvider } from "../../context/AppContext";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <ApplicationProvider>{children}</ApplicationProvider>
      </MemoryRouter>
    ),
  });
};

describe("ContainerLogin Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Deve renderizar o campo cpf + o botão de entrar", () => {
    renderWithRouter(<ContainerLogin />);
    expect(screen.getByPlaceholderText("000.000.000-00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("Deve formatar o cpf do usuário corretamente", async () => {
    renderWithRouter(<ContainerLogin />);
    const cpfInput = screen.getByPlaceholderText("000.000.000-00");
    await userEvent.type(cpfInput, "12345678901");
    await waitFor(() => {
      expect(cpfInput).toHaveValue("123.456.789-01");
    });
  });

  it("Deve salvar o cpf do usuário no localStorage corretamente", async () => {
    renderWithRouter(<ContainerLogin />);
    const cpfInput = screen.getByPlaceholderText("000.000.000-00");
    const button = screen.getByRole("button", { name: /entrar/i });

    await userEvent.clear(cpfInput);
    await userEvent.type(cpfInput, "38904573041");
    await userEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem("cpf")).toBe("389.045.730-41");
    });
  });

  it("Deve reagir ao clique do botão entrar", async () => {
    renderWithRouter(<ContainerLogin />);
    const button = screen.getByRole("button", { name: /entrar/i });

    await userEvent.click(button);
    expect(button).toBeEnabled();
  });
});
