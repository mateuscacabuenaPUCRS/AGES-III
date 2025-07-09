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

interface EditableMultilineFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  rows?: number;
  onConfirm?: (newValue: string) => void;
  loading?: boolean;
}

const EditableMultilineField = ({
  label,
  value,
  onChange,
  rows = 8,
  onConfirm,
  loading = false,
}: EditableMultilineFieldProps) => {
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
      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        {label}
      </Typography>

      <Box sx={{ position: "relative", width: "100%" }}>
        <TextField
          multiline
          fullWidth
          rows={rows}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          InputProps={{ readOnly: !editing }}
          disabled={loading}
          sx={{
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#bfbfbf",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "1rem",
              backgroundColor: "white",
              paddingRight: "3rem",
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
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              paddingRight: "3.5rem",
            },
            "& .MuiOutlinedInput-inputMultiline": {
              paddingRight: "3.5rem",
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            flexDirection: editing ? "row" : "column",
            gap: 1,
          }}
        >
          {editing ? (
            <>
              <Button
                onClick={handleConfirm}
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: "customButton.gold",
                  minWidth: "36px",
                  padding: 0,
                  height: "36px",
                  borderRadius: "0.5rem",
                  color: "white",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckIcon fontSize="small" />
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outlined"
                disabled={loading}
                sx={{
                  borderColor: "gray",
                  color: "gray",
                  minWidth: "36px",
                  padding: 0,
                  height: "36px",
                  borderRadius: "0.5rem",
                }}
              >
                <CloseIcon fontSize="small" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditing(true)}
              variant="outlined"
              disabled={loading}
              sx={{
                bgcolor: "customButton.gold",
                color: "white",
                minWidth: "36px",
                padding: 0,
                height: "36px",
                borderRadius: "0.5rem",
                borderColor: "transparent",
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <EditIcon fontSize="small" />
              )}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EditableMultilineField;
