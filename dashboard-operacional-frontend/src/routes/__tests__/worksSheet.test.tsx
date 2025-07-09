// import { ThemeProvider } from "@emotion/react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { describe, it, expect, vi, beforeEach } from "vitest";
// import { BrowserRouter } from "react-router-dom";
// import Worksheet from "../Worksheet";
// import { theme } from "../../theme";
// import { WorkSheet } from "../../hooks/useWorksheets";

// // Mock do hook de input de busca
// vi.mock("../../hooks/useHeaderInput", () => ({
//   useHeaderInput: () => ({ headerInputValue: "" }),
// }));

// // Mock do hook de operações
// vi.mock("../../hooks/useOperations", () => ({
//   useOperations: () => ({
//     filteredOperations: [
//       { id: 1, nome: "Operação X" },
//       { id: 2, nome: "Operação Y" },
//     ],
//   }),
// }));

// // Dados fictícios
// const mockWorksheets: WorkSheet[] = [
//   {
//     id: 1,
//     nome: "Planilha A",
//     size: 2048,
//     data_upload: "2024-01-01",
//     status: "Salva",
//   },
//   {
//     id: 2,
//     nome: "Planilha B",
//     size: 3072,
//     data_upload: "2024-01-02",
//     status: "Salva",
//   },
// ];

// // Funções mockadas do hook `useWorksheets`
// const mockAddPendingUpload = vi.fn();
// const mockAssociateJobId = vi.fn();
// const mockRemovePendingUpload = vi.fn();

// // Mock do hook de planilhas
// vi.mock("../../hooks/useWorksheets", () => ({
//   useWorksheets: () => ({
//     filteredWorksheets: mockWorksheets,
//     addPendingUpload: mockAddPendingUpload,
//     associateJobId: mockAssociateJobId,
//     removePendingUpload: mockRemovePendingUpload,
//     isLoading: false,
//     error: null,
//   }),
// }));

// // Mock da tabela
// vi.mock("../../components/Table/Table", () => ({
//   default: ({ onSelectionChange }: any) => (
//     <div data-testid="mock-table">
//       Mocked Table
//       <button onClick={() => onSelectionChange([1], [mockWorksheets[0]])}>
//         Selecionar Planilha
//       </button>
//     </div>
//   ),
// }));

// // Mock do controller de upload
// vi.mock("../../controllers/sheetController", () => ({
//   sheetController: {
//     uploadSheet: vi.fn().mockResolvedValue({ job_id: "fake-job-id" }),
//   },
// }));

// // Mock do modal de upload
// vi.mock("../../components/modal/uploadWorksheetModal", () => ({
//   default: ({ isOpen, onUploadSuccess, onClose }: any) =>
//     isOpen ? (
//       <div data-testid="mock-modal">
//         Modal Aberto
//         <button
//           onClick={() =>
//             onUploadSuccess(
//               new File(["conteúdo"], "Planilha C.xlsx", {
//                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//               }),
//               1
//             )
//           }
//         >
//           Upload Planilha
//         </button>
//         <button onClick={onClose}>Fechar</button>
//       </div>
//     ) : null,
// }));

// // Função utilitária
// const renderWithProviders = () =>
//   render(
//     <ThemeProvider theme={theme}>
//       <BrowserRouter>
//         <Worksheet />
//       </BrowserRouter>
//     </ThemeProvider>
//   );

// // Testes
// describe("Worksheet Component", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("deve renderizar o título e o botão de upload", () => {
//     renderWithProviders();
//     expect(screen.getByText("Histórico de Planilhas")).toBeInTheDocument();
//     expect(screen.getByText("Upload de arquivos")).toBeInTheDocument();
//   });

//   it("deve exibir a tabela com planilhas", () => {
//     renderWithProviders();
//     expect(screen.getByTestId("mock-table")).toBeInTheDocument();
//   });

//   it("deve abrir o modal ao clicar em 'Upload de arquivos'", () => {
//     renderWithProviders();
//     fireEvent.click(screen.getByText("Upload de arquivos"));
//     expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
//   });

//   it("deve fechar o modal ao clicar no botão de fechar", async () => {
//     renderWithProviders();
//     fireEvent.click(screen.getByText("Upload de arquivos"));
//     fireEvent.click(screen.getByText("Fechar"));
//     await waitFor(() => {
//       expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
//     });
//   });
  
// //   it("deve chamar a função de upload ao fazer upload de uma planilha", async () => {
// //     renderWithProviders();
// //     fireEvent.click(screen.getByText("Upload de arquivos"));
// //     fireEvent.click(screen.getByText("Upload Planilha"));

// //     await waitFor(() => {
// //       expect(mockAddPendingUpload).toHaveBeenCalledWith("Planilha C.xlsx", expect.any(Number));
// //       expect(mockAssociateJobId).toHaveBeenCalledWith("Planilha C.xlsx", "fake-job-id");
// //     });
// //   });
// // });
