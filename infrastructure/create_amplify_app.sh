# How to use this script:
# If prompted, answer yes

mv ../app/amplify/team-provider-info.json ../app/amplify/team-provider-info-old.json 
cd ../app
echo "amplify init"
echo "prod" | amplify init
mv aws-exports.js aws-exports.cjs
echo "amplify re-init"
amplify init
# Do you want to use an existing environment? yes
# Choose the environment you would like to use? prod

echo "amplify publish"
amplify publish
echo "amplify hosting serve"
amplify hosting serve

# Then do this

# Open amplify in aws console
# Open new app
# Backend environment
# Set up Amplify Studio -> On
# Data -> Save and deploy -> Deploy

# If amplify publish fails:
# In AWS console go to Amplify -> Hosting environment
# npm run build and ZIP the contents of /build folder
# upload the ZIP, define a name for the environment, click on the new domain
# Done