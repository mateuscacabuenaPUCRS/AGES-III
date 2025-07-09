import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { api } from "../server/service";
import {
  MessageGroupToBackend,
  MessageTypeToBackend,
} from "../interface/dashboard/chartInterface";

export interface TeiaNode {
  id: string;
  label?: string;
  group: number;
  suspeitoId?: string;
}

export interface TeiaLink {
  source: string;
  target: string;
  value: number;
}

interface TeiaMessageCountResponse {
  nodes: TeiaNode[];
  links: TeiaLink[];
}

export const useTeiaMessageCount = () => {
  const {
    dashboardFilters: filters,
    numbers,
    suspects,
    operations,
  } = useContext(AppContext);

  const [data, setData] = useState<TeiaMessageCountResponse>({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTeiaData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('fetching teia data with filters:');

        const payload = {
          numeros: numbers.map((n) => n.numero),
          grupo: MessageGroupToBackend[filters.group],
          tipo: MessageTypeToBackend[filters.type],
          data_inicial: filters.dateInitial ?? null,
          data_final: filters.dateFinal ?? null,
          hora_inicio: filters.timeInitial ?? null,
          hora_fim: filters.timeFinal ?? null,
          operacoes: operations.map((o) => o.id),
          suspeitos: suspects.map((s) => s.id),
        };

        const response = await api.get("/api/teia/message", { params: payload });

        setData({
          nodes: response.data?.nodes ?? [],
          links: response.data?.links ?? [],
        });

      } catch (err: any) {
        setError(err);
        setData({ nodes: [], links: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeiaData();
  }, [
    numbers,
    suspects,
    operations,
    filters.group,
    filters.type,
    filters.dateInitial,
    filters.dateFinal,
    filters.timeInitial,
    filters.timeFinal,
  ]);

  return {
    teiaData: data,
    isLoading,
    error,
  };
};
