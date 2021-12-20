<script>
	import { browser } from '$app/env';
	import '../app.css';
	import Amplify from '@aws-amplify/core';
	import aws_exports from '../aws-exports';
	import * as process from 'process';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	if (browser) {
		Amplify.configure(aws_exports);

		// This fix is based on https://github.com/aws-amplify/amplify-js/issues/3274#issuecomment-497773026
		window['process'] = process;
	}
	let sidebarOpen = false;
</script>

<Sidebar bind:open={sidebarOpen} />
<Navbar bind:sidebar={sidebarOpen} />
	<slot />
