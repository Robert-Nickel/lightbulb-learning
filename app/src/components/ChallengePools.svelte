<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { ChallengePool } from "../models";
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

<div class="container">
    <h2>Challenge Pools</h2>
    <div class="container">
        <h2>Create new Challenge Pool</h2>
        <input
            placeholder="Description"
            on:keydown={(e) => {
                if (e.key === "Enter") {
                    createChallengePoolFunc(e.target);
                }
            }}
        />
    </div>

    {#each challengePools as challengePool}
        <div class="container">
            <h2>{challengePool.description}</h2>
            <button
                on:click={() => deleteChallengePoolFunc(challengePool.id)}
                style="float: right;">Delete Challenge Pool</button
            >
            <OpenQuestions {challengePool} />
        </div>
    {/each}
</div>

<style>
    .container {
        border: 3px #333 solid;
        border-radius: 10px;
        text-align: left;
        padding: 1em;
        margin: 1em;
    }

    input {
        width: 16em;
    }
</style>
