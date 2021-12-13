<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenAnswerDraft, OpenQuestion, OpenAnswer } from "../models";
    import OpenFeedback from "./OpenFeedback.svelte";

    export let baseUrl: string;
    export let userId: string;
    export let openQuestion: OpenQuestion;
    let openAnswerDraft: OpenAnswerDraft;
    let myOpenAnswer: OpenAnswer;
    let openAnswers: Array<OpenAnswer>;

    fetchOpenAnswerDraft(openQuestion);
    fetchMyOpenAnswer(openQuestion);
    fetchOpenAnswers(openQuestion);

    async function fetchOpenAnswerDraft(openQuestion) {
        let openAnswerDrafts = await DataStore.query(OpenAnswerDraft, (a) =>
            a.openquestionID("eq", openQuestion.id)
        );
        openAnswerDraft = openAnswerDrafts[0];
    }

    async function fetchMyOpenAnswer(openQuestion) {
        let openAnswers = await DataStore.query(
            OpenAnswer,
            (a) =>
                a.openquestionID("eq", openQuestion.id) && a.owner("eq", userId)
        );
        myOpenAnswer = openAnswers[0];
    }

    async function fetchOpenAnswers(openQuestion) {
        openAnswers = await DataStore.query(OpenAnswer, (a) =>
            a.openquestionID("eq", openQuestion.id)
        );
    }

    async function saveOpenAnswerDraft(openQuestion: OpenQuestion) {
        const answerText = document.getElementById("openAnswerDraft").value;
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
            owner: userId,
        });
        await DataStore.save(myOpenAnswer);
        myOpenAnswer = myOpenAnswer;

        publishOpenAnswerCommittedEvent(myOpenAnswer);

        dispatch("toast", { type: "success", text: "Open Answer created!" });

        fetchMyOpenAnswer(openQuestion);
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

<div class="space-y-2">
    {#if myOpenAnswer}
        <div class="italic mt-2 whitespace-pre">
            ✅  You have answered this question.<!--My Answer: {myOpenAnswer.answerText}-->
        </div>
    {:else if openAnswerDraft}
        <div class="flex justify-between mt-2">
            <div>{openAnswerDraft.answerText}</div>
            <div>
                <button
                    on:click={() =>
                        deleteMyAnswerDraft(openAnswerDraft, openQuestion)}
                    class="w-32">Delete</button
                >
            </div>
        </div>
        <button
            disabled={!openAnswerDraft}
            on:click={() => commitOpenAnswer(openAnswerDraft, openQuestion)}
            class="w-32">Publish</button
        >
    {:else if openQuestion.owner != userId}
        <!--Create a new answer-->
        <div class="flex justify-between space-x-2 mt-2">
            <div class="w-full">
                <input
                    id="openAnswerDraft"
                    class="w-full"
                    placeholder="Answer this question"
                />
            </div>
            <div>
                <button
                    on:click={() => saveOpenAnswerDraft(openQuestion)}
                    class="w-32">Save Draft</button
                >
            </div>
        </div>
        <div>
            <button
                disabled={!openAnswerDraft}
                on:click={() => commitOpenAnswer(openAnswerDraft, openQuestion)}
                class="w-32">Publish</button
            >
        </div>
    {/if}
    {#if openAnswers && openAnswers.length > 0}
        <div class="mt-2 space-y-2">
            {#each openAnswers as openAnswer}
                <div class="rounded space-y-2 bg-gray-200 p-4">
                    <div>{openAnswer.answerText}</div>
                    <OpenFeedback bind:openAnswer {baseUrl} {userId} />
                </div>
            {/each}
        </div>
    {/if}
</div>
