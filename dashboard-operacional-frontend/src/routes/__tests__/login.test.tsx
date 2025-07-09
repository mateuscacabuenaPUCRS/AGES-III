import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import ContainerLogin from "../../components/login/ContainerLogin/ContainerLogin";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { ApplicationProvider } from "../../context/AppContext";

const renderLogin = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <ApplicationProvider>{children}</ApplicationProvider>
      </MemoryRouter>
    ),
  });
};

describe("ContainerLogin Component - Validação de CPF", () => {
  beforeEach(() => {
    localStorage.clear();
  });

it("deve renderizar o texto 'Dashboard Operacional'", () => {
    renderLogin(<Login />);
    const title = screen.getByText("Dashboard Operacional");
    expect(title).toBeInTheDocument();
  });

  it("deve renderizar o logo da polícia", () => {
    renderLogin(<Login />);
    const logo = screen.getByAltText("logo da policia");
    expect(logo).toBeInTheDocument();
  });

  it("deve aplicar a opacidade correta no background", () => {
    renderLogin(<Login />);
    const background = screen.getByTestId("background-image");
    expect(background).toHaveStyle({ opacity: 0.09 });
  });

  it("deve renderizar o logo com tamanhos responsivos", () => {
    renderLogin(<Login />);
    const logo = screen.getByAltText("logo da policia");
    expect(logo).toHaveStyle({
      width: {
        sm: "18rem",
        md: "21rem",
        lg: "25rem",
      },
      height: "auto",
    });
  });

  it("Deve exibir uma mensagem de erro quando o CPF for inválido", async () => {
    renderLogin(<ContainerLogin />);

    const cpfInput = screen.getByPlaceholderText("000.000.000-00");
    const button = screen.getByRole("button", { name: /entrar/i });

    await userEvent.type(cpfInput, "123.456.789-00");
    fireEvent.click(button);

    const errorMessage = await screen.findByText("CPF inválido. Verifique e tente novamente.");
    expect(errorMessage).toBeInTheDocument();
  });

  it("Não deve exibir uma mensagem de erro quando o CPF for válido", async () => {
    renderLogin(<ContainerLogin />);

    const cpfInput = screen.getByPlaceholderText("000.000.000-00");
    const button = screen.getByRole("button", { name: /entrar/i });
   
    await userEvent.type(cpfInput, "123.456.789-09");
    fireEvent.click(button);

    await waitFor(() => {
      const errorMessage = screen.queryByText("CPF inválido. Verifique e tente novamente.");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  it("Deve salvar o CPF no localStorage quando for válido", async () => {
    renderLogin(<ContainerLogin />);

    const cpfInput = screen.getByPlaceholderText("000.000.000-00");
    const button = screen.getByRole("button", { name: /entrar/i });

    await userEvent.type(cpfInput, "123.456.789-09");
    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem("cpf")).toBe("123.456.789-09");
    });
  });

  it("Deve exibir uma mensagem de erro se o login falhar", async () => {
    renderLogin(<ContainerLogin />);

    const cpfInput = screen.getByPlaceholderText("000.000.000-00");
    const button = screen.getByRole("button", { name: /entrar/i });

    await userEvent.type(cpfInput, "123.456.789-00");
    fireEvent.click(button);

    const errorMessage = await screen.findByText("CPF inválido. Verifique e tente novamente.");
    expect(errorMessage).toBeInTheDocument();
  });

  it("Deve permitir que o usuário digite e formate o CPF corretamente", async () => {
    renderLogin(<ContainerLogin />);

    const cpfInput = screen.getByPlaceholderText("000.000.000-00");
    await userEvent.type(cpfInput, "12345678901");

    expect(cpfInput).toHaveValue("123.456.789-01");
  });
});
