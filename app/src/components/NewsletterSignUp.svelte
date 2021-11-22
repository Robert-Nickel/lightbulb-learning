<div class="bg-black py-16 mt-8 pb-16">
    <div class="mx-auto max-w-screen-sm">
        <p class="text-white text-3xl mx-8 mb-8">Stay in the loop?</p>
        <form
            class="mx-8"
            action="https://tinyletter.com/RobertNickel"
            method="post"
            target="popupwindow"
            onsubmit="window.open('https://tinyletter.com/RobertNickel', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true"
        >
            <input
                type="text"
                name="email"
                class="font-semibold rounded-lg shadow-md focus:outline-none mx-auto"
                placeholder="email@example.com"
                id="tlemail"
                style="padding: 0.5rem; margin-right: 0.5rem; margin-bottom: 0.5rem; min-width: 16em;"
            />
            <input type="hidden" value="1" name="embed" />
            <input type="submit" value="Subscribe" class="btn-yellow" />
        </form>
    </div>
</div>

<style>
    .btn-yellow {
        @apply py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75;
    }
</style>
