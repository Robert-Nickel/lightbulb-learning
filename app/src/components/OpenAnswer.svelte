<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestion, OpenAnswer } from "../models";

    export let openQuestion: OpenQuestion;

    let openAnswers: Array<OpenAnswer> = [];

    fetchOpenAnswers();

    async function fetchOpenAnswers() {
        openAnswers = await DataStore.query(OpenAnswer);
    }

    async function createOpenAnswerFunc(input) {
        await DataStore.save(
            new OpenAnswer({
                text: input.value,
                openQuestionID: openQuestion.id,
            })
        );
        fetchOpenAnswers();
    }

    async function deleteOpenAnswerFunc(id) {
        await DataStore.delete(await DataStore.query(OpenAnswer, id));
        fetchOpenAnswers();
    }
</script>

<div class="container">
    <h2>Open Answers</h2>
    <div class="container">
        <h2>Create new Open Answer</h2>
        <input
            placeholder="Answer"
            on:keydown={(e) => {
                if (e.key === "Enter") {
                    createOpenAnswerFunc(e.target);
                }
            }}
        />
    </div>

    {#each openAnswers as openAnswer}
        <div class="container">
            <h2>{openAnswer.text}</h2>
            <button
                on:click={() => deleteOpenAnswerFunc(openAnswer.id)}
                style="float: right;">Delete this Open Answer</button
            >
        </div>
    {/each}
</div>

<style>
    .container {
        border: 3px #333 solid;
        border-radius: 10px;
        text-align: left;
        padding: 1em;
        margin: 1em;
    }

    input {
        width: 16em;
    }
</style>
