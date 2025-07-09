import { ChartFilters } from "../interface/dashboard/chartInterface";

const formatDateToBR = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

export const createFiltersCSV = (filters: ChartFilters) => {
  const filterMapping = {
    Gráfico: filters.chart || "",
    "Data Final": formatDateToBR(filters.dateFinal),
    "Data Inicial": formatDateToBR(filters.dateInitial),
    "Tipo do Filtro": filters.filterType || "",
    Grupo: filters.group || "",
    "Hora Final": filters.timeFinal || "",
    "Hora Inicial": filters.timeInitial || "",
    Tipo: filters.type || "",
  };

  const headers = ["Filtro", "Valor"];
  const rows = Object.entries(filterMapping).map(
    ([key, value]) => `"${key}","${value}"`
  );

  const csvContent = [headers.join(","), ...rows].join("\n");
  return csvContent;
};

export const downloadFileAsync = (
  content: string | Blob,
  filename: string,
  type: string = "text/csv"
): Promise<void> => {
  return new Promise((resolve) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    setTimeout(resolve, 500);
  });
};
