<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestionDraft, ChallengePool } from "../models";
    import { toast } from "@zerodevx/svelte-toast";

    export let challengePool: ChallengePool;

    let openQuestionDrafts: Array<OpenQuestionDraft> = [];

    fetchOpenQuestionDrafts();

    async function createOpenQuestionDraftFunc(questionText) {
        await DataStore.save(
            new OpenQuestionDraft({
                questionText,
                challengePoolID: challengePool.id,
            })
        );

        fetchOpenQuestionDrafts();

        toast.push("Open Question created!", {
            theme: {
                "--toastBackground": "#48BB78",
                "--toastBarBackground": "#2F855A",
            },
        });
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

    async function fetchOpenQuestionDrafts() {
        openQuestionDrafts = await DataStore.query(OpenQuestionDraft, (q) =>
            q.challengePoolID("eq", challengePool.id)
        );
    }

    async function deleteOpenQuestionDraftFunc(id) {
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

    function commitOpenQuestionDraft(openQuestionDraftID) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": openQuestionDraftID,
        });

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
    {#each openQuestionDrafts as openQuestionDraft}
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
            on:click={() => commitOpenQuestionDraft(openQuestionDraft.id)}>Commit</button
        >
    {/each}
</div>
