import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SuspectsDetails from "../suspectDetails";
import { ApplicationProvider } from "../../context/AppContext";
import { MemoryRouter } from "react-router-dom";

const mockUseSuspectInfo = vi.fn();

vi.mock("../../hooks/useSuspectInfo", () => ({
  useSuspectInfo: (id: number) => mockUseSuspectInfo(id),
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ApplicationProvider>{ui}</ApplicationProvider>
    </MemoryRouter>
  );
};

describe("SuspectsDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSuspectInfo.mockReturnValue({
      suspect: {
        id: 1,
        apelido: "Apelido Mockado",
        nome: "Nome Mockado",
        cpf: "12345678901",
        relevante: true,
        anotacoes: "Anotações Mockadas",
        ips: [
          { ip: "192.168.0.1", ocorrencias: 5 },
          { ip: "192.168.0.2", ocorrencias: 3 },
        ],
        celulares: [
          {
            numero: "51 99999-9999",
            lastUpdateDate: "2024-01-01",
            lastUpdateCpf: "123.456.789-00",
          },
        ],
        emails: [
          {
            email: "mockado@email.com",
            lastUpdateDate: "2024-01-01",
            lastUpdateCpf: "123.456.789-00",
          },
        ],
      },
      loading: false,
      error: null,
    });
  });

  it("Deve exibir o estado de carregamento corretamente", async () => {
    mockUseSuspectInfo.mockReturnValue({
      suspect: null,
      loading: true,
      error: null,
    });

    renderWithProvider(<SuspectsDetails />);
  });

  it("Deve exibir uma mensagem de erro quando ocorrer um erro", async () => {
    mockUseSuspectInfo.mockReturnValue({
      suspect: null,
      loading: false,
      error: "Erro ao carregar informações do suspeito",
    });

    renderWithProvider(<SuspectsDetails />);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao carregar informações do suspeito")
      ).toBeInTheDocument();
    });
  });

  it("Deve permitir a edição do campo de anotações", async () => {
    renderWithProvider(<SuspectsDetails />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Anotações Mockadas")
      ).toBeInTheDocument();
    });

    const notesField = screen.getByDisplayValue("Anotações Mockadas");
    fireEvent.change(notesField, { target: { value: "Novas Anotações" } });

    expect(notesField).toHaveValue("Novas Anotações");
  });

  it("Deve renderizar as tabelas de IPs, celulares e emails corretamente", async () => {
    renderWithProvider(<SuspectsDetails />);

    await waitFor(() => {
      expect(screen.getByText("Informações do Suspeito")).toBeInTheDocument();
    });

    expect(screen.getByText("IPs")).toBeInTheDocument();
    expect(screen.getByText("192.168.0.1")).toBeInTheDocument();
    expect(screen.getByText("192.168.0.2")).toBeInTheDocument();

    expect(screen.getByText("Celulares")).toBeInTheDocument();
    expect(screen.getByText("51 99999-9999")).toBeInTheDocument();

    expect(screen.getByText("Emails")).toBeInTheDocument();
    expect(screen.getByText("mockado@email.com")).toBeInTheDocument();
  });
});
