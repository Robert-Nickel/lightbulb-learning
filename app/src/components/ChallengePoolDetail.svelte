<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestion } from "../models";
    import { createEventDispatcher } from "svelte";
    import { toast } from "@zerodevx/svelte-toast";

    const dispatch = createEventDispatcher();

    export let challengePool;

    let open = false;

    function deleteClicked() {
        dispatch("deleteClicked");
    }

    async function createOpenQuestionFunc(input) {
        await DataStore.save(
            new OpenQuestion({
                text: input.value,
                challengePoolID: challengePool.id,
            })
        );
        toast.push("Open Question created!", {
            theme: {
                "--toastBackground": "#48BB78",
                "--toastBarBackground": "#2F855A",
            },
        });
    }
</script>

<div class="bg-gray-200 space-y-5 p-8">
    <div class="flex justify-between">
        <div class="flex space-x-3">
            <div on:click={() => (open = !open)}>
                {#if open}<i class="border-black border-solid p-1 border-b-2 border-r-2 inline-block transform rotate-45" />
                {:else}<i class="border-black border-solid p-1 border-b-2 border-r-2 inline-block transform -rotate-45" />
                {/if}
            </div>
            <div>{challengePool.description}</div>
        </div>
        {#if open}<div>
                <button on:click={deleteClicked}>Delete Challenge Pool</button>
            </div>
        {/if}
    </div>
    {#if open}
        <div>
            <input
                class="w-full"
                placeholder="Create new Open Question"
                on:keydown={(e) => {
                    if (e.key === "Enter") {
                        createOpenQuestionFunc(e.target);
                    }
                }}
            />
        </div>
        <!--<OpenQuestions {challengePool} />-->
    {/if}
</div>

<style>
    .arrow {
        @apply border-black border-solid p-1 border-b-2 border-r-2 inline-block transform rotate-45;
    }
</style>
