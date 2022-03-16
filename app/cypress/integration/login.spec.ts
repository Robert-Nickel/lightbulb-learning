import { student1, supabaseLogin, getLoginUrl } from '../plugins/supabaseLogin';

describe('Login', () => {
	beforeEach(() => {
		supabaseLogin();
	});

	it('login works', () => {
		cy.get('h1').should('contain', 'Challenge Pools');
	});

	it('login works2', () => {
		cy.get('h1').should('contain', 'Challenge Pools');
	});
});
