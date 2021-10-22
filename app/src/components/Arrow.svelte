<script lang="ts">
    export let down = false;
</script>

{#if down}<i
        class="border-black border-solid p-1 border-b-2 border-r-2 inline-block transform rotate-45"
    />
{:else}<i
        class="border-black border-solid p-1 border-b-2 border-r-2 inline-block transform -rotate-45"
    />
{/if}
