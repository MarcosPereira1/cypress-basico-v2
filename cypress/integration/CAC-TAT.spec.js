/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function() {

    const THREE_SECONDS_IN_MS = 3000                                                                  /*beforeeach é uma boa pratica de uso no teste, ele significa, "antes do teste", entao tudo que precisa executar antes, a gente poem nesse bloco, exemplo, antes de executar um teste eu preciso acessar a page da web primeiro */
    beforeEach(function() {         
        cy.visit('./src/index.html')   
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })
                                                                         /* o .only é para facilitar a execução de nossas feature, ao adicionar o .only só sera executado este teste */
    it('preenche os campos obrigatórios e envia o formulário', function() {     // exibe mensagem por 3 segundos 
       
        cy.clock()

        const longText = 'teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste testeteste teste teste teste'
        cy.get('#firstName').type('Marcos')
        cy.get('#lastName').type('Vinicius')
        cy.get('#email').type('marcospereira@teste.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar' ).click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')

    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock()
        cy.get('#firstName').type('Marcos')
        cy.get('#lastName').type('Vinicius')
        cy.get('#email').type('marcospereira@teste,com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar' ).click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numerico', function() {
        cy.get('#phone')
        .type('abcdfghij')
        .should('have.value', '')  // não tem valor, não espera encontrar nenhum valor 
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.clock()
        cy.get('#firstName').type('Marcos')
        cy.get('#lastName').type('Vinicius')
        cy.get('#email').type('marcospereira@teste.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar' ).click()
        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
        
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {    //exercicio 5
        cy.get('#firstName')
        .type('Marcos')
        .should('have.value', 'Marcos')   // verifica  o valor adicionado do type 
        .clear()
        .should('have.value', '')

        cy.get('#lastName')
        .type('Vinicius')
        .should('have.value', 'Vinicius')  
        .clear()
        .should('have.value', '')

        cy.get('#email')
        .type('marcos.pereira@teste.com')
        .should('have.value', 'marcos.pereira@teste.com')  
        .clear()
        .should('have.value', '')

        cy.get('#open-text-area')
        .type('teste')
        .should('have.value', 'teste')  
        .clear()
        .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.clock()
        
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
        
    })

    it.only('envia o formuário com sucesso usando um comando customizado', function() {
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

// SESSÃO DE LISTA SUSPENSA
    
    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product').select('YouTube')
        .should('have.value', 'youtube')  // verificando o valor não o texto
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product').select('mentoria')
        .should('have.value', 'mentoria') 
    })

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product').select(1)
        .should('have.value', 'blog')
    })

    // Marcando inputs do tipo radio

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio) {                          // o each recebe uma função de callback, que recebe cada um dos argumento em radio, o wrap pega esses elementos e empacota
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })

    })
    
    // checkboxes

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })

//Fazendo upload de arquivos com Cypress

it('seleciona um arquivo da pasta fixtures', function() {
    cy.get('input[type="file"]#file-upload')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json')
    .should(function($input) {
        expect($input[0].files[0].name).to.equal('example.json')
    })
})

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('input[type="file"]#file-upload')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]#file-upload')
        .selectFile('@sampleFile')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })

    })

    // Lidando com links que abrem em outra aba

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
        
        cy.contains('Talking About Testing').should('be.visible')
    })

    // Simulando o viewport de um dispositivo móvel



  })