import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  onDelete?: () => void;
  onAdd?: () => void;
  addButton?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  headerCollor?: string;
  showDeleteButton?: boolean;
  isDeleting?: boolean;
}

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
  numSelected,
  title,
  onDelete,
  addButton = false,
  onAdd,
  collapsed,
  collapsible,
  onToggleCollapse,
  headerCollor,
  showDeleteButton,
  isDeleting = false,
}) => {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        collapsed && headerCollor
          ? { bgcolor: headerCollor }
          : numSelected > 0
          ? { bgcolor: "table.grey" }
          : { bgcolor: "table.grey" },
      ]}
    >
      <Box
        sx={{
          flex: "1 1 100%",
          display: "flex",
          alignItems: "center",
          cursor: collapsible ? "pointer" : "default",
        }}
        onClick={collapsible ? onToggleCollapse : undefined}
      >
        {collapsible && (
          <IconButton size="small">
            {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        )}
        <Typography variant="h6" id="tableTitle" component="div">
          {numSelected > 0 ? `${numSelected} selecionado(s)` : title}
        </Typography>
      </Box>
      {isDeleting ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            position: "absolute",
            right: "6rem",
          }}
        >
          <CircularProgress color="inherit" size="20px" />
          <Typography variant="caption">deletando...</Typography>
        </Box>
      ) : (
        numSelected > 0 &&
        showDeleteButton && (
          <Tooltip title="Excluir">
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )
      )}

      {addButton && (
        <Button
          onClick={onAdd}
          sx={{
            bgcolor: "customButton.gold",
            color: "customText.white",
            textTransform: "none",
            fontWeight: 600,
            ml: 2, // Add some margin to the left
          }}
        >
          Adicionar
        </Button>
      )}
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
