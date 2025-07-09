import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  suspeitoId?: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

export interface Data {
  links: Link[];
  nodes: Node[];
}

interface WebChartInterface {
  data: Data;
}

const Chart: React.FC<WebChartInterface> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ display: boolean; value: number; x: number; y: number }>({
    display: false,
    value: 0,
    x: 0,
    y: 0
  });

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svgContainer = svgRef.current.parentElement;
    const width = svgContainer ? svgContainer.clientWidth : 928;
    const height = svgContainer ? svgContainer.clientHeight : 600;

    // TODO: unify colors
    const groupColorMap: Record<number, string> = {
      1: "#FFD700", // Manhã
      2: "#FFD700", // Tarde
      3: "#FFD700", // Noite
      4: "#D62727", // Alvos
      5: "#FFD700", // Madrugada
    };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "width: 100%; height: 100%; background-color: #1c1c1c")
      .attr("data-testid", "chart-svg");

    // Adicionar zoom
    const g = svg.append("g");
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
    );

    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({ ...d }));

    // Sort links by value to identify top 5 and next 10
    const sortedLinks = [...links].sort(
      (a, b) => (b.value || 0) - (a.value || 0)
    );
    const top10Values = new Set(
      sortedLinks.slice(0, 10).map((link) => link.value)
    );
    const next10Values = new Set(
      sortedLinks.slice(10, 20).map((link) => link.value)
    );

    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-2500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .force("collision", d3.forceCollide().radius(30));

    const link = g
      .append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll<SVGLineElement, Link>("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value))
      .attr("stroke", (d) => {
        if (links.length >= 15 && top10Values.has(d.value)) return "#FF4D4D"; // Red for top 10
        if (links.length >= 25 && next10Values.has(d.value)) return "#FFA000"; // Yellow for next 10
        return "#999"; // Default gray for the rest
      })
      .on("mouseover", (event, d) => {
        setTooltip({
          display: true,
          value: d.value,
          x: event.pageX,
          y: event.pageY,
        });
      })
      .on("mouseout", () => {
        setTooltip((prevState) => ({ ...prevState, display: false }));
      });

    const node = g
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .selectAll<SVGCircleElement, Node>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 15)
      .attr("fill", (d) => groupColorMap[d.group] || "#757575")
      .style("cursor", (d) =>
        d.group !== 6 && window.location.pathname === "/teia"
          ? "pointer"
          : "default"
      )
      .on("dblclick", (_event, d) => {
        if (d.group !== 6 && window.location.pathname === "/teia") {
          window.open(`/dashboard/detalhesSuspeito/${d.suspeitoId}`, "_blank");
        }
      });

    const nodeText = g
      .append("g")
      .selectAll<SVGTextElement, Node>("text")
      .data(nodes)
      .join("text")
      .text((d) => d.id)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dy", "-2em")
      .attr("font-size", "14px");

    node.call(
      d3
        .drag<SVGCircleElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    function ticked() {
      link
        .attr("x1", (d) => (d.source as Node).x || 0)
        .attr("y1", (d) => (d.source as Node).y || 0)
        .attr("x2", (d) => (d.target as Node).x || 0)
        .attr("y2", (d) => (d.target as Node).y || 0);

      node.attr("cx", (d) => d.x || 0).attr("cy", (d) => d.y || 0);

      nodeText.attr("x", (d) => d.x || 0).attr("y", (d) => d.y || 0);
    }

    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    simulation.on("tick", ticked);

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <>
      <svg ref={svgRef} />
      {tooltip.display && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px",
            borderRadius: "3px",
            pointerEvents: "none",
          }}
        >
          Value: {tooltip.value}
        </div>
      )}
    </>
  );
};

export default Chart;
