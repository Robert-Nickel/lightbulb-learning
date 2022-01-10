/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateOpenAnswerDraft = /* GraphQL */ `
  subscription OnCreateOpenAnswerDraft($owner: String) {
    onCreateOpenAnswerDraft(owner: $owner) {
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
export const onUpdateOpenAnswerDraft = /* GraphQL */ `
  subscription OnUpdateOpenAnswerDraft($owner: String) {
    onUpdateOpenAnswerDraft(owner: $owner) {
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
export const onDeleteOpenAnswerDraft = /* GraphQL */ `
  subscription OnDeleteOpenAnswerDraft($owner: String) {
    onDeleteOpenAnswerDraft(owner: $owner) {
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
export const onCreateOpenAnswer = /* GraphQL */ `
  subscription OnCreateOpenAnswer {
    onCreateOpenAnswer {
      id
      answerText
      owner
      openquestionID
      version
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOpenAnswer = /* GraphQL */ `
  subscription OnUpdateOpenAnswer {
    onUpdateOpenAnswer {
      id
      answerText
      owner
      openquestionID
      version
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOpenAnswer = /* GraphQL */ `
  subscription OnDeleteOpenAnswer {
    onDeleteOpenAnswer {
      id
      answerText
      owner
      openquestionID
      version
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateOpenFeedbackDraft = /* GraphQL */ `
  subscription OnCreateOpenFeedbackDraft($owner: String) {
    onCreateOpenFeedbackDraft(owner: $owner) {
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
export const onUpdateOpenFeedbackDraft = /* GraphQL */ `
  subscription OnUpdateOpenFeedbackDraft($owner: String) {
    onUpdateOpenFeedbackDraft(owner: $owner) {
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
export const onDeleteOpenFeedbackDraft = /* GraphQL */ `
  subscription OnDeleteOpenFeedbackDraft($owner: String) {
    onDeleteOpenFeedbackDraft(owner: $owner) {
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
export const onCreateOpenFeedback = /* GraphQL */ `
  subscription OnCreateOpenFeedback {
    onCreateOpenFeedback {
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
export const onUpdateOpenFeedback = /* GraphQL */ `
  subscription OnUpdateOpenFeedback {
    onUpdateOpenFeedback {
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
export const onDeleteOpenFeedback = /* GraphQL */ `
  subscription OnDeleteOpenFeedback {
    onDeleteOpenFeedback {
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
export const onCreateOpenQuestion = /* GraphQL */ `
  subscription OnCreateOpenQuestion {
    onCreateOpenQuestion {
      id
      questionText
      challengepoolID
      owner
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
      OpenAnswers {
        items {
          id
          answerText
          owner
          openquestionID
          version
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
      questionText
      challengepoolID
      owner
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
      OpenAnswers {
        items {
          id
          answerText
          owner
          openquestionID
          version
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
      questionText
      challengepoolID
      owner
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
      OpenAnswers {
        items {
          id
          answerText
          owner
          openquestionID
          version
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
export const onCreateChallengePool = /* GraphQL */ `
  subscription OnCreateChallengePool {
    onCreateChallengePool {
      id
      description
      owner
      groupID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
export const onUpdateChallengePool = /* GraphQL */ `
  subscription OnUpdateChallengePool {
    onUpdateChallengePool {
      id
      description
      owner
      groupID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
export const onDeleteChallengePool = /* GraphQL */ `
  subscription OnDeleteChallengePool {
    onDeleteChallengePool {
      id
      description
      owner
      groupID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
export const onCreateOpenQuestionDraft = /* GraphQL */ `
  subscription OnCreateOpenQuestionDraft($owner: String) {
    onCreateOpenQuestionDraft(owner: $owner) {
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
export const onUpdateOpenQuestionDraft = /* GraphQL */ `
  subscription OnUpdateOpenQuestionDraft($owner: String) {
    onUpdateOpenQuestionDraft(owner: $owner) {
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
export const onDeleteOpenQuestionDraft = /* GraphQL */ `
  subscription OnDeleteOpenQuestionDraft($owner: String) {
    onDeleteOpenQuestionDraft(owner: $owner) {
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
