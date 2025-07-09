import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import {
  GenericData,
  GenericTableProps,
  Order,
} from "../../interface/operationSuspectTable/operationSuspectTableInterface";
import { getComparator, getSelectedItems } from "../../utils/tableUtils";
import EnhancedTableToolbar from "./tableToolBar";
import EnhancedTableHead from "./tableHeader";
import { useCallback, useEffect, useMemo, useState } from "react";

function GenericTable<T extends GenericData>({
  rows,
  headCells,
  title,
  defaultOrderBy,
  noDataMessage,
  onSelectionChange,
  initialSelected = [],
  onDelete,
  showDeleteButton = true,
}: GenericTableProps<T>) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderBy);
  const [selected, setSelected] = useState<readonly number[]>(initialSelected);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  useEffect(() => {
    if (
      initialSelected.length > 0 &&
      JSON.stringify(initialSelected) !== JSON.stringify(selected)
    ) {
      setSelected(initialSelected);
    }
  }, [initialSelected]);

  const notifySelectionChange = useCallback(() => {
    if (onSelectionChange) {
      const selectedItems = getSelectedItems(rows, selected);
      onSelectionChange(selected, selectedItems);
    }
  }, [selected, rows, onSelectionChange]);

  useEffect(() => {
    notifySelectionChange();
  }, [selected, notifySelectionChange]);

  const handleDelete = useCallback(() => {
    if (onDelete && selected.length > 0) {
      const selectedItems = getSelectedItems(rows, selected);
      onDelete(selected, selectedItems);

      setSelected([]);
    }
  }, [onDelete, selected, rows]);

  const handleRequestSort = React.useCallback(
    (_event: React.MouseEvent<unknown>, property: keyof T) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const handleSelectAllClick = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        const onlyValidNumbers = newSelected
          .map((item) => Number(item))
          .filter((item) => !isNaN(item));
        setSelected(onlyValidNumbers);
        return;
      }
      setSelected([]);
    },
    [rows]
  );

  const handleClick = React.useCallback(
    (_event: React.MouseEvent<unknown>, id: number) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly number[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    },
    [selected]
  );

  const handleChangePage = React.useCallback(
    (_event: unknown, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  const isSelected = useCallback(
    (id: number) => selected.indexOf(id) !== -1,
    [selected]
  );
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          showDeleteButton={showDeleteButton}
          numSelected={selected.length}
          title={title}
          onDelete={handleDelete}
        />
        <TableContainer
          sx={{
            height: "calc(100vh - 400px)",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <Table
            sx={{
              minWidth: 750,
              tableLayout: "auto",
              width: "100%",
            }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={String(orderBy)}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        bgcolor: isSelected(row.id)
                          ? "table.lightGrey"
                          : "table.white",
                      }}
                    >
                      <Checkbox
                        sx={{
                          "&.Mui-checked": {
                            color: "customButton.gold",
                          },
                          "&.MuiCheckbox-indeterminate": {
                            color: "customButton.gold",
                          },
                        }}
                        checked={isItemSelected}
                      />
                    </TableCell>
                    {headCells.map((headCell, cellIndex) => {
                      const value = row[headCell.id];
                      const isFirstCell = cellIndex === 5;

                      return (
                        <TableCell
                          sx={{
                            bgcolor: isSelected(row.id)
                              ? "table.lightGrey"
                              : "table.white",
                          }}
                          key={String(headCell.id)}
                          align={"center"}
                          padding={"normal"}
                          component={"td"}
                          id={isFirstCell ? labelId : undefined}
                          scope={isFirstCell ? "row" : undefined}
                        >
                          {Array.isArray(value)
                            ? value.join(", ")
                            : typeof value === "string" ||
                              typeof value === "number" ||
                              React.isValidElement(value)
                            ? value
                            : String(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center">
                    {noDataMessage}
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <Box style={{ height: "50rem" }}>
                    <TableCell colSpan={headCells.length + 1} />
                  </Box>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </Paper>
    </Box>
  );
}

export default GenericTable;
