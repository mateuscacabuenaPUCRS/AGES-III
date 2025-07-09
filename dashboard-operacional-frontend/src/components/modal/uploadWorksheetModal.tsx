import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { z } from "zod";
import UploadAreaInput from "../uploadAreaInput";
import { Operation } from "../../hooks/useOperations";

const uploadModalSchema = z.object({
  uploadFile: z
    .instanceof(File, { message: "O upload de arquivo é obrigatório" })
    .refine((file) => /\.xlsx$/i.test(file.name), {
      message: "O arquivo deve estar no formato .xlsx",
    }),
  operation: z.number().min(1, "Selecione uma operação"),
});

type UploadModalForm = z.infer<typeof uploadModalSchema>;

interface UploadModalProps {
  isOpen: boolean;
  onUploadSuccess: (file: File, operacaoId: number) => void;
  onClose: () => void;
  existingFiles: string[];
  operationsList: Operation[];
}

const UploadWorksheetModal: React.FC<UploadModalProps> = ({
  isOpen,
  onUploadSuccess,
  onClose,
  existingFiles,
  operationsList,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<UploadModalForm>({
    mode: "all",
    resolver: zodResolver(uploadModalSchema),
    defaultValues: {
      uploadFile: undefined,
      operation: 0,
    },
  });

  const handleFileSelected = (file: File) => {
    // clear any previous duplicate-name error
    setSubmitError(null);

    if (!/\.xlsx$/i.test(file.name)) {
      setError("uploadFile", {
        type: "manual",
        message: "O arquivo deve estar no formato .xlsx",
      });
      return false;
    }
    clearErrors("uploadFile");
    setValue("uploadFile", file, { shouldValidate: true });

    return true;
  };

  const onSubmit = (data: UploadModalForm) => {
    const fileName = data.uploadFile.name;

    if (!/\.xlsx$/i.test(fileName)) {
      setSubmitError("O arquivo deve estar no formato .xlsx");
      return;
    }

    if (existingFiles.includes(fileName)) {
      setSubmitError("Já existe um arquivo com esse nome.");
      return;
    }
    setSubmitError(null);
    reset();
    onUploadSuccess(data.uploadFile, data.operation);
  };

  useEffect(() => {
    setSubmitError(null);
  }, [isOpen]);

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          padding: "1.875rem",
          position: "absolute",
          top: "50%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          margin: 0,
          overflow: "hidden",
        },
      }}
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        marginBottom="0.8rem"
        gap="0.3rem"
      >
        <Typography sx={{ fontWeight: 900, fontSize: "1.2rem" }}>
          Upload de planilha
        </Typography>
        <Tooltip
          title="A planilha deve estar no formato .xlsx"
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: "#fff",
                borderRadius: "12px",
                color: "rgba(0, 0, 0, 0.87)",
                maxWidth: 220,
                border: "1px solid #dadde9",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              },
            },
          }}
        >
          <IconButton size="small" sx={{ padding: 0 }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap="2.5rem"
        alignItems="center"
      >
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          gap="1.8rem"
          paddingTop={"0.5rem"}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
            Operação*
          </Typography>
          <Controller
            control={control}
            name="operation"
            render={({ field }) => (
              <Autocomplete
                options={operationsList}
                getOptionLabel={(option) => option.nome}
                onChange={(_, newValue) => field.onChange(newValue?.id || 0)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Operação"
                    error={!!errors.operation}
                    helperText={errors.operation?.message}
                    size="small"
                    sx={{
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "customButton.lightGray",
                      },
                      "& label.Mui-focused": {
                        color: "inherit",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "customButton.lightGray",
                          borderWidth: "1px",
                        },
                      "& .MuiOutlinedInput-root": {
                        display: "flex",
                        alignItems: "center",
                        "&:hover fieldset": {
                          borderColor: "customButton.lightGray",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "customButton.lightGray",
                        },
                        "& input": {
                          outline: "none",
                        },
                      },
                    }}
                  />
                )}
                value={
                  operationsList.find((op) => op.id === field.value) || null
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            )}
          />
        </Box>

        <Box width="100%" display="flex" flexDirection="column" gap="0.8rem">
          <Controller
            control={control}
            name="uploadFile"
            render={() => <UploadAreaInput onFileSelect={handleFileSelected} />}
          />
          <Box height="1.5rem">
            {errors.uploadFile && (
              <Typography color="error" variant="caption">
                {errors.uploadFile.message}
              </Typography>
            )}
          </Box>

          <Box width="100%">
            <Button
              fullWidth
              onClick={handleSubmit(onSubmit)}
              sx={{
                bgcolor: "customButton.gold",
                color: "customText.white",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Fazer Upload
            </Button>
            {submitError && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {submitError}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UploadWorksheetModal;
