mv ../app/amplify/team-provider-info.json ../app/amplify/team-provider-info-old.json 
cd ../app
echo "amplify init"
echo "prod" | amplify init
echo "amplify publish"
amplify publish
echo "amplify hosting serve"
amplify hosting serve