<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestionDraft, ChallengePool, OpenQuestion } from "../models";

    export let challengePool: ChallengePool;

    async function createOpenQuestionDraftFunc(questionText) {
        await DataStore.save(
            new OpenQuestionDraft({
                questionText,
                challengePoolID: challengePool.id,
            })
        );
        dispatch("change")
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
        dispatch("change")
    }

    async function deleteOpenQuestionDraftFunc(id) {
        await DataStore.delete(await DataStore.query(OpenQuestionDraft, id));
        dispatch("change")
    }

    async function deleteMyAnswerFromOpenQuestionDraft(openQuestionDraft) {
        await DataStore.save(
            OpenQuestionDraft.copyOf(openQuestionDraft, (updated) => {
                updated.answerText = null;
            })
        );
        dispatch("change")
    }

    async function commitOpenQuestionDraft(openQuestionDraft: OpenQuestionDraft) {
        await DataStore.save(
            new OpenQuestion({
                questionText: openQuestionDraft.questionText,
                challengePoolID: openQuestionDraft.challengePoolID,
            })
        );
        publishOpenQuestionCommittedEvent(openQuestionDraft)
        
        dispatch("toast", {type: "success", text: "Open Question created!"})

        await DataStore.delete(await DataStore.query(OpenQuestionDraft, openQuestionDraft.id));
        dispatch("change")
    }

    async function publishOpenQuestionCommittedEvent(openQuestionDraft: OpenQuestionDraft) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(openQuestionDraft);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        fetch(
            "https://yybkc7efv3.execute-api.eu-central-1.amazonaws.com/commitOpenQuestion",
            requestOptions
        )
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
    }
</script>

<div>
    <input
        class="w-full"
        placeholder="Create new Open Question"
        on:keydown={(e) => {
            if (e.key === "Enter") {
                createOpenQuestionDraftFunc(e.target.value);
            }
        }}
    />
</div>

<div>
    {#each challengePool.OpenQuestionDrafts as openQuestionDraft}
        <div class="flex justify-between space-y-0">
            <div>{openQuestionDraft.questionText}</div>
            <div>
                <button
                    on:click={() =>
                        deleteOpenQuestionDraftFunc(openQuestionDraft.id)}
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
            </div>{/if}
        <button
            disabled={!openQuestionDraft.answerText}
            on:click={() => commitOpenQuestionDraft(openQuestionDraft)}>Commit</button
        >
    {/each}
</div>
