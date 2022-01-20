import promisify from 'cypress-promise';
import { studentEmail1, supabaseLogin } from '../../plugins/supabaseLogin';

describe('Login', () => {
	beforeEach(async () => {
		await promisify(cy.visit('http://localhost:3000'));
		await supabaseLogin(studentEmail1);
	});

	it('login works', () => {
		cy.get('h1').should('contain', 'Challenge Pools');
	});
});
