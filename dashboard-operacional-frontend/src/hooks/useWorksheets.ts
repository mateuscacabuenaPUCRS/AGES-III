import { useMemo, useState, useEffect } from "react";
import { normalizeString } from "../utils/formatUtils";
import { sheetController } from "../controllers/sheetController";
import { GenericData } from "../interface/table/tableInterface";

export interface WorkSheet extends GenericData {
  id: number;
  nome: string;
  size: number;
  data_upload: string;
  status?: string;
  progress?: number;
  job_id?: string;
  [key: string]: string | number | string[] | undefined;
}

interface UseWorksheetsProps {
  searchTerm: string;
}

export const useWorksheets = ({ searchTerm }: UseWorksheetsProps) => {
  const [worksheets, setWorksheets] = useState<WorkSheet[]>([]);
  const [pendingUploads, setPendingUploads] = useState<WorkSheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch planilhas persistidas
  useEffect(() => {
    fetchSheetsAgain();
    fetchPendingJobs();
  }, []);

  // Agrupa todas as planilhas (persistidas + pendentes)
  const filteredWorksheets = useMemo(() => {
    let combined = [...pendingUploads, ...worksheets];

    if (searchTerm?.trim()) {
      const normalizedSearch = normalizeString(searchTerm.trim());
      combined = combined.filter(
        (w) =>
          normalizeString(w.nome).includes(normalizedSearch) ||
          String(w.id).includes(normalizedSearch)
      );
    }

    return combined.sort((a, b) => a.nome.localeCompare(b.nome));
  }, [searchTerm, worksheets, pendingUploads]);

  function addPendingUpload(nome: string, size: number, job_id?: string) {
    const id = Date.now();

    const newSheet: WorkSheet = {
      id: id,
      nome,
      size,
      data_upload: new Date().toISOString().slice(0, 10),
      job_id,
      status: job_id ? "Recebendo arquivo" : "Aguardando job_id",
      progress: 0,
    };

    setPendingUploads((prev) => prev.filter(sheet => sheet.nome !== nome))
    setPendingUploads((prev) => [...prev, newSheet]);

    if (job_id) {
      pollUploadProgress(job_id);
    }
  }

  function removePendingUpload(name: string) {
    setPendingUploads((prev) =>
      prev.map((p) =>
        p.nome === name ? { ...p, status: "Erro ao iniciar upload", progress: 0 } : p
      )
    );
  }
  function associateJobId(nome: string, job_id: string) {
    setPendingUploads((prev) =>
      prev.map((p) =>
        p.nome === nome && !p.job_id ? { ...p, job_id, status: "Recebendo arquivo" } : p
      )
    );

    pollUploadProgress(job_id);
  }

  function updatePendingProgress(job_id: string, status: string, progress: number) {
    setPendingUploads((prev) =>
      prev.map((p) =>
        p.job_id === job_id ? { ...p, status, progress } : p
      )
    );
  }

  function pollUploadProgress(job_id: string) {
    let errorCount = 0;
    const MAX_ERRORS = 5;

    const interval = setInterval(async () => {
      try {
        const progress = await sheetController.getUploadProgress(job_id);
        updatePendingProgress(job_id, progress.status, progress.progress);
        errorCount = 0; // reset erro se sucesso

        if (progress.erro) {
          clearInterval(interval);
          return;
        }

        if (progress.status === "Concluído") {
          clearInterval(interval);
          setPendingUploads((prev) => prev.filter((p) => p.job_id !== job_id));
          fetchSheetsAgain();
        }
      } catch (error) {
        errorCount += 1;

        if (errorCount >= MAX_ERRORS) {
          updatePendingProgress(job_id, "Erro de conexão com backend", 0);
          clearInterval(interval);
        }
      }
    }, 1000);
  }

  async function fetchSheetsAgain() {
    try {
      setIsLoading(true); // Adicionado
      const response = await sheetController.getAllSheets();
      const transformed = Array.isArray(response.Planilhas)
        ? response.Planilhas.map((sheet) => ({
          id: sheet.id,
          nome: sheet.nome,
          size: sheet.size,
          data_upload: sheet.data_upload,
          status: "Concluído",
        }))
        : [];
      setWorksheets(transformed);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to refresh worksheets"));
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPendingJobs() {
    try {
      const jobs = await sheetController.getPendingJobs();

      if (!Array.isArray(jobs)) return;

      setPendingUploads((prev) => {
        const existingJobIds = new Set(prev.map((p) => p.job_id));
        const newUploads: WorkSheet[] = [];

        for (const job of jobs) {
          if (!existingJobIds.has(job.job_id)) {
            newUploads.push({
              id: Date.now() + Math.random(),
              nome: job.nome,
              size: job.size,
              data_upload: job.data_upload ?? new Date().toISOString().slice(0, 10),
              job_id: job.job_id,
              status: "Recebendo arquivo",
              progress: 0,
            });

            pollUploadProgress(job.job_id);
          }
        }

        return [...prev, ...newUploads];
      });
    } catch (err) {
      // Se ocorrer um erro ao buscar os jobs pendentes, não faz nada
    }
  }

  return {
    filteredWorksheets,
    isLoading,
    error,
    addPendingUpload,
    associateJobId,
    removePendingUpload
  };
};
