import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import { z } from "zod";

const addOperationModalSchema = z.object({
  operationName: z
    .string({
      required_error: "Nome da operação é obrigatório",
    })
    .min(1, "Nome da operação não pode estar vazio"),
});

type AddOperationSchemaType = z.infer<typeof addOperationModalSchema>;

interface CreateOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOperation: (data: AddOperationSchemaType) => Promise<void>;
}

const CreateOperationModal: React.FC<CreateOperationModalProps> = ({
  isOpen,
  onClose,
  onCreateOperation,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddOperationSchemaType>({
    mode: "all",
    resolver: zodResolver(addOperationModalSchema),
    defaultValues: {
      operationName: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: AddOperationSchemaType) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onCreateOperation(data);
      reset();
      onClose();
    } catch (err) {
      if (err)
        setSubmitError("Não foi possível criar a operação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setSubmitError(null);
        onClose();
      }}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          padding: "1.875rem",
          position: "absolute",
          top: "50%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          margin: 0,
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={() => {
          setSubmitError(null);
          onClose();
        }}
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
        display="flex"
        flexDirection="column"
        alignItems="center"
        mb="0.8rem"
      >
        <Typography sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
          Criação Operação
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap="1rem" alignItems="center">
        <Box
          sx={{ width: "100%" }}
          display="flex"
          flexDirection="column"
          gap="0.3rem"
        >
          <Typography sx={{ fontWeight: "800", fontSize: "1rem" }}>
            Nome da operação*
          </Typography>

          <Controller
            control={control}
            name="operationName"
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Digite o nome da operação"
                variant="outlined"
                InputLabelProps={{ shrink: false }}
                InputProps={{
                  notched: false,
                  sx: {
                    height: "3.5rem",
                    width: "100%",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                      borderWidth: "1px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                  },
                }}
              />
            )}
          />

          <Box sx={{ height: "1.5rem" }}>
            {errors.operationName && (
              <Typography color="error" variant="caption">
                {typeof errors.operationName === "string"
                  ? errors.operationName
                  : errors.operationName.message ||
                    "Nome da operação é obrigatório"}
              </Typography>
            )}
          </Box>
        </Box>

        {submitError && (
          <Typography color="error" variant="body2" textAlign="center">
            {submitError}
          </Typography>
        )}

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          sx={{
            bgcolor: "customButton.gold",
            color: "customText.white",
            textTransform: "none",
            fontWeight: 600,
            width: "100%",
          }}
        >
          {isSubmitting ? "Criando..." : "Criar operação"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default CreateOperationModal;
