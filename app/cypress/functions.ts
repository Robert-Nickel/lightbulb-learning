/**
 * Export functions that are used from multiple spec files here.
 * If you export it in spec file A, and import it in spec file B
 * spec file A will be executed each time when spec file B is executed
 */

export function createChallengePool(): string {
    cy.get('.text-gray-100').click()
    cy.contains('Create').click()
    const challengePoolName = randomText("challenge_pool")
    cy.get('div.w-full > .w-full').type(challengePoolName)
    cy.get('.w-32').click()
    return challengePoolName
}

export function openChallengePool(challengePoolName: string) {
    cy.visit('http://localhost:3000')
    cy.wait(2_000)
    cy.contains(challengePoolName).click()
}

export function randomText(prefix: string) {
    return prefix + "_" + Cypress._.random(0, 1e6)
}