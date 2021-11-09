<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestion, ChallengePool } from "../models";
    import { toast } from "@zerodevx/svelte-toast";

    export let challengePool: ChallengePool;

    let openQuestions: Array<OpenQuestion> = [];

    fetchOpenQuestions();

    async function createOpenQuestionFunc(questionText) {
        await DataStore.save(
            new OpenQuestion({
                questionText,
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

    async function updateOpenQuestionWithAnswer(
        openQuestion: OpenQuestion,
        answerText
    ) {
        await DataStore.save(
            OpenQuestion.copyOf(openQuestion, (updated) => {
                updated.answerText = answerText;
            })
        );

        fetchOpenQuestions();
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

    async function deleteMyAnswerFromOpenQuestion(openQuestion) {
        await DataStore.save(
            OpenQuestion.copyOf(openQuestion, (updated) => {
                updated.answerText = null;
            })
        );

        fetchOpenQuestions();
    }

    function commitOpenQuestion() {
        
    }
</script>

<div>
    <input
        class="w-full"
        placeholder="Create new Open Question"
        on:keydown={(e) => {
            if (e.key === "Enter") {
                createOpenQuestionFunc(e.target.value);
            }
        }}
    />
</div>

<div>
    {#each openQuestions as openQuestion}
        <div class="flex justify-between space-y-0">
            <div>{openQuestion.questionText}</div>
            <div>
                <button on:click={() => deleteOpenQuestionFunc(openQuestion.id)}
                    >Delete</button
                >
            </div>
        </div>

        {#if openQuestion.answerText == null}
            <div>
                <div>
                    <input
                        class="w-full"
                        placeholder="What is the answer?"
                        on:keydown={(e) => {
                            if (e.key === "Enter") {
                                updateOpenQuestionWithAnswer(
                                    openQuestion,
                                    e.target.value
                                );
                            }
                        }}
                    />
                </div>
            </div>
        {:else}
            <div class="flex justify-between">
                <div>Answer: {openQuestion.answerText}</div>
                <div>
                    <button
                        on:click={() =>
                            deleteMyAnswerFromOpenQuestion(openQuestion)}
                        >Delete</button
                    >
                </div>
            </div>{/if}
        <button
            disabled={!openQuestion.answerText}
            on:click={commitOpenQuestion}>Commit</button
        >
    {/each}
</div>
