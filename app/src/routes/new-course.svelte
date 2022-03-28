<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import { saveCourse } from '$lib/supabaseClient';

	let createCourseDescription = '';
</script>

<h1>New Course</h1>

<input bind:value={createCourseDescription} class="w-full" placeholder="Course Name" />
<button
	on:click={async () => {
		const course = await saveCourse(createCourseDescription);
		createCourseDescription = '';
		goto(routes.course(course.id));
	}}
	class="w-32">Create</button
>
