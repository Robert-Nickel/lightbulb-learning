<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { ChallengePool } from "../models";

    let challengePools: Array<ChallengePool> = [];

    fetchChallengePools();

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

<div>
    <input
        placeholder="Whats the name of the new challenge pool?"
        on:keydown={(e) =>
            e.key === "Enter" && createChallengePoolFunc(e.target)}
    />
</div>
{#each challengePools as challengePool}
    <p>
        {challengePool.description}
        <span on:click={() => deleteChallengePoolFunc(challengePool.id)}
            >(x)</span
        >
    </p>
{/each}
