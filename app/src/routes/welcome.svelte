<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import { user } from '$lib/stores/user';
	import {
		fetchProfile,
		fetchUniversityByName,
		updateProfile,
		saveUniversity,
		saveProfile,
		fetchUniversity
	} from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let firstName;
	let lastName;
	let universityName;
	let otherUniversityName;
	let step = 'name';
	let profileId: string;

	onMount(async () => {
		const profile = await fetchProfile($user.id);
		if (profile) {
			profileId = profile.id;
			firstName = profile.firstName;
			lastName = profile.lastName;
			universityName = await (await fetchUniversity(profile.university)).name;
		}
	});
</script>

{#if step == 'name'}
	<h1>What is your name?</h1>

	<label for="firstName">
		First Name
		<input id="firstName" bind:value={firstName} placeholder="Stephen" />
	</label>

	<label for="lastName">
		Last Name
		<input id="lastName" bind:value={lastName} placeholder="Hawking" />
	</label>

	<button
		class="w-48"
		on:click={async () => {
			step = 'university';
		}}>Continue</button
	>
{:else if step == 'university'}
	<h1>Which one is your University?</h1>

	<fieldset>
		<label for="htwg">
			<input
				type="radio"
				bind:group={universityName}
				id="htwg"
				name="university"
				value="Hochschule Konstanz"
			/>
			Hochschule Konstanz
		</label>
		<label for="other">
			<input type="radio" bind:group={universityName} id="other" name="university" value="other" />
			Other
		</label>
	</fieldset>

	{#if universityName == 'other'}<input
			bind:value={otherUniversityName}
			type="text"
			placeholder="What is the name of your university?"
		/>{/if}

	<button
		on:click={async () => {
			let university = await fetchUniversityByName(universityName);
			if (!university) {
				university = await saveUniversity(otherUniversityName);
			}
			if (profileId) {
				await updateProfile(profileId, firstName, lastName, university);
			} else {
				await saveProfile(firstName, lastName, university);
			}
			goto(routes.root);
		}}
		class="w-48">Done</button
	>
{/if}
