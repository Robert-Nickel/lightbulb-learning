import { CookieSerializeOptions, parse, serialize } from 'cookie';
import type { GetSession, Handle } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { user as userStore } from '$lib/stores/user';
import type { AuthChangeEvent, AuthSession } from '@supabase/supabase-js';

export const sbCookieName = 'sb:token';
export const authUrl = '/api/auth.json';

export const sbCookieOptions: CookieSerializeOptions = {
	maxAge: 60 * 60 * 24 * 7,
	domain: '',
	path: '/',
	sameSite: 'lax',
	httpOnly: true
};

export const handle: Handle = async ({ event, resolve }) => {
	const sbToken = parse(event.request.headers.get('Cookie') || '')?.[sbCookieName];

	if (sbToken) {
		const { user, error } = await supabase.auth.api.getUser(sbToken);
		if (!error) {
			event.locals.user = user;
			userStore.set(user);
		}
	}

	const response = await resolve(event);

	if (event.request.method === 'POST' && new URL(event.request.url).pathname === authUrl) {
		const { event: authChangeEvent, session } = JSON.parse(await event.request.text()) as {
			event: AuthChangeEvent;
			session: AuthSession;
		};

		if (authChangeEvent === 'SIGNED_IN') {
			const cookieHeader = await serialize(sbCookieName, session.access_token, {
				...sbCookieOptions,
				expires: new Date(session.expires_at),
				maxAge: session.expires_in
			});
			await supabase.auth.setAuth(session.access_token);
			response.headers.append('Set-Cookie', cookieHeader);
		} else if (authChangeEvent === 'SIGNED_OUT') {
			const cookieHeader = await serialize(sbCookieName, 'deleted', { ...sbCookieOptions, maxAge: 0 });
			await supabase.auth.api.signOut(sbToken);
			response.headers.append('Set-Cookie', cookieHeader);
		}
		return response;
	}

	return response;
};

// provides for $session frontend store
export const getSession: GetSession = (request) => {
	const { user } = request.locals;
	// only include the properties that are needed client-side — exclude anything else attached to the user like access tokens etc
	// we know that the `user` object won't have anything sensitive so we're making the entire `user` object available
	// Note: `getSession` runs only when SvelteKit server-renders a page, not for the API handlers.
	return { user };
};
