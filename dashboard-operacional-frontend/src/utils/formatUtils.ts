/**
 * Normaliza uma string removendo acentos e convertendo para minúsculas
 * @param str String a ser normalizada
 * @returns String normalizada sem acentos e em minúsculas
 */
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const formatDate = (rawDate: string): string => {
  if (!rawDate) return "N/A";

  const iso = rawDate.replace(" ", "T").split(".")[0] + "Z";
  const date = new Date(iso);

  if (isNaN(date.getTime())) return "Data inválida";

  const datePart = date.toLocaleDateString("pt-BR");
  const timePart = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart} ${timePart}`;
};