import { vi } from "vitest";

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");

  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-responsive">{children}</div>
    ),
  };
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { ThemeProvider } from "@mui/material/styles";
import BarChartGeneric, { BarChartData } from "../dashboard/WebChart/BarChart";
import theme from "../../utils/theme";

beforeAll(() => {
  // Impede erro de gráfico com width/height zero
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    value: 500,
  });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    value: 300,
  });

  // Necessário para evitar crash com ResizeObserver
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("BarChartGeneric Component", () => {
  const sampleData: BarChartData[] = [
    { key: "A", value: 10 },
    { key: "B", value: 20 },
    { key: "C", value: 30 },
  ];

  it("deve renderizar os títulos corretamente", () => {
    renderWithTheme(
      <BarChartGeneric
        data={sampleData}
        title="Gráfico de Teste"
        subtitle="Valores Teste"
      />
    );

    expect(screen.getByText("Gráfico de Teste")).toBeInTheDocument();
    expect(screen.getByText("Valores Teste")).toBeInTheDocument();
  });

  it("deve renderizar corretamente o container do gráfico", () => {
    renderWithTheme(
      <BarChartGeneric data={sampleData} title="Teste" subtitle="Sub" />
    );

    expect(screen.getByTestId("mock-responsive")).toBeInTheDocument();
  });

  it("deve expandir corretamente com a prop expanded", () => {
    renderWithTheme(
      <BarChartGeneric
        data={sampleData}
        title="Expandido"
        subtitle="Teste"
        expanded
      />
    );

    expect(screen.getByText("Expandido")).toBeInTheDocument();
  });

  it("deve exibir o tooltip personalizado se ativo", () => {
    renderWithTheme(
      <BarChartGeneric
        data={sampleData}
        title="Tooltip"
        subtitle="Simulado"
        tooltipLabel="Total"
      />
    );

    expect(screen.getByText("Tooltip")).toBeInTheDocument();
  });
});
