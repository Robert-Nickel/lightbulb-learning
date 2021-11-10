/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateOpenQuestionDraft = /* GraphQL */ `
  subscription OnCreateOpenQuestionDraft {
    onCreateOpenQuestionDraft {
      id
      questionText
      challengePoolID
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
      answerText
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOpenQuestionDraft = /* GraphQL */ `
  subscription OnUpdateOpenQuestionDraft {
    onUpdateOpenQuestionDraft {
      id
      questionText
      challengePoolID
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
      answerText
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOpenQuestionDraft = /* GraphQL */ `
  subscription OnDeleteOpenQuestionDraft {
    onDeleteOpenQuestionDraft {
      id
      questionText
      challengePoolID
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
      answerText
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateChallengePool = /* GraphQL */ `
  subscription OnCreateChallengePool {
    onCreateChallengePool {
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
export const onUpdateChallengePool = /* GraphQL */ `
  subscription OnUpdateChallengePool {
    onUpdateChallengePool {
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
export const onDeleteChallengePool = /* GraphQL */ `
  subscription OnDeleteChallengePool {
    onDeleteChallengePool {
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
export const onCreateOpenQuestion = /* GraphQL */ `
  subscription OnCreateOpenQuestion($owner: String!) {
    onCreateOpenQuestion(owner: $owner) {
      id
      questionText
      challengePoolID
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
      answerText
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
export const onUpdateOpenQuestion = /* GraphQL */ `
  subscription OnUpdateOpenQuestion($owner: String!) {
    onUpdateOpenQuestion(owner: $owner) {
      id
      questionText
      challengePoolID
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
      answerText
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
export const onDeleteOpenQuestion = /* GraphQL */ `
  subscription OnDeleteOpenQuestion($owner: String!) {
    onDeleteOpenQuestion(owner: $owner) {
      id
      questionText
      challengePoolID
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
      answerText
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
export const onCreateOpenAnswer = /* GraphQL */ `
  subscription OnCreateOpenAnswer($owner: String!) {
    onCreateOpenAnswer(owner: $owner) {
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
        challengePool {
          id
          description
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        answerText
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
export const onUpdateOpenAnswer = /* GraphQL */ `
  subscription OnUpdateOpenAnswer($owner: String!) {
    onUpdateOpenAnswer(owner: $owner) {
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
        challengePool {
          id
          description
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        answerText
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
export const onDeleteOpenAnswer = /* GraphQL */ `
  subscription OnDeleteOpenAnswer($owner: String!) {
    onDeleteOpenAnswer(owner: $owner) {
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
        challengePool {
          id
          description
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        answerText
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
