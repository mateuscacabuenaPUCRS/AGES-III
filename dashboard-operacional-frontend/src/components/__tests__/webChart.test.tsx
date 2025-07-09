import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Chart from "../dashboard/WebChart/WebChart";

describe("Chart Component", () => {
  const mockData = {
    nodes: [
      { id: "1", group: 0 },
      { id: "2", group: 1 },
      { id: "3", group: 2 },
    ],
    links: [
      { source: "1", target: "2", value: 100 },
      { source: "2", target: "3", value: 600 },
    ],
  };

  it("renderiza o gráfico com os dados fornecidos", () => {
    render(<Chart data={mockData} />);
    const svg = screen.getByTestId("chart-svg");
    expect(svg).toBeInTheDocument();
  });

  it("renderiza os nós com os textos corretos", () => {
    render(<Chart data={mockData} />);
    mockData.nodes.forEach((node) => {
      expect(screen.getByText(node.id)).toBeInTheDocument();
    });
  });

  it("abre nova janela ao dar duplo clique em um nó", () => {
    const windowSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<Chart data={mockData} />);

    const node = screen.getByText("1").closest("circle");
    if (node) {
      fireEvent.dblClick(node);
      expect(windowSpy).toHaveBeenCalledWith("/node/1", "_blank");
    }

    windowSpy.mockRestore();
  });
});
