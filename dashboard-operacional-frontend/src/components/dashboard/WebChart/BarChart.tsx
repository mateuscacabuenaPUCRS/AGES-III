import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import { textStyles } from "../../../theme/typography";

export interface BarChartData {
  key: string;
  value: number;
}

export interface BarChartGenericProps {
  data: BarChartData[];
  title: string;
  subtitle: string;
  tooltipLabel?: string;
  expanded?: boolean;
}

function getTickValues(min: number, max: number, count: number) {
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(min + i * step));
}

const CustomTooltip = ({ active, payload, label, tooltipLabel }: any) => {
  if (active && payload && payload.length) {
    const color = payload[0].payload.fill;
    return (
      <Box
        sx={{
          bgcolor: color,
          color: "#fff",
          borderRadius: "0.5rem",
          px: "1rem",
          py: "0.5rem",
          fontWeight: 600,
          fontSize: "1rem",
          boxShadow: 2,
          minWidth: "5rem",
          textAlign: "center",
        }}
      >
        <div>{(tooltipLabel || "Contato") + ": " + label}</div>
        <div>{"Total"}: {payload[0].value}</div>
      </Box>
    );
  }
  return null;
};

const BarChartGeneric: React.FC<BarChartGenericProps> = ({
  data,
  title,
  subtitle,
  tooltipLabel,
  expanded = false,
}) => {
  const theme = useTheme();
  const chartData = data.map((data, idx) => ({
    name: data.key,
    value: data.value,
    fill: [
      theme.palette.chart.darkBrown,
      theme.palette.chart.goldenYellow,
      theme.palette.chart.oliveBrown,
      theme.palette.chart.lightBeige,
    ][idx % 4],
  }));

  // Calcular ticks do eixo Y
  const minY = 0;
  const maxY = Math.max(...data.map((item) => item.value)) * 1.2; // Aumentar o valor máximo em 20% para dar espaço
  const tickCount = expanded ? 5 : 3;
  const yTicks = getTickValues(minY, maxY, tickCount);

  return (
    <Paper
      sx={{
        width: "100%",
        height: { xs: "300px", sm: expanded ? "450px" : "400px", md: expanded ? "500px" : "550px" },
        p: { xs: 2, sm: 3 },
        borderRadius: "1.5rem",
        boxShadow: "0 0.25rem 1rem rgba(0,0,0,0.1)",
        backgroundColor: "#F8F8F8",
        fontFamily: theme.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          color: theme.palette.customText.lightGrey,
          ...textStyles.titleMedium,
          mb: 0,
          mt: 1,
          ml: 1,
        }}
      >
        {subtitle}
      </Typography>
      <Typography
        sx={{
          color: theme.palette.customText.black,
          ...textStyles.titleLarge,
          mt: -0.5,
          ml: 1,
          mb: 2,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowX: "auto",
          // scrollbarWidth: "thin", // Firefox
          scrollbarColor: (theme) => `${theme.palette.customButton.gold} transparent`, // Firefox
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: (theme) => theme.palette.customButton.gold,
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Box sx={{ minWidth: `${data.length * 50}px`, height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, bottom: 5, left: 5, right: 5 }}>
              <XAxis
                dataKey="name"
                height={100}
                angle={-45}
                interval={0}
                textAnchor="end"
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <title>{payload.value}</title> {/* Tooltip nativo SVG */}
                    <text
                      x={0}
                      y={10}
                      transform="rotate(-45)"
                      textAnchor="end"
                      fill={theme.palette.customText.lightGrey}
                      style={textStyles.bodyMedium as React.CSSProperties}
                    >
                      {payload.value.length > 20
                        ? `${payload.value.slice(0, 6)}…${payload.value.slice(-4)}`
                        : payload.value}
                    </text>
                  </g>
                )}
              />
              <YAxis
                tick={{ fill: theme.palette.customText.lightGrey, ...textStyles.bodyMedium }}
                ticks={yTicks}
                domain={[minY, maxY]}
              />
              {yTicks.map((y) => (
                y !== 0 && (
                  <ReferenceLine
                    key={"refline-" + y}
                    y={y}
                    stroke={theme.palette.customInput.lightGrey}
                    strokeDasharray="6 4"
                    strokeWidth={1}
                    ifOverflow="extendDomain"
                  />
                )
              ))}
              <Tooltip content={({ active, payload, label }) => (
                <CustomTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  tooltipLabel={tooltipLabel}
                />
              )} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper >
  );
};

export default BarChartGeneric;
