mv ../app/amplify/team-provider-info.json ../app/amplify/team-provider-info-old.json 
cd ../app
echo "amplify init"
echo "prod" | amplify init
# TODO: Add hosting of prod
echo "amplify publish"
# amplify publish # TODO: insert y 3x times automatically
#amplify hosting serve