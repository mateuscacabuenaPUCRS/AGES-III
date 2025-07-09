import { Alert, Box, alpha } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import NavigationButtons from "./NavigationButtons/NavigationButtons";
import { useNavigate } from "react-router-dom";
import logoPolicia from "../../../assets/logo-policia.svg";
import { AppContext } from "../../../context/AppContext";
import { api } from "../../../server/service";
import { ResponseApi } from "../../../interface/responseInterface";
import { createFiltersCSV, downloadFileAsync } from "../../../utils/createCSV";
import {
  MessageGroupToBackend,
  MessageTypeToBackend,
} from "../../../interface/dashboard/chartInterface";

interface NavigationBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  isCollapsed,
  onToggle,
}) => {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "info" as "error" | "warning" | "info" | "success",
  });
  const navigate = useNavigate();
  const {
    dashboardFilters: filters,
    operations,
    numbers,
    suspects,
  } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const exportAnalysis = async (): Promise<ResponseApi<void>> => {
    try {
      const filtersCSV = createFiltersCSV(filters);

      await downloadFileAsync(filtersCSV, "filtros.csv");

      const response = await api.post(
        "api/exportar/csv",
        {
          data_final: filters.dateFinal,
          data_inicial: filters.dateInitial,
          grupo: MessageGroupToBackend[filters.group],
          hora_fim: filters.timeFinal,
          hora_inicio: filters.timeInitial,
          numeros: numbers.map((op) => op.id),
          operacoes: operations.map((op) => op.id),
          suspeito: suspects.map((suspect) => suspect.id),
          tipo: MessageTypeToBackend[filters.type],
        },
        {
          responseType: "blob",
        }
      );

      await downloadFileAsync(response.data, "analise.zip", "application/zip");

      setAlert({
        show: true,
        type: "success",
        message: "Export realizado com sucesso!",
      });

      return response.data;
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Ocorreu um erro ao exportar. Tente novamente.",
      });
      throw new Error("Erro ao exportar análise: " + err);
    }
  };
  return (
    <>
      <Box
        height="100vh"
        width={isCollapsed ? "3.7rem" : "20.75rem"}
        bgcolor="customBackground.darkGray"
        display="flex"
        flexDirection="column"
        position="relative"
        top={0}
        left={0}
        zIndex={1}
        color="white"
        overflow="hidden"
        sx={{
          transition: "width 0.7s ease-in-out",
          "@media (max-width: 1024px)": {
            width: isCollapsed ? "3.7rem" : "16rem",
          },
        }}
      >
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
          display="flex"
          flexDirection="column"
          height="100%"
          width="20.75rem"
          overflow="auto"
          sx={{
            transition: "opacity 0.7s ease-in-out, width 0.7s ease-in-out",
            "&::-webkit-scrollbar": {
              width: "0px",
              background: "transparent",
            },
            "@media (max-width: 1024px)": {
              width: "16rem",
            },
          }}
        >
          <Box
            component="img"
            src={logoPolicia}
            alt="Logo Polícia"
            width={isCollapsed ? "0px" : "160px"}
            height="auto"
            mx="auto"
            my={isCollapsed ? 0 : 2}
            sx={{
              transition: "width 0.7s ease-in-out, margin 0.7s ease-in-out",
            }}
          />
          <NavigationButtons
            isCollapsed={isCollapsed}
            onToggle={onToggle}
            logout={logout}
            exportAnalysis={exportAnalysis}
          />
        </Box>
      </Box>
    </>
  );
};

export default NavigationBar;
