<script lang="ts">
	import { page } from '$app/stores';
	import { fetchMember, MemberType } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let member: MemberType;
    let openQuestionsAsked;

	onMount(async () => {
		const id = $page.params.slug;
		member = await fetchMember(id);
	});
</script>

{#if member}<h1>Performance of {member.firstName} {member.lastName}</h1>{/if}

{#if openQuestionsAsked}
<h2>Open Questions asked:</h2>
{/if}
