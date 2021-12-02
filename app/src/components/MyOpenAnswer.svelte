<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenAnswer, OpenQuestion } from "../models";

    export let openQuestion;
    let openAnswer: OpenAnswer;

    fetchMyOpenAnswers();

    async function fetchMyOpenAnswers() {
        let openAnswers = await DataStore.query(OpenAnswer, (a) =>
            a.openquestionID("eq", openQuestion.id)
        );
        openAnswer = openAnswers[0]
    }

    async function answerOpenQuestion(openQuestion: OpenQuestion, answerText) {
        await DataStore.save(
            new OpenAnswer({
                answerText,
                openquestionID: openQuestion.id,
            })
        );
        fetchMyOpenAnswers();
    }
</script>

<div>
    {#if openAnswer}
        {openAnswer.answerText}
    {:else}
        <input
            class="w-full"
            placeholder="Answer this question"
            on:keydown={(e) => {
                if (e.key === "Enter") {
                    answerOpenQuestion(openQuestion, e.target.value);
                }
            }}
        />
    {/if}
</div>
