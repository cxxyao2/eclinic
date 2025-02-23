
import data from '../fixtures/example.json'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface Chainable {
            login(): void;
            logout(): void;
        }
    }
}
// -

// -- This is a parent command --
Cypress.Commands.add('login', () => {

    cy.visit('/login');
    cy.get('input[formControlName="email"]').clear();
    cy.get('input[formControlName="password"]').clear();

    cy.get('input[formControlName="email"]').type(data.email);
    cy.get('input[formControlName="password"]').type(data.password);

    cy.get('button[type="submit"]').click();


});


Cypress.Commands.add('logout', () => {
    console.log('Custom command example: Logout');
    cy.contains('span', 'logout').click();
});