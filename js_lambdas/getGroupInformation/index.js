const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const jwt_decode = require("jwt-decode");
const { CognitoIdentityServiceProvider } = require('aws-sdk')

exports.handler = function (event, context, callback) {
    console.log("event", event);
    if(event.requestContext.http.method === 'OPTIONS') {
        const response = {
            statusCode: 200,
            headers: {},
            body: JSON.stringify({ "message": "Hello World!" })
          };
        callback(null, response);
    } else {
        const jwt_token = JSON.parse(event.body).jwtToken; // for userPool
        console.log("jwt_token",jwt_token);
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
                            const userpool = decoded_token['iss'].slice(decoded_token['iss'].lastIndexOf('/') + 1)
                            const groupName = decoded['cognito:groups'][0]
                            const groupResponse = provider.getGroup({
                                GroupName: groupName,
                                UserPoolId: userpool
                            }, function(err, getGroupResponse) {
                                if(err) {
                                    console.log(err, err.stack);
                                } else {
                                    callback(null, {
                                        userpool,
                                        groupName,
                                        groupType: getGroupResponse.Group.Description
                                    });
                                }
                            })
                        }
                    });
                }
            }
        )
    }
};
