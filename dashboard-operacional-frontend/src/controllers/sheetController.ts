import endpoints from '../constants/endpoints';
import { api } from '../server/service';

export interface SheetResponse {
  Planilhas: Array<{
    id: number;
    nome: string;
    data_upload: string;
    size: number;
  }>;
}

export interface PendingJob {
  job_id: string;
  nome: string;
  size: number;
  data_upload?: string;
}

export interface SheetUploadRequest {
  file: File;
  operacaoId: number;
}

class SheetController {
  async getAllSheets(): Promise<SheetResponse> {
    const response = await api.get<SheetResponse>(endpoints.SHEETS.getAll);
    return response.data;
  }

  async getPendingJobs(): Promise<PendingJob[]> {
    try {
      const response = await api.get<PendingJob[]>(endpoints.SHEETS.getPendingJobs);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async uploadSheet(request: SheetUploadRequest): Promise<{ job_id: string }> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('operacaoId', request.operacaoId.toString());

    const response = await api.post<{ job_id: string }>(
      endpoints.SHEETS.upload,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
  async getUploadProgress(jobId: string): Promise<{
    status: string;
    progress: number;
    erro: boolean;
    mensagem: string | null;
  }> {
    const response = await api.get(endpoints.SHEETS.getProgress + `/${jobId}`);
    return response.data;
  }


}
export const sheetController = new SheetController();
