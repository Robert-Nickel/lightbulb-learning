import promisify from 'cypress-promise';
import { createChallengePool, openChallengePool, randomText } from '../functions';
import { studentEmail1, supabaseLogin } from '../plugins/supabaseLogin';

describe('Open Questions', () => {
    beforeEach(async () => {
        await promisify(cy.visit('http://localhost:3000'));
        await supabaseLogin(studentEmail1);

        createChallengePool()
    });

    it('creates an open question draft', () => {
        // when
        createOpenQuestionDraft(openQuestionText, openAnswerText)

        // then
        cy.get('#p-draft-question').should("have.text", openQuestionText)
        cy.get('#p-draft-answer').should("have.text", "Your Answer: " + openAnswerText)
    });

    it("creates an open question", () => {
        // given
        createOpenQuestionDraft(openQuestionText, openAnswerText)

        // when
        publishOpenQuestionDraft()

        // then
        cy.get('.yours').should("have.text", "You asked: " + openQuestionText)
    })
})

const openQuestionText = randomText("open_question")
const openAnswerText = randomText("open_answer")

function createOpenQuestionDraft(questionText: string, answerText: string) {
    cy.get('#textarea-question').type(openQuestionText)
    cy.get('.w-32').click()

    cy.get('#textarea-draft-answer').type(openAnswerText)
    cy.get('#button-save').click()
}

function publishOpenQuestionDraft() {
    cy.get('#button-publish').click()
}

