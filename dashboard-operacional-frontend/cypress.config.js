import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    env: {
      apiUrl: "http://localhost:8000",
    },
    setupNodeEvents(on, config) {
      on("task", {
        renomearArquivo(nomeOriginal) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const novoNome = `arquivo_${timestamp}.xlsx`;
          const origem = path.join(
            __dirname,
            "cypress",
            "fixtures",
            nomeOriginal
          );
          const destino = path.join(__dirname, "cypress", "fixtures", novoNome);

          fs.copyFileSync(origem, destino);
          return destino;
        },
      });
    },
  },
});
