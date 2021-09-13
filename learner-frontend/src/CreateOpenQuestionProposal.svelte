<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import TextInput from "./TextInput.svelte";
    import SubmitButton from "./SubmitButton.svelte";
    let openQuestionText;

    const dispatch = createEventDispatcher();

    function submitQuestion() {
        dispatch("openQuestionProposalCreated", {
            openQuestionText: openQuestionText,
        });
    }
</script>

<TextInput
    placeholder="Your question"
    label="Create on open question"
    bind:textInput={openQuestionText}
/>
<SubmitButton on:buttonClicked={submitQuestion} />
