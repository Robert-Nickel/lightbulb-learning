<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { ChallengePool } from "../models";
    import ChallengePoolDetail from "./ChallengePoolDetail.svelte";
    import { Hub } from "aws-amplify";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let baseUrl;
    export let userId;
    let challengePools: Array<ChallengePool> = [];
    let activeChallenge: ChallengePool;
    let challengePoolDraft: string;

    fetchChallengePools();

    const listener = Hub.listen("datastore", async (hubData) => {
        const { event, data } = hubData.payload;
        if (event === "ready") {
            fetchChallengePools();
            // This removes the listener
            listener();
        }
    });

    async function fetchChallengePools() {
        challengePools = await DataStore.query(ChallengePool);
    }

    async function createChallengePool() {
        const description = document.getElementById("challengePoolDescription").value
        await DataStore.save(new ChallengePool({ description: description }));
        fetchChallengePools();
        document.getElementById("challengePoolDescription").value = ""
        dispatch("toast", { type: "success", text: "Challenge Pool created!" });
    }

    async function deleteChallengePool(id) {
        await DataStore.delete(await DataStore.query(ChallengePool, id));
        fetchChallengePools();
    }
</script>

{#if activeChallenge != null}
    <div>challenge mode for</div>
    <div>{activeChallenge.description}</div>
{:else}
    <div class="space-y-4">
        {#each challengePools as challengePool}
            <ChallengePoolDetail
                {challengePool}
                on:deleteClicked={() => deleteChallengePool(challengePool.id)}
                on:toast
                baseUrl
                userId
            />
        {/each}
        <div class="space-y-4">
            <div class="flex justify-between space-x-2">
                <div class="w-full">
                    <input
                        id="challengePoolDescription"
                        class="w-full"
                        placeholder="Create new Challenge Pool"
                    />
                </div>
                <div><button on:click={createChallengePool} class="w-32">Create</button></div>
            </div>
        </div>
    </div>
{/if}
