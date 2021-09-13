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
