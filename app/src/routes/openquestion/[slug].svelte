<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };

		const questionId = params.slug;
		const openQuestion = await fetchOpenQuestion(questionId);
		const courseDescription = await (await fetchCourse(openQuestion.course)).description;

		const openAnswersOfOthersWithNonLatest = await fetchOpenAnswersOfOthers(questionId, user.id);
		const openAnswersOfOthersDB = await filterNonLatest(openAnswersOfOthersWithNonLatest);
		const openAnswersOfOthersIds = openAnswersOfOthersDB.map((openAnswer) => openAnswer.id);
		const myOpenAnswerLikes = await fetchMyOpenAnswerLikes(openAnswersOfOthersIds, user.id);

		const myOpenAnswerWithoutLikes = await fetchLatestOpenAnswer(questionId, user.id);

		const allOpenAnswerIds = myOpenAnswerWithoutLikes
			? openAnswersOfOthersIds.concat(myOpenAnswerWithoutLikes.id)
			: openAnswersOfOthersIds;
		const openAnswerLikes = await fetchOpenAnswerLikes(allOpenAnswerIds);

		const myOpenAnswer = myOpenAnswerWithoutLikes
			? {
					...myOpenAnswerWithoutLikes,
					...{ totalLikes: countLikes(myOpenAnswerWithoutLikes.id) }
			  }
			: null;

		type OpenAnswer = OpenAnswerType & { isLiked: boolean; totalLikes: number };

		const openAnswersOfOthers: OpenAnswer[] = openAnswersOfOthersDB.map((openAnswer) => {
			const totalLikes = countLikes(openAnswer.id);
			return {
				...openAnswer,
				...{
					isLiked: isLiked(openAnswer.id),
					totalLikes
				}
			};
		});

		function isLiked(openAnswerId: string): boolean {
			for (let myOpenAnswerLike of myOpenAnswerLikes) {
				if (openAnswerId == myOpenAnswerLike.openAnswer) {
					return true;
				}
			}
			return false;
		}

		function countLikes(openAnswerId: string): number {
			return openAnswerLikes.filter((openAnswerLike) => {
				return openAnswerLike.openAnswer == openAnswerId;
			}).length;
		}

		return {
			props: {
				user,
				openQuestion,
				myOpenAnswer,
				openAnswersOfOthers,
				courseDescription
			}
		};
	};

	async function filterNonLatest(openAnswersOfOthers) {
		// O(n^2) <- thats though, isn't there a better way?
		// It filters out the non-latest open answers
		let openAnswers = openAnswersOfOthers;
		let indizesToRemove: number[] = [];
		for (let i = 0; i < openAnswers.length; i++) {
			let openAnswer = openAnswers[i];
			for (let otherOpenAnswer of openAnswers) {
				if (openAnswer.owner == otherOpenAnswer.owner) {
					if (openAnswer.version < otherOpenAnswer.version) {
						indizesToRemove.push(i);
						break;
					}
				}
			}
		}
		indizesToRemove
			.sort((a, b) => 0 - (a > b ? 1 : -1)) // sort descending
			.forEach((index) => {
				openAnswers.splice(index, 1);
			});
		return openAnswers;
	}
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import {
		fetchOpenAnswersOfOthers,
		fetchOpenQuestion,
		OpenAnswerType,
		OpenQuestionType,
		saveOpenAnswer,
		fetchLatestOpenAnswer,
		fetchCourse,
		fetchOpenAnswerLikes,
		fetchMyOpenAnswerLikes,
		deleteOpenAnswerLike,
		saveOpenAnswerLike
	} from '$lib/supabaseClient';
	import { user } from '$lib/stores/user';
	import autosize from '../../../node_modules/autosize';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';
	import { routes } from '$lib/routes';
	import OpenAnswer from '$lib/components/OpenAnswer.svelte';

	export let openQuestion: OpenQuestionType;
	export let myOpenAnswer: OpenAnswerType;
	export let openAnswersOfOthers;
	export let courseDescription: string;

	let openAnswerText;
	let toast;
</script>

<main class="container">
	{#if openQuestion}
		<Back text="Back to {courseDescription}" route="/course/{openQuestion.course}" />

		<h1 class={openQuestion.owner == $user.id ? 'yours pl-4' : ''}>{openQuestion.questionText}</h1>

		{#if myOpenAnswer}
			<a href={routes.openAnswer(myOpenAnswer.id)} class="light-link" sveltekit:prefetch>
				<article class="yours hoverable">
					<OpenAnswer openAnswer={myOpenAnswer} />
				</article>
			</a>
		{:else}
			<textarea
				id="textarea-answer"
				bind:value={openAnswerText}
				class="w-full h-12"
				placeholder="Answer this question"
				on:load={autosize(document.getElementById('textarea-answer'))}
			/>

			<button
				on:click={async () => {
					myOpenAnswer = await saveOpenAnswer(openAnswerText, openQuestion.id);
					toast.showSuccessToast('Open Answer created!');
				}}
				class="w-32 mt-4"
				disabled={!openAnswerText}>Publish</button
			>
		{/if}

		<!-- This shows the old and the new versions of the answers! -->
		{#if openAnswersOfOthers}
			{#each openAnswersOfOthers as openAnswerOfOther}
				<a href={routes.openAnswer(openAnswerOfOther.id)} class="light-link" sveltekit:prefetch>
					<article class="hoverable flex justify-between">
						<OpenAnswer openAnswer={openAnswerOfOther} />
						{#if openAnswerOfOther.isLiked}
							<button
								class="outline h-12 ml-4 mb-0 p-2 w-16"
								on:click|preventDefault={async () => {
									await deleteOpenAnswerLike(openAnswerOfOther.id);
									openAnswersOfOthers.map((oa) => {
										if (oa.id == openAnswerOfOther.id) {
											oa.isLiked = false;
											oa.totalLikes--;
										}
										return oa;
									});
									openAnswersOfOthers = openAnswersOfOthers;
								}}>Unlike</button
							>{:else}<button
								class="outline h-12 ml-4 mb-0 p-2 w-16"
								on:click|preventDefault={async () => {
									await saveOpenAnswerLike(openAnswerOfOther.id);
									openAnswersOfOthers.map((oa) => {
										if (oa.id == openAnswerOfOther.id) {
											oa.isLiked = true;
											oa.totalLikes++;
										}
										return oa;
									});
									openAnswersOfOthers = openAnswersOfOthers;
								}}>Like!</button
							>
						{/if}
					</article>
				</a>
			{/each}
		{/if}
	{/if}
</main>

<Toast bind:this={toast} />

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}

	.hoverable:hover {
		background: var(--card-sectionning-background-color);
	}
</style>
