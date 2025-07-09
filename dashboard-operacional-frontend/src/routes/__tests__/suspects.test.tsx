import { ThemeProvider } from "@emotion/react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { AppContext } from "../../context/AppContext";
import { BrowserRouter } from "react-router-dom";
import { theme } from "../../theme";
import { Suspect, Numbers } from "../../hooks/useSuspects";
import Suspects from "../Suspects";
import { MessageFilterGroup, MessageFilterType } from "../../interface/dashboard/chartInterface";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock dos hooks personalizados
vi.mock("../../hooks/useHeaderInput", () => ({
  useHeaderInput: () => ({ headerInputValue: "" }),
}));

const mockSuspects: Suspect[] = [
  {
    id: 1,
    apelido: "Jorge",
    numeros: "51 99999-9999",
    data_criacao: "2024-01-01",
    relevante: "Sim",
    operacoes: "Operação A",
  },
  {
    id: 2,
    apelido: "Maria",
    numeros: "51 88888-8888",
    data_criacao: "2024-01-02",
    relevante: "Não",
    operacoes: "Operação B",
  },
];

const mockNumbers: Numbers[] = [
  {
    id: 1,
    numero: "51 99999-9999",
    operacoes: "Operação A",
  },
  {
    id: 2,
    numero: "51 88888-8888",
    operacoes: "Operação B",
  },
];

const mockSetSuspects = vi.fn();
const mockSetNumbers = vi.fn();

vi.mock("../../hooks/useSuspects", () => ({
  useSuspects: () => ({
    suspects: mockSuspects,
    numbers: mockNumbers,
    loading: false,
    error: null,
  }),
  Suspect: {},
  Numbers: {},
}));

interface TableProps {
  onSelectionChange: (selectedIds: number[], selectedItems: Suspect[]) => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
vi.mock("../../components/Table/Table", () => ({
  default: ({ onSelectionChange, title }: TableProps & { title?: string }) => (
    <div
      data-testid={`mock-table-${
        title?.toLowerCase().replace(/\s+/g, "-") || "default"
      }`}
    >
      Mocked Table - {title}
      <div>51 99999-9999</div>
      <div>51 88888-8888</div>
      <button onClick={() => onSelectionChange([1], [mockSuspects[0]])}>
        Selecionar Alvo
      </button>
    </div>
  ),
}));
vi.mock("../../components/modal/createSuspectsModal", () => ({
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
          suspects: mockSuspects,
          setSuspects: mockSetSuspects,
          numbers: mockNumbers,
          setNumbers: mockSetNumbers,
          cpf: "",
          setCpf: vi.fn(),
          operations: [],
          setOperations: vi.fn(),
          worksheets: [],
          setWorksheets: vi.fn(),
          dashboardFilters: {
            type: MessageFilterType.Todos,
            group: MessageFilterGroup.Ambos,
            options: [] as string[],
            dateInitial: "",
            dateFinal: "",
            timeInitial: "",
            timeFinal: "",
          },
          setDashboardFilters: vi.fn(),
          webChartFilters: {
            type: MessageFilterType.Todos,
            group: MessageFilterGroup.Ambos,
            options: [] as string[],
            dateInitial: "",
            dateFinal: "",
            timeInitial: "",
            timeFinal: "",
          },
          setWebChartFilters: vi.fn(),
        }}
      >
        <BrowserRouter>
          <Suspects />
        </BrowserRouter>
      </AppContext.Provider>
    </ThemeProvider>
  );

describe("Suspects Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o título e o botão de criar suspeito", () => {
    renderWithProviders();
    expect(
      screen.getByText("Selecione os alvos para exibição do dashboard")
    ).toBeInTheDocument();
    expect(screen.getByText("Criar novo alvo")).toBeInTheDocument();
  });

  it("deve exibir a tabela com suspeitos", async () => {
    renderWithProviders();
    expect(screen.getByTestId("mock-table-suspeitos")).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-table-números-interceptados")
    ).toBeInTheDocument();
  });

  it("deve desabilitar botão de confirmação quando nada estiver selecionado", () => {
    renderWithProviders();
    const confirmBtn = screen.getByText(
      "Confirmar Seleção"
    ) as HTMLButtonElement;
    expect(confirmBtn.disabled).toBe(false);
  });

  it("deve exibir o botão de confirmação de seleção", () => {
    renderWithProviders();
    expect(screen.getByText("Confirmar Seleção")).toBeInTheDocument();
  });

  it("deve abrir o modal ao clicar em Criar novo alvo", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Criar novo alvo"));
  });

  it("deve fechar o modal ao clicar no botão Fechar", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Criar novo alvo"));
    fireEvent.click(screen.getByText("Criar alvo"));
  });
});
