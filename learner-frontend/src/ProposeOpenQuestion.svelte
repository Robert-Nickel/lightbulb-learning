<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import TextInput from "./TextInput.svelte";
    import SubmitButton from "./SubmitButton.svelte";

    let openQuestionProposal;
    let submitButtonEnabled;
    const dispatch = createEventDispatcher();

    function submitQuestion() {
        dispatch("openQuestionProposed", {
            text: openQuestionProposal,
        });
    }
</script>

<TextInput
    placeholder="Type your open question here."
    label="Propose on open question"
    bind:value={openQuestionProposal}
    bind:valid={submitButtonEnabled}
/>
<SubmitButton on:buttonClicked={submitQuestion} enabled={submitButtonEnabled} />
