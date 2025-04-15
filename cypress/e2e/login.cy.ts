import data from '../fixtures/example.json'

describe('Login Component', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', '');
    });
    cy.visit('/login');
  });


  it('should display the login form', () => {
    // 验证登录表单是否显示
    cy.get('mat-card').should('be.visible');
    cy.get('input[formControlName="email"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });



  it('should show validation error for invalid email', () => {

    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[formControlName="email"]').type('invalidemail');
    cy.get('input[formControlName="password"]').type('password');

    cy.get('mat-error').contains('Please enter a valid email address.').should('be.visible');
  });

  it('should handle successful login', () => {
    const backendURL = Cypress.env('backendURL')

    cy.intercept('POST', `${backendURL}/api/Auth/login`, {
      statusCode: 200,
      body: {
        accessToken: 'testAccessToken',
        user: { name: 'Test User' }
      }
    }).as('loginRequest');


    cy.get('input[formControlName="email"]').type(data.email);
    cy.get('input[formControlName="password"]').type(data.password);


    cy.get('button[type="submit"]').click();


    cy.wait('@loginRequest');


    cy.url().should('include', '/dashboard');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.equal('testAccessToken');
   
    });
  });

  it('should handle failed login', () => {
    const backendURL = Cypress.env('backendURL')

    cy.intercept('POST', `${backendURL}/api/Auth/login`, {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginRequest');


    cy.get('input[formControlName="email"]').type('test@example.com');
    cy.get('input[formControlName="password"]').type('wrongpassword');


    cy.get('button[type="submit"]').click();


    cy.wait('@loginRequest');


    cy.get('.error-message').should('contain.text', 'auth/refresh-token: 404 Not Found');


    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.be.null;
      expect(win.localStorage.getItem('email')).to.be.null;
    });
  });
});