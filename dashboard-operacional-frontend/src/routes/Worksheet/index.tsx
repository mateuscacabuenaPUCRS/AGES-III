import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React, { useCallback, useContext, useState } from "react";
import { HeadCell } from "../../interface/table/tableInterface";
import GenericTable from "../../components/Table/Table";
import { useWorksheets, WorkSheet } from "../../hooks/useWorksheets";
import { useHeaderInput } from "../../hooks/useHeaderInput";
import UploadWorksheetModal from "../../components/modal/uploadWorksheetModal";
import { sheetController } from "../../controllers/sheetController";
import { useOperations } from "../../hooks/useOperations";
import { AppContext } from "../../context/AppContext";

const workSheetsHeaderCells: readonly HeadCell<WorkSheet>[] = [
  { id: "nome", label: "Planilha" },
  { id: "size", label: "Tamanho do arquivo" },
  { id: "data_upload", label: "Data de Upload" },
  { id: "status", label: "Status" },
];

const Worksheet: React.FC = () => {
  const { setWorksheets } = useContext(AppContext);
  const [selectedIds, setSelectedIds] = useState<readonly number[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { headerInputValue } = useHeaderInput();
  const { filteredOperations } = useOperations({ searchTerm: "" });

  const {
    filteredWorksheets,
    addPendingUpload,
    associateJobId,
    removePendingUpload,
    isLoading,
    error,
  } = useWorksheets({
    searchTerm: headerInputValue,
  });

  const handleSelectionChange = useCallback(
    (selectedIds: readonly number[], selectedItems: WorkSheet[]) => {
      setSelectedIds(selectedIds);
      setWorksheets(selectedItems);
    },
    [setWorksheets]
  );

  const handleUpload = async (file: File, operation: number) => {
    setOpenModal(false);

    addPendingUpload(file.name, file.size);
    try {
      const response = await sheetController.uploadSheet({
        file,
        operacaoId: operation,
      });

      if (response?.job_id) {
        associateJobId(file.name, response.job_id);
      } else {
        removePendingUpload(file.name);
      }
    } catch (error) {
      removePendingUpload(file.name);
    }
  };

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="300px"
      >
        <Alert severity="error" sx={{ width: "100%", maxWidth: 600 }}>
          <Typography fontWeight={600}>
            Ocorreu um problema ao carregar as planilhas.
          </Typography>
          <Typography variant="body2">
            {error.message === "Network Error"
              ? "Não foi possível se conectar ao servidor. Verifique sua conexão."
              : error.message}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ fontFamily: "Inter, sans-serif" }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"baseline"}
      >
        <Typography
          variant="h5"
          data-testid="Histórico de Planilhas"
          color="#000000"
          mb={4}
          fontWeight={700}
          sx={{ fontFamily: "Inter, sans-serif" }}
        >
          Histórico de Planilhas
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
          Upload de arquivos
        </Button>
      </Box>

      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <GenericTable
          showDeleteButton={false}
          singleSelect={true}
          rows={filteredWorksheets}
          headCells={workSheetsHeaderCells}
          title="Planilhas"
          defaultOrderBy="nome"
          onSelectionChange={handleSelectionChange}
          initialSelected={selectedIds}
          noDataMessage="Nenhuma planilha encontrada"
          renderCell={(columnId, row) => {
            if (columnId === "status") {
              const isError = String(row.status || "")
                .toLowerCase()
                .startsWith("erro");

              if (isError) {
                return (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Tooltip title={String(row.status)} arrow>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        color="error.main"
                      >
                        <ErrorOutlineIcon fontSize="small" />
                        <Typography color="error">Erro</Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                );
              }

              if (typeof row.progress === "number") {
                return (
                  <Box>
                    <Typography
                      variant="caption"
                      textAlign="center"
                      display="block"
                    >
                      {`${row.progress}%`}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={row.progress}
                      sx={{
                        height: 6,
                        width: "100%",
                        borderRadius: 4,
                        mb: 0.5,
                      }}
                    />
                  </Box>
                );
              }

              return <Typography fontWeight={400}>Salva</Typography>;
            }

            return undefined;
          }}
        />
      )}

      <UploadWorksheetModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onUploadSuccess={handleUpload}
        existingFiles={filteredWorksheets
          .filter(
            (Worksheet) =>
              !String(Worksheet.status || "")
                .toLowerCase()
                .startsWith("erro")
          )
          .map((worksheet) => worksheet.nome)}
        operationsList={filteredOperations}
      />
    </Box>
  );
};

export default Worksheet;
