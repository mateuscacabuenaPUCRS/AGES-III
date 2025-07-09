import {
  GenericData,
  Order,
} from "../interface/operationSuspectTable/operationSuspectTableInterface";

/**
 * Função para ordenação decrescente
 */
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * Retorna uma função de comparação com base na ordem e propriedade
 */
export function getComparator<T extends GenericData>(
  order: Order,
  orderBy: keyof T
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
/**
 * Obtém os itens correspondentes aos IDs selecionados
 */
export function getSelectedItems<T extends GenericData>(
  rows: T[],
  selectedIds: readonly number[]
): T[] {
  return rows.filter((row) => selectedIds.includes(row.id));
}
