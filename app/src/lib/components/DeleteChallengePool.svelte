<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import { deleteChallengePool } from '$lib/supabaseClient';

	export let challengePool;
</script>

<button
	on:click={async () => {
		if (
			confirm(
				'Everything within ' + challengePool.description + ' will be gone forever.\nAre you really sure?'
			)
		) {
			await deleteChallengePool(challengePool.id);
			goto(routes.root);
		}
	}}
	class="secondary outline w-auto mb-0 hover-red">Delete {challengePool.description}</button
>
