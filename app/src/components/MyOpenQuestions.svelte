<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestion, ChallengePool } from "../models";
    import MyOpenAnswer from "./MyOpenAnswer.svelte";
    import { toast } from "@zerodevx/svelte-toast";

    export let challengePool: ChallengePool;

    let openQuestions: Array<OpenQuestion> = [];

    fetchOpenQuestions();

    async function createOpenQuestionFunc(input) {
        await DataStore.save(
            new OpenQuestion({
                text: input.value,
                challengePoolID: challengePool.id,
            })
        );

        fetchOpenQuestions();

        toast.push("Open Question created!", {
            theme: {
                "--toastBackground": "#48BB78",
                "--toastBarBackground": "#2F855A",
            },
        });
    }

    async function fetchOpenQuestions() {
        openQuestions = await DataStore.query(OpenQuestion, (q) =>
            q.challengePoolID("eq", challengePool.id)
        );
    }

    async function deleteOpenQuestionFunc(id) {
        await DataStore.delete(await DataStore.query(OpenQuestion, id));
        fetchOpenQuestions();
    }
</script>

<div>
    <input
        class="w-full"
        placeholder="Create new Open Question"
        on:keydown={(e) => {
            if (e.key === "Enter") {
                createOpenQuestionFunc(e.target);
            }
        }}
    />
</div>

<div>
    {#each openQuestions as openQuestion}
        <div class="flex justify-between space-y-0">
            <div>{openQuestion.text}</div>
            <div>
                <button on:click={() => deleteOpenQuestionFunc(openQuestion.id)}
                    >Delete</button
                >
            </div>
        </div>
        <MyOpenAnswer {openQuestion} />
    {/each}
</div>
