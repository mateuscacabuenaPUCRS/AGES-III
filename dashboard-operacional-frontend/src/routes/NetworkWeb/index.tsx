import { Box, MenuItem, TextField, Typography, Collapse, IconButton } from "@mui/material";
import React, { useState, useMemo } from "react";
import WebChart from "../../components/dashboard/WebChart/WebChart";
import MultiSelect, { Option } from "../../components/multiSelect";
import dayjs from "dayjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  },
};

const mockData = {
  nodes: [
    // IPs - Grupo 1 (Azul Claro) - Turno da Manhã
    { id: "192.168.1.100", group: 1 },
    { id: "192.168.1.101", group: 1 },
    { id: "192.168.1.102", group: 1 },
    { id: "192.168.1.103", group: 1 },

    // IPs - Grupo 2 (Verde Claro) - Turno da Tarde
    { id: "10.0.0.50", group: 2 },
    { id: "10.0.0.51", group: 2 },
    { id: "10.0.0.52", group: 2 },
    { id: "10.0.0.53", group: 2 },

    // IPs - Grupo 3 (Roxo Claro) - Turno da Noite
    { id: "172.16.0.25", group: 3 },
    { id: "172.16.0.26", group: 3 },
    { id: "172.16.0.27", group: 3 },
    { id: "172.16.0.28", group: 3 },

    // Alvos (Grupo 4 - Vermelho) - Destaque
    { id: "Alvo 1", group: 4 },
    { id: "Alvo 2", group: 4 },
    { id: "Alvo 3", group: 4 },
    { id: "Alvo 4", group: 4 },
    { id: "Alvo 5", group: 4 },
    { id: "Alvo 6", group: 4 },
  ],
  links: [
    // Exemplo de datas fictícias para cada link
    {
      source: "192.168.1.100",
      target: "Alvo 1",
      value: 450,
      date: "2024-06-01",
    },
    {
      source: "192.168.1.100",
      target: "Alvo 2",
      value: 320,
      date: "2024-06-02",
    },
    {
      source: "192.168.1.101",
      target: "Alvo 2",
      value: 390,
      date: "2024-06-03",
    },
    {
      source: "192.168.1.102",
      target: "Alvo 3",
      value: 280,
      date: "2024-06-04",
    },
    {
      source: "192.168.1.103",
      target: "Alvo 4",
      value: 510,
      date: "2024-06-05",
    },
    {
      source: "192.168.1.100",
      target: "Alvo 5",
      value: 420,
      date: "2024-06-06",
    },
    { source: "10.0.0.50", target: "Alvo 1", value: 290, date: "2024-06-01" },
    { source: "10.0.0.51", target: "Alvo 3", value: 280, date: "2024-06-02" },
    { source: "10.0.0.52", target: "Alvo 4", value: 510, date: "2024-06-03" },
    { source: "10.0.0.53", target: "Alvo 6", value: 380, date: "2024-06-04" },
    { source: "10.0.0.50", target: "Alvo 2", value: 290, date: "2024-06-05" },
    { source: "172.16.0.25", target: "Alvo 3", value: 220, date: "2024-06-06" },
    { source: "172.16.0.26", target: "Alvo 4", value: 310, date: "2024-06-01" },
    { source: "172.16.0.27", target: "Alvo 1", value: 180, date: "2024-06-02" },
    { source: "172.16.0.28", target: "Alvo 5", value: 420, date: "2024-06-03" },
    { source: "172.16.0.25", target: "Alvo 6", value: 390, date: "2024-06-04" },
    {
      source: "192.168.1.100",
      target: "192.168.1.101",
      value: 150,
      date: "2024-06-05",
    },
    {
      source: "192.168.1.101",
      target: "192.168.1.102",
      value: 200,
      date: "2024-06-06",
    },
    {
      source: "192.168.1.102",
      target: "192.168.1.103",
      value: 180,
      date: "2024-06-01",
    },
    {
      source: "10.0.0.50",
      target: "10.0.0.51",
      value: 200,
      date: "2024-06-02",
    },
    {
      source: "10.0.0.51",
      target: "10.0.0.52",
      value: 190,
      date: "2024-06-03",
    },
    {
      source: "10.0.0.52",
      target: "10.0.0.53",
      value: 170,
      date: "2024-06-04",
    },
    {
      source: "172.16.0.25",
      target: "172.16.0.26",
      value: 180,
      date: "2024-06-05",
    },
    {
      source: "172.16.0.26",
      target: "172.16.0.27",
      value: 190,
      date: "2024-06-06",
    },
    {
      source: "172.16.0.27",
      target: "172.16.0.28",
      value: 200,
      date: "2024-06-01",
    },
    {
      source: "192.168.1.100",
      target: "10.0.0.50",
      value: 420,
      date: "2024-06-02",
    },
    {
      source: "10.0.0.51",
      target: "172.16.0.25",
      value: 290,
      date: "2024-06-03",
    },
    {
      source: "172.16.0.26",
      target: "192.168.1.101",
      value: 310,
      date: "2024-06-04",
    },
    {
      source: "192.168.1.102",
      target: "10.0.0.52",
      value: 380,
      date: "2024-06-05",
    },
    {
      source: "10.0.0.53",
      target: "172.16.0.27",
      value: 290,
      date: "2024-06-06",
    },
    {
      source: "172.16.0.28",
      target: "192.168.1.103",
      value: 310,
      date: "2024-06-01",
    },
    {
      source: "192.168.1.101",
      target: "Alvo 1",
      value: 380,
      date: "2024-06-02",
    },
    { source: "10.0.0.50", target: "Alvo 3", value: 290, date: "2024-06-03" },
    { source: "172.16.0.25", target: "Alvo 2", value: 310, date: "2024-06-04" },
    {
      source: "192.168.1.102",
      target: "Alvo 5",
      value: 320,
      date: "2024-06-05",
    },
    { source: "10.0.0.51", target: "Alvo 4", value: 350, date: "2024-06-06" },
    { source: "172.16.0.26", target: "Alvo 6", value: 270, date: "2024-06-01" },
  ],
};


