#!/bin/sh
# deploy the frontend
cd ../app
# build the lambdas
cd ../lambdas/commitOpenQuestionLambda
sbt assembly
cd ../createOpenQuestionLambda
sbt assembly
cd ../commitOpenAnswerLambda
sbt assembly
# deploy the whole infrastructure 
cd ../../infrastructure
npm install
cdk synth
cdk deploy
echo "--- Deployment finished ---"