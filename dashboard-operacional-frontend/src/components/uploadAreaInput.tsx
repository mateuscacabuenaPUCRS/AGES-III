import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface UploadAreaInputProps {
  onFileSelect: (file: File) => boolean;
}

const UploadAreaInput: React.FC<UploadAreaInputProps> = ({
  onFileSelect,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (onFileSelect(selectedFile)) {        
        setFileName(selectedFile.name);
      }
      else {
        setFileName(null);
      }
    }
  };

  return (
    <Box
      sx={{
        border: "2px dashed #9E833B",
        borderRadius: 2,
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        minHeight: 250,
      }}
    >
      <input
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      <CloudUploadIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />

      <Typography fontSize={"1rem"} sx={{ color: "#555", mb: 2 , textAlign: "center"}}>
        {fileName || "Selecione seu arquivo"}{" "}
      </Typography>

      <Button
        variant="outlined"
        component="label"
        htmlFor="file-upload"
        sx={{
          borderColor: "customButton.gold",
          color: "#555",
          height: "1.5rem",
          fontSize: "0.8rem",
        }}
      >
        procurar arquivo
      </Button>
    </Box>
  );
};

export default UploadAreaInput;