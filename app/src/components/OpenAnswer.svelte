<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestion, OpenAnswer } from "../models";

    export let openQuestion: OpenQuestion;

    let openAnswers: Array<OpenAnswer> = [];

    fetchOpenAnswers();

    async function fetchOpenAnswers() {
        openAnswers = await DataStore.query(OpenAnswer, (a) =>
            a.openQuestionID("eq", openQuestion.id)
        );
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

<div>
    <div>
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
        <div >
            <h2>{openAnswer.text}</h2>
            <button
                on:click={() => deleteOpenAnswerFunc(openAnswer.id)}
                style="float: right;">Delete this Open Answer</button
            >
        </div>
    {/each}
</div>