/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
  }
`;
export const getOpenAnswer = /* GraphQL */ `
  query GetOpenAnswer($id: ID!) {
    getOpenAnswer(id: $id) {
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
export const listOpenAnswers = /* GraphQL */ `
  query ListOpenAnswers(
    $filter: ModelOpenAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOpenAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const syncOpenFeedbacks = /* GraphQL */ `
  query SyncOpenFeedbacks(
    $filter: ModelOpenFeedbackFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOpenFeedbacks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getOpenFeedback = /* GraphQL */ `
  query GetOpenFeedback($id: ID!) {
    getOpenFeedback(id: $id) {
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
export const listOpenFeedbacks = /* GraphQL */ `
  query ListOpenFeedbacks(
    $filter: ModelOpenFeedbackFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOpenFeedbacks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        challengepoolID
        owner
        OpenAnswers {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        OpenAnswerDrafts {
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
        challengepoolID
        owner
        OpenAnswers {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        OpenAnswerDrafts {
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
        owner
        OpenQuestions {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        OpenQuestionDrafts {
          nextToken
          startedAt
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
        owner
        OpenQuestions {
          nextToken
          startedAt
        }
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        OpenQuestionDrafts {
          nextToken
          startedAt
        }
      }
      nextToken
      startedAt
    }
  }
`;
export const getOpenAnswerDraft = /* GraphQL */ `
  query GetOpenAnswerDraft($id: ID!) {
    getOpenAnswerDraft(id: $id) {
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
export const listOpenAnswerDrafts = /* GraphQL */ `
  query ListOpenAnswerDrafts(
    $filter: ModelOpenAnswerDraftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOpenAnswerDrafts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
`;
export const syncOpenAnswerDrafts = /* GraphQL */ `
  query SyncOpenAnswerDrafts(
    $filter: ModelOpenAnswerDraftFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOpenAnswerDrafts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
`;
export const getOpenFeedbackDraft = /* GraphQL */ `
  query GetOpenFeedbackDraft($id: ID!) {
    getOpenFeedbackDraft(id: $id) {
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
export const listOpenFeedbackDrafts = /* GraphQL */ `
  query ListOpenFeedbackDrafts(
    $filter: ModelOpenFeedbackDraftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOpenFeedbackDrafts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncOpenFeedbackDrafts = /* GraphQL */ `
  query SyncOpenFeedbackDrafts(
    $filter: ModelOpenFeedbackDraftFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOpenFeedbackDrafts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getOpenQuestionDraft = /* GraphQL */ `
  query GetOpenQuestionDraft($id: ID!) {
    getOpenQuestionDraft(id: $id) {
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
`;
