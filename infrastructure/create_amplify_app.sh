echo "What is the name of the university"
read university
mv ../app/amplify/team-provider-info.json ../app/amplify/team-provider-info-old.json 
cd ../app
echo "amplify init"
echo "prod" | amplify init
cp src/aws-exports.js src/aws-exports.cjs
echo "amplify re-init"
amplify init
echo "amplify push"
amplify push
echo "creating branch " + $university
git branch $university
git checkout $university
git push -u origin $university

# Then do this

# Open amplify in aws console
# Open new app
# Backend environment
# Set up Amplify Studio -> On
# Data -> Save and deploy -> Deploy