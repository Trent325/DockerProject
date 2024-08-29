describe('Applicant login and navigation', () => {
  it('Applicant login should pass', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.get('#formBasicEmail').type("rushilpatra");
    cy.get('#formBasicPassword').type("rushil123");
    cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(1)').click();
    cy.get('#root > div > div > div > form > button').click();
  });
  it('Applicant applicaion should submit', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.get('#formBasicEmail').type("rushilpatra");
    cy.get('#formBasicPassword').type("rushil123");
    cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(1)').click();
    cy.get('#root > div > div > div > form > button').click();
    cy.wait(2000);
    cy.get('#root > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-1.css-as8t27-MuiGrid-root > div > div > div > div > h1').click();
    cy.wait(2000);
    cy.get('#root > section > div > div > div > button').click();
  });
  it('Applicant should be able to view all applied jobs', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.get('#formBasicEmail').type("rushilpatra");
    cy.get('#formBasicPassword').type("rushil123");
    cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(1)').click();
    cy.get('#root > div > div > div > form > button').click();
    cy.wait(2000);
    cy.get('#basic-navbar-nav > div > a:nth-child(2)').click();
    cy.wait(2000);
    cy.get('#root > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-1.css-as8t27-MuiGrid-root > div > div > div > h1');

  });
  it('Should navigate to the Profile page when clicking on the Profile link', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.get('#formBasicEmail').type("rushilpatra");
    cy.get('#formBasicPassword').type("rushil123");
    cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(1)').click();
    cy.get('#root > div > div > div > form > button').click();
    cy.xpath('//*[@id="basic-navbar-nav"]/div/a[3]').click();
});
it('Should update the profile', () => {
  cy.visit('http://127.0.0.1:5173/');
  cy.get('#formBasicEmail').type("rushilpatra");
  cy.get('#formBasicPassword').type("rushil123");
  cy.get('#root > div > div > div > form > div:nth-child(3) > div > div:nth-child(1)').click();
  cy.get('#root > div > div > div > form > button').click();
  cy.xpath('//*[@id="basic-navbar-nav"]/div/a[3]').click();
  cy.wait(2000); 
  cy.get('#root > div > div > div > div > div.makeCenter > button').click();

  cy.get('#root > div > div > form > div:nth-child(2) > input[type=text]').type('Rushil Patra');
  cy.get('#root > div > div > form > div:nth-child(3) > input[type=text]').type('Rutgers');
  cy.get('#root > div > div > form > div:nth-child(4) > input[type=text]').type('Ms Computer Science');
  cy.wait(2000);
  cy.get('#root > div > div > form > div.button-group > button.save-button').click();
});
});


