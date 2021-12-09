/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOpenAnswer = /* GraphQL */ `
  mutation CreateOpenAnswer(
    $input: CreateOpenAnswerInput!
    $condition: ModelOpenAnswerConditionInput
  ) {
    createOpenAnswer(input: $input, condition: $condition) {
      id
      answerText
      owner
      openquestionID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateOpenAnswer = /* GraphQL */ `
  mutation UpdateOpenAnswer(
    $input: UpdateOpenAnswerInput!
    $condition: ModelOpenAnswerConditionInput
  ) {
    updateOpenAnswer(input: $input, condition: $condition) {
      id
      answerText
      owner
      openquestionID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteOpenAnswer = /* GraphQL */ `
  mutation DeleteOpenAnswer(
    $input: DeleteOpenAnswerInput!
    $condition: ModelOpenAnswerConditionInput
  ) {
    deleteOpenAnswer(input: $input, condition: $condition) {
      id
      answerText
      owner
      openquestionID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createOpenFeedback = /* GraphQL */ `
  mutation CreateOpenFeedback(
    $input: CreateOpenFeedbackInput!
    $condition: ModelOpenFeedbackConditionInput
  ) {
    createOpenFeedback(input: $input, condition: $condition) {
      id
      feedbackText
      owner
      openanswerID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateOpenFeedback = /* GraphQL */ `
  mutation UpdateOpenFeedback(
    $input: UpdateOpenFeedbackInput!
    $condition: ModelOpenFeedbackConditionInput
  ) {
    updateOpenFeedback(input: $input, condition: $condition) {
      id
      feedbackText
      owner
      openanswerID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteOpenFeedback = /* GraphQL */ `
  mutation DeleteOpenFeedback(
    $input: DeleteOpenFeedbackInput!
    $condition: ModelOpenFeedbackConditionInput
  ) {
    deleteOpenFeedback(input: $input, condition: $condition) {
      id
      feedbackText
      owner
      openanswerID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createOpenAnswerDraft = /* GraphQL */ `
  mutation CreateOpenAnswerDraft(
    $input: CreateOpenAnswerDraftInput!
    $condition: ModelOpenAnswerDraftConditionInput
  ) {
    createOpenAnswerDraft(input: $input, condition: $condition) {
      id
      answerText
      openquestionID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateOpenAnswerDraft = /* GraphQL */ `
  mutation UpdateOpenAnswerDraft(
    $input: UpdateOpenAnswerDraftInput!
    $condition: ModelOpenAnswerDraftConditionInput
  ) {
    updateOpenAnswerDraft(input: $input, condition: $condition) {
      id
      answerText
      openquestionID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteOpenAnswerDraft = /* GraphQL */ `
  mutation DeleteOpenAnswerDraft(
    $input: DeleteOpenAnswerDraftInput!
    $condition: ModelOpenAnswerDraftConditionInput
  ) {
    deleteOpenAnswerDraft(input: $input, condition: $condition) {
      id
      answerText
      openquestionID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createOpenFeedbackDraft = /* GraphQL */ `
  mutation CreateOpenFeedbackDraft(
    $input: CreateOpenFeedbackDraftInput!
    $condition: ModelOpenFeedbackDraftConditionInput
  ) {
    createOpenFeedbackDraft(input: $input, condition: $condition) {
      id
      feedbackText
      openanswerID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateOpenFeedbackDraft = /* GraphQL */ `
  mutation UpdateOpenFeedbackDraft(
    $input: UpdateOpenFeedbackDraftInput!
    $condition: ModelOpenFeedbackDraftConditionInput
  ) {
    updateOpenFeedbackDraft(input: $input, condition: $condition) {
      id
      feedbackText
      openanswerID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteOpenFeedbackDraft = /* GraphQL */ `
  mutation DeleteOpenFeedbackDraft(
    $input: DeleteOpenFeedbackDraftInput!
    $condition: ModelOpenFeedbackDraftConditionInput
  ) {
    deleteOpenFeedbackDraft(input: $input, condition: $condition) {
      id
      feedbackText
      openanswerID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createOpenQuestion = /* GraphQL */ `
  mutation CreateOpenQuestion(
    $input: CreateOpenQuestionInput!
    $condition: ModelOpenQuestionConditionInput
  ) {
    createOpenQuestion(input: $input, condition: $condition) {
      id
      questionText
      challengepoolID
      owner
      OpenAnswers {
        items {
          id
          answerText
          owner
          openquestionID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      OpenAnswerDrafts {
        items {
          id
          answerText
          openquestionID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const updateOpenQuestion = /* GraphQL */ `
  mutation UpdateOpenQuestion(
    $input: UpdateOpenQuestionInput!
    $condition: ModelOpenQuestionConditionInput
  ) {
    updateOpenQuestion(input: $input, condition: $condition) {
      id
      questionText
      challengepoolID
      owner
      OpenAnswers {
        items {
          id
          answerText
          owner
          openquestionID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      OpenAnswerDrafts {
        items {
          id
          answerText
          openquestionID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const deleteOpenQuestion = /* GraphQL */ `
  mutation DeleteOpenQuestion(
    $input: DeleteOpenQuestionInput!
    $condition: ModelOpenQuestionConditionInput
  ) {
    deleteOpenQuestion(input: $input, condition: $condition) {
      id
      questionText
      challengepoolID
      owner
      OpenAnswers {
        items {
          id
          answerText
          owner
          openquestionID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      OpenAnswerDrafts {
        items {
          id
          answerText
          openquestionID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const createChallengePool = /* GraphQL */ `
  mutation CreateChallengePool(
    $input: CreateChallengePoolInput!
    $condition: ModelChallengePoolConditionInput
  ) {
    createChallengePool(input: $input, condition: $condition) {
      id
      description
      owner
      OpenQuestions {
        items {
          id
          questionText
          challengepoolID
          owner
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      OpenQuestionDrafts {
        items {
          id
          questionText
          answerText
          challengepoolID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const updateChallengePool = /* GraphQL */ `
  mutation UpdateChallengePool(
    $input: UpdateChallengePoolInput!
    $condition: ModelChallengePoolConditionInput
  ) {
    updateChallengePool(input: $input, condition: $condition) {
      id
      description
      owner
      OpenQuestions {
        items {
          id
          questionText
          challengepoolID
          owner
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      OpenQuestionDrafts {
        items {
          id
          questionText
          answerText
          challengepoolID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const deleteChallengePool = /* GraphQL */ `
  mutation DeleteChallengePool(
    $input: DeleteChallengePoolInput!
    $condition: ModelChallengePoolConditionInput
  ) {
    deleteChallengePool(input: $input, condition: $condition) {
      id
      description
      owner
      OpenQuestions {
        items {
          id
          questionText
          challengepoolID
          owner
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      OpenQuestionDrafts {
        items {
          id
          questionText
          answerText
          challengepoolID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const createOpenQuestionDraft = /* GraphQL */ `
  mutation CreateOpenQuestionDraft(
    $input: CreateOpenQuestionDraftInput!
    $condition: ModelOpenQuestionDraftConditionInput
  ) {
    createOpenQuestionDraft(input: $input, condition: $condition) {
      id
      questionText
      answerText
      challengepoolID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateOpenQuestionDraft = /* GraphQL */ `
  mutation UpdateOpenQuestionDraft(
    $input: UpdateOpenQuestionDraftInput!
    $condition: ModelOpenQuestionDraftConditionInput
  ) {
    updateOpenQuestionDraft(input: $input, condition: $condition) {
      id
      questionText
      answerText
      challengepoolID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteOpenQuestionDraft = /* GraphQL */ `
  mutation DeleteOpenQuestionDraft(
    $input: DeleteOpenQuestionDraftInput!
    $condition: ModelOpenQuestionDraftConditionInput
  ) {
    deleteOpenQuestionDraft(input: $input, condition: $condition) {
      id
      questionText
      answerText
      challengepoolID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
