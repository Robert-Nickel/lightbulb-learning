<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let value = "Submit";
    export let disabled = false;
</script>

{#if disabled}
    <input
        type="button"
        on:click={(e) => dispatch("buttonClicked")}
        {value}
        disabled
    />
{:else}
    <input type="button" on:click={(e) => dispatch("buttonClicked")} {value} />
{/if}

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
