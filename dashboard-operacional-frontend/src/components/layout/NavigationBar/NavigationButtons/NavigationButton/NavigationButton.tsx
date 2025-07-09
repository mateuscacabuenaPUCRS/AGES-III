import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { textStyles } from "../../../../../theme/typography";

interface NavigationButtonProps {
  to?: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isUpload?: boolean;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  to,
  icon,
  label,
  isCollapsed,
  isActive,
  onClick,
  isUpload = false,
}) => {
  const ButtonContent = (
    <Box
      display="flex"
      alignItems="center"
      justifyContent={isCollapsed ? "center" : "flex-start"}
      mb={2}
      gap={isCollapsed ? 0 : 2}
      p={isCollapsed ? 1.2 : 1.5}
      borderRadius="8px"
      sx={{
        width: isCollapsed ? "40px" : "100%",
        height: isCollapsed ? "40px" : undefined,
        background: isActive
          ? "#9E833B"
          : "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)",
        transition: "all 0.3s ease, width 0.7s ease-in-out",
        "&:hover": {
          background: isActive
            ? "#9E833B"
            : "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
          transform: isCollapsed ? "translateX(2.5px)" : "translateX(5px)",
        },
      }}
    >
      {icon}
      {!isCollapsed && (
        <Box>
          <Typography sx={{ ...textStyles.navigationBarTitle }}>
            {label}
          </Typography>
          {isUpload && (
            <Typography sx={{ color: "#B0B0B0", fontSize: "0.8rem" }}>
              Clique aqui para exportar o relatório com a análise
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: "none", color: "white" }}>
        {ButtonContent}
      </Link>
    );
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        textDecoration: "none",
        color: "white",
        cursor: "pointer",
      }}
    >
      {ButtonContent}
    </Box>
  );
};

export default NavigationButton;
