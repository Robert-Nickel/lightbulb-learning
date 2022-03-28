<script lang="ts">
	import { goto } from '$app/navigation';
	import Back from '$lib/components/Back.svelte';
	import { routes } from '$lib/routes';

	import { joinCourse } from '$lib/supabaseClient';

	export let inviteCode: string = '';
</script>

<Back text="Back to all Courses" route={routes.courses} />
<h1>Join Course</h1>
<input bind:value={inviteCode} type="text" placeholder="Invite Code to join existing Course" />

<button
	on:click={async () => {
		if (inviteCode) {
			const courseId = await joinCourse(inviteCode);
			if (courseId != 'false') {
				goto(routes.course(courseId));
			}
		}
	}}
	class="w-32">Join</button
>
