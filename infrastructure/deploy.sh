#!/bin/sh
cd ../lambdas/commitOpenQuestionLambda
sbt assembly
cd ../createOpenQuestionLambda
sbt assembly
cd ../../infrastructure
npm install
cdk synth
cdk deploy
echo "Deployment successful"