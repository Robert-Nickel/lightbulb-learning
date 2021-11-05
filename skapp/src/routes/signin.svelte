<script>
  import Amplify, { Auth } from 'aws-amplify';

  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';

  import awsconfig from '../aws-exports';
  //Amplify.configure({ ...awsconfig, ssr: true });

  async function handleSignIn() {
    try {
      const res = await Auth.signIn(username, password);
    } catch (error) {
      console.log(error);
    }
    goto('/testssr');
  }

  onMount(() => {});

  onDestroy(() => {});
</script>

<svelte:head>
  <title>Sign In</title>
</svelte:head>

<main>
  <form on:submit|preventDefault={handleSignIn}>
    <input
      type="text"
      value={username}
      on:input={(event) => (username = event.target.value)}
    />
    <input
      id="Password"
      label="Password"
      type="password"
      value={password}
      on:input={(event) => (password = event.target.value)}
    />

    <button type="submit">Sign In</button>
  </form>
</main>

<style>
</style>
