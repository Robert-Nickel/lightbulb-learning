<script lang="ts">
	import { getJWTToken } from '$lib/stores/auth';
	import { baseUrl } from '../lib/awsCommon';

	let paid = false;
	let showYouHaveToPay = false;

	async function upgrade() {
		if (!paid) {
			showYouHaveToPay = true;
		} else {
			let myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');
			const jwtToken = await getJWTToken();
			const raw = JSON.stringify({
				'Authorization': JSON.stringify(jwtToken)
			});
			const requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw
			};
			fetch(`${baseUrl}/upgradeGroup`, requestOptions)
				.then((response) => response.json())
				.then((result) => {
					console.log(result);
				})
				.catch((error) => console.log('error', error));
		}
	}
</script>

<h1>Upgrade to the next level!</h1>

<p>
	You are currently using the free plan of Lightbulb Learning - this means your groups are limited to 50
	students. Upgrade to the next level to <strong>unlock groups with up to 500 students! </strong>
</p>

<label for="paid">
	<input bind:checked={paid} type="checkbox" id="paid" name="paid" aria-invalid={showYouHaveToPay} />
	I agree to pay monthly.
</label>
{#if showYouHaveToPay}
	<small class="text-orange-600">You have to agree to pay for a standard group.</small>
{/if}
<button class="mt-8" on:click={upgrade}>Upgrade now!</button>
