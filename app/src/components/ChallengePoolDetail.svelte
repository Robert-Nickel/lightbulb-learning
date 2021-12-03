<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import OpenQuestionDrafts from "./OpenQuestionDrafts.svelte";
    import Arrow from "./Arrow.svelte";
    import OpenQuestions from "./OpenQuestions.svelte";

    export let challengePool;
    export let baseUrl;

    let openQuestions;

    let open = false;

    function deleteClicked() {
        dispatch("deleteClicked");
    }

    function startChallengeClicked() {
        dispatch("startChallengeClicked");
    }

    function openQuestionCommitted() {
        openQuestions.fetchOpenQuestions();
    }
</script>

<div class="bg-gray-200 space-y-5 p-8">
    <div class="flex justify-between">
        <div class="flex space-x-3">
            <div on:click={() => (open = !open)}>
                <Arrow down={open} />
            </div>
            <div>{challengePool.description}</div>
        </div>
        {#if open}
            <div>
                <button on:click={deleteClicked}>Delete</button>
                <button on:click={startChallengeClicked}>Start Challenge</button
                >
            </div>
        {/if}
    </div>
    {#if open}
        <OpenQuestionDrafts {challengePool} on:toast on:openQuestionCommitted={openQuestionCommitted} baseUrl/>
        <OpenQuestions bind:this={openQuestions} {challengePool} />
    {/if}
</div>
