import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import { describe, it, expect, vi } from "vitest";
import EmailModal from "../modal/createEmailModal";

const mockOnClose = vi.fn();
const mockOnSubmit = vi.fn();

const renderEmailModal = (isOpen = true, initialData = null) => {
  render(
    <ThemeProvider theme={theme}>
      <EmailModal
        isOpen={isOpen}
        onClose={mockOnClose}
        onCreateEmail={mockOnSubmit}
        initialData={initialData}
      />
    </ThemeProvider>
  );
};

describe("EmailModal Component", () => {
  it('renderiza o placeholder "Digite o email"', () => {
    renderEmailModal();
    expect(screen.getByPlaceholderText("Digite o email")).toBeInTheDocument();
  });

  it("exibe erro se email for deixado em branco", async () => {
    renderEmailModal();
    fireEvent.click(screen.getByRole("button", { name: /adicionar email/i }));
    expect(await screen.findByText("Email é obrigatório")).toBeInTheDocument();
  });

  it("exibe erro se email for inválido", async () => {
    renderEmailModal();
    fireEvent.change(screen.getByPlaceholderText(/digite o email/i), {
      target: { value: "invalido" },
    });
    fireEvent.click(screen.getByRole("button", { name: /adicionar email/i }));
    expect(
      await screen.findByText("Formato de email inválido")
    ).toBeInTheDocument();
  });

  it("submete com email válido", async () => {
    renderEmailModal();
    fireEvent.change(screen.getByPlaceholderText(/digite o email/i), {
      target: { value: "teste@exemplo.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /adicionar email/i }));
    expect(
      await screen.findByDisplayValue("teste@exemplo.com")
    ).toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith({ email: "teste@exemplo.com" });
  });

  it("fecha o modal ao clicar no botão de fechar", () => {
    renderEmailModal();
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
