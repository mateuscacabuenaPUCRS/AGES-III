export interface GenericData {
  id: number;
  [key: string]: string | number | string[] | number[] | undefined;
}

export interface HeadCell<T extends GenericData> {
  id: keyof T;
  label: string;
}

export type Order = "asc" | "desc";

export interface GenericTableProps<T extends GenericData> {
  rows: T[];
  noDataMessage?: string;
  headCells: readonly HeadCell<T>[];
  title: string;
  defaultOrderBy: keyof T;
  initialSelected?: readonly number[];
  onSelectionChange?: (
    selectedIds: readonly number[],
    selectedItems: T[]
  ) => void;
  onDelete?: (selectedIds: readonly number[], selectedItems: T[]) => void;
  showDeleteButton?: boolean;
}

export interface EnhancedTableHeadProps<T extends GenericData> {
  headCells: readonly HeadCell<T>[];
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
