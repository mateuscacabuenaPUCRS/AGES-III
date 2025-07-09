import Typography from "@mui/material/Typography";
import Box from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GenericTable from "../../components/Table/Table";
import { GenericData, HeadCell } from "../../interface/table/tableInterface";
import EmailModal from "../../components/modal/createEmailModal";
import EditableField from "../../components/editableField";
import { useContext, useEffect, useState } from "react";
import EditableMultilineField from "../../components/editableMultilineField";
import { useSuspectInfo } from "../../hooks/useSuspectInfo";
import TelephoneModal from "../../components/modal/createTelephoneModal";
import { AppContext } from "../../context/AppContext";
import { useSuspectNumbers } from "../../hooks/useSuspectsNumbers";
import { suspectInterface } from "../../interface/suspect/suspectInterface";

interface Email extends GenericData {
  email: string;
  insertDate: string;
  insertBy: string;
}
interface Phone extends GenericData {
  phone: string;
  insertDate: string;
  insertBy: string;
}
interface Ips extends GenericData {
  ip: string;
  ocorrencias: number;
}

const formatsuspectCpf = (value: string): string => {
  if (!value) return "";
  const numericValue = value.replace(/\D/g, "").slice(0, 11);
  return numericValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const SuspectsDetails = () => {
  const menuItemStyles = {
    padding: "4px 16px",
    "&:hover": {
      backgroundColor: "transparent !important",
      color: "inherit !important",
    },
    "&.Mui-selected": {
      backgroundColor: "hsla(44, 45.60%, 42.50%, 0.08) !important",
      color: "inherit !important",
    },
    "&.Mui-selected:hover": {
      backgroundColor: "hsla(44, 45.60%, 42.50%, 0.08) !important",
      color: "inherit !important",
    },
    "&.Mui-selected, &.Mui-selected:focus, &.Mui-selected:active": {
      backgroundColor: "hsla(44, 45.60%, 42.50%, 0.08) !important",
      color: "inherit !important",
    },
  };
  const { cpf } = useContext(AppContext);

  const {
    suspect,
    loading,
    error,
    updateSuspectDetails,
    createSuspectEmail,
    deleteSuspectNumber,
    deleteSuspectEmail,
    createSuspectNumber,
    updateSuspectEmail,
  } = useSuspectInfo(Number(window.location.pathname.split("/").pop()));

  const { suspectsNumbers } = useSuspectNumbers();

  const [loadingFields, setLoadingFields] = useState({
    nickname: false,
    name: false,
    suspectCpf: false,
    notes: false,
    relevante: false,
  });

  const [loadingNumbersDelete, setLoadingNumbersDelete] =
    useState<boolean>(false);
  const [loadingEmailDelete, setLoadingEmailDelete] = useState<boolean>(false);
  const [editingEmail, setEditingEmail] = useState<Email | null>(null);
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [suspectCpf, setsuspectCpfSuspect] = useState("");
  const [notes, setNotes] = useState("");
  const [relevante, setRelevante] = useState<boolean>(false);
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

  useEffect(() => {
    if (suspect) {
      setNickname(suspect.apelido);
      setName(suspect.nome);
      setsuspectCpfSuspect(formatsuspectCpf(suspect.cpf));
      setNotes(suspect.anotacoes);
      setRelevante(suspect.relevante);
    }
  }, [suspect]);

  async function updateField(field: string, _: string | boolean) {
    setLoadingFields((prev) => ({ ...prev, [field]: true }));

    const allValues: suspectInterface = {
      apelido: suspect?.apelido || null,
      nome: suspect?.nome || null,
      cpf: suspect?.cpf || null,
      relevante: suspect?.relevante || false,
      anotacoes: suspect?.anotacoes || null,
    };

    try {
      const { isSuccess, errorMessage } = await updateSuspectDetails(
        suspect?.id.toString() || "",
        allValues
      );

      if (isSuccess) {
        setAlert({
          show: true,
          type: "success",
          message: "Campo atualizado com sucesso!",
        });
      } else {
        setAlert({
          show: true,
          type: "error",
          message: errorMessage || "Erro ao atualizar o campo.",
        });
      }
    } catch (error) {
      console.log("Erro ao atualizar campo:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Erro inesperado ao atualizar o campo.",
      });
    } finally {
      setLoadingFields((prev) => ({ ...prev, [field]: false }));
    }
  }

  const handleNicknameChange = (newValue: string) => {
    setNickname(newValue);
  };

  const handleNameChange = (newValue: string) => {
    setName(newValue);
  };

  const handlesuspectCpfChange = (newValue: string) => {
    const formatted = formatsuspectCpf(newValue);
    setsuspectCpfSuspect(formatted);
  };

  const handleNotesChange = (newValue: string) => {
    setNotes(newValue);
  };

  const handleRelevanteChange = (value: string) => {
    const newValue = value === "sim";
    setRelevante(newValue);
    updateField("relevante", newValue);
  };

  const EmailHeaderCells: readonly HeadCell<Email>[] = [
    { id: "email", label: "Email" },
    { id: "insertDate", label: "Data de Inserção" },
    { id: "insertBy", label: "Inserido por" },
    {
      id: "edit",
      label: "",
      iconAction: {
        icon: <EditIcon sx={{ fontSize: "1.2rem" }} />,
        onClick: (id: number) => {
          handleEditEmail(id);
        },
      },
    },
  ];
  const handleEditEmail = (emailId: number) => {
    const emailToEdit = suspect?.emails?.find((e) => e.id === emailId);
    if (emailToEdit) {
      setEditingEmail({
        id: emailToEdit.id,
        email: emailToEdit.email,
        insertDate: emailToEdit.lastUpdateDate,
        insertBy: emailToEdit.lastUpdateCpf,
      });
      setOpenEmailModal(true);
    }
  };
  const PhoneHeaderCells: readonly HeadCell<Phone>[] = [
    { id: "phone", label: "Celular" },
    { id: "insertDate", label: "Data de Inserção" },
    { id: "insertBy", label: "Inserido por" },
  ];

  const IPsHeaderCells: readonly HeadCell<Ips>[] = [
    { id: "ip", label: "IP" },
    { id: "ocorrencias", label: "Ocorrências" },
  ];
  const [openTelephoneModal, setOpenTelephoneModal] = useState(false);
  const [openEmailModal, setOpenEmailModal] = useState(false);

  return (
    <>
      <TelephoneModal
        isOpen={openTelephoneModal}
        onClose={() => setOpenTelephoneModal(false)}
        onCreateNumber={async (numberData) => {
          try {
            const numbers = numberData.telephone.map((tel) => Number(tel));
            await createSuspectNumber(numbers, cpf);
            setOpenTelephoneModal(false);
            setAlert({
              show: true,
              type: "success",
              message: "Telefone Adicionado com sucesso",
            });
          } catch (err) {
            console.log("Erro ao adicionar numero:", err);
            setAlert({
              show: true,
              type: "error",
              message: "Ocorreu um erro. Tente novamente.",
            });
          }
        }}
        suspectsNumbers={suspectsNumbers}
      />
      <EmailModal
        isEditing={!!editingEmail}
        isOpen={openEmailModal}
        onClose={() => {
          setOpenEmailModal(false);
          setTimeout(() => {
            setEditingEmail(null);
          }, 300);
        }}
        initialData={editingEmail ? { email: editingEmail.email } : null}
        onCreateEmail={async (emailData) => {
          try {
            if (editingEmail) {
              await updateSuspectEmail(editingEmail.id, cpf, emailData.email);
            } else {
              await createSuspectEmail(emailData.email, cpf);
            }

            setOpenEmailModal(false);
            setEditingEmail(null);
            setAlert({
              show: true,
              type: "success",
              message: editingEmail
                ? "Email atualizado com sucesso"
                : "Email adicionado com sucesso",
            });
          } catch (err) {
            console.log("Erro ao processar email:", err);
            setAlert({
              show: true,
              type: "error",
              message: "Ocorreu um erro. Tente novamente.",
            });
          }
        }}
      />
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
      <Box
        bgcolor="customBackground.secondary"
        sx={{
          pt: "clamp(1rem, 3vh, 3rem)",
          pb: "clamp(1rem, 2vh, 3rem)",
          px: "clamp(1rem, 3.5vw, 4rem)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              mb: 1,
              fontSize: "1.125rem",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => window.history.back()}
          >
            <ArrowBackIosIcon sx={{ fontSize: "1.125rem" }} />
            Voltar
          </Typography>
        </Box>

        <Typography
          variant="h5"
          color="#000000"
          fontWeight={700}
          sx={{ fontFamily: "Inter, sans-serif" }}
        >
          Informações do Suspeito
        </Typography>

        {error && (
          <Typography color="error" fontWeight={600}>
            {error}
          </Typography>
        )}

        {!error && (
          <>
            <Box display="flex" flexDirection="row" gap={10} flexWrap="wrap">
              <Box
                display="flex"
                flexDirection="column"
                maxWidth="30rem"
                width="25rem"
              >
                {loading ? (
                  <>
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                  </>
                ) : (
                  <>
                    <EditableField
                      label="Apelido"
                      value={nickname}
                      onChange={handleNicknameChange}
                      onConfirm={(newValue) =>
                        updateField("nickname", newValue)
                      }
                      loading={loadingFields.nickname}
                    />
                    <EditableField
                      label="Nome"
                      value={name}
                      onChange={handleNameChange}
                      onConfirm={(newValue) => updateField("name", newValue)}
                      loading={loadingFields.name}
                    />
                    <EditableField
                      label="CPF"
                      value={suspectCpf}
                      onChange={handlesuspectCpfChange}
                      onConfirm={(newValue) =>
                        updateField("suspectCpf", newValue)
                      }
                      loading={loadingFields.suspectCpf}
                    />
                  </>
                )}
              </Box>
              {loading ? (
                <Skeleton height={160} width="100%" />
              ) : (
                <EditableMultilineField
                  label="Anotações"
                  value={notes}
                  onChange={handleNotesChange}
                  onConfirm={(newValue) => updateField("notes", newValue)}
                  loading={loadingFields.notes}
                />
              )}
            </Box>

            {loading ? (
              <Skeleton height={50} width={250} />
            ) : (
              <FormControl
                fullWidth
                size="small"
                sx={{
                  bgcolor: "white",
                  borderRadius: "0.313rem",
                  maxWidth: "25rem",
                }}
              >
                <InputLabel
                  id="relevante-label"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "text.primary",
                    "&.Mui-focused": {
                      color: "text.primary",
                      fontWeight: 700,
                    },
                  }}
                >
                  Relevante
                </InputLabel>
                <Select
                  labelId="relevante-label"
                  value={relevante ? "sim" : "nao"}
                  label="Relevante"
                  onChange={(e) => handleRelevanteChange(e.target.value)}
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",

                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "customButton.gold",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "customButton.gold",
                    },
                  }}
                >
                  <MenuItem value="sim" sx={menuItemStyles}>
                    Sim
                  </MenuItem>

                  <MenuItem value="nao" sx={menuItemStyles}>
                    Não
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            {!loading && (
              <p style={{ fontSize: "0.775rem", color: "#666" }}>
                *Para editar os campos, clique no botão de lapis
              </p>
            )}

            {!loading && suspect && (
              <Box display="flex" flexDirection="column" gap="0rem">
                <GenericTable
                  rows={(suspect.ips || []).map((ip, idx) => ({
                    id: idx,
                    ip: ip.ip,
                    ocorrencias: ip.ocorrencias,
                  }))}
                  collapsible
                  addButton={false}
                  onAdd={() => {}}
                  singleSelect
                  headCells={IPsHeaderCells}
                  title="IPs"
                  defaultOrderBy="ocorrencias"
                  onSelectionChange={() => {}}
                  initialSelected={[]}
                  noDataMessage="Nenhum IP encontrado para este suspeito"
                  onDelete={() => {}}
                  allowSelection={false}
                  headerCollor="white"
                  showDeleteButton={false}
                />

                <GenericTable
                  isDeleting={loadingNumbersDelete}
                  rows={(suspect.celulares || []).map((c) => ({
                    id: c.id,
                    phone: c.numero,
                    insertDate: c.lastUpdateDate,
                    insertBy: c.lastUpdateCpf,
                  }))}
                  collapsible
                  addButton
                  onAdd={() => {
                    setOpenTelephoneModal(true);
                  }}
                  singleSelect
                  headCells={PhoneHeaderCells}
                  title="Celulares"
                  defaultOrderBy="insertDate"
                  onSelectionChange={() => {}}
                  initialSelected={[]}
                  noDataMessage="Nenhum celular encontrado para este suspeito"
                  onDelete={async (selectedIds) => {
                    if (suspect.celulares.length <= 1) {
                      setAlert({
                        show: true,
                        type: "error",
                        message: "O suspeito deve ter pelo menos um número.",
                      });
                    }
                    try {
                      setLoadingNumbersDelete(true);
                      for (const id of selectedIds) {
                        await deleteSuspectNumber(id);
                      }
                      setAlert({
                        show: true,
                        type: "success",
                        message: "Número deletado com sucesso",
                      });
                      setLoadingNumbersDelete(false);
                    } catch (err) {
                      setLoadingNumbersDelete(false);
                      console.log("Erro ao deletar numero:", err);
                      setAlert({
                        show: true,
                        type: "error",
                        message: "Ocorreu um erro. Tente novamente.",
                      });
                    }
                  }}
                  headerCollor="white"
                />

                <GenericTable
                  isDeleting={loadingEmailDelete}
                  rows={(suspect.emails || []).map((e) => ({
                    id: e.id,
                    email: e.email,
                    insertDate: e.lastUpdateDate,
                    insertBy: e.lastUpdateCpf,
                  }))}
                  collapsible
                  addButton
                  onAdd={() => {
                    setOpenEmailModal(true);
                  }}
                  singleSelect
                  headCells={EmailHeaderCells}
                  title="Emails"
                  defaultOrderBy="insertDate"
                  onSelectionChange={() => {}}
                  initialSelected={[]}
                  noDataMessage="Nenhum email encontrado para este suspeito"
                  onDelete={async (selectedIds) => {
                    try {
                      setLoadingEmailDelete(true);
                      for (const id of selectedIds) {
                        await deleteSuspectEmail(id);
                      }
                      setAlert({
                        show: true,
                        type: "success",
                        message: "Email deletado com sucesso",
                      });
                      setLoadingEmailDelete(false);
                    } catch (err) {
                      setLoadingEmailDelete(false);
                      console.log("Erro ao deletar email:", err);
                      setAlert({
                        show: true,
                        type: "error",
                        message: "Ocorreu um erro. Tente novamente.",
                      });
                    }
                  }}
                  headerCollor="white"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default SuspectsDetails;
