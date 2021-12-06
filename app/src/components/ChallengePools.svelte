<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { ChallengePool } from "../models";
    import ChallengePoolDetail from "./ChallengePoolDetail.svelte";
    import { Hub } from "aws-amplify";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let baseUrl;
    let challengePools: Array<ChallengePool> = [];
    let activeChallenge: ChallengePool;

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

    async function createChallengePool(input) {
        await DataStore.save(new ChallengePool({ description: input.value }));
        fetchChallengePools();

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
                on:deleteClicked={() =>
                    deleteChallengePool(challengePool.id)}
                on:startChallengeClicked={() => {
                    activeChallenge = challengePool;
                }}
                on:toast
                baseUrl
            />
        {/each}
        <div class="space-y-4">
            <span class="block">Create new Challenge Pool</span>
            <span class="block"
                ><input
                    placeholder="Description"
                    class="w-full"
                    on:keydown={(e) => {
                        if (e.key === "Enter") {
                            createChallengePool(e.target);
                        }
                    }}
                /></span
            >
        </div>
    </div>
{/if}
