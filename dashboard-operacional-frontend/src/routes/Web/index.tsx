import {
  Box,
  MenuItem,
  TextField,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import React, { useState, useMemo, useContext, useEffect } from "react";
import WebChart, { Data } from "../../components/dashboard/WebChart/WebChart";
import MultiSelect, { Option } from "../../components/multiSelect";
import { AppContext } from "../../context/AppContext";
import { WebLink, WebNode } from "../../interface/web/webInterface";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useNavigate } from "react-router-dom";
import {
  TeiaLink,
  TeiaNode,
  useTeiaMessageCount,
} from "../../hooks/useTeiaMessageCount";
import {
  MessageFilterGroup,
  MessageFilterType,
} from "../../interface/dashboard/chartInterface";
import { FilterType } from "../../enum/ViewSelectionFilterEnum";
import ViewSelectionFilter from "../../components/filters/ViewSelection";
import { useTeiaIp } from "../../hooks/useTeiaIp";
import { useSuspects } from "../../hooks/useSuspects";

const menuItemStyles = {
  padding: "4px 16px",
  "&:hover": {
    backgroundColor: "transparent !important",
    color: "inherit !important",
  },
  "&.Mui-selected": {
    backgroundColor: "hsla(44, 45.60%, 42.50%, 0.08) !important",
    color: "inherit !important",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "hsla(44, 45.60%, 42.50%, 0.08) !important",
    color: "inherit !important",
  },
  "&.Mui-selected, &.Mui-selected:focus, &.Mui-selected:active": {
    backgroundColor: "hsla(44, 45.60%, 42.50%, 0.08) !important",
    color: "inherit !important",
  },
};

const focusedTextFieldStyles = {
  minWidth: "11rem",
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "customButton.lightGray",
  },
  "& label.Mui-focused": {
    color: "inherit",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "customButton.lightGray",
    borderWidth: "1px",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "customButton.lightGray",
    },
    "&.Mui-focused fieldset": {
      borderColor: "customButton.lightGray",
    },
    "& input": {
      outline: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
  },
};

const graficFilters = [
  { value: FilterType.INTERACTIONS, label: "Mensagens" },
  { value: FilterType.IP, label: "IPs" },
];

interface Suspect {
  id: number;
  apelido: string;
}

interface Number {
  id: number;
  numero: string;
}

