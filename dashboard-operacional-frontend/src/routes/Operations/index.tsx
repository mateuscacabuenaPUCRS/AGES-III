import {
  Alert,
  alpha,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import GenericTable from "../../components/operationSuspectTable/table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHeaderInput } from "../../hooks/useHeaderInput";
import { useOperations } from "../../hooks/useOperations";
import type { Operation } from "../../hooks/useOperations";
import { HeadCell } from "../../interface/operationSuspectTable/operationSuspectTableInterface";
import CreateOperationModal from "../../components/modal/createOperationModal";
import { AppContext } from "../../context/AppContext";

const operationHeaderCells: readonly HeadCell<Operation>[] = [
  { id: "nome", label: "Nome da operação" },
  { id: "data_criacao", label: "Data de criação" },
  { id: "qtd_alvos", label: "Número de alvos na operação" },
];

const Operations: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { headerInputValue } = useHeaderInput();
  const { operations, setOperations, setSuspects, setNumbers } =
    useContext(AppContext);

  const [openModal, setOpenModal] = useState(false);

  // IDs e objetos selecionados localmente (antes do confirmar)
  const [selectedIds, setSelectedIds] = useState<readonly number[]>(
    operations.map((op) => op.id)
  );
  const [selectedItems, setSelectedItems] = useState<Operation[]>(operations);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "info" as "error" | "warning" | "info" | "success",
  });

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSelectionChange = useCallback(
    (ids: readonly number[], items: Operation[]) => {
      setSelectedIds(ids);
      setSelectedItems(items);
    },
    []
  );

  const {
    filteredOperations,
    loading,
    error,
    createOperation,
    fetchOperations,
  } = useOperations({ searchTerm: headerInputValue });

  const operationsSelected = () => {
    setOperations(selectedItems);
    setSuspects([]); // limpa alvos ao confirmar
    setNumbers([]);

    const newSearchParams = new URLSearchParams(searchParams);
    const operationIds = selectedItems
      .map((item: Operation) => item.id)
      .join("-");
    newSearchParams.set("operacao", operationIds);
    navigate(`/alvos?${newSearchParams.toString()}`);
  };

  return (
    <Box p={3} sx={{ fontFamily: "Inter, sans-serif" }}>
      {alert.show && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
          sx={{
            position: "fixed",
            top: 16,
            left: "calc(50% + 1px)",
            zIndex: 9999,
            borderRadius: 2,
            boxShadow: 3,
            fontWeight: 500,
            backgroundColor: (theme) =>
              alert.type === "success"
                ? alpha(theme.palette.success.light, 1)
                : alert.type === "error"
                ? alpha(theme.palette.error.light, 1)
                : alpha(theme.palette.info.light, 1),
            color: "#ffffff",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {alert.message}
        </Alert>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="baseline">
        <Typography variant="h5" color="#000000" mb={4} fontWeight={700}>
          Selecione uma operação para iniciar a investigação
        </Typography>

        <Button
          onClick={() => setOpenModal(true)}
          sx={{
            bgcolor: "customButton.gold",
            color: "customText.white",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Criar nova operação
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress color="inherit" />
        </Box>
      ) : error ? (
        <Typography color="error" fontWeight={600}>
          Não foi possível carregar as operações. Tente novamente mais tarde.
        </Typography>
      ) : (
        <GenericTable
          rows={filteredOperations}
          headCells={operationHeaderCells}
          title="Operações"
          defaultOrderBy="nome"
          onSelectionChange={handleSelectionChange}
          initialSelected={selectedIds}
          noDataMessage="Nenhuma operação encontrada, por favor faça o upload da planilha"
          onDelete={() => {}}
          showDeleteButton={false}
        />
      )}

      {!loading && (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            disabled={selectedIds.length === 0}
            onClick={operationsSelected}
            sx={{
              bgcolor: "customButton.black",
              color: "customText.white",
              fontWeight: 600,
              textTransform: "none",
              "&.Mui-disabled": {
                bgcolor: "customText.grey",
                color: "customText.lightGrey",
                cursor: "not-allowed",
              },
            }}
          >
            Confirmar Seleção
          </Button>
        </Box>
      )}

      <CreateOperationModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreateOperation={async (operationData) => {
          try {
            await createOperation(operationData.operationName);
            setOpenModal(false);
            setAlert({
              show: true,
              type: "success",
              message: "Operação criada com sucesso",
            });
            fetchOperations();
          } catch (err) {
            console.log("Erro ao criar operação:", err);
            setAlert({
              show: true,
              type: "error",
              message: "Ocorreu um erro ao criar a operação. Tente novamente.",
            });
          }
        }}
      />
    </Box>
  );
};

export default Operations;
