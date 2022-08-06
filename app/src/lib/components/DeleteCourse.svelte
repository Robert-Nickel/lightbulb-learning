<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import { deleteCourse } from '$lib/supabaseQueries';

	export let course;
</script>

<button
	on:click={async () => {
		if (
			confirm(
				'Everything within ' + course.title + ' will be gone forever.\nAre you really sure?'
			)
		) {
			await deleteCourse(course.id);
			goto(routes.courses);
		}
	}}
	class="secondary outline w-auto mb-0 hover-red">Delete {course.title}</button
>