const WebRoute: React.FC = () => {
  const {
    dashboardFilters: filters,
    setDashboardFilters: setFilters,
    operations,
    numbers: selectedNumbers,
    setNumbers: setSelectedNumbers,
    suspects: selectedSuspects,
    setSuspects: setSelectedSuspects,
  } = useContext(AppContext);

  const operationIds = useMemo(
    () => operations.map((op) => op.id),
    [operations]
  );
  const { suspects, numbers } = useSuspects({
    searchTerm: "",
    operationIds: operationIds,
  });

  const suspectOptions: Option[] = useMemo(() => {
    return suspects.map((suspect: Suspect) => ({
      id: suspect.id.toString(),
      label: suspect.apelido,
    }));
  }, [suspects]);

  const numberOptions: Option[] = useMemo(() => {
    return numbers.map((number: Number) => ({
      id: number.id.toString(),
      label: number.numero,
    }));
  }, [numbers]);

  const selectedSuspectIds = useMemo(() => {
    return selectedSuspects.map((suspect) => suspect.id.toString());
  }, [selectedSuspects]);

  const selectedNumberIds = useMemo(() => {
    return selectedNumbers.map((number) => number.id.toString());
  }, [selectedNumbers]);

  const [expanded, setExpanded] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!operations[0] && !numbers[0] && !suspects[0]) {
      navigate("/operacoes");
    }
  }, [operations, numbers, suspects, navigate]);

  const { teiaData } = useTeiaMessageCount();
  const { teiaData: teiaIpData } = useTeiaIp();

  const [nodes, setNodes] = useState<WebNode[]>([]);
  const [links, setLinks] = useState<WebLink[]>([]);
  const [ipOptions, setIpOptions] = useState<Option[]>([]);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    if (!teiaData && filters.chart === FilterType.INTERACTIONS) return;
    if (!teiaIpData && filters.chart === FilterType.IP) return;

    const rawNodes =
      filters.chart === FilterType.INTERACTIONS
        ? teiaData.nodes
        : teiaIpData.nodes;
    const rawLinks =
      filters.chart === FilterType.INTERACTIONS
        ? teiaData.links
        : teiaIpData.links;

    const knownNodeIds = new Set(rawNodes.map((n) => n.id));
    const allTargetIds = rawLinks.map((l) => l.target);
    const missingTargetNodes = allTargetIds
      .filter((id) => !knownNodeIds.has(id))
      .map((id) => ({ id, group: 6 }));

    const finalNodes: TeiaNode[] = [...rawNodes, ...missingTargetNodes];
    const finalLinks: TeiaLink[] = rawLinks;

    setNodes(finalNodes);
    setLinks(finalLinks);
  }, [teiaData, teiaIpData, filters.chart]);

  const handleWebChange = (val: FilterType) => {
    setFilters({
      ...filters,
      chart: val,
      group: MessageFilterGroup.Ambos,
      type: MessageFilterType.Todos,
    });
  };

  useEffect(() => {
    if (filters.chart === FilterType.IP) {
      setIpOptions(nodes.map((node) => ({
        id: node.id.toString(),
        label: node.id,
      })) ?? []);
    }
  }, [nodes, filters.chart]);

  return (
    <Box
      width="100%"
      bgcolor="#F8F8F8"
      height="100vh"
      display="flex"
      flexDirection="column"
      padding="0"
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        borderBottom={expanded ? "1px solid #e0e0e0" : "none"}
      >
        <Collapse in={expanded} timeout="auto">
          {filters.chart === FilterType.INTERACTIONS ? <Box
            display="flex"
            flexDirection="column"
            gap="1rem"
            px="1rem"
            pt="1rem"
            sx={{
              width: "fit-content",
              minWidth: "27rem",
              px: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Typography
              fontFamily={"Inter, sans-serif"}
              fontWeight={600}
              fontSize={"1.25rem"}
            >
              Seleção de Alvos
            </Typography>
            <MultiSelect
              style="gray"
              placeholder={"Selecione os nomes"}
              height="53px"
              options={[...suspectOptions, ...numberOptions]}
              selectedOptions={[...selectedSuspectIds, ...selectedNumberIds]}
              onChange={(selected) => {
                const selectedSuspects = suspects.filter((opt: Suspect) =>
                  selected.includes(opt.id.toString())
                );
                const selectedNumbers = numbers.filter((opt: Number) =>
                  selected.includes(opt.id.toString())
                );
                setSelectedSuspects(selectedSuspects);
                setSelectedNumbers(selectedNumbers);
              }}
            />
          </Box> : 
          <Box
          display="flex"
          flexDirection="column"
          gap="1rem"
          px="1rem"
          pt="1rem"
          sx={{
            width: "fit-content",
            minWidth: "27rem",
            px: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <Typography
            fontFamily={"Inter, sans-serif"}
            fontWeight={600}
            fontSize={"1.25rem"}
          >
            Seleção de IPs
          </Typography>
          <MultiSelect
            style="gray"
            placeholder={"Selecione os IPs"}
            height="53px"
            options={ipOptions}
            selectedOptions={filters.options}
            onChange={(selected) => {
              setFilters({
                ...filters,
                options: selected,
              });
            }}
          />
        </Box>
              
          }

          <Box
            width={"100%"}
            display={"flex"}
            px={"1rem"}
            py={"0.7rem"}
            flexDirection={"row"}
            justifyContent={"left"}
            gap={"1rem"}
            flexWrap={"wrap"}
            flexGrow={1}
            sx={{ alignItems: "center" }}
          >
            <Box
              sx={{
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Typography
                fontFamily={"Inter, sans-serif"}
                fontWeight={600}
                fontSize={"1.25rem"}
              >
                Seleção de Gráficos
              </Typography>
              <ViewSelectionFilter
                filters={graficFilters}
                selectedFilter={filters.chart?.toString() ?? ""}
                onChange={(val: FilterType) => handleWebChange(val)}
              />
            </Box>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              gap="0.75rem"
            >
              <Typography>Filtrar por:</Typography>
              <Box
                display={"flex"}
                flexDirection={"row"}
                gap={"2rem"}
                flexWrap={"wrap"}
              >
                <TextField
                  select
                  label="Grupo"
                  value={filters.group}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      group: e.target.value as MessageFilterGroup,
                    })
                  }
                  sx={{
                    ...focusedTextFieldStyles,
                    backgroundColor: "transparent",
                  }}
                >
                  {filters.chart === FilterType.INTERACTIONS
                    ? ["Ambos", "Grupo", "Número"].map((value) => (
                        <MenuItem key={value} value={value} sx={menuItemStyles}>
                          {value}
                        </MenuItem>
                      ))
                    : ["Ambos", "IP", "Interlocutor"].map((value) => (
                        <MenuItem key={value} value={value} sx={menuItemStyles}>
                          {value}
                        </MenuItem>
                      ))}
                </TextField>

                <TextField
                  select
                  label="Tipo"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      type: e.target.value as MessageFilterType,
                    })
                  }
                  sx={focusedTextFieldStyles}
                >
                  {filters.chart === FilterType.INTERACTIONS
                    ? ["Todos", "Texto", "Vídeo", "Áudio"].map((value) => (
                        <MenuItem key={value} value={value} sx={menuItemStyles}>
                          {value}
                        </MenuItem>
                      ))
                    : ["Todos", "IP", "Interlocutor"].map((value) => (
                        <MenuItem key={value} value={value} sx={menuItemStyles}>
                          {value}
                        </MenuItem>
                      ))}
                </TextField>

                <TextField
                  id="date-initial"
                  InputLabelProps={{ shrink: true }}
                  label="Data Inicial"
                  type="date"
                  value={filters.dateInitial}
                  onChange={(e) =>
                    setFilters({ ...filters, dateInitial: e.target.value })
                  }
                  sx={focusedTextFieldStyles}
                />

                <TextField
                  id="date-final"
                  InputLabelProps={{ shrink: true }}
                  label="Data Final"
                  type="date"
                  value={filters.dateFinal}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFinal: e.target.value })
                  }
                  sx={focusedTextFieldStyles}
                />

                <TextField
                  id="time-initial"
                  InputLabelProps={{ shrink: true }}
                  label="Horário Inicial"
                  type="time"
                  value={filters.timeInitial}
                  onChange={(e) =>
                    setFilters({ ...filters, timeInitial: e.target.value })
                  }
                  sx={focusedTextFieldStyles}
                />

                <TextField
                  id="time-final"
                  InputLabelProps={{ shrink: true }}
                  label="Horário Final"
                  type="time"
                  value={filters.timeFinal}
                  onChange={(e) =>
                    setFilters({ ...filters, timeFinal: e.target.value })
                  }
                  sx={focusedTextFieldStyles}
                />
              </Box>
            </Box>

            {/* Legenda dos Turnos */}
            <Box
              display="flex"
              gap="1.5rem"
              alignItems="center"
              mt="0.5rem"
              sx={{
                transition: "all 0.3s ease-in-out",
              }}
            >
              <Typography
                variant="subtitle2"
                fontFamily="Inter, sans-serif"
                fontWeight={600}
                fontSize="0.95rem"
                color="text.primary"
              >
                Legenda de Turnos:
              </Typography>
              <Box display="flex" gap="1rem" flexWrap="wrap">
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Box
                    width="14px"
                    height="14px"
                    bgcolor="#D62727"
                    borderRadius="50%"
                    sx={{
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontSize="0.95rem"
                    color="text.primary"
                  >
                    Alvos
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Box
                    width="14px"
                    height="14px"
                    bgcolor="#FFD700"
                    borderRadius="50%"
                    sx={{
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontSize="0.95rem"
                    color="text.primary"
                  >
                    Suspeitos
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Collapse>
        <IconButton onClick={toggleExpanded} size="small" disableRipple>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Box
          width="100%"
          height="100%"
          borderRadius="0"
          boxShadow="0px 0px 20px rgba(0,0,0,0.6)"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <WebChart
            data={
              {
                nodes: nodes,
                links: links,
              } as Data
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default WebRoute;
