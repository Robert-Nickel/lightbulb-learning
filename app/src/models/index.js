// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { OpenAnswerDraft, OpenAnswer, OpenQuestion, ChallengePool, OpenQuestionDraft } = initSchema(schema);

export {
  OpenAnswerDraft,
  OpenAnswer,
  OpenQuestion,
  ChallengePool,
  OpenQuestionDraft
};