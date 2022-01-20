import { createClient } from '@supabase/supabase-js';
import { definitions } from '../../src/lib/models/supabase';

/**
 * We store the refresh_tokens of test users in the test_tokens table.
 * This way we can synchronize the refresh_tokens between different test runs and make sure
 * that it is always updated in sequence. Because refresh_tokens can only be used once.
 */

export const studentEmail1 = 'll-student1@discardmail.com';
export const studentEmail2 = 'll-student2@discardmail.com';

export const supabaseLogin = async (email: string) => {
	const refresh_token = await getRefreshToken(email);
	const session = await getSession(refresh_token);
	await setRefreshToken(email, session.refresh_token);
	window.localStorage.setItem('supabase.auth.token', JSON.stringify({ currentSession: session }));
};

const supabaseUrl = 'https://ckjsuzpqlhcjbonsnuzp.supabase.co';
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjA2NjY2MCwiZXhwIjoxOTU3NjQyNjYwfQ.mcsY3yNw8SMmcd_ltjLIRpnvnH2Kr1mq-IC2bXUFuSI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getRefreshToken = async (email: string) => {
	const { error, data } = await supabase
		.from<definitions['test_tokens']>('test_tokens')
		.select('refresh_token')
		.eq('email', email);
	if (error) console.error('error getting refresh token:\n' + JSON.stringify(error, null, 2));
	return data[0].refresh_token;
};

const setRefreshToken = async (email: string, refresh_token: string) => {
	const { error } = await supabase
		.from<definitions['test_tokens']>('test_tokens')
		.upsert({ refresh_token, email })
		.eq('email', email);
	if (error) console.error('error setting refresh token:\n' + JSON.stringify(error, null, 2));
};

const getSession = async (refresh_token: string) => {
	return fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token&apikey=${supabaseAnonKey}`, {
		method: 'POST',
		body: JSON.stringify({ refresh_token })
	})
		.then((res) => res.json())
		.catch((err) => console.error(err));
};
