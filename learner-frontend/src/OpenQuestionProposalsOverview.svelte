<script lang="ts">
    import OpenQuestionProposalListItem from "./OpenQuestionProposalListItem.svelte";
    export let openQuestionProposals = [];
</script>

{#each openQuestionProposals as openQuestionProposal (openQuestionProposal.text)}
    <OpenQuestionProposalListItem text={openQuestionProposal.text} />
{/each}
