import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { BarChartData } from "../components/dashboard/WebChart/BarChart";
import { api } from "../server/service";
import {
    MessageGroupToBackend,
    MessageTypeToBackend,
} from "../interface/dashboard/chartInterface";

export const useDayMessages = () => {
    const {
        dashboardFilters: filters,
        numbers,
        suspects,
        operations,
    } = useContext(AppContext);

    const [messages, setMessages] = useState<BarChartData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                setError(null); // limpa erro anterior
                const payload = {
                    numeros: numbers.map((n) => n.numero),
                    grupo: MessageGroupToBackend[filters.group],
                    tipo: MessageTypeToBackend[filters.type],
                    data_inicial: filters.dateInitial || null,
                    data_final: filters.dateFinal || null,
                    hora_inicio: filters.timeInitial || null,
                    hora_fim: filters.timeFinal || null,
                    operacoes: operations.map((o) => o.id),
                    suspeitos: suspects.map((s) => s.id),
                };

                const response = await api.get("/api/mensagens/dia", {
                    params: payload,
                });
                const rawData = response.data || [];

                const formatted: BarChartData[] = rawData.map((item: any) => ({
                    key: item.dia?.toString() || "desconhecido",
                    value: item.qtdMensagens ?? 0,
                }));

                const emptyDays = formatted.every((item) => item.value === 0);

                setMessages(rawData.length === 0 || emptyDays ? [] : formatted);
            } catch (err: any) {
                setMessages([]);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
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
        messages,
        isLoading,
        error,
    };
};
