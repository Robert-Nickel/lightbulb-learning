<script>
  import LinkButton from './LinkButton.svelte'
  import Text from './Text.svelte'
  import Button from './Button.svelte'
  import Input from './Input.svelte'

  export let supabaseClient
  export let setView

  let error = '', message = '', loading = false, email = ''

  async function submit() {
    error = ''
    message = ''
    loading = true

    const { error: err } = await supabaseClient.auth.signIn({ email })

    if (err)
      error = err.message
    else
      message = 'Check your email for the magic link.'

    loading = false
  }
</script>

<form on:submit|preventDefault={submit}>
  <Input name="email" type="email" label="Email address" placeholder="Your email address" bind:value={email}/>
  <Button primary {loading}>Send magic link</Button>

  <LinkButton on:click={() => setView('sign_in')}>Login with password</LinkButton>

  {#if message}
    <Text>{message}</Text>
  {/if}

  {#if error}
    <Text type="danger">{error}</Text>
  {/if}
</form>
