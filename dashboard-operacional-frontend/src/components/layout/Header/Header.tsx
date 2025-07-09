import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import SearchBar from "../SearchBar/SearchBar";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ inputValue, setInputValue }) => {
  const location = useLocation();
  const isOperationsPage = location.pathname === "/operacoes";
  const isWorksheetPage = location.pathname === "/planilhas";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
 
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "#F7F7F7",
        borderBottom: "1px solid #eaeaea",
        boxShadow: "none",
        borderBottomWidth: "1px",
        borderBottomColor: "customInput.primary",
      }}
    >
      {" "}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.75rem 1.5rem",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "#191919",
              marginBottom: "0.25rem",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Dashboard Operacional
          </Typography>
          <Typography
            variant="subtitle1"
            component="p"
            sx={{
              fontSize: "0.9rem",
              color: "#565656",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Olá, seja bem vindo!
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            width: "50%",
          }}
        >
          <SearchBar
            placeholder={
              isOperationsPage
                ? "Procure aqui pelas operações"
                : isWorksheetPage
                ? "Procure aqui pelas planilhas"
                : "Procure aqui pelos alvos"
            }
            value={inputValue}
            onSearchChange={handleChange}
          ></SearchBar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
