<script lang="ts">
import { baseUrl } from '$lib/awsCommon';

	import { Auth } from 'aws-amplify';

	async function addUserToGroup() {
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const user = await Auth.currentAuthenticatedUser();
		const username = user.attributes.email;
		// TODO: change this hardcoded userpool to be custom for premium instances
		const userPoolId = 'lightbulblearningapp1ed418f9_userpool_1ed418f9-prod';

		const groupName = document.getElementById('groupName').value;
		const body = {
			username,
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
	<input id="groupName" placeholder="Group Name" />
	<button on:click={addUserToGroup}>Join Group</button>
</main>
