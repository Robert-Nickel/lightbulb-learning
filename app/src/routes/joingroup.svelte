<script lang="ts">
	import { baseUrl } from '$lib/awsCommon';

	import { Auth } from 'aws-amplify';

	async function addUserToGroup() {
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const user = await Auth.currentAuthenticatedUser();
		const userName = user.attributes.email;
		// TODO: change this hardcoded userpool to be custom for premium instances
		const userPoolId = 'eu-central-1_bAc9VMMys';

		const groupName = document.getElementById('groupName').value;
		const body = {
			userName,
			userPoolId,
			groupName
		};

		var requestOptions = {
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
	<input id="groupName" placeholder="Group Name" />
	<button on:click={addUserToGroup}>Join Group</button>
</main>
