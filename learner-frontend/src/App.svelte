<script lang="ts">
  import { store } from "./stores/auth.js";
  import ProposeOpenQuestion from "./ProposeOpenQuestion.svelte";
  import OpenQuestionProposalsOverview from "./OpenQuestionProposalsOverview.svelte";
  import Login from "./Login.svelte";

  let openQuestionProposals = [];
  function handleOpenQuestionProposed(event) {
    // TODO: somewhere here, create the open question proposal in the backend as well
    openQuestionProposals.push({ text: event.detail.text });
    openQuestionProposals = openQuestionProposals;
  }
  function logout() {
    $store = null;
  }
</script>

<main>
  <h2>scalexam</h2>

  {#if $store != null}
    <h2>
      You are logged in <button type="button" on:click={logout}>Log Out</button>
    </h2>
    <pre>
    {JSON.stringify($store, null, 2)}
  </pre>
    <!--<OpenQuestionProposalsOverview {openQuestionProposals} />
    <ProposeOpenQuestion on:openQuestionProposed={handleOpenQuestionProposed} />-->
  {:else}
    <Login />
  {/if}
</main>

<style>
  :root {
    --dark-blue-color: #001733;
    --cyber-orange-color: #ffab40;
    --almost-white-color: #f4f4f4;
    --disabled-gray-color: #b4b4b4;
    --danger-color: #dc3545;
    --success-color: #28a745;

    font-family: "Montserrat", sans-serif;

    background-color: var(--dark-blue-color);
    color: var(--almost-white-color);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  main {
    padding: 1em;
    margin: 0 auto;
    max-width: 48em;
  }

  h2 {
    font-weight: 800;
  }
</style>
