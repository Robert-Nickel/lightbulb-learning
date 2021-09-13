<script lang="ts">
    export let placeholder = "";
    export let maxlength = 500;
    export let label = "";
    export let textInput = "";
</script>

<p>{label}</p>
<textarea {placeholder} {maxlength} bind:value={textInput} />

<style>
    textarea:focus {
        outline: none;
    }

    textarea {
        display: block;
        font-family: "Montserrat", sans-serif;
        padding: 0.5em;
        height: 10em;
        resize: none;
        line-height: 1.6;
        width: 100% !important;
        font-size: inherit;
        border: 1px solid #ccc;
        border-radius: 8px;
    }
</style>
