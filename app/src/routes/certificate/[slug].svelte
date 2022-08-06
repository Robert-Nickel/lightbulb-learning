<script lang="ts" context="module">
	import {
		CourseType,
		fetchCourse,
		fetchCourseUserWithId,
		fetchMember,
		MemberType
	} from '$lib/supabaseQueries';

	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export const load = async ({ session, params }) =>
		withPageAuth(
			{
				redirectTo: '/login',
				user: session.user
			},
			async () => {
				const courseUserId = params.slug;
				const courseUser = await fetchCourseUserWithId(courseUserId, session);
				const course = await fetchCourse(courseUser.course, session);
				const member = await fetchMember(courseUserId, session);

				return {
					props: {
						member,
						course
					}
				};
			}
		);
</script>

<script lang="ts">
	export let member: MemberType;
	export let course: CourseType;
</script>

<div class="text-center mt-8">
	<h1>Certificate</h1>

	<p>This certificate is awarded to {member.email}</p>

	<p>in successfully completing the Lightbulb Learning course</p>

	<h3>{course.title}.</h3>
</div>
