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
        
        // then
        cy.get('h1').should("have.text", challengePoolName);
    });

    it('opens a challenge pool', () => {
        // given
        const challengePoolName = createChallengePool()

        // when
        openChallengePool(challengePoolName)

        // then
        cy.get('h1').should('have.text', challengePoolName);
    })

    it('deletes a challenge pool', () => {
        // given
        const challengePoolName = createChallengePool()
        openChallengePool(challengePoolName)
        cy.contains('Settings').click()

        // when
        cy.contains('Delete').click()
        
        // then
        cy.url().should('not.contain', '/challengePool')
    })
});