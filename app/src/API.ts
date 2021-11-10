/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateOpenQuestionDraftInput = {
  id?: string | null,
  questionText?: string | null,
  challengePoolID?: string | null,
  answerText?: string | null,
  _version?: number | null,
  openQuestionDraftChallengePoolId?: string | null,
};

export type ModelOpenQuestionDraftConditionInput = {
  questionText?: ModelStringInput | null,
  challengePoolID?: ModelIDInput | null,
  answerText?: ModelStringInput | null,
  and?: Array< ModelOpenQuestionDraftConditionInput | null > | null,
  or?: Array< ModelOpenQuestionDraftConditionInput | null > | null,
  not?: ModelOpenQuestionDraftConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type OpenQuestionDraft = {
  __typename: "OpenQuestionDraft",
  id: string,
  questionText?: string | null,
  challengePoolID?: string | null,
  ChallengePool?: ChallengePool | null,
  answerText?: string | null,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  createdAt: string,
  updatedAt: string,
};

export type ChallengePool = {
  __typename: "ChallengePool",
  id: string,
  description: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  createdAt: string,
  updatedAt: string,
  openQuestions?: ModelOpenQuestionConnection | null,
};

export type ModelOpenQuestionConnection = {
  __typename: "ModelOpenQuestionConnection",
  items?:  Array<OpenQuestion | null > | null,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type OpenQuestion = {
  __typename: "OpenQuestion",
  id: string,
  questionText: string,
  challengePoolID?: string | null,
  challengePool?: ChallengePool | null,
  answerText?: string | null,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
  openAnswers?: ModelOpenAnswerConnection | null,
};

export type ModelOpenAnswerConnection = {
  __typename: "ModelOpenAnswerConnection",
  items?:  Array<OpenAnswer | null > | null,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type OpenAnswer = {
  __typename: "OpenAnswer",
  id: string,
  openQuestionID?: string | null,
  text: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  createdAt: string,
  updatedAt: string,
  openQuestion?: OpenQuestion | null,
  owner?: string | null,
};

export type UpdateOpenQuestionDraftInput = {
  id: string,
  questionText?: string | null,
  challengePoolID?: string | null,
  answerText?: string | null,
  _version?: number | null,
  openQuestionDraftChallengePoolId?: string | null,
};

export type DeleteOpenQuestionDraftInput = {
  id: string,
  _version?: number | null,
};

export type CreateChallengePoolInput = {
  id?: string | null,
  description: string,
  _version?: number | null,
};

export type ModelChallengePoolConditionInput = {
  description?: ModelStringInput | null,
  and?: Array< ModelChallengePoolConditionInput | null > | null,
  or?: Array< ModelChallengePoolConditionInput | null > | null,
  not?: ModelChallengePoolConditionInput | null,
};

export type UpdateChallengePoolInput = {
  id: string,
  description?: string | null,
  _version?: number | null,
};

export type DeleteChallengePoolInput = {
  id: string,
  _version?: number | null,
};

export type CreateOpenQuestionInput = {
  id?: string | null,
  questionText: string,
  challengePoolID?: string | null,
  answerText?: string | null,
  _version?: number | null,
  openQuestionChallengePoolId?: string | null,
};

export type ModelOpenQuestionConditionInput = {
  questionText?: ModelStringInput | null,
  challengePoolID?: ModelIDInput | null,
  answerText?: ModelStringInput | null,
  and?: Array< ModelOpenQuestionConditionInput | null > | null,
  or?: Array< ModelOpenQuestionConditionInput | null > | null,
  not?: ModelOpenQuestionConditionInput | null,
};

export type UpdateOpenQuestionInput = {
  id: string,
  questionText?: string | null,
  challengePoolID?: string | null,
  answerText?: string | null,
  _version?: number | null,
  openQuestionChallengePoolId?: string | null,
};

export type DeleteOpenQuestionInput = {
  id: string,
  _version?: number | null,
};

export type CreateOpenAnswerInput = {
  id?: string | null,
  openQuestionID?: string | null,
  text: string,
  _version?: number | null,
  openAnswerOpenQuestionId?: string | null,
};

export type ModelOpenAnswerConditionInput = {
  openQuestionID?: ModelIDInput | null,
  text?: ModelStringInput | null,
  and?: Array< ModelOpenAnswerConditionInput | null > | null,
  or?: Array< ModelOpenAnswerConditionInput | null > | null,
  not?: ModelOpenAnswerConditionInput | null,
};

export type UpdateOpenAnswerInput = {
  id: string,
  openQuestionID?: string | null,
  text?: string | null,
  _version?: number | null,
  openAnswerOpenQuestionId?: string | null,
};

export type DeleteOpenAnswerInput = {
  id: string,
  _version?: number | null,
};

export type ModelOpenQuestionDraftFilterInput = {
  id?: ModelIDInput | null,
  questionText?: ModelStringInput | null,
  challengePoolID?: ModelIDInput | null,
  answerText?: ModelStringInput | null,
  and?: Array< ModelOpenQuestionDraftFilterInput | null > | null,
  or?: Array< ModelOpenQuestionDraftFilterInput | null > | null,
  not?: ModelOpenQuestionDraftFilterInput | null,
};

export type ModelOpenQuestionDraftConnection = {
  __typename: "ModelOpenQuestionDraftConnection",
  items?:  Array<OpenQuestionDraft | null > | null,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelChallengePoolFilterInput = {
  id?: ModelIDInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelChallengePoolFilterInput | null > | null,
  or?: Array< ModelChallengePoolFilterInput | null > | null,
  not?: ModelChallengePoolFilterInput | null,
};

export type ModelChallengePoolConnection = {
  __typename: "ModelChallengePoolConnection",
  items?:  Array<ChallengePool | null > | null,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelOpenQuestionFilterInput = {
  id?: ModelIDInput | null,
  questionText?: ModelStringInput | null,
  challengePoolID?: ModelIDInput | null,
  answerText?: ModelStringInput | null,
  and?: Array< ModelOpenQuestionFilterInput | null > | null,
  or?: Array< ModelOpenQuestionFilterInput | null > | null,
  not?: ModelOpenQuestionFilterInput | null,
};

export type ModelOpenAnswerFilterInput = {
  id?: ModelIDInput | null,
  openQuestionID?: ModelIDInput | null,
  text?: ModelStringInput | null,
  and?: Array< ModelOpenAnswerFilterInput | null > | null,
  or?: Array< ModelOpenAnswerFilterInput | null > | null,
  not?: ModelOpenAnswerFilterInput | null,
};

export type CreateOpenQuestionDraftMutationVariables = {
  input: CreateOpenQuestionDraftInput,
  condition?: ModelOpenQuestionDraftConditionInput | null,
};

export type CreateOpenQuestionDraftMutation = {
  createOpenQuestionDraft?:  {
    __typename: "OpenQuestionDraft",
    id: string,
    questionText?: string | null,
    challengePoolID?: string | null,
    ChallengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateOpenQuestionDraftMutationVariables = {
  input: UpdateOpenQuestionDraftInput,
  condition?: ModelOpenQuestionDraftConditionInput | null,
};

export type UpdateOpenQuestionDraftMutation = {
  updateOpenQuestionDraft?:  {
    __typename: "OpenQuestionDraft",
    id: string,
    questionText?: string | null,
    challengePoolID?: string | null,
    ChallengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteOpenQuestionDraftMutationVariables = {
  input: DeleteOpenQuestionDraftInput,
  condition?: ModelOpenQuestionDraftConditionInput | null,
};

export type DeleteOpenQuestionDraftMutation = {
  deleteOpenQuestionDraft?:  {
    __typename: "OpenQuestionDraft",
    id: string,
    questionText?: string | null,
    challengePoolID?: string | null,
    ChallengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateChallengePoolMutationVariables = {
  input: CreateChallengePoolInput,
  condition?: ModelChallengePoolConditionInput | null,
};

export type CreateChallengePoolMutation = {
  createChallengePool?:  {
    __typename: "ChallengePool",
    id: string,
    description: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestions?:  {
      __typename: "ModelOpenQuestionConnection",
      items?:  Array< {
        __typename: "OpenQuestion",
        id: string,
        questionText: string,
        challengePoolID?: string | null,
        answerText?: string | null,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type UpdateChallengePoolMutationVariables = {
  input: UpdateChallengePoolInput,
  condition?: ModelChallengePoolConditionInput | null,
};

export type UpdateChallengePoolMutation = {
  updateChallengePool?:  {
    __typename: "ChallengePool",
    id: string,
    description: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestions?:  {
      __typename: "ModelOpenQuestionConnection",
      items?:  Array< {
        __typename: "OpenQuestion",
        id: string,
        questionText: string,
        challengePoolID?: string | null,
        answerText?: string | null,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type DeleteChallengePoolMutationVariables = {
  input: DeleteChallengePoolInput,
  condition?: ModelChallengePoolConditionInput | null,
};

export type DeleteChallengePoolMutation = {
  deleteChallengePool?:  {
    __typename: "ChallengePool",
    id: string,
    description: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestions?:  {
      __typename: "ModelOpenQuestionConnection",
      items?:  Array< {
        __typename: "OpenQuestion",
        id: string,
        questionText: string,
        challengePoolID?: string | null,
        answerText?: string | null,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type CreateOpenQuestionMutationVariables = {
  input: CreateOpenQuestionInput,
  condition?: ModelOpenQuestionConditionInput | null,
};

export type CreateOpenQuestionMutation = {
  createOpenQuestion?:  {
    __typename: "OpenQuestion",
    id: string,
    questionText: string,
    challengePoolID?: string | null,
    challengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    openAnswers?:  {
      __typename: "ModelOpenAnswerConnection",
      items?:  Array< {
        __typename: "OpenAnswer",
        id: string,
        openQuestionID?: string | null,
        text: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type UpdateOpenQuestionMutationVariables = {
  input: UpdateOpenQuestionInput,
  condition?: ModelOpenQuestionConditionInput | null,
};

export type UpdateOpenQuestionMutation = {
  updateOpenQuestion?:  {
    __typename: "OpenQuestion",
    id: string,
    questionText: string,
    challengePoolID?: string | null,
    challengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    openAnswers?:  {
      __typename: "ModelOpenAnswerConnection",
      items?:  Array< {
        __typename: "OpenAnswer",
        id: string,
        openQuestionID?: string | null,
        text: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type DeleteOpenQuestionMutationVariables = {
  input: DeleteOpenQuestionInput,
  condition?: ModelOpenQuestionConditionInput | null,
};

export type DeleteOpenQuestionMutation = {
  deleteOpenQuestion?:  {
    __typename: "OpenQuestion",
    id: string,
    questionText: string,
    challengePoolID?: string | null,
    challengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    openAnswers?:  {
      __typename: "ModelOpenAnswerConnection",
      items?:  Array< {
        __typename: "OpenAnswer",
        id: string,
        openQuestionID?: string | null,
        text: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type CreateOpenAnswerMutationVariables = {
  input: CreateOpenAnswerInput,
  condition?: ModelOpenAnswerConditionInput | null,
};

export type CreateOpenAnswerMutation = {
  createOpenAnswer?:  {
    __typename: "OpenAnswer",
    id: string,
    openQuestionID?: string | null,
    text: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestion?:  {
      __typename: "OpenQuestion",
      id: string,
      questionText: string,
      challengePoolID?: string | null,
      challengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      openAnswers?:  {
        __typename: "ModelOpenAnswerConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type UpdateOpenAnswerMutationVariables = {
  input: UpdateOpenAnswerInput,
  condition?: ModelOpenAnswerConditionInput | null,
};

export type UpdateOpenAnswerMutation = {
  updateOpenAnswer?:  {
    __typename: "OpenAnswer",
    id: string,
    openQuestionID?: string | null,
    text: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestion?:  {
      __typename: "OpenQuestion",
      id: string,
      questionText: string,
      challengePoolID?: string | null,
      challengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      openAnswers?:  {
        __typename: "ModelOpenAnswerConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type DeleteOpenAnswerMutationVariables = {
  input: DeleteOpenAnswerInput,
  condition?: ModelOpenAnswerConditionInput | null,
};

export type DeleteOpenAnswerMutation = {
  deleteOpenAnswer?:  {
    __typename: "OpenAnswer",
    id: string,
    openQuestionID?: string | null,
    text: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestion?:  {
      __typename: "OpenQuestion",
      id: string,
      questionText: string,
      challengePoolID?: string | null,
      challengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      openAnswers?:  {
        __typename: "ModelOpenAnswerConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type SyncOpenQuestionDraftsQueryVariables = {
  filter?: ModelOpenQuestionDraftFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncOpenQuestionDraftsQuery = {
  syncOpenQuestionDrafts?:  {
    __typename: "ModelOpenQuestionDraftConnection",
    items?:  Array< {
      __typename: "OpenQuestionDraft",
      id: string,
      questionText?: string | null,
      challengePoolID?: string | null,
      ChallengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetOpenQuestionDraftQueryVariables = {
  id: string,
};

export type GetOpenQuestionDraftQuery = {
  getOpenQuestionDraft?:  {
    __typename: "OpenQuestionDraft",
    id: string,
    questionText?: string | null,
    challengePoolID?: string | null,
    ChallengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListOpenQuestionDraftsQueryVariables = {
  filter?: ModelOpenQuestionDraftFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOpenQuestionDraftsQuery = {
  listOpenQuestionDrafts?:  {
    __typename: "ModelOpenQuestionDraftConnection",
    items?:  Array< {
      __typename: "OpenQuestionDraft",
      id: string,
      questionText?: string | null,
      challengePoolID?: string | null,
      ChallengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncChallengePoolsQueryVariables = {
  filter?: ModelChallengePoolFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncChallengePoolsQuery = {
  syncChallengePools?:  {
    __typename: "ModelChallengePoolConnection",
    items?:  Array< {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null > | null,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetChallengePoolQueryVariables = {
  id: string,
};

export type GetChallengePoolQuery = {
  getChallengePool?:  {
    __typename: "ChallengePool",
    id: string,
    description: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestions?:  {
      __typename: "ModelOpenQuestionConnection",
      items?:  Array< {
        __typename: "OpenQuestion",
        id: string,
        questionText: string,
        challengePoolID?: string | null,
        answerText?: string | null,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type ListChallengePoolsQueryVariables = {
  filter?: ModelChallengePoolFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChallengePoolsQuery = {
  listChallengePools?:  {
    __typename: "ModelChallengePoolConnection",
    items?:  Array< {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null > | null,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetOpenQuestionQueryVariables = {
  id: string,
};

export type GetOpenQuestionQuery = {
  getOpenQuestion?:  {
    __typename: "OpenQuestion",
    id: string,
    questionText: string,
    challengePoolID?: string | null,
    challengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    openAnswers?:  {
      __typename: "ModelOpenAnswerConnection",
      items?:  Array< {
        __typename: "OpenAnswer",
        id: string,
        openQuestionID?: string | null,
        text: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type ListOpenQuestionsQueryVariables = {
  filter?: ModelOpenQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOpenQuestionsQuery = {
  listOpenQuestions?:  {
    __typename: "ModelOpenQuestionConnection",
    items?:  Array< {
      __typename: "OpenQuestion",
      id: string,
      questionText: string,
      challengePoolID?: string | null,
      challengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      openAnswers?:  {
        __typename: "ModelOpenAnswerConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null > | null,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncOpenQuestionsQueryVariables = {
  filter?: ModelOpenQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncOpenQuestionsQuery = {
  syncOpenQuestions?:  {
    __typename: "ModelOpenQuestionConnection",
    items?:  Array< {
      __typename: "OpenQuestion",
      id: string,
      questionText: string,
      challengePoolID?: string | null,
      challengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      openAnswers?:  {
        __typename: "ModelOpenAnswerConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null > | null,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetOpenAnswerQueryVariables = {
  id: string,
};

export type GetOpenAnswerQuery = {
  getOpenAnswer?:  {
    __typename: "OpenAnswer",
    id: string,
    openQuestionID?: string | null,
    text: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestion?:  {
      __typename: "OpenQuestion",
      id: string,
      questionText: string,
      challengePoolID?: string | null,
      challengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      openAnswers?:  {
        __typename: "ModelOpenAnswerConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type ListOpenAnswersQueryVariables = {
  filter?: ModelOpenAnswerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOpenAnswersQuery = {
  listOpenAnswers?:  {
    __typename: "ModelOpenAnswerConnection",
    items?:  Array< {
      __typename: "OpenAnswer",
      id: string,
      openQuestionID?: string | null,
      text: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestion?:  {
        __typename: "OpenQuestion",
        id: string,
        questionText: string,
        challengePoolID?: string | null,
        answerText?: string | null,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncOpenAnswersQueryVariables = {
  filter?: ModelOpenAnswerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncOpenAnswersQuery = {
  syncOpenAnswers?:  {
    __typename: "ModelOpenAnswerConnection",
    items?:  Array< {
      __typename: "OpenAnswer",
      id: string,
      openQuestionID?: string | null,
      text: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestion?:  {
        __typename: "OpenQuestion",
        id: string,
        questionText: string,
        challengePoolID?: string | null,
        answerText?: string | null,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateOpenQuestionDraftSubscription = {
  onCreateOpenQuestionDraft?:  {
    __typename: "OpenQuestionDraft",
    id: string,
    questionText?: string | null,
    challengePoolID?: string | null,
    ChallengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateOpenQuestionDraftSubscription = {
  onUpdateOpenQuestionDraft?:  {
    __typename: "OpenQuestionDraft",
    id: string,
    questionText?: string | null,
    challengePoolID?: string | null,
    ChallengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteOpenQuestionDraftSubscription = {
  onDeleteOpenQuestionDraft?:  {
    __typename: "OpenQuestionDraft",
    id: string,
    questionText?: string | null,
    challengePoolID?: string | null,
    ChallengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateChallengePoolSubscription = {
  onCreateChallengePool?:  {
    __typename: "ChallengePool",
    id: string,
    description: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestions?:  {
      __typename: "ModelOpenQuestionConnection",
      items?:  Array< {
        __typename: "OpenQuestion",
        id: string,
        questionText: string,
        challengePoolID?: string | null,
        answerText?: string | null,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type OnUpdateChallengePoolSubscription = {
  onUpdateChallengePool?:  {
    __typename: "ChallengePool",
    id: string,
    description: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestions?:  {
      __typename: "ModelOpenQuestionConnection",
      items?:  Array< {
        __typename: "OpenQuestion",
        id: string,
        questionText: string,
        challengePoolID?: string | null,
        answerText?: string | null,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type OnDeleteChallengePoolSubscription = {
  onDeleteChallengePool?:  {
    __typename: "ChallengePool",
    id: string,
    description: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestions?:  {
      __typename: "ModelOpenQuestionConnection",
      items?:  Array< {
        __typename: "OpenQuestion",
        id: string,
        questionText: string,
        challengePoolID?: string | null,
        answerText?: string | null,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type OnCreateOpenQuestionSubscriptionVariables = {
  owner: string,
};

export type OnCreateOpenQuestionSubscription = {
  onCreateOpenQuestion?:  {
    __typename: "OpenQuestion",
    id: string,
    questionText: string,
    challengePoolID?: string | null,
    challengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    openAnswers?:  {
      __typename: "ModelOpenAnswerConnection",
      items?:  Array< {
        __typename: "OpenAnswer",
        id: string,
        openQuestionID?: string | null,
        text: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type OnUpdateOpenQuestionSubscriptionVariables = {
  owner: string,
};

export type OnUpdateOpenQuestionSubscription = {
  onUpdateOpenQuestion?:  {
    __typename: "OpenQuestion",
    id: string,
    questionText: string,
    challengePoolID?: string | null,
    challengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    openAnswers?:  {
      __typename: "ModelOpenAnswerConnection",
      items?:  Array< {
        __typename: "OpenAnswer",
        id: string,
        openQuestionID?: string | null,
        text: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type OnDeleteOpenQuestionSubscriptionVariables = {
  owner: string,
};

export type OnDeleteOpenQuestionSubscription = {
  onDeleteOpenQuestion?:  {
    __typename: "OpenQuestion",
    id: string,
    questionText: string,
    challengePoolID?: string | null,
    challengePool?:  {
      __typename: "ChallengePool",
      id: string,
      description: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      openQuestions?:  {
        __typename: "ModelOpenQuestionConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    answerText?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    openAnswers?:  {
      __typename: "ModelOpenAnswerConnection",
      items?:  Array< {
        __typename: "OpenAnswer",
        id: string,
        openQuestionID?: string | null,
        text: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      } | null > | null,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
  } | null,
};

export type OnCreateOpenAnswerSubscriptionVariables = {
  owner: string,
};

export type OnCreateOpenAnswerSubscription = {
  onCreateOpenAnswer?:  {
    __typename: "OpenAnswer",
    id: string,
    openQuestionID?: string | null,
    text: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestion?:  {
      __typename: "OpenQuestion",
      id: string,
      questionText: string,
      challengePoolID?: string | null,
      challengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      openAnswers?:  {
        __typename: "ModelOpenAnswerConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateOpenAnswerSubscriptionVariables = {
  owner: string,
};

export type OnUpdateOpenAnswerSubscription = {
  onUpdateOpenAnswer?:  {
    __typename: "OpenAnswer",
    id: string,
    openQuestionID?: string | null,
    text: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestion?:  {
      __typename: "OpenQuestion",
      id: string,
      questionText: string,
      challengePoolID?: string | null,
      challengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      openAnswers?:  {
        __typename: "ModelOpenAnswerConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteOpenAnswerSubscriptionVariables = {
  owner: string,
};

export type OnDeleteOpenAnswerSubscription = {
  onDeleteOpenAnswer?:  {
    __typename: "OpenAnswer",
    id: string,
    openQuestionID?: string | null,
    text: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
    openQuestion?:  {
      __typename: "OpenQuestion",
      id: string,
      questionText: string,
      challengePoolID?: string | null,
      challengePool?:  {
        __typename: "ChallengePool",
        id: string,
        description: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        createdAt: string,
        updatedAt: string,
      } | null,
      answerText?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
      openAnswers?:  {
        __typename: "ModelOpenAnswerConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
    } | null,
    owner?: string | null,
  } | null,
};
