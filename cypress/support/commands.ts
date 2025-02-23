
import data from '../fixtures/example.json'

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => { 
    console.log("Email is", email)
 })
