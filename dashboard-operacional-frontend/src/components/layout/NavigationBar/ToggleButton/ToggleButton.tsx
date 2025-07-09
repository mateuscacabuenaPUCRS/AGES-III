import { Box } from "@mui/material";

interface ToggleButtonProps {
  icon: React.ReactNode;
  isCollapsed: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  icon,
  isCollapsed,
  onClick,
}) => {
  const ButtonContent = (
    <Box
      display="flex"
      alignItems="center"
      mb={2}
      p={1.2}
      borderRadius="8px"
      sx={{
        width: "40px",
        height: "40px",
        background: "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)",
        transition: "all 0.7s ease, left 0.7s ease-in-out",
        "&:hover": {
          background:"linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
          transform: isCollapsed ? "translateX(2.5px)" : "translateX(5px)",
        },
        position: "absolute",
        top: 10,
        left: !isCollapsed ? 280 : 8,
        "@media (max-width: 1024px)": {
          left: !isCollapsed ? 210 : 8,
        },
      }}
    >
      {icon}
      
    </Box>
  );

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

export default ToggleButton;
