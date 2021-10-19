<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { ChallengePool } from "../models";
    import ChallengePoolDetail from "./ChallengePoolDetail.svelte";
    import OpenQuestions from "./OpenQuestions.svelte";
    import { Hub } from "aws-amplify";

    let challengePools: Array<ChallengePool> = [];

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

    async function createChallengePoolFunc(input) {
        await DataStore.save(new ChallengePool({ description: input.value }));
        fetchChallengePools();
    }

    async function deleteChallengePoolFunc(id) {
        await DataStore.delete(await DataStore.query(ChallengePool, id));
        fetchChallengePools();
    }
</script>

<div class="space-y-4">
    {#each challengePools as challengePool}
        <ChallengePoolDetail
            {challengePool}
            on:deleteClicked={() => deleteChallengePoolFunc(challengePool.id)}
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
                        createChallengePoolFunc(e.target);
                    }
                }}
            /></span
        >
    </div>
</div>
