
describe('Practitioner Schedule Component', () => {

    before(() => {
        cy.viewport(Cypress.env('viewport_w'), Cypress.env('viewport_h'));
    })


    beforeEach(() => {
        cy.login();
        cy.visit('/available');
        cy.get('mat-select[data-cy="cyPractitionerList"]').should('be.visible');
        cy.get('mat-select[data-cy="cyPractitionerList"]').click();
        cy.get('mat-option').first().click();

        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        cy.get('input[data-cy="cyDatePicker"]').clear();
        cy.get('input[data-cy="cyDatePicker"]').type(formattedDate);

        cy.contains('button', 'Create').click();

        // cy.get('mat-dialog-actions')
        //     .then(($dialogActions) => {
        //         if ($dialogActions.length > 0) {
        //             cy.wrap($dialogActions)
        //                 .contains('span', 'Ok')
        //                 .then(($span) => {
        //                     if ($span.length > 0) {
        //                         cy.wrap($span).click();
        //                         cy.get('mat-dialog-container').should('not.exist');
        //                     }
        //                 });
        //         }
        //     })
    })


    it('should display the page title', () => {
        cy.get('h2').should('contain.text', 'Practitioner Schedule');
    });



    it('should create a schedule', () => {
        cy.get('table tr[mat-row]').should('have.length.greaterThan', 0);
    });

    it('should save the schedule', () => {

        // cy.intercept({
        //     url: /^(?!.*(login|register)).*$/,
        //     middleware: true
        // }, (req) => {
        //     const accessToken = Cypress.env('accessToken') as string;
        //     if (accessToken) {
        //         req.headers['Authorization'] = `Bearer ${accessToken}`;
        //     }
        // }).as('editSchedule');

        cy.contains('button', 'Save').click({ force: true });
        cy.get('[data-cy=savedFlag]').should('exist');
        // cy.get('@editSchedule').then((interception) => {
        //     console.log('intercept', interception);
    });


    it('should delete the schedule', () => {

        cy.contains('button', 'Delete').click();
        cy.contains('span', 'Ok').click();

        cy.get('table  tr[mat-row]').should('have.length', 0);
    });




})