#!/bin/sh
# deploy the frontend
cd ../app
# build the lambdas
cd ../lambdas/
for d in */ ; do
    cd "$d"
    sbt assembly
    cd ..
done
# deploy the whole infrastructure 
cd ../infrastructure
npm install
cdk synth
cdk deploy --require-approval never
echo "--- Deployment finished ---"
