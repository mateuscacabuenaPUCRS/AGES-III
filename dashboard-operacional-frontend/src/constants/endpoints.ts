const endpoints = {
  DASHBOARD: {
    // EX: página de dashboard
    deleteChart: (chartId: string) => `/chart/${chartId}`,
    getAllChartsRequests: (chartId: string) => `/request/charts/${chartId}`,
    sendReport: "/send/resport/charts/",
  },
  SUSPECT: {},
  OPERATION: {
    // EX: página de operações
    createOperation: "api/operacao",
    getAllOperations: "api/operacao",
    getOperationById: (operationId: string) => `/operation/${operationId}`,
  },
  WEB: {
    // EX: página do gráfico de teia
    createWeb: "api/teia/message"
  },
  SHEETS: {
    getAll: 'api/planilha',
    upload: 'api/interceptacao/upload',
    getProgress: 'api/upload/progresso',
    getPendingJobs: 'api/upload/progresso'
  },
};

export default endpoints;
