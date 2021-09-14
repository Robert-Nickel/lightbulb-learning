<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import TextInput from "./TextInput.svelte";
    import SubmitButton from "./SubmitButton.svelte";
    let openQuestionText;
    let validationError = "initial";
    $: submitButtonDisabled = validationError != "";

    const dispatch = createEventDispatcher();

    function submitQuestion() {
        dispatch("openQuestionProposed", {
            text: openQuestionText,
        });
    }

    function isOpenQuestionTextValid() {
        return openQuestionText.length > 0;
    }

    function showValidationErrorIfRequired() {
        validationError = isOpenQuestionTextValid()
            ? ""
            : "You have to enter some text.";
    }
</script>

<TextInput
    placeholder="Your question"
    label="Create on open question"
    bind:textInput={openQuestionText}
    {validationError}
    on:textInputChanged={showValidationErrorIfRequired}
/>
<SubmitButton on:buttonClicked={submitQuestion} disabled={submitButtonDisabled}/>
