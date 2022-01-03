<script lang="ts">
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';

	export function showSuccessToast(text) {
		let theme = {
			'--toastBackground': '#48BB78',
			'--toastBarBackground': '#2F855A'
		};
		toast.push(text, {
			theme
		});
	}
</script>

<SvelteToast />
