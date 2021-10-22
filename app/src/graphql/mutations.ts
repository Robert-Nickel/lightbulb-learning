/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createChallengePool = /* GraphQL */ `
  mutation CreateChallengePool(
    $input: CreateChallengePoolInput!
    $condition: ModelChallengePoolConditionInput
  ) {
    createChallengePool(input: $input, condition: $condition) {
      id
      description
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      openQuestions {
        items {
          id
          text
          challengePoolID
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      openQuestions {
        items {
          id
          text
          challengePoolID
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      openQuestions {
        items {
          id
          text
          challengePoolID
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
export const createOpenQuestion = /* GraphQL */ `
  mutation CreateOpenQuestion(
    $input: CreateOpenQuestionInput!
    $condition: ModelOpenQuestionConditionInput
  ) {
    createOpenQuestion(input: $input, condition: $condition) {
      id
      text
      challengePoolID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      challengePool {
        id
        description
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        openQuestions {
          nextToken
          startedAt
        }
      }
      owner
      openAnswers {
        items {
          id
          openQuestionID
          text
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
      text
      challengePoolID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      challengePool {
        id
        description
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        openQuestions {
          nextToken
          startedAt
        }
      }
      owner
      openAnswers {
        items {
          id
          openQuestionID
          text
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
      text
      challengePoolID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      challengePool {
        id
        description
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        openQuestions {
          nextToken
          startedAt
        }
      }
      owner
      openAnswers {
        items {
          id
          openQuestionID
          text
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
export const createOpenAnswer = /* GraphQL */ `
  mutation CreateOpenAnswer(
    $input: CreateOpenAnswerInput!
    $condition: ModelOpenAnswerConditionInput
  ) {
    createOpenAnswer(input: $input, condition: $condition) {
      id
      openQuestionID
      text
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      openQuestion {
        id
        text
        challengePoolID
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        challengePool {
          id
          description
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        owner
        openAnswers {
          nextToken
          startedAt
        }
      }
      owner
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
      openQuestionID
      text
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      openQuestion {
        id
        text
        challengePoolID
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        challengePool {
          id
          description
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        owner
        openAnswers {
          nextToken
          startedAt
        }
      }
      owner
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
      openQuestionID
      text
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      openQuestion {
        id
        text
        challengePoolID
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        challengePool {
          id
          description
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        owner
        openAnswers {
          nextToken
          startedAt
        }
      }
      owner
    }
  }
`;
