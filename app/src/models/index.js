// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ChallengePool, OpenQuestionDraft } = initSchema(schema);

export {
  ChallengePool,
  OpenQuestionDraft
};