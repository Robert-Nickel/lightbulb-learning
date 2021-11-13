import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ChallengePoolMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OpenQuestionDraftMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class ChallengePool {
  readonly id: string;
  readonly description?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<ChallengePool, ChallengePoolMetaData>);
  static copyOf(source: ChallengePool, mutator: (draft: MutableModel<ChallengePool, ChallengePoolMetaData>) => MutableModel<ChallengePool, ChallengePoolMetaData> | void): ChallengePool;
}

export declare class OpenQuestionDraft {
  readonly id: string;
  readonly questionText?: string;
  readonly answerText?: string;
  readonly ChallengePool?: ChallengePool;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<OpenQuestionDraft, OpenQuestionDraftMetaData>);
  static copyOf(source: OpenQuestionDraft, mutator: (draft: MutableModel<OpenQuestionDraft, OpenQuestionDraftMetaData>) => MutableModel<OpenQuestionDraft, OpenQuestionDraftMetaData> | void): OpenQuestionDraft;
}