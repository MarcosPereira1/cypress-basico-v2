Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Marcos')
    cy.get('#lastName').type('Vinicius')
    cy.get('#email').type('marcospereira@teste.com')
    cy.get('#open-text-area').type('teste')
    cy.get('button[type="submit"]').click()  
})