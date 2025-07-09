import { createContext, useEffect, useState } from "react";
import { Operation } from "../hooks/useOperations";
import { Suspect, Numbers } from "../hooks/useSuspects";
import { WorkSheet } from "../hooks/useWorksheets";
import {
  ChartFilters,
  MessageFilterGroup,
  MessageFilterType,
} from "../interface/dashboard/chartInterface";
import { FilterType } from "../enum/ViewSelectionFilterEnum";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType>({} as AppContextType);

interface AppContextType {
  cpf: string;
  setCpf: (cpf: string) => void;

  operations: Operation[];
  setOperations: (operations: Operation[]) => void;

  suspects: Suspect[];
  setSuspects: (suspects: Suspect[]) => void;

  numbers: Numbers[]; // targets
  setNumbers: (numbers: Numbers[]) => void;

  worksheets: WorkSheet[];
  setWorksheets: (worksheets: WorkSheet[]) => void;

  dashboardFilters: ChartFilters;
  setDashboardFilters: (chartFilters: ChartFilters) => void;

  webChartFilters: ChartFilters;
  setWebChartFilters: (chartFilters: ChartFilters) => void;
}

export const ApplicationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cpf, setCpf] = useState<string>("");
  const [operations, setOperations] = useState<Operation[]>([]);
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [numbers, setNumbers] = useState<Numbers[]>([]);
  const [worksheets, setWorksheets] = useState<WorkSheet[]>([]);

  const [dashboardFilters, setDashboardFilters] = useState<ChartFilters>({
    filterType: FilterType.UNION,
    chart: FilterType.ALL,
    type: MessageFilterType.Texto,
    group: MessageFilterGroup.Ambos,
    options: [] as string[],
    dateInitial: "",
    dateFinal: "",
    timeInitial: "",
    timeFinal: "",
  });

  const today = new Date();
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const [webChartFilters, setWebChartFilters] = useState<ChartFilters>({
    type: MessageFilterType.Todos,
    chart: FilterType.INTERACTIONS,
    group: MessageFilterGroup.Ambos,
    options: [] as string[],
    dateInitial: oneMonthAgo.toISOString().split("T")[0],
    dateFinal: tomorrow.toISOString().split("T")[0],
    timeInitial: "00:00",
    timeFinal: "23:59",
  });

  useEffect(() => {
    setCpf(localStorage.getItem("cpf") ?? "")
  }, []);

  return (
    <AppContext.Provider
      value={{
        cpf,
        setCpf,
        operations,
        setOperations,
        suspects,
        setSuspects,
        numbers,
        setNumbers,
        worksheets,
        setWorksheets,
        dashboardFilters,
        setDashboardFilters,
        webChartFilters,
        setWebChartFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
