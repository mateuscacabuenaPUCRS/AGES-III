import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface EditableFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (newValue: string) => void;
  onConfirm?: (newValue: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

const EditableField = ({
  label,
  placeholder,
  value,
  onChange,
  onConfirm,
  loading = false,
  disabled = false,
}: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    if (!editing) {
      setTempValue(value);
    }
  }, [value, editing]);

  const handleConfirm = () => {
    onChange(tempValue);
    setEditing(false);
    if (onConfirm) {
      onConfirm(tempValue);
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setEditing(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Typography variant="subtitle2" fontWeight={600}>
        {label}
      </Typography>
      <Box display="flex" flexDirection="row" sx={{ gap: editing ? 1 : 0 }}>
        <TextField
          variant="outlined"
          placeholder={placeholder}
          value={editing ? tempValue : value}
          onChange={(e) => setTempValue(e.target.value)}
          InputProps={{ readOnly: !editing }}
          disabled={loading || disabled}
          sx={{
            width: "100%",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#bfbfbf",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: editing ? "0.313rem" : "0.313rem 0 0 0.313rem",
              backgroundColor: "white",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: editing ? "customButton.gold" : "#bfbfbf",
                borderWidth: "1px",
              },
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

            "& .MuiOutlinedInput-input": {
              padding: "0.625rem",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
            },
            "& label.Mui-focused": {
              color: "inherit",
            },
          }}
        />
        {editing ? (
          <>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={loading || disabled}
              sx={{
                bgcolor: "customButton.gold",
                color: "white",
                minWidth: "45px",
                padding: "6px",
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CheckIcon fontSize="small" />
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              sx={{
                color: "gray",
                minWidth: "45px",
                padding: "6px",
                borderColor: "gray",
              }}
            >
              <CloseIcon fontSize="small" />
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            onClick={() => setEditing(true)}
            disabled={loading || disabled}
            sx={{
              bgcolor: "customButton.gold",
              borderColor: "transparent",
              borderRadius: "0 0.313rem 0.313rem 0",
              color: "customText.white",
              textTransform: "none",
              fontWeight: 400,
              minWidth: "45px",
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <EditIcon sx={{ fontSize: "1rem" }} />
            )}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EditableField;
