<script>
    import Logo from "./Logo.svelte";
    import Hamburger from "./Hamburger.svelte";

    export let sidebar = false;
</script>

<header
    class="flex justify-between bg-gray-200 p-2 items-center text-gray-600 border-b-2"
>
    <nav class="flex">
        <Hamburger bind:open={sidebar} />
        <Logo />
    </nav>
</header>

<!--
    References:
    https://dev.to/joshnuss/creating-a-sidebar-menu-in-svelte-ih2
-->
