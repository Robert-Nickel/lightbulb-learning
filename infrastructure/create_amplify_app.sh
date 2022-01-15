echo "What is the name of the university"
read university
mv ../app/amplify/team-provider-info.json ../app/amplify/team-provider-info-old.json 
cd ../app
mv src/aws-exports.js src/aws-exports.cjs
sleep 2
echo "amplify init"
echo "prod" | amplify init
sleep 2
rm -rf src/aws-exports.js
echo "amplify push"
amplify push
sleep 2
mv src/aws-exports.js src/aws-exports.cjs
echo "creating branch " + $university
echo "lightbulb-learning-cad-git-$university-lightbulb-learning.vercel.app"
git branch $university
git checkout $university
git push -u origin $university

# OPTIONAL:
# Open amplify in aws console
# Open new app
# Backend environment
# Set up Amplify Studio -> On
# Data -> Save and deploy -> Deploy