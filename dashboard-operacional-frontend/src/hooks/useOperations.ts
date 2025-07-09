import { useEffect, useMemo, useState, useCallback } from "react";
import { formatDate, normalizeString } from "../utils/formatUtils";
import { GenericData } from "../interface/operationSuspectTable/operationSuspectTableInterface";
import { api } from "../server/service";
import endpoints from "../constants/endpoints";

export interface Operation extends GenericData {
  id: number;
  nome: string;
  data_criacao: string;
  qtdAlvos: number;
}

interface UseOperationsProps {
  searchTerm: string;
}

export const useOperations = ({ searchTerm }: UseOperationsProps) => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

const fetchOperations = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await api.get<Operation[]>(
      endpoints.OPERATION.getAllOperations
    );

    const formattedData = response.data.map((op) => ({
      ...op,
      data_criacao: formatDate(op.data_criacao),
    }));

    setOperations(formattedData);
  } catch (err) {
    setError(new Error("Erro ao buscar operações"));
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const createOperation = useCallback(
    async (operationName: string): Promise<Operation> => {
      try {
        const response = await api.post<Operation>(
          endpoints.OPERATION.createOperation,
          { nome: operationName }
        );

        fetchOperations();
        
        return response.data;        
      } catch (err) {
        throw new Error("Erro ao criar operação");
      }
    },
    []
  );

  const filteredOperations = useMemo(() => {
    const trimmed = searchTerm.trim();

    if (!trimmed) return [...operations].sort(sortByOperationName);

    const normalizedSearch = normalizeString(trimmed);

    return operations
      .filter(
        (operation) =>
          normalizeString(operation.nome).includes(normalizedSearch) ||
          String(operation.id).includes(normalizedSearch) ||
          normalizeString(operation.data_criacao).includes(normalizedSearch)
      )
      .sort(sortByOperationName);
  }, [searchTerm, operations]);

  return {
    filteredOperations,
    loading,
    error,
    setOperations,
    createOperation,
    fetchOperations
  };
};

const sortByOperationName = (a: Operation, b: Operation) =>
  a.nome.localeCompare(b.nome);