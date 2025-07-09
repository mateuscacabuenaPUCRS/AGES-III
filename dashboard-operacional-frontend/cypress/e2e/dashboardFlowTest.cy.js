describe("Login com CPF válido", () => {
  it("testa o fluxo até o dashboard desde o login", () => {
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

    // Seleciona o checkbox da tabela
    cy.get(
      ".MuiTableHead-root > .MuiTableRow-root > .MuiTableCell-paddingCheckbox > .MuiButtonBase-root > .PrivateSwitchBase-input"
    ).click();

    // Clica no botão que leva para /alvos
    cy.get(".css-f0am11 > .MuiButtonBase-root").click();

    // Seleciona o checkbox da tabela
    cy.get(
      ":nth-child(3) > .MuiPaper-root > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiTableContainer-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > .MuiTableCell-paddingCheckbox > .MuiButtonBase-root > .PrivateSwitchBase-input"
    ).click();
    
    // Clica no botão que leva para /dashboard
    cy.get(".css-f0am11 > .MuiButtonBase-root").click();

    //verifica se foi redirecionado para /dashboard
    cy.url().should("include", "/dashboard");

    //clica no botão que redireciona a teia
    cy.get('[href="/teia"] > .MuiBox-root').click();

    // Verifica se foi redirecionado para /teia
    cy.url().should("include", "/teia");
  });
});
