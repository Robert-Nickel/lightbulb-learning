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
# install the js-lambdas 
cd ../js_lambdas
for d in */ ; do
    cd "$d"
    npm i
    cd ..
done
cd ../infrastructure
cdk synth
cdk deploy --require-approval never
echo "--- Deployment finished ---"
