<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let value = "Submit";
    export let enabled = true;
</script>

<input
    type="button"
    on:click={(e) => dispatch("buttonClicked")}
    {value}
    disabled={!enabled || undefined}
/>

<style>
    input {
        padding: 0.5rem;
        border: 1px solid white;
        background: none;
        color: white;
        font-size: 1rem;
        min-width: 16em;
        border-radius: 8px;
        margin-top: 1em;
    }
    input:disabled {
        color: var(--disabled-gray-color);
        border: 1px solid var(--disabled-gray-color);
    }
</style>
