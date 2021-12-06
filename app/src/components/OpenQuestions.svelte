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

<div class="space-y-2">
    {#if openQuestions.length > 0}<div class="text-xl mt-8">All Open Questions</div>{/if}
    {#each openQuestions as openQuestion}
        <div class="rounded space-y-2 bg-gray-300 p-4">
            <div>{openQuestion.questionText}</div>
           
            <OpenAnswers bind:openQuestion baseUrl/>
        </div>
    {/each}
</div>
