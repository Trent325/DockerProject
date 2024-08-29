describe('Admin login and navigation', () => {
    it('Admin login should pass', () => {
      cy.visit('http://127.0.0.1:5173/');
      cy.get('#formBasicEmail').type("admin");
      cy.get('#formBasicPassword').type("admin");
      cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(3) > label').click();
      cy.get('#root > div > div > div > form > button').click();
    });
    it('Admin dashboard should load', () => {
        cy.visit('http://127.0.0.1:5173/');
        cy.get('#formBasicEmail').type("admin");
        cy.get('#formBasicPassword').type("admin");
        cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(3) > label').click();
        cy.get('#root > div > div > div > form > button').click();
        cy.wait(2000);
        cy.get('#basic-navbar-nav > div > a').click();
      });
      it('Admin logout', () => {
        cy.visit('http://127.0.0.1:5173/');
        cy.get('#formBasicEmail').type("admin");
        cy.get('#formBasicPassword').type("admin");
        cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(3) > label').click();
        cy.get('#root > div > div > div > form > button').click();
        cy.wait(2000);
        cy.get('#basic-navbar-nav > div > a').click();
        cy.get('#basic-navbar-nav > div > button').click();
      });
});