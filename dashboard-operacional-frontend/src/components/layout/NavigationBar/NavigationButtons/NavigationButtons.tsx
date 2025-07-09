import { Box } from "@mui/material";
import MediationIcon from "@mui/icons-material/Mediation";
import TargetIcon from "@mui/icons-material/AdsClickOutlined";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Groups2Icon from "@mui/icons-material/Groups2";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import NavigationButton from "./NavigationButton/NavigationButton";
import ToggleButton from "../ToggleButton/ToggleButton";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useContext } from "react";
import { AppContext } from "../../../../context/AppContext";

interface NavigationButtonsProps {
  isCollapsed: boolean;
  onToggle: () => void;
  logout: () => void;
  exportAnalysis?: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  isCollapsed,
  onToggle,
  logout,
  exportAnalysis,
}) => {
  const location = useLocation();
  const isActive = (path: string): boolean => location.pathname === path;

  const { suspects, numbers } = useContext(AppContext);
  const hasTargets = suspects.length > 0 || numbers.length > 0;

  return (
    <Box
      mt={!isCollapsed ? 0 : 6}
      py={2}
      px={isCollapsed ? 1 : 2}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <Box flex={1}>
        <ToggleButton
          icon={isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
          isCollapsed={isCollapsed}
          onClick={onToggle}
        />

        <NavigationButton
          to="/planilhas"
          icon={<DriveFolderUploadIcon />}
          label="Planilhas"
          isCollapsed={isCollapsed}
          isActive={isActive("/planilhas")}
        />

        <NavigationButton
          to="/operacoes"
          icon={<TargetIcon />}
          label="Operações"
          isCollapsed={isCollapsed}
          isActive={isActive("/operacoes")}
        />

        <NavigationButton
          to="/alvos"
          icon={<Groups2Icon />}
          label="Alvos"
          isCollapsed={isCollapsed}
          isActive={isActive("/alvos")}
        />

        {hasTargets && (
          <>
            <NavigationButton
              to="/dashboard"
              icon={<AssessmentIcon />}
              label="Dashboard"
              isCollapsed={isCollapsed}
              isActive={isActive("/dashboard")}
            />

            <NavigationButton
              to="/teia"
              icon={<MediationIcon />}
              label="Teia"
              isCollapsed={isCollapsed}
              isActive={isActive("/teia")}
            />
          </>
        )}
      </Box>

      <Box>
        {hasTargets && (
          <NavigationButton
            icon={<CloudUploadIcon />}
            label="Exportar Análise"
            isCollapsed={isCollapsed}
            isActive={false}
            onClick={exportAnalysis}
            isUpload={true}
          />
        )}

        <NavigationButton
          icon={<LogoutIcon />}
          label="Logout"
          isCollapsed={isCollapsed}
          isActive={false}
          onClick={logout}
        />
      </Box>
    </Box>
  );
};

export default NavigationButtons;
