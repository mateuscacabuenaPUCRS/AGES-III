// hooks/useSuspectInfo.ts
import { useCallback, useEffect, useState } from "react";
import { api } from "../server/service";
import { formatDate } from "../utils/formatUtils";
import {
  suspectInterface,
  suspectResponseInterface,
} from "../interface/suspect/suspectInterface";
import { ResponseApi } from "../interface/responseInterface";

interface Phone {
  id: number;
  numero: string;
  lastUpdateCpf: string;
  lastUpdateDate: string;
}

interface Email {
  id: number;
  email: string;
  lastUpdateCpf: string;
  lastUpdateDate: string;
}

interface IpEntry {
  ip: string;
  ocorrencias: number;
}

interface CreateEmailResponse {
  id: number;
  email: string;
}
interface CreateNumberResponse {
  id: number;
  numero: string;
}

interface SuspectEmail {
  id: number;
  suspeitoId: number;
  email: string;
  lastUpdateCpf: string;
  lastUpdateDate: string;
}

export interface SuspectInfo {
  id: number;
  nome: string;
  apelido: string;
  cpf: string;
  relevante: boolean;
  anotacoes: string;
  emails: Email[];
  celulares: Phone[];
  ips: IpEntry[];
}

export const useSuspectInfo = (id: number) => {
  const [suspect, setSuspect] = useState<SuspectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuspect = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<SuspectInfo>(`/api/suspeito/${id}`);
      const formattedData = {
        ...response.data,
        celulares: response.data.celulares.map((c) => ({
          ...c,
          lastUpdateDate: formatDate(c.lastUpdateDate),
        })),
        emails: response.data.emails.map((c) => ({
          ...c,
          lastUpdateDate: formatDate(c.lastUpdateDate),
        })),
      };
      setSuspect(formattedData);
    } catch (error) {
      setError("Não foi possível carregar os dados do suspeito.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    fetchSuspect();
  }, [id]);

  async function updateSuspectDetails(
    id: string,
    values: Partial<suspectInterface>
  ): Promise<ResponseApi<suspectResponseInterface>> {
    try {
      const response = await api.put<suspectResponseInterface>(
        `/api/suspeito/${id}`,
        {
          nome: values.nome,
          apelido: values.apelido,
          cpf: values.cpf,
          relevante: values.relevante,
          anotacoes: values.anotacoes,
        }
      );

      return {
        response: response.data,
        isSuccess: true,
      };
    } catch (error) {
      setError("Erro ao atualizar os dados do suspeito.");
      return {
        response: undefined,
        isSuccess: false,
      };
    }
  }
  const createSuspectEmail = useCallback(
    async (email: string, userCpf: string): Promise<CreateEmailResponse> => {
      try {
        const cleanUserCpf = userCpf.replace(/\D/g, "");
        const response = await api.post<CreateEmailResponse>(
          `/api/suspeito/${id}/email`,
          {
            email,
          },
          {
            headers: {
              "Content-Type": "application/json",
              cpfUsuario: cleanUserCpf,
            },
          }
        );
        fetchSuspect();
        return response.data;
      } catch (err: unknown) {
        console.error("Erro ao criar email:", err);
        throw new Error("Erro ao criar email do suspeito");
      }
    },
    [id, fetchSuspect]
  );
  const deleteSuspectEmail = async (
    emailId: number
  ): Promise<ResponseApi<void>> => {
    try {
      await api.delete(`/api/suspeito/${id}/email/${emailId}`);

      fetchSuspect();
      return {
        isSuccess: true,
      };
    } catch (error: unknown) {
      console.error("Erro ao deletar email do suspeito:", error);
      throw new Error("Erro ao deletar email do suspeito");
    }
  };
  const createSuspectNumber = useCallback(
    async (
      numbers: number[],
      userCpf: string
    ): Promise<CreateNumberResponse> => {
      try {
        const cleanUserCpf = userCpf.replace(/\D/g, "");
        const response = await api.post<CreateNumberResponse>(
          `/api/suspeito/${id}/numero`,
          {
            numerosIds: numbers,
          },
          {
            headers: {
              "Content-Type": "application/json",
              cpfUsuario: cleanUserCpf,
            },
          }
        );
        await fetchSuspect();
        return response.data;
      } catch (err) {
        throw new Error("Erro ao criar números do suspeito");
      }
    },
    [id, fetchSuspect]
  );

  const deleteSuspectNumber = async (
    numberId: number
  ): Promise<ResponseApi<void>> => {
    try {
      await api.delete(`/api/suspeito/${id}/numero/${numberId}`);

      fetchSuspect();
      return {
        isSuccess: true,
      };
    } catch (error) {
      console.log("Erro ao deletar número ao alvo:", error);
      throw new Error("Erro ao deletar número ao alvo");
    }
  };

  async function updateSuspectEmail(
    emailId: number,
    userCpf: string,
    email: string
  ): Promise<ResponseApi<SuspectEmail>> {
    try {
      const cleanUserCpf = userCpf.replace(/\D/g, "");
      const response = await api.put<SuspectEmail>(
        `/api/suspeito/${id}/email/${emailId}`,
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            cpfUsuario: cleanUserCpf,
          },
        }
      );
      fetchSuspect();
      return {
        response: response.data,
        isSuccess: true,
      };
    } catch (error) {
      setError("Erro ao atualizar o email do suspeito.");
      return {
        response: undefined,
        isSuccess: false,
      };
    }
  }

  return {
    suspect,
    loading,
    error,
    updateSuspectDetails,
    createSuspectEmail,
    updateSuspectEmail,
    createSuspectNumber,
    deleteSuspectNumber,
    deleteSuspectEmail,
  };
};
