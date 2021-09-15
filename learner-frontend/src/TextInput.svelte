<script lang="ts">
    export let placeholder = "";
    export let label = "";
    export let value = "";
    export let valid = false;
    let maxlength = 500;

    let validationError = "initial";

    function showValidationErrorIfRequired() {
        valid = checkValidity();
        validationError = valid ? "" : "You have to enter some text.";
    }

    function checkValidity() {
        return value.length > 0;
    }
</script>

<p>{label}</p>
<textarea
    {placeholder}
    {maxlength}
    bind:value
    on:keyup={showValidationErrorIfRequired}
/>
{#if validationError != "" && validationError != "initial"}
    <p>{validationError}</p>
{/if}

<style>
    textarea:focus {
        outline: none;
    }

    textarea {
        display: block;
        box-sizing: inherit;
        font-family: inherit;
        padding: 0.5em;
        height: 10em;
        resize: none;
        line-height: 1.6;
        width: 100%;
        font-size: inherit;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin: 0 auto;
    }
</style>
