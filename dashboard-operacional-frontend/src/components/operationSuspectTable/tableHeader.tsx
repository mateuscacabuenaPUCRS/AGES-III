import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import {
  EnhancedTableHeadProps,
  GenericData,
} from "../../interface/operationSuspectTable/operationSuspectTableInterface";
import { JSX } from "react";

const EnhancedTableHead = <T extends GenericData>({
  headCells,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}: EnhancedTableHeadProps<T>): JSX.Element => {
  const createSortHandler =
    (property: keyof T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ bgcolor: "table.darkGrey" }}>
          <Checkbox
            sx={{
              "&.Mui-checked": {
                color: "customButton.gold",
              },
              "&.MuiCheckbox-indeterminate": {
                color: "customButton.gold",
              },
            }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "selecionar todos os itens",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              bgcolor: "table.darkGrey",
              fontWeight: "bold",
              fontSize: "0.925rem",
            }}
            key={String(headCell.id)}
            align="center"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc"
                    ? "ordenado decrescente"
                    : "ordenado crescente"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
