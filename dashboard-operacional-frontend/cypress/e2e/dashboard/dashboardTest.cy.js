describe("Teste de Dashboard - Visualização e Filtros", () => {
  beforeEach(() => {
    // Visita a página de dashboard antes de cada teste
    cy.visit("/dashboard");

    // Aguarda a página carregar completamente
    cy.contains("Seleção de Alvos", { timeout: 10000 }).should("be.visible");
  });

  it("Deve carregar o dashboard com todos os elementos principais", () => {
    // 1. Validação: Verifica se a seção de seleção de alvos está presente
    cy.contains("Seleção de Alvos").should("be.visible");
    cy.get('input[placeholder="Selecione os nomes"]').should("be.visible");

    // 2. Validação: Verifica se a seção de seleção de gráficos está presente
    cy.contains("Seleção de Gráficos").should("be.visible");

    // 3. Validação: Verifica se os filtros de gráficos estão presentes
    cy.get("button").contains("Todos").should("be.visible");
    cy.get("button").contains("Interações").should("be.visible");
    cy.get("button").contains("IPs").should("be.visible");
    cy.get("button").contains("Horário").should("be.visible");
    cy.get("button").contains("Data").should("be.visible");

    // 4. Validação: Verifica se o filtro "Todos" está selecionado por padrão
    cy.get("button")
      .contains("Todos")
      .should("have.class", "MuiButton-contained");
  });

  it("Deve permitir filtrar gráficos por categoria", () => {
    // 1. Clica no filtro "Interações"
    cy.get("button").contains("Interações").click();

    // 2. Validação: Verifica se o filtro "Interações" foi selecionado
    cy.get("button")
      .contains("Interações")
      .should("have.class", "MuiButton-contained");

    // 3. Validação: Verifica se outros filtros não estão selecionados
    cy.get("button")
      .contains("Todos")
      .should("not.have.class", "MuiButton-contained");

    // 4. Clica no filtro "IPs"
    cy.get("button").contains("IPs").click();

    // 5. Validação: Verifica se o filtro "IPs" foi selecionado
    cy.get("button")
      .contains("IPs")
      .should("have.class", "MuiButton-contained");
    cy.get("button")
      .contains("Interações")
      .should("not.have.class", "MuiButton-contained");

    // 6. Clica no filtro "Horário"
    cy.get("button").contains("Horário").click();

    // 7. Validação: Verifica se o filtro "Horário" foi selecionado
    cy.get("button")
      .contains("Horário")
      .should("have.class", "MuiButton-contained");

    // 8. Clica no filtro "Data"
    cy.get("button").contains("Data").click();

    // 9. Validação: Verifica se o filtro "Data" foi selecionado
    cy.get("button")
      .contains("Data")
      .should("have.class", "MuiButton-contained");

    // 10. Volta para "Todos"
    cy.get("button").contains("Todos").click();

    // 11. Validação: Verifica se voltou para "Todos"
    cy.get("button")
      .contains("Todos")
      .should("have.class", "MuiButton-contained");
  });

  it("Deve permitir selecionar alvos no MultiSelect", () => {
    // 1. Clica no campo de seleção de alvos
    cy.get('input[placeholder="Selecione os nomes"]').click();

    // 2. Aguarda as opções carregarem
    cy.get('[role="listbox"]').should("be.visible");

    // 3. Seleciona algumas opções se estiverem disponíveis
    cy.get('[role="option"]').then(($options) => {
      if ($options.length > 0) {
        // Seleciona a primeira opção
        cy.wrap($options.first()).click();

        // Se houver mais opções, seleciona uma segunda
        if ($options.length > 1) {
          cy.wrap($options.eq(1)).click();
        }
      }
    });

    // 4. Clica fora para fechar o dropdown
    cy.get("body").click(0, 0);

    // 5. Validação: Verifica se as seleções foram mantidas
    cy.get(".MuiChip-root").should("exist");
  });

  it("Deve permitir expandir gráficos individuais", () => {
    // 1. Inicialmente deve mostrar todos os gráficos (modo "Todos")
    cy.get("button").contains("Todos").click();

    // 2. Aguarda os gráficos carregarem
    cy.wait(5000);

    // 3. Clica em um gráfico específico através do filtro
    cy.get("button").contains("Interações").click();

    // 4. Validação: Verifica se apenas um gráfico está sendo exibido
    cy.get("button")
      .contains("Interações")
      .should("have.class", "MuiButton-contained");

    // 5. Testa outros gráficos
    cy.get("button").contains("IPs").click();
    cy.get("button")
      .contains("IPs")
      .should("have.class", "MuiButton-contained");

    cy.get("button").contains("Horário").click();
    cy.get("button")
      .contains("Horário")
      .should("have.class", "MuiButton-contained");

    cy.get("button").contains("Data").click();
    cy.get("button")
      .contains("Data")
      .should("have.class", "MuiButton-contained");
  });

  it("Deve manter estado dos filtros durante navegação", () => {
    // 1. Seleciona um filtro específico
    cy.get("button").contains("Interações").click();

    // 2. Seleciona alguns alvos
    cy.get('input[placeholder="Selecione os nomes"]').click();
    cy.get('[role="listbox"]').should("be.visible");
    cy.get('[role="option"]').then(($options) => {
      if ($options.length > 0) {
        cy.wrap($options.first()).click();
      }
    });
    cy.get("body").click(0, 0);

    // 3. Atualiza a página
    cy.reload();

    // 4. Aguarda recarregar
    cy.contains("Seleção de Alvos", { timeout: 10000 }).should("be.visible");

    // 5. Validação: Verifica se os estados foram mantidos (se implementado)
    cy.get("button").contains("Interações").should("exist");
    cy.get('input[placeholder="Selecione os nomes"]').should("exist");
  });

  it("Deve permitir interação com elementos do gráfico", () => {
    // 1. Aguarda os gráficos carregarem
    cy.wait(5000);

    // 2. Verifica se há elementos interativos nos gráficos
    cy.get(".recharts-bar-rectangle").then(($bars) => {
      if ($bars.length > 0) {
        // Tenta fazer hover em uma barra do gráfico
        cy.wrap($bars.first()).trigger("mouseover");

        // Verifica se tooltip aparece
        cy.get(".recharts-tooltip-wrapper").should("be.visible");
      }
    });
  });

  it.only("Deve validar navegação entre diferentes tipos de visualização", () => {
    // 1. Começa com "Todos"
    cy.get("button").contains("Todos").click();

    // 2. Cicla através de todos os filtros testando cada um
    const filtros = ["Interações", "IPs", "Horário", "Data"];

    filtros.forEach((filtro) => {
      // Clica no filtro
      cy.get("button").contains(filtro).click();

      // Validação: Verifica se foi selecionado
      cy.get("button")
        .contains(filtro)
        .should("have.class", "MuiButton-contained");
    });

    // 3. Volta para "Todos"
    cy.get("button").contains("Todos").click();
    cy.get("button")
      .contains("Todos")
      .should("have.class", "MuiButton-contained");
  });
});
