
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


    })


    it('should display the page title', () => {
        cy.get('h2').should('contain.text', 'Practitioner Schedule');
    });



    it('should create a schedule', () => {
        cy.get('table tr[mat-row]').should('have.length.greaterThan', 0);
    });

    it('should save the schedule successfully', () => {

        const backendURL = Cypress.env('backendURL')
        cy.spy(console, 'log').as('log');

        cy.intercept('POST', `${backendURL}/api/PractitionerSchedules`, (req) => {
            req.reply((res) => {
                console.log('Response body:', res.body);
                return res;
            });
        }).as('postApiCall');


        cy.contains('button', 'Save').click({ force: true });
        cy.wait('@postApiCall').then((interception) => {
            // 验证响应状态码是否为 200
            expect(interception.response.statusCode).to.equal(200);
        });

        cy.wait(10000);

        cy.get('@log').its('callCount').should('equal', 57)



    });


    it('should delete the schedule', () => {

        cy.contains('button', 'Delete').click();
        cy.contains('span', 'Ok').click();

        cy.get('table  tr[mat-row]').should('have.length', 0);
    });




})