const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const jwt_decode = require("jwt-decode");
const { CognitoIdentityServiceProvider } = require('aws-sdk')

/** This authorization lambda function is expected to provide an ACCESS token, to validate the request for upgrading a group from free to standard. Only users who have an ADMIN_OF_GROUP property can upgrade this group. */
exports.handler = function (event, context, callback) {
    axios.get("https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_ioweDqC3S/.well-known/jwks.json").then(
        response => {
            console.log(event.headers.authorization);
            const jwt_token = JSON.parse(event.headers.authorization).jwtToken;
            const decoded_token = jwt_decode(jwt_token, { header: true })
            const valid_jwks = response.data.keys.filter(jwk => jwk['kid'] == decoded_token['kid'])

            if (valid_jwks.length !== 1) {
                console.error("no valid jwk or multiple jwks found")
                callback("Error: no valid JWK for JWT found")
            } else {
                jwk = valid_jwks[0];
                const decoded = jwt.verify(jwt_token, jwkToPem(jwk))
                console.log("decoded", decoded)

                // if decoded doesn't contain admin_of_group property...
                // use fresh identity token ;) or below code...
                
                //   var provider =  new aws.CognitoIdentityServiceProvider();
                //   provider.getUser({
                //     AccessToken: jwt_token
                //   }, function(err, data) {
                //     if (err) console.log(err, err.stack); // an error occurred
                //     else     console.log(data);           // successful response
                //   });
                const admin_of_group = decoded['custom:admin_of_group'];
                console.log("admin of group", admin_of_group)
                if (admin_of_group.length > 0) {
                    callback(null, generateSimpleResponse(true));
                } else {
                    callback("Error: no admin of group");
                }
            }
            callback("Error: Invalid JWT token"); // Return a 500 Invalid token     
        }
    )
};

const generateSimpleResponse = function (isAllowed) {
    return {
        "isAuthorized": isAllowed
    };
}
