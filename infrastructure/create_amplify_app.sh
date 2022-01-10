mv ../app/amplify/team-provider-info.json ../app/amplify/team-provider-info-old.json 
cd ../app
echo "amplify init"
echo "prod" | amplify init
mv aws_exports.js aws_exports.cjs
echo "amplify re-init"
amplify init # use existing environment? - yes which one? - prod

echo "amplify publish"
amplify publish
echo "amplify hosting serve"
amplify hosting serve



# Set Up Studio?