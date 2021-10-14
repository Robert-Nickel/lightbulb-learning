// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ChallengePool, OpenQuestion, OpenAnswer } = initSchema(schema);

export {
  ChallengePool,
  OpenQuestion,
  OpenAnswer
};