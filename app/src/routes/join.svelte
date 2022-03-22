<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	import { joinCourse } from '$lib/supabaseClient';

	let inviteCode: string;
</script>

<h1>Join Course</h1>
<div class="flex justify-between space-x-2">
	<div class="w-full">
		<input bind:value={inviteCode} type="text" placeholder="Invite Code to join existing Course" />
	</div>
	<div>
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
	</div>
</div>
