<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestion, ChallengePool } from "../models";
    import OpenAnswer from "./OpenAnswer.svelte";

    export let challengePool: ChallengePool;

    let openQuestions: Array<OpenQuestion> = [];

    fetchOpenQuestions();

    async function fetchOpenQuestions() {
        openQuestions = await DataStore.query(OpenQuestion, (q) =>
            q.challengePoolID("eq", challengePool.id)
        );
    }

    async function createOpenQuestionFunc(input) {
        await DataStore.save(
            new OpenQuestion({
                text: input.value,
                challengePoolID: challengePool.id,
            })
        );
        fetchOpenQuestions();
    }

    async function deleteOpenQuestionFunc(id) {
        await DataStore.delete(await DataStore.query(OpenQuestion, id));
        fetchOpenQuestions();
    }
</script>

<div space-y-4>
    {#each openQuestions as openQuestion}
        <div >
            <h2>{openQuestion.text}</h2>
            <button
                on:click={() => deleteOpenQuestionFunc(openQuestion.id)}
                style="float: right;">Delete this Open Question</button
            >
            <OpenAnswer {openQuestion} />
        </div>
    {/each}
    <div >
        <h2>Create new Open Question</h2>
        <input
            placeholder="Question"
            on:keydown={(e) => {
                if (e.key === "Enter") {
                    createOpenQuestionFunc(e.target);
                }
            }}
        />
    </div>
</div>
