<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenAnswerDraft, OpenQuestion, OpenAnswer } from "../models";
    import OpenFeedback from "./OpenFeedback.svelte";

    export let baseUrl;
    export let openQuestion: OpenQuestion;
    let openAnswerDraft: OpenAnswerDraft;
    let openAnswer: OpenAnswer;

    fetchOpenAnswerDraft(openQuestion);
    fetchOpenAnswer(openQuestion);

    async function fetchOpenAnswerDraft(openQuestion) {
        let openAnswerDrafts = await DataStore.query(OpenAnswerDraft, (a) =>
            a.openquestionID("eq", openQuestion.id)
        );
        openAnswerDraft = openAnswerDrafts[0];
    }

    async function fetchOpenAnswer(openQuestion) {
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
        fetchOpenAnswerDraft(openQuestion);
    }

    async function commitOpenAnswer(
        openAnswerDraft: OpenAnswerDraft,
        openQuestion: OpenQuestion
    ) {
        deleteMyAnswerDraft(openAnswerDraft, openQuestion);

        let myOpenAnswer: OpenAnswer = new OpenAnswer({
            answerText: openAnswerDraft.answerText,
            openquestionID: openAnswerDraft.openquestionID,
        });
        await DataStore.save(myOpenAnswer);
        openAnswer = myOpenAnswer;

        publishOpenAnswerCommittedEvent(openAnswer);

        dispatch("toast", { type: "success", text: "Open Answer created!" });

        fetchOpenAnswer(openQuestion);
    }

    async function deleteMyAnswerDraft(
        openAnswerDraft: OpenAnswerDraft,
        openQuestion: OpenQuestion
    ) {
        await DataStore.delete(
            await DataStore.query(OpenAnswerDraft, openAnswerDraft.id)
        );
        fetchOpenAnswerDraft(openQuestion);
    }

    async function publishOpenAnswerCommittedEvent(openAnswer: OpenAnswer) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(openAnswer);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        fetch(`${baseUrl}/commitOpenAnswer`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
    }
</script>

<div>
    {#if openAnswer}
        Answer: {openAnswer.answerText}
        <OpenFeedback bind:openAnswer baseUrl />
    {:else}
        {#if openAnswerDraft}
            <div class="flex justify-between">
                <div>{openAnswerDraft.answerText}</div>
                <div>
                    <button
                        on:click={() =>
                            deleteMyAnswerDraft(openAnswerDraft, openQuestion)}
                        class="w-32">Delete</button
                    >
                </div>
            </div>
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
                on:click={() => commitOpenAnswer(openAnswerDraft, openQuestion)}
                class="w-32">Commit</button
            >
        </div>
    {/if}
</div>
