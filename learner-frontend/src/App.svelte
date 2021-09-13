<script lang="ts">
  import CreateOpenQuestionProposal from "./CreateOpenQuestionProposal.svelte";
  import OpenQuestionProposalsOverview from "./OpenQuestionProposalsOverview.svelte";

  let openQuestionProposals = [];
  function handleOpenQuestionProposalCreated(event) {
    openQuestionProposals.push({ text: event.detail.openQuestionText });
    openQuestionProposals = openQuestionProposals;
  }
</script>

<main>
  <h2>scalexam</h2>
  <OpenQuestionProposalsOverview {openQuestionProposals} />

  <CreateOpenQuestionProposal
    on:openQuestionProposalCreated={handleOpenQuestionProposalCreated}
  />

</main>

<style>
  :root {
    --dark-blue-color: #001733;
    --cyber-orange-color: #ffab40;
    --almost-white-color: #f4f4f4;
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
