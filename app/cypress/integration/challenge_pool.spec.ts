import promisify from 'cypress-promise';
import { createChallengePool, openChallengePool } from '../functions';
import { studentEmail1, studentEmail2, supabaseLogin } from '../plugins/supabaseLogin';

describe('Challenge Pools', () => {
    beforeEach(async () => {
        await promisify(cy.visit('http://localhost:3000'));
        await supabaseLogin(studentEmail1);
    });

    it('creates a challenge pool', () => {
        // when
        const challengePoolName = createChallengePool()
        cy.wait(2_000)

        // then
        cy.get('.hoverable').last().should("have.text", challengePoolName);
    });

    it('opens a challenge pool', () => {
        // given
        const challengePoolName = createChallengePool()

        // when
        openChallengePool(challengePoolName)

        // then
        cy.get('h1').should('have.text', challengePoolName);
    })

    it("doesn't show delete button to not admin", async () => {
        // given
        const challengePoolName = createChallengePool()
        await supabaseLogin(studentEmail2);

        // when
        openChallengePool(challengePoolName)

        // then
        cy.check('.secondary').should('not.exist')
    })

    it('deletes a challenge pool', () => {
        // given
        const challengePoolName = createChallengePool()
        openChallengePool(challengePoolName)

        // when
        cy.get('.secondary').click()

        // then
        cy.url().should('not.contain', '/challengePool')
    })
});