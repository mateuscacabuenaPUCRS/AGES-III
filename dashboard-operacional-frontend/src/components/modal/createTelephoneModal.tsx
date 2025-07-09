import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import { z } from "zod";
import MultiSelect from "../multiSelect";

const telephoneModalSchema = z.object({
  telephone: z
    .array(z.string())
    .nonempty("Pelo menos um telefone é obrigatório"),
});

type TelephoneFormData = z.infer<typeof telephoneModalSchema>;

interface TelephoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNumber: (data: TelephoneFormData) => Promise<void>;
  initialData?: TelephoneFormData | null;
  suspectsNumbers: { id: string; label: string }[];
}

const TelephoneModal: React.FC<TelephoneModalProps> = ({
  isOpen,
  onClose,
  onCreateNumber,
  initialData,
  suspectsNumbers,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TelephoneFormData>({
    resolver: zodResolver(telephoneModalSchema),
    defaultValues: {
      telephone: initialData ? initialData.telephone : [],
    },
    shouldUnregister: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: TelephoneFormData) => {
    setIsSubmitting(true);
    try {
      await onCreateNumber(data);
      reset();
      onClose();
    } catch (err) {
      console.error("Erro ao criar numero:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ telephone: [] });
    }
  }, [initialData, reset]);

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
          {initialData ? "Editar Telefones" : "Adicionar Telefones"}
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
        >
          <Typography sx={{ fontWeight: "800", fontSize: "1rem" }}>
            Telefones*
          </Typography>
          <Controller
            control={control}
            name="telephone"
            render={({ field }) => (
              <MultiSelect
                style="white"
                placeholder="Selecione os números"
                height="3.5rem"
                options={suspectsNumbers}
                selectedOptions={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
          {errors.telephone && (
            <Typography color="error" variant="caption">
              {errors.telephone.message}
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
          {isSubmitting ? "Adicionando..." : "Adicionar Telefones"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default TelephoneModal;
