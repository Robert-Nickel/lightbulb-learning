<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestion } from "../models";
    import { createEventDispatcher } from "svelte";
    import { toast } from '@zerodevx/svelte-toast'

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
    <div on:click={() => (open = true)}>{challengePool.description}</div>
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

        <div>
            <button on:click={deleteClicked}>Delete Challenge Pool</button>
        </div>
        <div>
            <button on:click={() => (open = false)}>Close Details</button>
        </div>

        <!--<OpenQuestions {challengePool} />-->
    {/if}
</div>
