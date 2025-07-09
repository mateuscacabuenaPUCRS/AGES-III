import * as React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
  Collapse,
  Tooltip,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GenericData,
  GenericTableProps,
  Order,
} from "../../interface/table/tableInterface";
import { getComparator, getSelectedItems } from "../../utils/tableUtils";
import EnhancedTableToolbar from "./TableToolBar";
import EnhancedTableHead from "./TableHeader";

function GenericTable<T extends GenericData>({
  rows,
  headCells,
  title,
  defaultOrderBy,
  noDataMessage,
  onSelectionChange,
  singleSelect = false,
  initialSelected = [],
  onDelete,
  allowSelection = true,
  onAdd,
  addButton = false,
  collapsible = false,
  defaultCollapsed = true,
  headerCollor,
  renderCell,
  isDeleting,
  showDeleteButton = true,
}: GenericTableProps<T>) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderBy);
  const [selected, setSelected] = useState<readonly number[]>(initialSelected);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const handleToggleCollapse = () => {
    if (collapsible) {
      setCollapsed((prev) => !prev);
    }
  };

  useEffect(() => {
    if (
      initialSelected.length > 0 &&
      JSON.stringify(initialSelected) !== JSON.stringify(selected)
    ) {
      setSelected(initialSelected);
    }
  }, []);

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

  const handleRequestSort = useCallback(
    (_event: React.MouseEvent<unknown>, property: keyof T) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        const onlyValidNumbers = newSelected
          .map((item) => Number(item))
          .filter((item) => !isNaN(item));
        setSelected(onlyValidNumbers);
      } else {
        setSelected([]);
      }
    },
    [rows]
  );

  const handleClick = useCallback(
    (_event: React.MouseEvent<unknown>, id: number) => {
      if (singleSelect) {
        setSelected(selected.includes(id) ? [] : [id]);
        return;
      }

      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly number[] = [];

      if (selectedIndex === -1) {
        newSelected = [...selected, id];
      } else {
        newSelected = selected.filter((item) => item !== id);
      }

      setSelected(newSelected);
    },
    [selected, singleSelect]
  );

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
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

  const tableContent = () => (
    <>
      <TableContainer sx={{ maxHeight: "100%", overflow: "auto" }}>
        <Table
          sx={{ minWidth: 750, tableLayout: "auto", width: "100%" }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <EnhancedTableHead
            singleSelect={singleSelect}
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
                      bgcolor: isItemSelected
                        ? "table.lightGrey"
                        : "table.white",
                    }}
                  >
                    {allowSelection && (
                      <Checkbox
                        sx={{
                          "&.Mui-checked": { color: "customButton.gold" },
                          "&.MuiCheckbox-indeterminate": {
                            color: "customButton.gold",
                          },
                        }}
                        checked={isItemSelected}
                      />
                    )}
                  </TableCell>

                  {headCells.map((headCell, cellIndex) => {
                    const value = row[headCell.id];
                    const isFirstCell = cellIndex === 5;

                    return (
                      <TableCell
                        key={String(headCell.id)}
                        align="center"
                        padding="normal"
                        component="td"
                        scope={isFirstCell ? "row" : undefined}
                        id={isFirstCell ? labelId : undefined}
                        sx={{
                          bgcolor: isItemSelected
                            ? "table.lightGrey"
                            : "table.white",
                          maxWidth: "10rem",
                        }}
                      >
                        {renderCell &&
                        renderCell(headCell.id, row) !== undefined ? (
                          renderCell(headCell.id, row)
                        ) : headCell.iconAction ? (
                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                              headCell.iconAction?.onClick(row.id, row);
                            }}
                            sx={{
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {headCell.iconAction.icon}
                          </Box>
                        ) : (
                          <Tooltip
                            title={
                              Array.isArray(value)
                                ? value.join(", ")
                                : String(value)
                            }
                            arrow
                          >
                            <Box
                              sx={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                display: "block",
                              }}
                            >
                              {Array.isArray(value)
                                ? value.join(", ")
                                : String(value)}
                            </Box>
                          </Tooltip>
                        )}
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
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={headCells.length + 1} />
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
    </>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          onDelete={handleDelete}
          onAdd={onAdd}
          addButton={addButton}
          collapsible={collapsible}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          headerCollor={headerCollor}
          showDeleteButton={showDeleteButton}
          isDeleting={isDeleting}
        />
        {collapsible ? (
          <Collapse in={!collapsed}>{tableContent()}</Collapse>
        ) : (
          tableContent()
        )}
      </Paper>
    </Box>
  );
}

export default GenericTable;
