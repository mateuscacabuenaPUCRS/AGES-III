describe("Login com CPF válido", () => {
  it("deve redirecionar para /operacoes após inputar um CPF válido", () => {
    // Acessa a página de login
    cy.visit("/login");

    // Digita um CPF válido
    cy.get('input[placeholder="000.000.000-00"]').type("03401973070");

    // Clica no botão de entrar
    cy.contains("Entrar").click();

    // Verifica se foi redirecionado para /operacoes
    cy.url().should("include", "/operacoes");

    // Verifica se o CPF foi salvo no localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("cpf")).to.equal("034.019.730-70");
    });
  });
});

describe("Login com CPF inválido", () => {
  it("deve permanecer na página de login e exibir mensagem de erro", () => {
    // Acessa a página de login
    cy.visit("/login");

    // Digita um CPF inválido
    cy.get('input[placeholder="000.000.000-00"]').type("12345678900");

    // Clica no botão de entrar
    cy.contains("Entrar").click();

    // Verifica se permaneceu na página de login
    cy.url().should("include", "/login");

    // Verifica se a mensagem de erro é exibida
    cy.contains("CPF inválido").should("exist");
  });
});