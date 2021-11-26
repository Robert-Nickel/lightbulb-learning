<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import OpenQuestionDrafts from "./OpenQuestionDrafts.svelte";
    import Arrow from "./Arrow.svelte";
    import OpenQuestions from "./OpenQuestions.svelte";
    import { DataStore } from "@aws-amplify/datastore";
    import { ChallengePool } from "../models";

    export let challengePool: ChallengePool;

    let open = false;

    function deleteClicked() {
        dispatch("deleteClicked");
    }

    function startChallengeClicked() {
        dispatch("startChallengeClicked");
    }

    async function fetchChallengePool() {
        challengePool = await DataStore.query(ChallengePool, challengePool.id);
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
        <OpenQuestionDrafts {challengePool} on:toast on:change={fetchChallengePool}/>
        <OpenQuestions {challengePool} />
    {/if}
</div>
