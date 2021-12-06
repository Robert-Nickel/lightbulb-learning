<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestionDraft, ChallengePool, OpenQuestion } from "../models";

    export let baseUrl;
    export let challengePool: ChallengePool;
    let openQuestionDrafts: Array<OpenQuestionDraft> = [];

    fetchOpenQuestionDrafts();

    async function fetchOpenQuestionDrafts() {
        openQuestionDrafts = await DataStore.query(OpenQuestionDraft, (q) =>
            q.challengepoolID("eq", challengePool.id)
        );
    }

    async function createOpenQuestionDraft() {
        const questionText = document.getElementById(
            "openQuestionDraftText"
        ).value;
        await DataStore.save(
            new OpenQuestionDraft({
                questionText,
                challengepoolID: challengePool.id,
            })
        );
        fetchOpenQuestionDrafts();
    }

    async function updateOpenQuestionDraftWithAnswer(
        openQuestionDraft: OpenQuestionDraft,
        answerText
    ) {
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
            placeholder="Create new Open Question"
            id="openQuestionDraftText"
        />
    </div>
    <div><button on:click={createOpenQuestionDraft}>Save Draft</button></div>
</div>

<div>
    {#if openQuestionDrafts.length > 0}
        Drafts:
    {/if}
    {#each openQuestionDrafts as openQuestionDraft}
        <div class="flex justify-between space-y-0">
            <div>{openQuestionDraft.questionText}</div>
            <div>
                <button
                    on:click={() =>
                        deleteOpenQuestionDraft(openQuestionDraft.id)}
                    >Delete</button
                >
            </div>
        </div>

        {#if openQuestionDraft.answerText == null}
            <div>
                <div>
                    <input
                        class="w-full"
                        placeholder="What is the answer?"
                        on:keydown={(e) => {
                            if (e.key === "Enter") {
                                updateOpenQuestionDraftWithAnswer(
                                    openQuestionDraft,
                                    e.target.value
                                );
                            }
                        }}
                    />
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
                            )}>Delete</button
                    >
                </div>
            </div>
        {/if}
        <button
            disabled={!openQuestionDraft.answerText}
            on:click={() => commitOpenQuestion(openQuestionDraft)}
            >Commit</button
        >
    {/each}
</div>
