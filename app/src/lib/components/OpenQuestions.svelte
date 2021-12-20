<script lang="ts">
  import { DataStore } from "@aws-amplify/datastore";
  import { ChallengePool, OpenQuestion, OpenAnswer } from "../models";
  import OpenAnswers from "./OpenAnswers.svelte";

  export let baseUrl: string;
  export let userId: string;
  export let challengePool: ChallengePool;

  let openQuestions: Array<OpenQuestion> = [];

  fetchOpenQuestions();

  export async function fetchOpenQuestions() {
    openQuestions = await DataStore.query(OpenQuestion, (q) =>
      q.challengepoolID("eq", challengePool.id)
    );
  }
</script>

<div class="space-y-2">
  {#if openQuestions.length > 0}
    <div class="text-xl mt-8">All Open Questions</div>
  {/if}
  {#each openQuestions as openQuestion}
    <div
      class="rounded p-4"
      style="background: var(--card-background-color);"
    >
      <p>{openQuestion.questionText}</p>

      <OpenAnswers bind:openQuestion {baseUrl} {userId} />
    </div>
  {/each}
</div>
