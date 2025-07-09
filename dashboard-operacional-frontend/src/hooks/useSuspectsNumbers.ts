// hooks/useSuspectInfo.ts
import { useEffect, useState } from "react";
import { api } from "../server/service";

export interface SuspectNumber {
  id: number;
  value: string;
  suspect: boolean;
  numeros: string[];
}

export const useSuspectNumbers = () => {
  const [suspectsNumbers, setSuspectsNumbers] = useState<
    { id: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchSuspect = async () => {
      try {
        setLoading(true);
        const response = await api.get<SuspectNumber[]>(
          `/api/alvos?showSuspects=true`
        );
        const result = response.data
          .filter((item) => /^\d+$/.test(item.value))
          .map((item) => ({
            id: item.id.toString(),
            label: item.value,
          }));
        setSuspectsNumbers(result);
      } catch (err) {
        setError("Não foi possível carregar os numeros.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuspect();
  }, []);

  return { suspectsNumbers, loading, error };
};
