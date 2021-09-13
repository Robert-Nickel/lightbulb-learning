<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let value = "Submit";

</script>

<input type="button" on:click="{e => dispatch('buttonClicked')}" {value} />

<style>
    input[type=button] {
        padding: 0.5rem;
        border: 1px solid white;
        background: none;
        color: white;
        font-size: 1rem;
        min-width: 16em;
        border-radius: 8px;
        margin-top: 1em;
    }
</style>
