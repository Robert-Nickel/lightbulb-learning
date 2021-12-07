<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestionDraft, ChallengePool, OpenQuestion } from "../models";

    export let baseUrl;
    export let challengePool: ChallengePool;
    export let userId;

    let openQuestionDrafts: Array<OpenQuestionDraft> = [];

    fetchOpenQuestionDrafts();

    async function fetchOpenQuestionDrafts() {
        openQuestionDrafts = await DataStore.query(OpenQuestionDraft, (q) =>
            q.challengepoolID("eq", challengePool.id)
        );
    }

    async function createOpenQuestionDraft() {
        const questionText = document.getElementById(
            "openQuestionDraftQuestionText"
        ).value;
        await DataStore.save(
            new OpenQuestionDraft({
                questionText,
                challengepoolID: challengePool.id,
            })
        );
        document.getElementById("openQuestionDraftQuestionText").value = "";

        await fetchOpenQuestionDrafts();
        document.getElementById("openQuestionDraftAnswerText").focus();
    }

    async function updateOpenQuestionDraftWithAnswer(
        openQuestionDraft: OpenQuestionDraft
    ) {
        const answerText = document.getElementById(
            "openQuestionDraftAnswerText"
        ).value;
        await DataStore.save(
            OpenQuestionDraft.copyOf(openQuestionDraft, (updated) => {
                updated.answerText = answerText;
            })
        );
        fetchOpenQuestionDrafts();
    }

    async function deleteOpenQuestionDraft(id) {
        await DataStore.delete(await DataStore.query(OpenQuestionDraft, id));
        fetchOpenQuestionDrafts();
    }

    async function deleteMyAnswerFromOpenQuestionDraft(openQuestionDraft) {
        await DataStore.save(
            OpenQuestionDraft.copyOf(openQuestionDraft, (updated) => {
                updated.answerText = null;
            })
        );
        fetchOpenQuestionDrafts();
    }

    async function commitOpenQuestion(openQuestionDraft: OpenQuestionDraft) {
        await DataStore.save(
            new OpenQuestion({
                questionText: openQuestionDraft.questionText,
                challengepoolID: openQuestionDraft.challengepoolID,
                owner: userId,
            })
        );
        dispatch("openQuestionCommitted");

        publishOpenQuestionCommittedEvent(openQuestionDraft);

        dispatch("toast", { type: "success", text: "Open Question created!" });

        await DataStore.delete(
            await DataStore.query(OpenQuestionDraft, openQuestionDraft.id)
        );
        fetchOpenQuestionDrafts();
    }

    async function publishOpenQuestionCommittedEvent(
        openQuestionDraft: OpenQuestionDraft
    ) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(openQuestionDraft);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        fetch(`${baseUrl}/commitOpenQuestion`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
    }
</script>

<div class="flex justify-between space-x-2">
    <div class="w-full">
        <input
            class="w-full"
            placeholder="Create an open question"
            id="openQuestionDraftQuestionText"
        />
    </div>
    <div>
        <button on:click={createOpenQuestionDraft} class="w-32"
            >Save Draft</button
        >
    </div>
</div>

<div class="space-y-2">
    {#if openQuestionDrafts.length > 0}<div class="text-xl mt-8">
            Drafts
        </div>{/if}

    {#each openQuestionDrafts as openQuestionDraft}
        <div class="rounded space-y-2 bg-gray-300 p-4">
            <div class="flex justify-between ">
                <div>Question: {openQuestionDraft.questionText}</div>
                <div>
                    <button
                        on:click={() =>
                            deleteOpenQuestionDraft(openQuestionDraft.id)}
                        class="w-32">Delete</button
                    >
                </div>
            </div>

            {#if openQuestionDraft.answerText == null}
                <div class="flex justify-between space-x-2">
                    <div class="w-full">
                        <input
                            class="w-full"
                            placeholder="What is the correct answer?"
                            id="openQuestionDraftAnswerText"
                        />
                    </div>
                    <div>
                        <button
                            on:click={() =>
                                updateOpenQuestionDraftWithAnswer(
                                    openQuestionDraft
                                )}
                            class="w-32">Save Answer</button
                        >
                    </div>
                </div>
            {:else}
                <div class="flex justify-between">
                    <div>Answer: {openQuestionDraft.answerText}</div>
                    <div>
                        <button
                            on:click={() =>
                                deleteMyAnswerFromOpenQuestionDraft(
                                    openQuestionDraft
                                )}
                            class="w-32">Delete</button
                        >
                    </div>
                </div>
            {/if}
            <button
                disabled={!openQuestionDraft.answerText}
                on:click={() => commitOpenQuestion(openQuestionDraft)}
                class="w-32">Publish</button
            >
        </div>
    {/each}
</div>
