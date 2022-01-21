import promisify from 'cypress-promise';
import { studentEmail1, supabaseLogin } from '../plugins/supabaseLogin';

describe('Challenge Pools', () => {
    beforeEach(async () => {
        await promisify(cy.visit('http://localhost:3000'));
        await supabaseLogin(studentEmail1);
    });

    it('creates a challenge pool', () => {
        // when
        const challengePoolName = createChallengePool()
        cy.wait(500)

        // then
        cy.get('.hoverable').last().should("have.text", challengePoolName);
    });

    it('opens a challenge pool', () => {
        // given
        const challengePoolName = createChallengePool()

        // when
        cy.contains(challengePoolName).click()
        cy.wait(500)

        // then
        cy.get("h1").contains(challengePoolName)
    })
});

function createChallengePool(): string {
    const challengePoolName = "challenge_pool_" + Cypress._.random(0, 1e6)
    cy.get('div.w-full > .w-full').type(challengePoolName)
    cy.get('.w-32').click()
    return challengePoolName
}