import { readable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { supabase } from '$lib/supabaseClient';


export const user = readable<User>(supabase.auth.user(), set => {
    supabase.auth.onAuthStateChange((event, session) => {
        if (event == 'SIGNED_OUT') {
            set(null)
        } else {
            set(session.user);
        }
    })
})