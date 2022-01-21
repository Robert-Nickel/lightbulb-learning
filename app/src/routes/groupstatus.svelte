<script lang="ts">
	import { goto } from '$app/navigation';
	import { baseUrl } from '$lib/awsCommon';
	import { Auth } from 'aws-amplify';
	import { onMount } from 'svelte';

	let groupName;

	onMount(() => {
		updateGroupStatus();

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

	async function updateGroupStatus() {
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
				if (result.length != 0) {
					groupName = result;
				}
				console.log('result: ');
				console.log(result);
			})
			.catch((error) => console.log('error', error));
	}
</script>

<h1>Group Status</h1>

<table>
	{#if groupName}
		<tr
			><td><div class="lds-heart"><div /></div></td><td>Your group {groupName} was created successfully.</td
			></tr
		>
		Please logout and login again.
		<!-- <button
			on:click={() => {
				goto('/');
			}}
			class=" mt-4 w-48">Start</button
		> -->
	{:else}
		<tr
			><td
				><div class="lds-ring">
					<div />
					<div />
					<div />
					<div />
				</div></td
			><td>Your group is still in creation.</td></tr
		>
		<button on:click={updateGroupStatus} class="outline mt-4 w-48">Update</button>
	{/if}
</table>

<style>
	.lds-ring {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}
	.lds-ring div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 64px;
		height: 64px;
		margin: 8px;
		border: 8px solid #fff;
		border-radius: 50%;
		animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: #fff transparent transparent transparent;
	}
	.lds-ring div:nth-child(1) {
		animation-delay: -0.45s;
	}
	.lds-ring div:nth-child(2) {
		animation-delay: -0.3s;
	}
	.lds-ring div:nth-child(3) {
		animation-delay: -0.15s;
	}
	@keyframes lds-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.lds-heart {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
		transform: rotate(45deg);
		transform-origin: 40px 40px;
	}
	.lds-heart div {
		top: 32px;
		left: 32px;
		position: absolute;
		width: 32px;
		height: 32px;
		background: #fff;
		animation: lds-heart 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
	}
	.lds-heart div:after,
	.lds-heart div:before {
		content: ' ';
		position: absolute;
		display: block;
		width: 32px;
		height: 32px;
		background: #fff;
	}
	.lds-heart div:before {
		left: -24px;
		border-radius: 50% 0 0 50%;
	}
	.lds-heart div:after {
		top: -24px;
		border-radius: 50% 50% 0 0;
	}
	@keyframes lds-heart {
		0% {
			transform: scale(0.95);
		}
		5% {
			transform: scale(1.1);
		}
		39% {
			transform: scale(0.85);
		}
		45% {
			transform: scale(1);
		}
		60% {
			transform: scale(0.95);
		}
		100% {
			transform: scale(0.9);
		}
	}
</style>
