describe('example to-do app', () => {
    beforeEach(() => {
        cy.visit('https://lightbulb-learning.io/oauth')
    })

    it('does something very smart', () => {
        cy.get('.container > button').click()
        cy.get('#login_field').type("testing-lightbulb-learning-on-prod")
        cy.get('#password').type("")
        cy.get('.btn').click()
    })
})