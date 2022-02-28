import { createChallengePool, openChallengePool } from '../functions';
import { supabaseLogin } from '../plugins/supabaseLogin';

describe('Challenge Pools', () => {
	beforeEach(() => {
		supabaseLogin();
	});

	it('opens "join a challenge pool" when user has none')

	it('opens the challenge pool right after creation', () => {
		cy.get('.text-gray-100').click();
		cy.contains('Create').click();

		// when
		const challengePoolName = createChallengePool();

		// then
		cy.get('h1').should('have.text', challengePoolName);
	});

	it('opens a challenge pool', () => {
		// given
		const challengePoolName = createChallengePool();

		// when
		openChallengePool(challengePoolName);

		// then
		cy.get('h1').should('have.text', challengePoolName);
	});

	it('deletes a challenge pool', () => {
		// given
		openChallengePool(createChallengePool());
		cy.contains('Settings').click();

		// when
		cy.contains('Settings').click().wait(500);
		cy.contains('Delete').click();

		// then
		cy.url().should('not.contain', '/challengePool');
	});
});
