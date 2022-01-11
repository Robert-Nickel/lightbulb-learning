<script lang="ts">
	import { baseUrl } from '$lib/awsCommon';

	import { Auth } from 'aws-amplify';

	let groupName = '';

	async function addUserToGroup() {
		const jwtToken = await (await Auth.currentSession()).getAccessToken().getJwtToken()

		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		// myHeaders.append('Authorization', jwtToken);

		const body = { groupName, jwtToken } ;

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(body)
		};

		fetch(`${baseUrl}/addUserToGroup`, requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.log('error', error));
	}
</script>

<main class="container pt-4">
	<h1>Join Group</h1>
	<div class="mb-4">
		You get the group name from your professor. If you have it already, enter it below to join the group.
	</div>
	<input bind:value={groupName} placeholder="Group Name" />
	<button on:click={addUserToGroup}>Join Group</button>
</main>
