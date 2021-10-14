/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
          text
          challengePoolID
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
          text
          challengePoolID
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
          text
          challengePoolID
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
  }
`;
export const onCreateOpenQuestion = /* GraphQL */ `
  subscription OnCreateOpenQuestion {
    onCreateOpenQuestion {
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
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const onUpdateOpenQuestion = /* GraphQL */ `
  subscription OnUpdateOpenQuestion {
    onUpdateOpenQuestion {
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
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const onDeleteOpenQuestion = /* GraphQL */ `
  subscription OnDeleteOpenQuestion {
    onDeleteOpenQuestion {
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
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const onCreateOpenAnswer = /* GraphQL */ `
  subscription OnCreateOpenAnswer {
    onCreateOpenAnswer {
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
        openAnswers {
          nextToken
          startedAt
        }
      }
    }
  }
`;
export const onUpdateOpenAnswer = /* GraphQL */ `
  subscription OnUpdateOpenAnswer {
    onUpdateOpenAnswer {
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
        openAnswers {
          nextToken
          startedAt
        }
      }
    }
  }
`;
export const onDeleteOpenAnswer = /* GraphQL */ `
  subscription OnDeleteOpenAnswer {
    onDeleteOpenAnswer {
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
        openAnswers {
          nextToken
          startedAt
        }
      }
    }
  }
`;
