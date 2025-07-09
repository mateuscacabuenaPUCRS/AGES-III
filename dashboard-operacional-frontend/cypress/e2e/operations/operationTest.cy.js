describe("Teste de Operações - Criação e Seleção", () => {
  beforeEach(() => {
    // Visita a página de operações antes de cada teste
    cy.visit("/operacoes");

    // Aguarda a página carregar completamente
    cy.contains("Selecione uma operação para iniciar a investigação", {
      timeout: 10000,
    }).should("be.visible");
  });

  it("Deve criar uma nova operação e selecioná-la com sucesso", () => {
    const nomeOperacao = `Operação Cypress Teste`;

    // 1. Clica no botão "Criar nova operação"
    cy.get("button")
      .contains("Criar nova operação")
      .should("be.visible")
      .click();

    // 2. Validação: Verifica se o modal de criação apareceu
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Criação Operação").should("be.visible");

    // 3. Validação: Verifica se o campo de nome está presente
    cy.get('input[placeholder="Digite o nome da operação"]').should(
      "be.visible"
    );

    // 4. Validação: Verifica se o botão "Criar operação" está presente
    cy.get("button").contains("Criar operação").should("be.visible");

    // 5. Digita o nome da operação
    cy.get('input[placeholder="Digite o nome da operação"]')
      .clear()
      .type(nomeOperacao);

    // 6. Validação: Verifica se o texto foi digitado corretamente
    cy.get('input[placeholder="Digite o nome da operação"]').should(
      "have.value",
      nomeOperacao
    );

    // 7. Clica no botão "Criar operação"
    cy.get("button").contains("Criar operação").click();

    // 8. Validação: Verifica se o modal foi fechado
    cy.get('[role="dialog"]').should("not.exist");

    // 9. Validação: Verifica se apareceu o alert de sucesso
    cy.get('[role="alert"]').should("be.visible");
    cy.contains("Operação criada com sucesso").should("be.visible");

    // 10. Aguarda o alert desaparecer
    cy.get('[role="alert"]', { timeout: 5000 }).should("not.exist");

    // 11. Validação: Verifica se a nova operação aparece na tabela
    cy.contains(nomeOperacao).should("be.visible");

    // 12. Seleciona a operação criada (clica na linha da tabela)
    cy.contains(nomeOperacao).closest("tr").click();

    // 13. Validação: Verifica se a linha foi selecionada (deve ter cor de fundo diferente)
    cy.contains(nomeOperacao)
      .closest("tr")
      .should("have.class", "Mui-selected");

    // 14. Validação: Verifica se o botão "Confirmar Seleção" está habilitado
    cy.get("button").contains("Confirmar Seleção").should("not.be.disabled");

    // 15. Clica em "Confirmar Seleção"
    cy.get("button").contains("Confirmar Seleção").click();

    // 16. Validação: Verifica se navegou para a página de alvos
    cy.url().should("include", "/alvos");

    // 17. Validação: Verifica se a operação foi passada como parâmetro na URL
    cy.url().should("include", "operacao=");
  });

  it("Deve validar campos obrigatórios no modal de criação", () => {
    // 1. Clica no botão "Criar nova operação"
    cy.get("button").contains("Criar nova operação").click();

    // 2. Tenta criar sem preencher o nome
    cy.get("button").contains("Criar operação").click();

    // 3. Validação: Verifica se aparece mensagem de erro
    cy.contains("Nome da operação não pode estar vazio").should("be.visible");
  });

  it("Deve permitir fechar o modal sem criar operação", () => {
    // 1. Clica no botão "Criar nova operação"
    cy.get("button").contains("Criar nova operação").click();

    // 2. Validação: Modal está aberto
    cy.get('[role="dialog"]').should("be.visible");

    // 3. Clica no botão X para fechar
    cy.get('[aria-label="close"]').click();

    // 4. Validação: Modal foi fechado
    cy.get('[role="dialog"]').should("not.exist");
  });

  it.only("Deve desabilitar botão Confirmar Seleção quando nenhuma operação está selecionada", () => {
    // 1. Validação: Botão deve estar desabilitado inicialmente
    cy.get("button").contains("Confirmar Seleção").should("be.disabled");

    // 2. Seleciona uma operação
    cy.get("tbody tr").first().click();

    // 3. Validação: Botão deve estar habilitado
    cy.get("button").contains("Confirmar Seleção").should("not.be.disabled");

    // 4. Clica novamente para deselecionar
    cy.get("tbody tr").first().click();

    // 5. Validação: Botão deve estar desabilitado novamente
    cy.get("button").contains("Confirmar Seleção").should("be.disabled");
  });
});
