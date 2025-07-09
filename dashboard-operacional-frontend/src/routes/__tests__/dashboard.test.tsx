import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../Dashboard";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
import { ApplicationProvider } from "../../context/AppContext";
import { MemoryRouter } from "react-router-dom";

class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}
(globalThis).ResizeObserver = ResizeObserver;

vi.mock("../../hooks/useContactMessages", () => ({
  useContactMessages: () => ({
    contactMessages: [{ key: "Contato A", value: 10 }],
    isLoading: false,
    error: null,
  }),
}));

vi.mock("../../hooks/usePeriodMessages", () => ({
  usePeriodMessages: () => ({
    periodMessages: [{ key: "08:00", value: 5 }],
    isLoading: false,
    error: null,
  }),
}));

vi.mock("../../hooks/useDayMessages", () => ({
  useDayMessages: () => ({
    messages: [{ key: "2023-01-01", value: 3 }],
    isLoading: false,
    error: null,
  }),
}));

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

vi.mock("../../components/multiSelect", () => ({
  default: ({
    selectedOptions,
    onChange,
  }: {
    selectedOptions: string[];
    onChange: (options: string[]) => void;
  }) => (
    <div data-testid="mock-multiselect" onClick={() => onChange(["FakeUser"])}>
      MockMultiSelect: {selectedOptions.join(", ")}
    </div>
  ),
}));

vi.mock("../../components/filters/ViewSelection", () => ({
  default: ({
    filters,
    selectedFilter,
    onChange,
  }: {
    filters: { value: string; label: string }[];
    selectedFilter: string;
    onChange: (value: string) => void;
  }) => (
    <div data-testid="mock-filter">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          style={{ fontWeight: selectedFilter === f.value ? "bold" : "normal" }}
        >
          {f.label}
        </button>
      ))}
    </div>
  ),
}));

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ApplicationProvider>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </ApplicationProvider>
    </MemoryRouter>
  );
};

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("deve renderizar o título 'Seleção de Alvos'", () => {
    renderWithTheme(<Dashboard />);
    expect(screen.getByText("Seleção de Alvos")).toBeInTheDocument();
  });

  it("deve renderizar os filtros de seleção", () => {
    renderWithTheme(<Dashboard />);
    expect(screen.getByText("Seleção de Gráficos")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por:")).toBeInTheDocument();
  });

  it("deve renderizar os gráficos por padrão (modo ALL)", () => {
    renderWithTheme(<Dashboard />);
    expect(screen.getByText("Mensagens por Contato")).toBeInTheDocument();
    expect(screen.getByText("Mensagens por IP")).toBeInTheDocument();
    expect(screen.getByText("Mensagens por Horário")).toBeInTheDocument();
    expect(screen.getByText("Mensagens por Dia")).toBeInTheDocument();
  });

  it("deve trocar o gráfico ao clicar em 'Mensagens por IP'", () => {
    renderWithTheme(<Dashboard />);
    const chart = screen.getByText("Mensagens por IP");
    fireEvent.click(chart);
    expect(screen.getByText("Mensagens por IP")).toBeInTheDocument();
  });

  it("deve alterar seleção no filtro de tipo (Texto, Vídeo, Todos)", () => {
    renderWithTheme(<Dashboard />);

    const tipoSelect = screen.getAllByRole("combobox")[1];
    fireEvent.mouseDown(tipoSelect);

    const listbox = screen.getByRole("listbox");
    const videoOption = within(listbox).getByText("Vídeo");
    fireEvent.click(videoOption);
    expect(screen.getAllByRole("combobox")[1]).toHaveTextContent("Vídeo");
  });

  it("deve alterar os nomes selecionados no MultiSelect", () => {
    renderWithTheme(<Dashboard />);
    const multiSelect = screen.getByTestId("mock-multiselect");
    fireEvent.click(multiSelect);
    expect(screen.getByText("MockMultiSelect: FakeUser")).toBeInTheDocument();
  });

  it("deve alterar o filtro de grupo para 'Número'", () => {
    renderWithTheme(<Dashboard />);
    const groupSelect = screen.getByRole("combobox", { name: /grupo/i });
    fireEvent.mouseDown(groupSelect);

    const listbox = screen.getByRole("listbox");
    const numberOption = within(listbox).getByText("Número");
    fireEvent.click(numberOption);

    expect(screen.getByRole("combobox", { name: /grupo/i })).toHaveTextContent("Número");
  });

  it("deve alterar a data inicial e final", () => {
    renderWithTheme(<Dashboard />);
    const initialDateInput = screen.getByLabelText("Data Inicial");
    const finalDateInput = screen.getByLabelText("Data Final");

    fireEvent.change(initialDateInput, { target: { value: "2023-01-01" } });
    fireEvent.change(finalDateInput, { target: { value: "2023-12-31" } });

    expect(initialDateInput).toHaveValue("2023-01-01");
    expect(finalDateInput).toHaveValue("2023-12-31");
  });

  it("deve alterar a faixa horária inicial e final", () => {
    renderWithTheme(<Dashboard />);
    const initialTimeInput = screen.getByLabelText(/Faixa Horária.*Início/i);
    const finalTimeInput = screen.getByLabelText(/Faixa Horária.*Fim/i);

    fireEvent.change(initialTimeInput, { target: { value: "08:00" } });
    fireEvent.change(finalTimeInput, { target: { value: "18:00" } });

    expect(initialTimeInput).toHaveValue("08:00");
    expect(finalTimeInput).toHaveValue("18:00");
  });

  it("deve selecionar o filtro de seleção IPs", () => {
    renderWithTheme(<Dashboard />);
    const ipFilterButton = screen.getByText("IPs");
    fireEvent.click(ipFilterButton);
    expect(ipFilterButton).toHaveStyle("font-weight: bold");
  });
});