<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { ChallengePool, OpenQuestion } from "../models";

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
    {#each openQuestions as openQuestion}
        <div class="flex justify-between space-y-0">
            <div>{openQuestion.questionText}</div>
        </div>
    {/each}
</div>
