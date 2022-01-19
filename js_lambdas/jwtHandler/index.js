const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const jwt_decode = require("jwt-decode");
const { CognitoIdentityServiceProvider } = require('aws-sdk')

exports.handler = function (event, context, callback) {
    console.log("event", event);
    const jwt_token = event.jwtToken;
    const decoded_token = jwt_decode(jwt_token);
    const decoded_token_header = jwt_decode(jwt_token, { header: true })
    console.log(`userpool: ${decoded_token['iss']}`)

    axios.get(`${decoded_token['iss']}/.well-known/jwks.json`).then(
        response => {
            const valid_jwks = response
                .data
                .keys
                .filter(jwk => jwk['kid'] == decoded_token_header['kid'])

            if (valid_jwks.length !== 1) {
                console.error("no valid jwk or multiple jwks found")
                callback("Error: no valid JWK for JWT found")
            } else {
                jwk = valid_jwks[0];
                let decoded = jwt.verify(jwt_token, jwkToPem(jwk))
                console.log("decoded", decoded)

                var provider = new CognitoIdentityServiceProvider();
                provider.getUser({
                    AccessToken: jwt_token
                }, function (err, data) {
                    if (err) { 
                        console.log(err, err.stack); // an error occurred
                        callback(err);
                    }
                    else {
                        console.log("data", data);
                        // console.log("amount_of_groups", decoded['cognito:groups'].length);
                        usermail = data.UserAttributes.find( e => e.Name === 'email')
                        userpool = decoded_token['iss'].slice(decoded_token['iss'].lastIndexOf('/') + 1)
                        returnObj = {
                            'usermail': usermail.Value, 
                            'userpool': userpool,
                            'amount_of_groups': decoded['cognito:groups'] ? decoded['cognito:groups'].length : 0,
                            'admin_of_group' : decoded['custom:admin_of_group']
                        }

                        console.log("returnObj: ", returnObj);
                        callback(null, returnObj);
                    }
                });
            }
        }
    )
};
