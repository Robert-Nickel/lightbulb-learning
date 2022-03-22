<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import { deleteCourse } from '$lib/supabaseClient';

	export let course;
</script>

<button
	on:click={async () => {
		if (
			confirm(
				'Everything within ' + course.description + ' will be gone forever.\nAre you really sure?'
			)
		) {
			await deleteCourse(course.id);
			goto(routes.root);
		}
	}}
	class="secondary outline w-auto mb-0 hover-red">Delete {course.description}</button
>
