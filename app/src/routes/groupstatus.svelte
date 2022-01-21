<script lang="ts">
	import { baseUrl } from '$lib/awsCommon';
	import Toast from '$lib/components/Toast.svelte';
	import { Auth } from 'aws-amplify';
	import { onMount } from 'svelte';

	let groupCreated = false;
	let toast;

	onMount(() => {
		const groupStatus = getGroupStatus();

		// fetch groupStatus(currentToken)
		// Lambda:
		// group = cognito.getGroups(currentToken)[0]
		// if (group) {
		//     return true
		// } else {
		//     return false
		// }

		// if(lambda returns true && groupCreated == false) {
		//     showToast ("group created")
		// }
	});

	async function getGroupStatus() {
		const jwt = await (await Auth.currentSession()).getAccessToken().getJwtToken();

		console.log('passing in jwt: ' + jwt);
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const body = { jwt };

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(body)
		};

		let toReturn;
		fetch(`${baseUrl}/getGroupStatus`, requestOptions)
			.then((response) => response.text())
			.then((result) => {
				if (result.length != 0 && groupCreated == false) {
					toast.showSuccessToast(`${result} group created!`);
					groupCreated = true;
				}
				console.log('result: ');
				console.log(result);
				toReturn = result;
			})
			.catch((error) => console.log('error', error));
		return toReturn;
	}
</script>

<h1>Group Status</h1>

{#if groupCreated}
	Success!!
{:else}
	Remain patient
{/if}

<Toast bind:this={toast} />
