<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	import { CourseType, leaveCourse } from '$lib/supabaseQueries';
	import { session } from '$app/stores';

	export let course: CourseType;
</script>

<button
	class="secondary outline w-auto mb-0 hover-red mt-4"
	on:click={async () => {
		if (confirm('Do you really want to leave ' + course.description + '?')) {
			await leaveCourse(course.id, $session.user.id);
			goto(routes.courses);
		}
	}}>Leave Course</button
>
