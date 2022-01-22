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
git branch $university
git checkout $university
sed -i "s/long run./long run at $university./" ./src/lib/components/StartPage.svelte
sed -i "s/result.groupType/\"Premium\"/" ./src/lib/components/Navbar.svelte
git add .
git commit -m "initial commit for $university"
git push -u origin $university
echo "---------------------------------------ENJOY------------------------------------------"
echo "https://lightbulb-learning-cad-git-$university-lightbulb-learning.vercel.app"

echo "Next step is to add custom admin_of_group Attribute"
# Next Steps -> add custom admin_of_group Attribute
# user.custom:admin_of_group: Attribute does not exist in the schema.
echo "Select User Pool"
amplify console auth
echo "Next click on Attributes in the left hand navigation and click Add custom attribute."
echo "Create admin_of_group of type String with default settings"
