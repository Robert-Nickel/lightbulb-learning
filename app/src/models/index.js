// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { OpenAnswer, OpenQuestion, ChallengePool, OpenQuestionDraft } = initSchema(schema);

export {
  OpenAnswer,
  OpenQuestion,
  ChallengePool,
  OpenQuestionDraft
};