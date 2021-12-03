<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenAnswerDraft, OpenQuestion, OpenAnswer } from "../models";

    export let openQuestion: OpenQuestion;
    let openAnswerDraft: OpenAnswerDraft;
    let openAnswer: OpenAnswer;

    fetchMyOpenAnswerDraft(openQuestion);

    async function fetchMyOpenAnswerDraft(openQuestion) {
        let openAnswerDrafts = await DataStore.query(OpenAnswerDraft, (a) =>
            a.openquestionID("eq", openQuestion.id)
        );
        openAnswerDraft = openAnswerDrafts[0];
    }

    async function fetchMyOpenAnswer(openQuestion) {
        let openAnswers = await DataStore.query(OpenAnswer, (a) =>
            a.openquestionID("eq", openQuestion.id)
        );
        openAnswer = openAnswers[0];
    }

    async function saveOpenAnswerDraft(openQuestion: OpenQuestion, answerText) {
        await DataStore.save(
            new OpenAnswerDraft({
                answerText,
                openquestionID: openQuestion.id,
            })
        );
        fetchMyOpenAnswerDraft(openQuestion);
    }

    async function commitOpenAnswer(openAnswerDraft: OpenAnswerDraft) {
        console.log("committing...");
        console.log(openAnswerDraft);

        await DataStore.delete(
            await DataStore.query(OpenAnswerDraft, openAnswerDraft.id)
        );
        fetchMyOpenAnswerDraft(openQuestion);

        let myOpenAnswer: OpenAnswer = new OpenAnswer({
            answerText: openAnswerDraft.answerText,
            openquestionID: openAnswerDraft.openquestionID,
        });
        await DataStore.save(myOpenAnswer);
        openAnswer = myOpenAnswer;

        // TODO: publishOpenQuestionCommittedEvent(openQuestionDraft);

        dispatch("toast", { type: "success", text: "Open Answer created!" });

        fetchMyOpenAnswer(openQuestion);
    }
</script>

<div>
    {#if openAnswer}
        Your answer: {openAnswer.answerText}
    {:else}
        {#if openAnswerDraft}
            {openAnswerDraft.answerText}
        {:else}
            <input
                class="w-full"
                placeholder="Answer this question"
                on:keydown={(e) => {
                    if (e.key === "Enter") {
                        saveOpenAnswerDraft(openQuestion, e.target.value);
                    }
                }}
            />
        {/if}
        <div>
            <button
                disabled={!openAnswerDraft}
                on:click={() => commitOpenAnswer(openAnswerDraft)}
                >Commit</button
            >
        </div>
    {/if}
</div>
