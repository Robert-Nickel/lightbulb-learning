<script lang="ts">
	import { goto } from '$app/navigation';
	import { baseUrl } from '$lib/awsCommon';
	import { Auth } from 'aws-amplify';

	let role = '';
	let roleType = 'Standard';
	let paid: boolean = false;
	let showYouHaveToPay;
	let done = false;
	let groupName = '';

	async function createGroup() {
		if (roleType == 'Standard' && !paid) {
			showYouHaveToPay = true;
			return;
		}

		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		const user = await Auth.currentAuthenticatedUser();
		const userName = user.attributes.email;
		// TODO: change this hardcoded userpool to be custom for premium instances
		const userPoolId = 'eu-central-1_bAc9VMMys';

		const body = {
			userName,
			userPoolId,
			groupName,
			roleType
		};

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(body)
		};

		fetch(`${baseUrl}/createGroup`, requestOptions)
			.then((response) => response.text())
			.then((result) => {
				done = true;
				console.log(result);
			})
			.catch((error) => console.log('error', error));
	}
</script>

<main class="container pt-4">
	{#if !done}
		{#if role == ''}
			<h1>Who are you?</h1>
			<button on:click={() => goto('/joingroup')} class="outline">Im a Student</button>
			<button on:click={() => (role = 'professor')} class="outline">Im a Professor</button>
			<button on:click={() => (role = 'university')} class="outline">Im a University Representative</button>
		{:else if role == 'university'}
			<h1>Welcome!</h1>
			<div>
				With a university-wide accout for Lightbulb Learning you have unlimited access for all of your
				professors and students.
				<br /><a href="mailto:lightbulb-learning@robertnickel.online">Contact us</a> for pricing information, a
				complete feature list and to tell us your requirements for the system.
			</div>
		{:else if role == 'professor'}
			<h1>Create Group</h1>
			<div class="mb-4">
				Create a group for you and your students. Everyone with the group name can join the group and learn
				for the long run.
			</div>

			<input id="groupName" placeholder="Group Name" bind:value={groupName} />

			<fieldset>
				<legend>Group Type</legend>
				<label for="standard">
					<input type="radio" id="standard" name="grouptype" value="Standard" bind:group={roleType} />
					Standard
				</label>
				<label for="free">
					<input type="radio" id="free" name="grouptype" value="Free" bind:group={roleType} />
					Free
				</label>
				<label for="paid">
					<input type="checkbox" id="paid" name="paid" bind:checked={paid} aria-invalid={showYouHaveToPay} />
					I agree to pay monthly.
				</label>
				{#if showYouHaveToPay}
					<small class="text-orange-600">You have to agree to pay for a standard group.</small>
				{/if}
			</fieldset>
			<button on:click={createGroup}>Create Group</button>
		{/if}
	{:else}
		<h1>Group created!</h1>
		<div class="mb-4">Share <kbd>{groupName}</kbd><br> with your students, so they can join the group.</div>
	{/if}
</main>
