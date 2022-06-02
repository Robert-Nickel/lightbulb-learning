import { writable } from 'svelte/store';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '$lib/supabaseClient';

const { set, subscribe } = writable<User>(supabase.auth.user());

supabase.auth.onAuthStateChange(async (event, session) => {
	if (event == 'SIGNED_OUT') {
		set(null);
		await unsetAuthCookie();
	} else {
		if (!session) return; // happens on test runs
		set(session.user);
		await setAuthCookie(session);
	}
});

export const user = {
	signIn: (email: string, password: string = null) => supabase.auth.signIn({ email, password }),
	signInGitHub: () => supabase.auth.signIn({
		provider: 'github',
	}),
	signOut: () => supabase.auth.signOut(),
	resetPassword: (email: string) => supabase.auth.api.resetPasswordForEmail(email),
	subscribe,
	set
};

async function setServerSession(event: AuthChangeEvent, session: Session) {
	await fetch('/api/auth.json', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		credentials: 'same-origin',
		body: JSON.stringify({ event, session })
	});
}
const setAuthCookie = async (session: Session) => await setServerSession('SIGNED_IN', session);
const unsetAuthCookie = async () => await setServerSession('SIGNED_OUT', null);
