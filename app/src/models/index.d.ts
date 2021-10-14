import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ChallengePoolMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OpenQuestionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OpenAnswerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class ChallengePool {
  readonly id: string;
  readonly description: string;
  readonly openQuestions?: (OpenQuestion | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<ChallengePool, ChallengePoolMetaData>);
  static copyOf(source: ChallengePool, mutator: (draft: MutableModel<ChallengePool, ChallengePoolMetaData>) => MutableModel<ChallengePool, ChallengePoolMetaData> | void): ChallengePool;
}

export declare class OpenQuestion {
  readonly id: string;
  readonly text: string;
  readonly challengePoolID?: string;
  readonly challengePool?: ChallengePool;
  readonly openAnswers?: (OpenAnswer | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<OpenQuestion, OpenQuestionMetaData>);
  static copyOf(source: OpenQuestion, mutator: (draft: MutableModel<OpenQuestion, OpenQuestionMetaData>) => MutableModel<OpenQuestion, OpenQuestionMetaData> | void): OpenQuestion;
}

export declare class OpenAnswer {
  readonly id: string;
  readonly openQuestionID?: string;
  readonly openQuestion?: OpenQuestion;
  readonly text: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<OpenAnswer, OpenAnswerMetaData>);
  static copyOf(source: OpenAnswer, mutator: (draft: MutableModel<OpenAnswer, OpenAnswerMetaData>) => MutableModel<OpenAnswer, OpenAnswerMetaData> | void): OpenAnswer;
}