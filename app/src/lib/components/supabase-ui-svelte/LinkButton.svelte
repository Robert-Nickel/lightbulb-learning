<!-- svelte-ignore a11y-missing-attribute -->
<a on:click|preventDefault><slot/></a>

<style>
a {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    text-align: center;
}</style>