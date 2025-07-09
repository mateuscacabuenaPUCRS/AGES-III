import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import { z } from "zod";

const emailModalSchema = z.object({
  email: z
    .string({ required_error: "Email é obrigatório" })
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido"),
});

type EmailFormData = z.infer<typeof emailModalSchema>;

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EmailFormData | null;
  onCreateEmail: (data: EmailFormData) => Promise<void>;
  isEditing?: boolean;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onCreateEmail,
  isEditing = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailModalSchema),
    defaultValues: {
      email: initialData ? initialData.email : "",
    },
    shouldUnregister: true,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ email: "" });
    }
  }, [initialData, reset]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    try {
      await onCreateEmail(data);
      reset();
      onClose();
    } catch (err) {
      console.error("Erro ao processar email:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        display="flex"
        flexDirection="column"
        alignItems="center"
        mb="0.8rem"
      >
        <Typography sx={{ fontWeight: "900", fontSize: "1.2rem" }}>
          {isEditing ? "Editar Email" : "Adicionar Email"}
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap="1.5rem"
        alignItems="center"
      >
        <Box
          sx={{ width: "100%" }}
          display="flex"
          flexDirection="column"
          gap="0.3rem"
        ></Box>

        <Box
          sx={{ width: "100%" }}
          display="flex"
          flexDirection="column"
          gap="0.3rem"
        >
          <Typography sx={{ fontWeight: "800", fontSize: "1rem" }}>
            Email*
          </Typography>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                {...field}
                onBlur={field.onBlur}
                placeholder="Digite o email"
                variant="outlined"
                InputProps={{
                  sx: {
                    height: "3.5rem",
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
          {errors.email && (
            <Typography color="error" variant="caption">
              {errors.email.message}
            </Typography>
          )}
        </Box>

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
          {isSubmitting
            ? isEditing
              ? "Atualizando..."
              : "Adicionando..."
            : isEditing
            ? "Atualizar Email"
            : "Adicionar Email"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default EmailModal;
