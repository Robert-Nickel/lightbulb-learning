<script lang="ts">
    import { DataStore } from "@aws-amplify/datastore";
    import { OpenQuestion, OpenAnswer } from "../models";

    export let openQuestion: OpenQuestion;

    let myOpenAnswer: OpenAnswer;

    fetchMyOpenAnswer();

    async function fetchMyOpenAnswer() {
        let myOpenAnswers = await DataStore.query(OpenAnswer, (a) =>
            a.openQuestionID("eq", openQuestion.id)
        );
        if (myOpenAnswers.length > 0) {
            myOpenAnswer = myOpenAnswers[0];
        } else {
            myOpenAnswer = null;
        }
    }

    async function createOpenAnswerFunc(input) {
        await DataStore.save(
            new OpenAnswer({
                text: input.value,
                openQuestionID: openQuestion.id,
            })
        );
        fetchMyOpenAnswer();
    }

    async function deleteOpenAnswerFunc(id) {
        await DataStore.delete(await DataStore.query(OpenAnswer, id));
        fetchMyOpenAnswer();
    }
</script>

<div>
    {#if !myOpenAnswer}
        <div>
            <input
                class="w-full"
                placeholder="What is the answer?"
                on:keydown={(e) => {
                    if (e.key === "Enter") {
                        createOpenAnswerFunc(e.target);
                    }
                }}
            />
        </div>
    {:else}
        <div class="flex justify-between">
            <div>Answer: {myOpenAnswer.text}</div>
            <div>
                <button on:click={() => deleteOpenAnswerFunc(myOpenAnswer.id)}
                    >Delete</button
                >
            </div>
        </div>
    {/if}
</div>
