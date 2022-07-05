<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import { session } from '$app/stores';

	import { joinCourse } from '$lib/supabaseQueries';
	import Back from '$lib/components/Back.svelte';

	export let inviteCode: string = '';
</script>

<Back text="Back to all Courses" route={routes.courses} />
<h1>Join Course</h1>
<input bind:value={inviteCode} type="text" placeholder="Invite Code to join existing Course" />

<button
	on:click={async () => {
		if (inviteCode) {
			const courseUser = await joinCourse(inviteCode, $session.user.id);
			goto(routes.course(courseUser.course));
		}
	}}
	class="w-32">Join</button
>
