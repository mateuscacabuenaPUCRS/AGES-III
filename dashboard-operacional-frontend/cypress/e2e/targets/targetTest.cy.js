describe("Teste de Alvos - Criação e Seleção", () => {
  beforeEach(() => {
    // Visita a página de alvos antes de cada teste
    cy.visit("/alvos");

    // Aguarda a página carregar completamente
    cy.contains("Selecione os alvos para exibição do dashboard", {
      timeout: 10000,
    }).should("be.visible");
  });

  it("Deve criar um novo alvo e selecioná-lo com sucesso", () => {
    const apelidoAlvo = `Alvo Cypress Teste`;
    const nomeAlvo = `Nome Completo Teste`;

    // 1. Clica no botão "Criar novo alvo"
    cy.get("button").contains("Criar novo alvo").should("be.visible").click();

    // 2. Validação: Verifica se o modal de criação apareceu
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Criação Alvos").should("be.visible");

    // 3. Validação: Verifica se os campos estão presentes
    cy.get('input[placeholder="Digite o apelido do suspeito"]').should(
      "be.visible"
    );
    cy.get('input[placeholder="Digite o nome do suspeito"]').should(
      "be.visible"
    );
    cy.contains("Números vinculados a esse alvo*").should("be.visible");
    cy.get('input[placeholder="Digite o CPF do suspeito"]').should(
      "be.visible"
    );

    // 4. Validação: Verifica se o botão "Criar alvo" está presente
    cy.get("button").contains("Criar alvo").should("be.visible");

    // 5. Preenche o apelido do alvo (campo obrigatório)
    cy.get('input[placeholder="Digite o apelido do suspeito"]')
      .clear()
      .type(apelidoAlvo);

    // 6. Preenche o nome do alvo (campo opcional)
    cy.get('input[placeholder="Digite o nome do suspeito"]')
      .clear()
      .type(nomeAlvo);

    // 7. Seleciona um número (campo obrigatório)
    cy.get('input[placeholder="Selecione os números"]').click();

    // 8. Aguarda as opções carregarem e seleciona um número disponível
    cy.get('[role="listbox"]').should("be.visible");
    cy.get('[role="option"]').first().click();

    // 9. Clica fora para fechar o dropdown
    cy.get("body").click(0, 0);

    // 10. Validação: Verifica se os dados foram preenchidos
    cy.get('input[placeholder="Digite o apelido do suspeito"]').should(
      "have.value",
      apelidoAlvo
    );
    cy.get('input[placeholder="Digite o nome do suspeito"]').should(
      "have.value",
      nomeAlvo
    );

    // 11. Clica no botão "Criar alvo"
    cy.get("button").contains("Criar alvo").click();

    // 12. Validação: Verifica se o modal foi fechado
    cy.get('[role="dialog"]').should("not.exist");
  });

  it("Deve validar campos obrigatórios no modal de criação", () => {
    // 1. Clica no botão "Criar novo alvo"
    cy.get("button").contains("Criar novo alvo").click();

    // 2. Tenta criar sem preencher nenhum campo
    cy.get("button").contains("Criar alvo").click();

    // 3. Validação: Verifica se aparece mensagem de erro para apelido
    cy.contains("Apelido do suspeito é obrigatório").should("be.visible");

    // 4. Preenche apenas o apelido e tenta submeter
    cy.get('input[placeholder="Digite o apelido do suspeito"]').type("Teste");
    cy.get("button").contains("Criar alvo").click();

    // 5. Validação: Verifica se aparece mensagem para números obrigatórios
    cy.contains("CPF deve ter 11 dígitos").should("be.visible");

    // 6. Testa validação de apelido vazio
    cy.get('input[placeholder="Digite o apelido do suspeito"]').clear();
    cy.get("button").contains("Criar alvo").click();
    cy.contains("Apelido do suspeito não pode estar vazio").should(
      "be.visible"
    );
  });

  it("Deve validar CPF quando preenchido", () => {
    // 1. Abre o modal
    cy.get("button").contains("Criar novo alvo").click();

    // 2. Preenche um CPF inválido
    cy.get('input[placeholder="Digite o CPF do suspeito"]').type("12345678901");

    // 3. Clica fora do campo para acionar validação
    cy.get('input[placeholder="Digite o apelido do suspeito"]').click();

    // 4. Validação: Verifica mensagem de CPF inválido
    cy.contains("CPF inválido").should("be.visible");

    // 5. Preenche um CPF com poucos dígitos
    cy.get('input[placeholder="Digite o CPF do suspeito"]').clear().type("123");
    cy.get('input[placeholder="Digite o apelido do suspeito"]').click();

    // 6. Validação: Verifica mensagem de CPF com poucos dígitos
    cy.contains("CPF deve ter 11 dígitos").should("be.visible");
  });

  it("Deve permitir fechar o modal sem criar alvo", () => {
    // 1. Clica no botão "Criar novo alvo"
    cy.get("button").contains("Criar novo alvo").click();

    // 2. Validação: Modal está aberto
    cy.get('[role="dialog"]').should("be.visible");

    // 3. Clica no botão X para fechar
    cy.get('[aria-label="close"]').click();

    // 4. Validação: Modal foi fechado
    cy.get('[role="dialog"]').should("not.exist");
  });

  it("Deve habilitar/desabilitar botão Confirmar Seleção baseado na seleção", () => {
    // 1. Validação: Verifica se existem tabelas de suspeitos e números
    cy.contains("Suspeitos").should("be.visible");
    cy.contains("Números Interceptados").should("be.visible");

    // 2. Verifica estado inicial do botão (pode estar habilitado se houver seleções prévias)
    cy.get("button").contains("Confirmar Seleção").should("exist");

    // 3. Se houver dados na tabela, testa seleção
    cy.get("tbody tr").then(($rows) => {
      if ($rows.length > 0) {
        // Seleciona primeiro item da tabela de suspeitos
        cy.get("tbody tr").first().click();

        // Validação: Botão deve estar habilitado
        cy.get("button")
          .contains("Confirmar Seleção")
          .should("not.be.disabled");

        // Deseleciona clicando novamente
        cy.get("tbody tr").first().click();
      }
    });
  });

  it("Deve permitir seleção múltipla de alvos", () => {
    // 1. Verifica se há múltiplos itens na tabela
    cy.get("tbody tr").then(($rows) => {
      if ($rows.length > 1) {
        // Seleciona primeiro item
        cy.get("tbody tr").eq(0).click();

        // Seleciona segundo item
        cy.get("tbody tr").eq(1).click();

        // Validação: Ambos devem estar selecionados
        cy.get("tbody tr.Mui-selected").should("have.length.at.least", 2);

        // Botão deve estar habilitado
        cy.get("button")
          .contains("Confirmar Seleção")
          .should("not.be.disabled");
      }
    });
  });

  it("Deve navegar para detalhes do suspeito ao clicar em Detalhes", () => {
    // 1. Verifica se há dados na tabela de suspeitos
    cy.get("tbody tr").then(($rows) => {
      if ($rows.length > 0) {
        // Procura pelo botão "Detalhes" na primeira linha
        cy.get("tbody tr")
          .first()
          .within(() => {
            cy.get("button").contains("Detalhes").click();
          });

        // 2. Validação: Deve navegar para página de detalhes
        cy.url().should("include", "/dashboard/detalhesSuspeito/");
      }
    });
  });
});
