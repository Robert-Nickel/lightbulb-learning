// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { OpenQuestion, ChallengePool, OpenQuestionDraft } = initSchema(schema);

export {
  OpenQuestion,
  ChallengePool,
  OpenQuestionDraft
};