const options: Option[] = mockData.nodes
  .filter((x) => x.group !== 4) 
  .map((node) => ({
    id: node.id,
    label: node.id,
  }));

const NetworkWebRoute: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [selectedType, setSelectedType] = useState("IP");
  const [selectedGroup, setSelectedGroup] = useState("Ambos");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedShift, setSelectedShift] = useState("Todos");
  
  // Definir data inicial como 1 mês atrás
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const [dateInitial, setDateInitial] = useState(oneMonthAgo.toISOString().split('T')[0]);
  const [dateFinal, setDateFinal] = useState("");
  const [timeInitial, setTimeInitial] = useState("00:00");
  const [timeFinal, setTimeFinal] = useState("23:59");

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Filtragem dos nós e links
  const filteredData = useMemo(() => {
    let nodes = mockData.nodes;
    let links = mockData.links;

    // Filtro por datas
    if (dateInitial || dateFinal) {
      links = links.filter((link) => {
        const linkDate = dayjs(link.date);
        const afterInitial = dateInitial
          ? linkDate.isAfter(dayjs(dateInitial)) ||
            linkDate.isSame(dayjs(dateInitial))
          : true;
        const beforeFinal = dateFinal
          ? linkDate.isBefore(dayjs(dateFinal)) ||
            linkDate.isSame(dayjs(dateFinal))
          : true;
        return afterInitial && beforeFinal;
      });
      // Só mantém nós conectados
      const nodeIds = new Set(links.flatMap((l) => [l.source, l.target]));
      nodes = nodes.filter((n) => nodeIds.has(n.id));
    }

    // Filtro por IPs selecionados
    if (selectedOptions.length > 0) {
      nodes = nodes.filter(
        (node) => selectedOptions.includes(node.id) || node.group === 4 // Sempre mostrar alvos
      );
      const nodeIds = nodes.map((n) => n.id);
      links = links.filter(
        (link) => nodeIds.includes(link.source) && nodeIds.includes(link.target)
      );
    }

    // Filtro por Grupo
    if (selectedGroup !== "Ambos") {
      if (selectedGroup === "IP") {
        nodes = nodes.filter((node) => node.group !== 4);
      } else if (selectedGroup === "Interlocutor") {
        nodes = nodes.filter((node) => node.group === 4);
      }
      const nodeIds = nodes.map((n) => n.id);
      links = links.filter(
        (link) => nodeIds.includes(link.source) && nodeIds.includes(link.target)
      );
    }

    // Filtro por Tipo (apenas exemplo, pois não há campo de tipo real)
    if (selectedType !== "Todos") {
      if (selectedType === "IP") {
        nodes = nodes.filter((node) => node.group !== 4);
      } else if (selectedType === "Interlocutor") {
        nodes = nodes.filter((node) => node.group === 4);
      }
      const nodeIds = nodes.map((n) => n.id);
      links = links.filter(
        (link) => nodeIds.includes(link.source) && nodeIds.includes(link.target)
      );
    }

    // Filtro de Turno
    if (selectedShift !== "Todos") {
      links = links.filter((link) => {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);
        if (!sourceNode || !targetNode) return false;
        if (selectedShift === "Manhã") {
          return sourceNode.group === 1 && targetNode.group === 1;
        } else if (selectedShift === "Tarde") {
          return sourceNode.group === 2 && targetNode.group === 2;
        } else if (selectedShift === "Noite") {
          return sourceNode.group === 3 && targetNode.group === 3;
        }
        return true;
      });
      // Só mantém nós conectados
      const nodeIds = new Set(links.flatMap((l) => [l.source, l.target]));
      nodes = nodes.filter((n) => nodeIds.has(n.id));
    }

    return { nodes, links };
  }, [
    selectedOptions,
    selectedGroup,
    selectedType,
    selectedShift,
    dateInitial,
    dateFinal,
  ]);

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
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        borderBottom={expanded ? "1px solid #e0e0e0" : "none"}
        sx={{
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Collapse in={expanded} timeout="auto">
          <Box 
            display="flex" 
            flexDirection="column" 
            gap="1.5rem" 
            px="1.5rem"
            py="1rem"
            sx={{
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Box
              sx={{
                width: "fit-content",
                minWidth: "25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <Typography
                fontFamily={"Inter, sans-serif"}
                fontWeight={600}
                fontSize={"1.25rem"}
                color="text.primary"
              >
                Seleção de IPs
              </Typography>
              <MultiSelect
                style="gray"
                placeholder="Selecione os IPs"
                height="53px"
                options={options}
                selectedOptions={selectedOptions}
                onChange={setSelectedOptions}
              />
            </Box>

            <Box width="100%" display="flex" flexDirection="column" gap="0.75rem">
              <Typography
                variant="caption"
                fontSize={"14px"}
                fontFamily="Inter, sans-serif"
                fontWeight={600}
                color="text.primary"
              >
                Filtrar por:
              </Typography>

              <Box 
                display="flex" 
                flexDirection="row" 
                flexWrap="wrap" 
                gap="2.5rem"
                sx={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <TextField
                  select
                  label="Grupo"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  sx={{ ...focusedTextFieldStyles, backgroundColor: "transparent" }}
                >
                  {["IP", "Interlocutor", "Ambos"].map((value) => (
                    <MenuItem key={value} value={value} sx={menuItemStyles}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Tipo"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  sx={focusedTextFieldStyles}
                >
                  <MenuItem value="IP" sx={menuItemStyles}>
                    IP
                  </MenuItem>
                  <MenuItem value="Interlocutor" sx={menuItemStyles}>
                    Interlocutor
                  </MenuItem>
                  <MenuItem value="Todos" sx={menuItemStyles}>
                    Todos
                  </MenuItem>
                </TextField>

                <TextField
                  select
                  label="Turno"
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  sx={focusedTextFieldStyles}
                >
                  {["Todos", "Manhã", "Tarde", "Noite"].map((value) => (
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
                  value={dateInitial}
                  onChange={(e) => setDateInitial(e.target.value)}
                  sx={focusedTextFieldStyles}
                />

                <TextField
                  id="date-final"
                  InputLabelProps={{ shrink: true }}
                  label="Data Final"
                  type="date"
                  value={dateFinal}
                  onChange={(e) => setDateFinal(e.target.value)}
                  sx={focusedTextFieldStyles}
                />

                <TextField
                  id="time-initial"
                  InputLabelProps={{ shrink: true }}
                  label="Horário Inicial"
                  type="time"
                  value={timeInitial}
                  onChange={(e) => setTimeInitial(e.target.value)}
                  sx={focusedTextFieldStyles}
                />

                <TextField
                  id="time-final"
                  InputLabelProps={{ shrink: true }}
                  label="Horário Final"
                  type="time"
                  value={timeFinal}
                  onChange={(e) => setTimeFinal(e.target.value)}
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
              mb="1rem"
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
                    bgcolor="#000A2F"
                    borderRadius="50%"
                    sx={{
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                  <Typography variant="body2" fontSize="0.95rem" color="text.primary">
                    Madrugada (00h-6h)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Box
                    width="14px"
                    height="14px"
                    bgcolor="#808CBF"
                    borderRadius="50%"
                    sx={{
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                  <Typography variant="body2" fontSize="0.95rem" color="text.primary">
                    Manhã (6h-12h)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Box
                    width="14px"
                    height="14px"
                    bgcolor="#31438C"
                    borderRadius="50%"
                    sx={{
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                  <Typography variant="body2" fontSize="0.95rem" color="text.primary">
                    Tarde (12h-18h)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Box
                    width="14px"
                    height="14px"
                    bgcolor="#0F1E55"
                    borderRadius="50%"
                    sx={{
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                  <Typography variant="body2" fontSize="0.95rem" color="text.primary">
                    Noite (18h-00h)
                  </Typography>
                </Box>
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
                  <Typography variant="body2" fontSize="0.95rem" color="text.primary">
                    Alvos
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Collapse>
        <IconButton 
          onClick={toggleExpanded} 
          size="small" 
          disableRipple
          sx={{
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Box
        flex={1}
        bgcolor="#181818"
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
          <WebChart data={filteredData} />
        </Box>
      </Box>
    </Box>
  );
};

export default NetworkWebRoute;
