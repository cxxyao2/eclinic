describe('Chat Feature', () => {
  beforeEach(() => {
    cy.login(); // Using your existing login command
    cy.visit('/chat');
  });

  it('should create and join a chat room', () => {
    // Create room
    cy.contains('Create New Room').click();
    cy.get('input[formControlName="patientId"]').type('123');
    cy.get('input[formControlName="topic"]').type('Test Chat Room');
    cy.contains('button', 'Create Room').click();

    // Verify room creation
    cy.url().should('include', '/chat/');
    cy.contains('Test Chat Room').should('be.visible');
  });

  it('should send and receive messages in real-time', () => {
    // Create test room first
    cy.contains('Create New Room').click();
    cy.get('input[formControlName="patientId"]').type('123');
    cy.get('input[formControlName="topic"]').type('Test Chat Room');
    cy.contains('button', 'Create Room').click();

    // Send message
    cy.get('input[formControlName="message"]').type('Hello World{enter}');
    
    // Verify message appears
    cy.contains('Hello World').should('be.visible');
  });

  it('should handle connection loss and reconnection', () => {
    // Join a room
    cy.contains('Test Chat Room').click();

    // Simulate connection loss
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'));
    });

    // Verify disconnection state
    cy.contains('Disconnected').should('be.visible');

    // Simulate reconnection
    cy.window().then((win) => {
      win.dispatchEvent(new Event('online'));
    });

    // Verify reconnection
    cy.contains('Connected').should('be.visible');
  });
});