import promisify from 'cypress-promise';
import { createChallengePool, openChallengePool, randomText } from '../functions';
import { studentEmail1, supabaseLogin } from '../plugins/supabaseLogin';

describe('Open Questions', () => {
    beforeEach(async () => {
        await promisify(cy.visit('http://localhost:3000'));
        await supabaseLogin(studentEmail1);

        openChallengePool(createChallengePool())
    });

    it('creates an open question draft', () => {
        // when
        createOpenQuestionDraft(openQuestionText, openAnswerText)

        // then
        cy.get('.mb-8 > :nth-child(1) > .w-full').should("have.text", openQuestionText)
        cy.get('.mb-8 > :nth-child(2) > .w-full').should("have.text", "Your Answer: " + openAnswerText)
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
    cy.get('.w-full.mt-4 > .w-full').type(openQuestionText)
    cy.get('.w-32').click()

    cy.get('#openQuestionDraftAnswerText').type(openAnswerText)
    cy.get(':nth-child(2) > .w-48').click()
}

function publishOpenQuestionDraft() {
    cy.get('.mb-8 > .w-32').click()
}