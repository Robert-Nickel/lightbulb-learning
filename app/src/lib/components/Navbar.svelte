<script lang="ts">
import { getJWTToken } from '$lib/stores/auth';

import { onMount } from 'svelte';

	import Hamburger from './Hamburger.svelte';
	import { baseUrl } from '../awsCommon';
	export let sidebar = false;
	// TODO: auslesen der Description aus Gruppe
	let level = 'Free';

	onMount( async () => {
		var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
		let jwtToken = await getJWTToken();
		console.log("jwtToken", jwtToken)
		var raw = JSON.stringify({'jwtToken': jwtToken});
		var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

		fetch(`${baseUrl}/getGroup`, requestOptions)
            .then((response) => response.json())
            .then((result) => { 
				console.log(result);
				level = result.groupType;
			})
            .catch((error) => console.log("error", error));
	})
</script>

<header class="flex p-2 items-center text-white">
	<nav class="flex">
		<Hamburger bind:open={sidebar} />
	</nav>
	<nav><a href="/" class="text-white">Lightbulb Learning</a></nav>
	<nav class="ml-4">{level}</nav>
</header>

<!--
    References:
    https://dev.to/joshnuss/creating-a-sidebar-menu-in-svelte-ih2
-->
