import { ThemeProvider } from "@emotion/react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppContext } from "../../context/AppContext";
import { BrowserRouter } from "react-router-dom";
import { theme } from "../../theme";
import Operations from "../Operations";
import { Operation } from "../../hooks/useOperations";
import { MessageFilterGroup, MessageFilterType } from "../../interface/dashboard/chartInterface";

// Mocks dos hooks personalizados
vi.mock("../../hooks/useHeaderInput", () => ({
  useHeaderInput: () => ({ headerInputValue: "" }),
}));

const mockOperations: Operation[] = [
  { id: 1, nome: "Operação Alfa", data_criacao: "2024-01-01", qtdAlvos: 3 },
  { id: 2, nome: "Operação Beta", data_criacao: "2024-01-02", qtdAlvos: 5 },
];

const mockSetOperations = vi.fn();

vi.mock("../../hooks/useOperations", () => ({
  useOperations: () => ({
    filteredOperations: mockOperations,
    loading: false,
    error: false,
    createOperation: vi.fn(),
  }),
}));

interface TableProps {
  onSelectionChange: (
    selectedIds: number[],
    selectedItems: Operation[]
  ) => void;
}

vi.mock("../../components/operationSuspectTable/table", () => ({
  default: ({ onSelectionChange }: TableProps) => (
    <div data-testid="mock-table">
      Mocked Table
      <button onClick={() => onSelectionChange([1], [mockOperations[0]])}>
        Selecionar Operação
      </button>
    </div>
  ),
}));

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

vi.mock("../../components/modal/createOperationModal", () => ({
  default: ({ isOpen, onClose }: ModalProps) =>
    isOpen ? (
      <div data-testid="mock-modal">
        Modal Aberto
        <button onClick={onClose}>Fechar</button>
      </div>
    ) : null,
}));

const renderWithProviders = () =>
  render(
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          operations: [],
          setOperations: mockSetOperations,
          cpf: "",
          setCpf: () => {},
          suspects: [],
          setSuspects: () => {},
          numbers: [],
          setNumbers: () => {},
          worksheets: [],
          setWorksheets: () => {},
          dashboardFilters: {
            type: MessageFilterType.Todos,
            group: MessageFilterGroup.Ambos,
            options: [] as string[],
            dateInitial: "",
            dateFinal: "",
            timeInitial: "",
            timeFinal: "",
          },
          setDashboardFilters: () => {},
          webChartFilters: {
            type: MessageFilterType.Todos,
            group: MessageFilterGroup.Ambos,
            options: [] as string[],
            dateInitial: "",
            dateFinal: "",
            timeInitial: "",
            timeFinal: "",
          },
          setWebChartFilters: () => {},
        }}
      >
        <BrowserRouter>
          <Operations />
        </BrowserRouter>
      </AppContext.Provider>
    </ThemeProvider>
  );

describe("Operation Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o título e o botão de criar operação", () => {
    renderWithProviders();
    expect(
      screen.getByText("Selecione uma operação para iniciar a investigação")
    ).toBeInTheDocument();
    expect(screen.getByText("Criar nova operação")).toBeInTheDocument();
  });

  it("deve exibir a tabela com operações", () => {
    renderWithProviders();
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
  });

  it("deve exibir o botão de confirmação de seleção", () => {
    renderWithProviders();
    expect(screen.getByText("Confirmar Seleção")).toBeInTheDocument();
  });

  it("deve habilitar o botão de confirmação ao selecionar uma operação", async () => {
    renderWithProviders();
    const confirmBtn = screen.getByText(
      "Confirmar Seleção"
    ) as HTMLButtonElement;
    expect(confirmBtn.disabled).toBe(true);
    fireEvent.click(screen.getByText("Selecionar Operação"));
    await waitFor(() => {
      expect(confirmBtn.disabled).toBe(false);
    });
  });

  it("deve desabilitar botão de confirmação quando nada estiver selecionado", () => {
    renderWithProviders();
    const confirmBtn = screen.getByText(
      "Confirmar Seleção"
    ) as HTMLButtonElement;
    expect(confirmBtn.disabled).toBe(true);
  });

  it("deve abrir o modal ao clicar em Criar nova operação", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Criar nova operação"));
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão Fechar", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Criar nova operação"));
    fireEvent.click(screen.getByText("Fechar"));
    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });
});
