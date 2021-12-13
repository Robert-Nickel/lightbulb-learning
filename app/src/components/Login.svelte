<script>
  import {
    signUp,
    signIn,
    confirmSignUp,
    loginFormState,
  } from "../stores/auth.js";
  
  export let mode = "signup"
  let isSigningIn = mode === "signin";
  let promise; // nothing to start with

  function toggleMode() {
    if (mode === "signup") mode = "signin";
    else mode = "signup";
  }
  function handleSubmit() {
    if (mode === "signup") {
      promise = signUp().then(() => {
        mode = "confirm";
      });
    } else if (mode === "confirm") {
      promise = confirmSignUp();
    } else {
      promise = signIn();
    }
  }
</script>

<div>
  {#await promise}
    <p>Logging in...</p>
  {:catch error}
    <p class="errorMessage">Something went wrong: {error.message}</p>
  {/await}
  <div class="flex justify-between mb-8">
    <div class="inline-block">
      {#if mode === "signin"}
        <p class="text-3xl">Sign In</p>
      {:else}
        <p class="text-3xl">Sign Up</p>
      {/if}
    </div>
    <div class="flex justify-end">
      <label class="switch relative mt-32">
        <input
          type="checkbox"
          on:click={toggleMode}
          bind:checked={isSigningIn}
        />
        <span class="slider round" />
      </label>
      {#if mode === "signin"}
        <p class="pt-2 ml-2">Switch to Sign Up</p>
      {:else}
        <p class="pt-2 ml-2">Switch to Sign In</p>
      {/if}
    </div>
  </div>
  <form on:submit|preventDefault={handleSubmit}>
    {#if mode == "signin"}
      <label>
        Email:
        <input type="text" bind:value={$loginFormState.username} />
      </label>
      <label>
        Password:
        <input type="password" bind:value={$loginFormState.password} />
      </label>
    {/if}
    {#if mode === "signup"}
      <label>
        Email:
        <input type="email" bind:value={$loginFormState.email} />
      </label>
      <label>
        Password:
        <input type="password" bind:value={$loginFormState.password} />
      </label>
    {/if}
    {#if mode === "confirm"}
      <label>
        Confirm signup (check your email):
        <input
          type="text"
          bind:value={$loginFormState.confirmCode}
          placeholder="e.g. 123456"
        />
      </label>
    {/if}
    <button type="submit">Submit</button>
  </form>
</div>

<!--
  References:
  https://www.swyx.io/svelte-auth/
-->
<style>
  .errorMessage {
    background: papayawhip;
    color: red;
    padding: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: 0 auto;
  }
  label {
    text-align: left;
    display: flex;
    align-items: center;
    margin: 0 0 1em 0;
    justify-content: space-between;
  }
  button[type="submit"] {
    grid-column: 1 / 3;
  }
  /* The switch - the box around the slider */
  .switch {
    width: 60px;
    height: 34px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
