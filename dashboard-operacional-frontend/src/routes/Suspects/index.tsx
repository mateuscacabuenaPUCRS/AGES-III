import {
  Box,
  Button,
  alpha,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import GenericTable from "../../components/Table/Table";
import { useNavigate } from "react-router-dom";
import { useHeaderInput } from "../../hooks/useHeaderInput";
import { HeadCell } from "../../interface/table/tableInterface";
import { useSuspects, Suspect, Numbers } from "../../hooks/useSuspects";
import CreateSuspectModal from "../../components/modal/createSuspectModal";
import { AppContext } from "../../context/AppContext";
import { useSuspectNumbers } from "../../hooks/useSuspectsNumbers";

const Suspects: React.FC = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const { headerInputValue } = useHeaderInput();
  const {
    suspects: selectedSuspectsContext,
    numbers: selectedNumbersContext,
    setSuspects,
    setNumbers,
    operations,
    cpf,
  } = useContext(AppContext);

  const { suspectsNumbers } = useSuspectNumbers();
  const [selectedSuspects, setSelectedSuspects] = useState<Suspect[]>(
    selectedSuspectsContext
  );
  const [selectedNumbers, setSelectedNumbers] = useState<Numbers[]>(
    selectedNumbersContext
  );
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

  const operationIds = useMemo(
    () => operations.map((op) => op.id),
    [operations]
  );

  const {
    suspects,
    numbers,
    loading,
    error,
    createSuspect,
    fetchSuspects,
    deleteSuspect,
  } = useSuspects({
    searchTerm: headerInputValue,
    operationIds,
  });

  const suspectHeadCells: readonly HeadCell<Suspect>[] = [
    { id: "apelido", label: "Nome/Apelido" },
    { id: "numeros", label: "Número" },
    { id: "data_criacao", label: "Data de inserção" },
    { id: "relevante", label: "Relevância" },
    { id: "operacoes", label: "Operações" },
    {
      id: "botton",
      label: "",
      iconAction: {
        icon: (
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: "customButton.black",
              color: "customText.white",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
            }}
          >
            Detalhes
          </Button>
        ),
        onClick: (id: number) => {
          navigate(`/dashboard/detalhesSuspeito/${id}`);
        },
      },
    },
  ];

  const numberHeadCells: readonly HeadCell<Numbers>[] = [
    { id: "numero", label: "Número" },
    { id: "operacoes", label: "Operações" },
  ];

  const handleSuspectsSelection = useCallback(
    (_: readonly number[], selectedItems: Suspect[]) => {
      setSelectedSuspects(selectedItems);
    },
    []
  );

  const handleNumbersSelection = useCallback(
    (_: readonly number[], selectedItems: Numbers[]) => {
      setSelectedNumbers(selectedItems);
    },
    []
  );

  const onConfirm = () => {
    setSuspects(selectedSuspects);
    setNumbers(selectedNumbers);
    navigate("/dashboard");
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
          Selecione os alvos para exibição do dashboard
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
          Criar novo alvo
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress color="inherit" />
        </Box>
      ) : error ? (
        <Typography color="error" fontWeight={600}>
          {error}
        </Typography>
      ) : (
        <>
          <GenericTable
            rows={suspects}
            headCells={suspectHeadCells}
            collapsible
            defaultCollapsed={false}
            title="Suspeitos"
            defaultOrderBy="apelido"
            singleSelect={false}
            onSelectionChange={handleSuspectsSelection}
            initialSelected={selectedSuspectsContext.map((s) => s.id)}
            noDataMessage="Nenhum suspeito encontrado"
            onDelete={async (selectedIds) => {
              try {
                for (const id of selectedIds) {
                  await deleteSuspect(id);
                }
                setAlert({
                  show: true,
                  type: "success",
                  message: "Suspeito deletado com sucesso",
                });
              } catch (err) {
                console.error("Erro ao deletar suspeitos:", err);
                setAlert({
                  show: true,
                  type: "error",
                  message: "Ocorreu um erro . Tente novamente.",
                });
              }
            }}
          />

          <GenericTable
            rows={numbers}
            headCells={numberHeadCells}
            collapsible
            defaultCollapsed={false}
            title="Números Interceptados"
            defaultOrderBy="numero"
            singleSelect={false}
            onSelectionChange={handleNumbersSelection}
            initialSelected={selectedNumbersContext.map((n) => n.id)}
            noDataMessage="Nenhum número encontrado"
            showDeleteButton={false}
          />

          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button
              disabled={
                selectedSuspects.length === 0 && selectedNumbers.length === 0
              }
              onClick={onConfirm}
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
        </>
      )}

      <CreateSuspectModal
        suspectsNumbers={suspectsNumbers}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreateSuspect={async (suspectData) => {
          try {
            const cleanUserCpf = cpf.replace(/\D/g, "");
            const cleanSusCpf = (suspectData.suspectCPF ?? "").replace(
              /\D/g,
              ""
            );

            const createSuspectDTO = {
              apelido: suspectData.suspectNickname,
              cpf: cleanSusCpf,
              nome: suspectData.suspectName ?? "",
              numeros_ids: (suspectData.suspectsNumbers ?? []).map(Number),
            };

            await createSuspect(createSuspectDTO, cleanUserCpf);
            fetchSuspects();
            setAlert({
              show: true,
              type: "success",
              message: "Suspeito criado com sucesso",
            });
            return null;
          } catch (err) {
            console.error("Erro ao criar suspeito:", err);
            setAlert({
              show: true,
              type: "error",
              message:
                "Ocorreu um erro ao criar o suspeito. Tente logar novamente.",
            });
          }
        }}
      />
    </Box>
  );
};

export default Suspects;
