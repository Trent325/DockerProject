describe('HR login and navigation', () => {
    it('HR login should pass', () => {
      cy.visit('http://127.0.0.1:5173/');
      cy.get('#formBasicEmail').type("rushilpatrahr");
      cy.get('#formBasicPassword').type("rushil123");
      cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(2) > label').click();
      cy.get('#root > div > div > div > form > button').click();
    });
    it('HR Job post should pass', () => {
        cy.visit('http://127.0.0.1:5173/');
        cy.get('#formBasicEmail').type("rushilpatrahr");
        cy.get('#formBasicPassword').type("rushil123");
        cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(2) > label').click();
        cy.get('#root > div > div > div > form > button').click();
        cy.get('#root > div > div:nth-child(2) > button').click();
        cy.wait(3000);
        cy.get('body > div.MuiModal-root.css-79ws1d-MuiModal-root > div:nth-child(3) > form > div:nth-child(1) > div').type("test job");
        cy.get('body > div.MuiModal-root.css-79ws1d-MuiModal-root > div:nth-child(3) > form > div:nth-child(2)').type("test description");
        cy.get('body > div.MuiModal-root.css-79ws1d-MuiModal-root > div:nth-child(3) > form > div:nth-child(3) > div').type("test location");
        cy.get('body > div.MuiModal-root.css-79ws1d-MuiModal-root > div:nth-child(3) > form > div:nth-child(4)').type("test category");
        // cy.get('body > div.MuiModal-root.css-79ws1d-MuiModal-root > div:nth-child(3) > form > div:nth-child(5) > div').type("2024-11-1");
        cy.get('button[data-testid="open-datepicker"]').click();

// Select a specific date, for example, August 28, 2024
cy.get('div[aria-label="Aug 28, 2024"]').click();
      });
});