import * as jwt from 'jsonwebtoken';

const jwtSecret = 'super-secret-jwt-token-with-at-least-32-characters-long';
export const student1 = {
    email: 'll-student1@discardmail.com',
    id: '6a4cb762-5ddd-46a0-9db1-46684fe04daa'
};

export const loginStudent = async (page) => {
    await page.goto(getLoginUrl(student1), { waitUntil: 'networkidle' });
    await page.goto('http://localhost:3000');
}

const getLoginUrl = (person) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 10); // does not fix the issue: 1 minute buffer to avoid clock sync issues with server (not needed when we run server locally)
    const exp = now.setHours(now.getHours() + 1);
    const token = jwt.sign(
        {
            aud: 'authenticated',
            exp,
            sub: person.id,
            email: person.email,
            phone: '',
            app_metadata: {
                provider: 'email',
                providers: ['email']
            },
            user_metadata: {},
            role: 'authenticated'
        },
        jwtSecret
    );
    // localStorage.setItem(
    // 	'supabase.auth.token',
    // 	JSON.stringify({
    // 		currentSession: {
    // 			provider_token: null,
    // 			access_token: token,
    // 			expires_in: 3600,
    // 			expires_at: exp,
    // 			refresh_token: 'NoHave',
    // 			token_type: 'bearer'
    // 		},
    // 		expiresAt: exp
    // 	})
    // );
    return `http://localhost:3000/evaluateAuth#access_token=${token}&expires_in=3600&refresh_token=NoHave&token_type=bearer&type=magiclink`;
};