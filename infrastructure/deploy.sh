#!/bin/sh
# deploy the frontend
cd ../app
amplify publish
# build the lambdas
cd ../lambdas/commitOpenQuestionLambda
sbt assembly
cd ../createOpenQuestionLambda
sbt assembly
# deploy the whole infrastructure 
cd ../../infrastructure
npm install
cdk synth
cdk deploy
echo "--- Deployment successful ---"