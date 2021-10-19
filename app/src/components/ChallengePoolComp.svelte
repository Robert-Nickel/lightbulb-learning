<script lang="ts">
    //import { ChallengePool } from "../models";
    import OpenQuestions from "./OpenQuestions.svelte";
    import { createEventDispatcher } from "svelte";

    export let challengePool;
    const dispatch = createEventDispatcher();

    function deleteClicked() {
        dispatch("deleteClicked");
    }
</script>

<div class="container">
    <h2>{challengePool.description}</h2>
    <button
        on:click={deleteClicked}
        style="float: right;">Delete Challenge Pool</button
    >
    <OpenQuestions {challengePool} />
</div>
