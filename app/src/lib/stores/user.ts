import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { supabase } from '$lib/supabaseClient';

const { set, subscribe } = writable<User>(supabase.auth.user());

supabase.auth.onAuthStateChange((event, session) => {
	if (event == 'SIGNED_OUT') {
		set(null);
	} else {
		set(session.user);
	}
});

export const user = {
	signIn: (email: string) => supabase.auth.signIn({ email }),
	signOut: () => supabase.auth.signOut(),
	subscribe
};
