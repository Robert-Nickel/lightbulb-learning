<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import OpenQuestions from "./MyOpenQuestions.svelte";

    export let challengePool;

    let open = false;

    function deleteClicked() {
        dispatch("deleteClicked");
    }
</script>

<div class="bg-gray-200 space-y-5 p-8">
    <div class="flex justify-between">
        <div class="flex space-x-3">
            <div on:click={() => (open = !open)}>
                {#if open}<i
                        class="border-black border-solid p-1 border-b-2 border-r-2 inline-block transform rotate-45"
                    />
                {:else}<i
                        class="border-black border-solid p-1 border-b-2 border-r-2 inline-block transform -rotate-45"
                    />
                {/if}
            </div>
            <div>{challengePool.description}</div>
        </div>
        {#if open}
            <div>
                <button on:click={deleteClicked}>Delete</button>
            </div>
        {/if}
    </div>
    {#if open}
        <OpenQuestions {challengePool} />
    {/if}
</div>
