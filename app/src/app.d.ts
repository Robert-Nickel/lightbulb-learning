/// <reference types="@sveltejs/kit" />

import type { User } from '@supabase/supabase-js';

declare namespace App {
	interface UserSession {
		user: import('@supabase/supabase-js').User
		accessToken?: string
	}
	
	interface Locals extends UserSession {
		error: import('@supabase/supabase-js').ApiError
	}
	
	interface Session extends UserSession {}

	interface Locals {
		user: User;
	}

	interface Platform {}

	interface Stuff {}
}
