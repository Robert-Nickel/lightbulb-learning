<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { ChallengePool, OpenQuestion, OpenAnswer } from "../models";
    import OpenAnswers from "./OpenAnswers.svelte";

    export let baseUrl;
    export let challengePool: ChallengePool;

    let openQuestions: Array<OpenQuestion> = [];

    fetchOpenQuestions();

    export async function fetchOpenQuestions() {
        openQuestions = await DataStore.query(OpenQuestion, (q) =>
            q.challengepoolID("eq", challengePool.id)
        );
    }
</script>

<div>
    {#if openQuestions.length > 0}All Questions:{/if}
    {#each openQuestions as openQuestion}
        <div>
            <div>{openQuestion.questionText}</div>
           
            <OpenAnswers bind:openQuestion baseUrl/>
        </div>
    {/each}
</div>
