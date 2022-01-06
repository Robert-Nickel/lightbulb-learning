<script lang="ts">
	import { createClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import type { definitions } from '../lib/models/supabase';
	type challenge_pools2 = definitions['challenge_pools'];
	const supabaseUrl = 'https://rkpsxesguhibbzhylmsd.supabase.co';
	const supabaseKey = 'TODO';
	const supabase = createClient(supabaseUrl, supabaseKey);

	onMount(async () => {
		//let { data, error } = await supabase.from('challenge_pools').select();
		const { data, error } = await supabase
			.from<challenge_pools2>('challenge_pools')
			.insert([{ description: 'This is the new one then' }]);

		alert(JSON.stringify(data));
	});
</script>
