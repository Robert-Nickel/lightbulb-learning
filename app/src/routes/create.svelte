<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import { saveCourse } from '$lib/supabaseClient';

	let createCourseDescription = '';
</script>

<h1>Create Course</h1>
<div class="space-y-4">
	<div class="flex justify-between space-x-2">
		<div class="w-full">
			<input
				bind:value={createCourseDescription}
				class="w-full"
				placeholder="Create new Course"
			/>
		</div>
		<div>
			<button
				on:click={async () => {
					const course = await saveCourse(createCourseDescription);
					createCourseDescription = '';
					goto(routes.course(course.id));
				}}
				class="w-32">Create</button
			>
		</div>
	</div>
</div>
