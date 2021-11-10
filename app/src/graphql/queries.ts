/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOpenQuestionDraft = /* GraphQL */ `
  query GetOpenQuestionDraft($id: ID!) {
    getOpenQuestionDraft(id: $id) {
      id
      questionText
      challengePoolID
      answerText
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      ChallengePool {
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
    }
  }
`;
export const listOpenQuestionDrafts = /* GraphQL */ `
  query ListOpenQuestionDrafts(
    $filter: ModelOpenQuestionDraftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOpenQuestionDrafts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        questionText
        challengePoolID
        answerText
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        ChallengePool {
          id
          description
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }
      nextToken
      startedAt
    }
  }
`;
export const syncOpenQuestionDrafts = /* GraphQL */ `
  query SyncOpenQuestionDrafts(
    $filter: ModelOpenQuestionDraftFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOpenQuestionDrafts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        questionText
        challengePoolID
        answerText
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        ChallengePool {
          id
          description
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
      }
      nextToken
      startedAt
    }
  }
`;
export const getChallengePool = /* GraphQL */ `
  query GetChallengePool($id: ID!) {
    getChallengePool(id: $id) {
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
          questionText
          challengePoolID
          answerText
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
export const listChallengePools = /* GraphQL */ `
  query ListChallengePools(
    $filter: ModelChallengePoolFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChallengePools(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncChallengePools = /* GraphQL */ `
  query SyncChallengePools(
    $filter: ModelChallengePoolFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChallengePools(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getOpenQuestion = /* GraphQL */ `
  query GetOpenQuestion($id: ID!) {
    getOpenQuestion(id: $id) {
      id
      questionText
      challengePoolID
      answerText
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
export const listOpenQuestions = /* GraphQL */ `
  query ListOpenQuestions(
    $filter: ModelOpenQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOpenQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        questionText
        challengePoolID
        answerText
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
      nextToken
      startedAt
    }
  }
`;
export const syncOpenQuestions = /* GraphQL */ `
  query SyncOpenQuestions(
    $filter: ModelOpenQuestionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOpenQuestions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        questionText
        challengePoolID
        answerText
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
      nextToken
      startedAt
    }
  }
`;
export const getOpenAnswer = /* GraphQL */ `
  query GetOpenAnswer($id: ID!) {
    getOpenAnswer(id: $id) {
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
        questionText
        challengePoolID
        answerText
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
export const listOpenAnswers = /* GraphQL */ `
  query ListOpenAnswers(
    $filter: ModelOpenAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOpenAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          questionText
          challengePoolID
          answerText
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncOpenAnswers = /* GraphQL */ `
  query SyncOpenAnswers(
    $filter: ModelOpenAnswerFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOpenAnswers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
          questionText
          challengePoolID
          answerText
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          owner
        }
        owner
      }
      nextToken
      startedAt
    }
  }
`;
