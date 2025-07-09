describe("CreateSuspectModal", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get('input[placeholder="000.000.000-00"]').type("03401973070");
    cy.contains("Entrar").click();

    cy.visit("/alvos");
  });

  it("deve preencher o formulario de criar um alvo", () => {
    cy.get(".css-h9yv4t > .MuiButtonBase-root").click();

    cy.get('input[placeholder="Digite o apelido do suspeito"]').type(
      "Suspeito Teste"
    );

    cy.get('input[placeholder="Digite o nome do suspeito"]').type(
      "Suspeito Teste"
    );

    cy.get(
      ".MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root"
    ).click();
    cy.get('[role="option"]').eq(0).click();
    cy.get('[role="option"]').eq(1).click();
    cy.get('[role="dialog"]').click(10, 10);

    cy.get('input[placeholder="Digite o CPF do suspeito"]')
      .clear()
      .type("05102625039");

    cy.contains("Criar alvo").click();

    cy.contains("Criação Alvos").should("not.exist");
  });
});
