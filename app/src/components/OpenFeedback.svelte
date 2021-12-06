<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenFeedbackDraft, OpenFeedback, OpenAnswer } from "../models";

    export let baseUrl;
    export let openAnswer: OpenAnswer;
    let openFeedbackDraft: OpenFeedbackDraft;
    let openFeedback: OpenFeedback;

    fetchOpenFeedbackDraft(openAnswer);
    fetchOpenFeedback(openAnswer);

    async function fetchOpenFeedbackDraft(openAnswer) {
        let openFeedbackDrafts = await DataStore.query(OpenFeedbackDraft, (f) =>
            f.openanswerID("eq", openAnswer.id)
        );
        openFeedbackDraft = openFeedbackDrafts[0];
    }

    async function fetchOpenFeedback(openAnswer) {
        let openFeedbacks = await DataStore.query(OpenFeedback, (f) =>
            f.openanswerID("eq", openAnswer.id)
        );
        openFeedback = openFeedbacks[0];
    }

    async function saveOpenFeedbackDraft(openAnswer: OpenAnswer, feedbackText) {
        await DataStore.save(
            new OpenFeedbackDraft({
                feedbackText,
                openanswerID: openAnswer.id,
            })
        );
        fetchOpenFeedbackDraft(openAnswer);
    }

    async function commitOpenFeedback(
        openFeedbackDraft: OpenFeedbackDraft,
        openAnswer: OpenAnswer
    ) {
        deleteMyFeedbackDraft(openFeedbackDraft, openAnswer);

        let myOpenFeedback: OpenFeedback = new OpenFeedback({
            feedbackText: openFeedbackDraft.feedbackText,
            openanswerID: openFeedbackDraft.openanswerID,
        });
        await DataStore.save(myOpenFeedback);
        openFeedback = myOpenFeedback;

        publishOpenFeedbackCommittedEvent(openFeedback);

        dispatch("toast", { type: "success", text: "Open Feedback created!" });

        fetchOpenFeedback(openAnswer);
    }

    async function deleteMyFeedbackDraft(openFeedbackDraft: OpenFeedbackDraft, openAnswer: OpenAnswer) {
        await DataStore.delete(
            await DataStore.query(OpenFeedbackDraft, openFeedbackDraft.id)
        );
        fetchOpenFeedbackDraft(openAnswer);
    }

    async function publishOpenFeedbackCommittedEvent(openFeedback: OpenFeedback) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(openFeedback);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        fetch(`${baseUrl}/commitOpenFeedback`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
    }
</script>

<div>
    {#if openFeedback}
        Feedback: {openFeedback.feedbackText}
    {:else}
        {#if openFeedbackDraft}
            <div class="flex justify-between">
                <div>{openFeedbackDraft.feedbackText}</div>
                <div>
                    <button
                        on:click={() => deleteMyFeedbackDraft(openFeedbackDraft, openAnswer)}
                        >Delete</button
                    >
                </div>
            </div>
        {:else}
            <input
                class="w-full"
                placeholder="Provide feedback to this answer"
                on:keydown={(e) => {
                    if (e.key === "Enter") {
                        saveOpenFeedbackDraft(openAnswer, e.target.value);
                    }
                }}
            />
        {/if}
        <div>
            <button
                disabled={!openFeedbackDraft}
                on:click={() => commitOpenFeedback(openFeedbackDraft, openAnswer)}
                >Commit</button
            >
        </div>
    {/if}
</div>
