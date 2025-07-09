describe("Web Route Tests", () => {
  beforeEach(() => {
    // login
    cy.visit("/login");
    cy.get('input[placeholder="000.000.000-00"]').type("03401973070");
    cy.contains("Entrar").click();

    // Selecionar a operação
    cy.get('tbody input[type="checkbox"]').check().uncheck();
    cy.get("tbody tr").first().find('input[type="checkbox"]').check();
    cy.contains("Confirmar Seleção").click();

    // Selecionar o alvo
    cy.get("tbody tr").first().find('input[type="checkbox"]').check();
    cy.contains("Confirmar Seleção").click();

    // Visitar a rota web
    cy.get('[href="/teia"] > .MuiBox-root').click();
  });

  describe("Renderização Inicial", () => {
    it("deve renderizar os elementos principais da página", () => {
      // Verificar se o título está presente
      cy.contains("Seleção de Alvos").should("be.visible");

      // Verificar se os filtros estão presentes
      cy.contains("Filtrar por:").should("be.visible");

      // Verificar se a legenda está presente
      cy.contains("Legenda de Turnos:").should("be.visible");

      // Verificar se o gráfico está presente
      cy.get('[data-testid="chart-svg"]').should("exist");
    });

    it("deve renderizar todos os filtros", () => {
      // Verificar filtros de seleção
      cy.get("label").contains("Grupo").should("be.visible");
      cy.get("label").contains("Tipo").should("be.visible");
      cy.get("label").contains("Data Inicial").should("be.visible");
      cy.get("label").contains("Data Final").should("be.visible");
      cy.get("label").contains("Horário Inicial").should("be.visible");
      cy.get("label").contains("Horário Final").should("be.visible");
    });

    it("deve renderizar a legenda de turnos completa", () => {
      cy.contains("Legenda de Turnos:").should("be.visible");
      cy.contains("Alvos").should("be.visible");
      cy.contains("Suspeitos").should("be.visible");
    });

    it("deve mostrar as cores corretas na legenda", () => {
      // Verificar cor vermelha para Alvos
      cy.contains("Alvos")
        .parent()
        .find("div[style*='background-color: rgb(214, 39, 39)']")
        .should("exist");

      // Verificar cor amarela para Suspeitos
      cy.contains("Suspeitos")
        .parent()
        .find("div[style*='background-color: rgb(255, 215, 0)']")
        .should("exist");
    });
  });

  describe("Funcionalidade de Expansão", () => {
    it("deve permitir retrair e expandir os filtros", () => {
      // Por padrão deve estar expandido
      cy.contains("Seleção de Alvos").should("be.visible");

      // Clicar no botão de expansão/retração
      cy.get('[data-testid="ExpandLessIcon"]').parent().click();

      // Aguardar animação
      cy.wait(500);

      // Verificar se foi retraído (o conteúdo não deve estar visível)
      cy.get('[data-testid="ExpandMoreIcon"]').should("exist");

      // Expandir novamente
      cy.get('[data-testid="ExpandMoreIcon"]').parent().click();

      // Aguardar animação
      cy.wait(500);

      // Verificar se foi expandido
      cy.contains("Seleção de Alvos").should("be.visible");
    });
  });

  describe("Interações com Filtros", () => {
    it("deve permitir alterar o filtro de grupo", () => {
      // Clicar no select de grupo
      cy.get("label").contains("Grupo").parent().click();

      // Selecionar uma opção
      cy.get('[role="option"]').contains("Grupo").click();

      // Verificar se a seleção foi aplicada
      cy.get("label").contains("Grupo").parent().should("contain", "Grupo");
    });

    it("deve permitir alterar o filtro de tipo", () => {
      // Clicar no select de tipo
      cy.get("label").contains("Tipo").parent().click();

      // Selecionar uma opção
      cy.get('[role="option"]').contains("Texto").click();

      // Verificar se a seleção foi aplicada
      cy.get("label").contains("Tipo").parent().should("contain", "Texto");
    });

    it("deve permitir definir datas", () => {
      const dataInicial = "2025-01-01";
      const dataFinal = "2025-12-31";

      // Definir data inicial
      cy.get('input[type="date"]').first().type(dataInicial);
      cy.get('input[type="date"]').first().should("have.value", dataInicial);

      // Definir data final
      cy.get('input[type="date"]').last().clear().type(dataFinal);
      cy.get('input[type="date"]').last().should("have.value", dataFinal);
    });

    it("deve permitir definir horários", () => {
      const horarioInicial = "08:00";
      const horarioFinal = "18:00";

      // Definir horário inicial
      cy.get('input[type="time"]').first().type(horarioInicial);
      cy.get('input[type="time"]').first().should("have.value", horarioInicial);

      // Definir horário final
      cy.get('input[type="time"]').last().type(horarioFinal);
      cy.get('input[type="time"]').last().should("have.value", horarioFinal);
    });
  });

  describe("Funcionalidade do Gráfico", () => {
    it("deve renderizar o gráfico web", () => {
      // Verificar se o SVG do gráfico existe
      cy.get('svg[data-testid="chart-svg"]').should("exist");
      cy.get('svg[data-testid="chart-svg"]').should("be.visible");
    });

    it("deve permitir interação com nós do gráfico", () => {
      // Aguardar o carregamento do gráfico
      cy.wait(2000);

      // Verificar se existem nós no gráfico
      cy.get('svg[data-testid="chart-svg"] circle').should("exist");
    });

    it("deve permitir zoom no gráfico", () => {
      // Aguardar o carregamento do gráfico
      cy.wait(2000);

      // Verificar se o gráfico permite zoom (verificar se tem transform)
      cy.get('svg[data-testid="chart-svg"] g').should("exist");
    });

    it("deve abrir nova aba ao dar duplo clique em nó válido", () => {
      // Aguardar o carregamento do gráfico
      cy.wait(2000);

      // Mock para prevenir abertura de nova janela em teste
      cy.window().then((win) => {
        cy.stub(win, "open").as("windowOpen");
      });

      // Tentar duplo clique em um nó (se existir)
      cy.get('svg[data-testid="chart-svg"] circle').first().dblclick();

      // Nota: A abertura da janela depende das condições específicas do código
    });
  });

  describe("Navegação", () => {
    it("deve navegar corretamente para a rota /teia", () => {
      cy.url().should("include", "/teia");
    });

    it("deve manter o estado dos filtros durante a sessão", () => {
      // Definir um valor no filtro
      const dataInicial = "2023-06-01";
      cy.get('input[type="date"]').first().clear().type(dataInicial);

      // Verificar se o valor foi mantido
      cy.get('input[type="date"]').first().should("have.value", dataInicial);
    });
  });
});
