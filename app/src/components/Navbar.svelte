<script>
    import Logo from "./Logo.svelte";
    import Hamburger from "./Hamburger.svelte";
    import { createEventDispatcher } from "svelte";
	import { store } from "../stores/auth.js";

    export let sidebar = false;
    const dispatch = createEventDispatcher();

    function logout() {
        dispatch("logout");
    }
</script>

<header
    class="flex justify-between bg-gray-200 p-2 items-center text-gray-600 border-b-2"
>
    <nav class="flex">
        <Hamburger bind:open={sidebar} />
        <Logo />
    </nav>

    <nav class="hidden text-gray-500 uppercase text-bold sm:block">
        <a
            href="/"
            class="hover:text-gray-700 hover:no-underline"
            on:click={logout}>Logout</a
        >
    </nav>
</header>
{#if $store == null}
<div class="bg-lightbulb bg-cover">
    <p class="text-7xl max-w-screen-sm mx-auto px-8 leading-snug pt-32 pb-8 text-white font-bold">
        Learning for the long run.
    </p>
</div>
{/if}
<!--
    References:
    https://dev.to/joshnuss/creating-a-sidebar-menu-in-svelte-ih2
-->
