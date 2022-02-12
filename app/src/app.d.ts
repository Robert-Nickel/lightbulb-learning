/// <reference types="@sveltejs/kit" />

import type { User } from '@supabase/supabase-js';

declare namespace App {
	interface Locals {
		user: User;
	}

	interface Platform {}

	interface Session {
		user: User;
	}

	interface Stuff {}
}
