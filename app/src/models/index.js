// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { OpenQuestionDraft, ChallengePool, OpenQuestion, OpenAnswer } = initSchema(schema);

export {
  OpenQuestionDraft,
  ChallengePool,
  OpenQuestion,
  OpenAnswer
};