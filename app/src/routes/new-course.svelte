<script lang="ts">
	import { goto } from '$app/navigation';
	import Back from '$lib/components/Back.svelte';
	import { routes } from '$lib/routes';
	import { saveCourse } from '$lib/supabaseQueries';
	import { session } from '$app/stores';
	let createCourseDescription = '';
</script>

<Back text="Back to all Courses" route={routes.courses} />

<h1>New Course</h1>

<input bind:value={createCourseDescription} class="w-full" placeholder="Course Name" />
<button
	on:click={async () => {
		const course = await saveCourse(createCourseDescription, $session.user.id);
		createCourseDescription = '';
		goto(routes.course(course.id));
	}}
	class="w-32">Create</button
>
