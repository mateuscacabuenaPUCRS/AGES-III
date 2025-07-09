import endpoints from "../constants/endpoints";
import { ChartInformation } from "../interface/dashboard/chartInterface";
import { ResponseApi } from "../interface/responseInterface";
import { handleAxiosError } from "../response/errors";
import { api } from "../server/service";
const { DASHBOARD } = endpoints;
/**
 * Exemplo de função delete
 *
 * @param chartId - Identificador único do gráfico a ser removido
 * @returns Uma Promise que resolve para um objeto ResponseApi indicando sucesso ou erro
 */
export const deleteDashboardChart = async (
  chartId: string
): Promise<ResponseApi<void>> => {
  try {
    // Faz uma requisição DELETE para a API usando o endpoint fornecido pela constante DASHBOARD.deleteChart
    // Passa o ID do chart como parte da URL
    await api.delete(DASHBOARD.deleteChart(chartId));

    // Retorna um objeto de sucesso se a requisição for bem-sucedida
    return {
      isSuccess: true,
    };
  } catch (error) {
    // Se ocorrer um erro, utiliza a função handleAxiosError para processar o erro
    // e retornar um objeto de resposta com informações sobre o erro
    return handleAxiosError(error);
  }
};

/**
 * Exemplo de função get
 *
 * @returns Uma Promise que resolve para um objeto ResponseApi contendo as informações do paciente
 */
export const getChartInformation = async (): Promise<
  ResponseApi<ChartInformation> // interface ChartInformation tipo de dado retornado pela API
> => {
  try {
    // Faz uma requisição GET para a API usando o endpoint fornecido pela constante PACIENT.getPacientData
    // Passa um parametro que a api espera ("")
    const response = await api.get<ChartInformation>(
      DASHBOARD.getAllChartsRequests("parametro que a api espera")
    );

    // Extrai os dados da resposta da API
    const data = response.data;

    // Retorna um objeto de sucesso contendo os dados do paciente
    return {
      isSuccess: true,
      response: data,
    };
  } catch (error) {
    // Se ocorrer um erro, utiliza a função handleAxiosError para processar o erro
    // e retornar um objeto de resposta com informações sobre o erro
    return handleAxiosError(error);
  }
};

/**
 * Exemplo de função de envio de relatório
 *
 * @param requestId - Identificador único da solicitação relacionada ao relatório
 * @param userId - Identificador único do usuário que está enviando o relatório
 */
export const sendCharthReport = async (
  requestId: string,
  userId: string
): Promise<ResponseApi<string>> => {
  try {
    // Faz uma requisição PATCH para a API usando o endpoint fornecido pela constante DASHBOARD.sendReport
    // Envia os dados do relatório no corpo da requisição (ID da solicitação, ID do usuário)
    await api.patch<ChartInformation>(DASHBOARD.sendReport, {
      requestId: requestId, // ID da solicitação relacionada
      userId: userId, // ID do usuário que está enviando
    });

    // Retorna um objeto de sucesso se a requisição for bem-sucedida
    return {
      isSuccess: true,
    };
  } catch (error) {
    // Se ocorrer um erro, utiliza a função handleAxiosError para processar o erro
    // e retornar um objeto de resposta com informações sobre o erro
    return handleAxiosError(error);
  }
};
