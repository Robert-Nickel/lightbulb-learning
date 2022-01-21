const jsonwebtoken = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const jwt_decode = require("jwt-decode");
const { CognitoIdentityServiceProvider } = require('aws-sdk')

exports.handler = function (event, context, callback) {
    console.log("event", event);
    if (event.requestContext.http.method === 'OPTIONS') {
        const response = {
            statusCode: 200,
            headers: {},
            body: JSON.stringify({ "message": "Hello World!" })
        };
        callback(null, response);
    } else {
        const jwt = JSON.parse(event.body).jwt; // for userPool
        console.log("jwt", jwt);
        const decoded_token = jwt_decode(jwt);
        const decoded_token_header = jwt_decode(jwt, { header: true })
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
                    let decoded = jsonwebtoken.verify(jwt, jwkToPem(jwk))
                    console.log("decoded", decoded)

                    var provider = new CognitoIdentityServiceProvider();
                    provider.getUser({
                        AccessToken: jwt
                    }, function (err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                            callback(err);
                        }
                        else {
                            console.log("data", data);
                            const decoded_group = decoded['cognito:groups']
                            const groupName = decoded_group ? decoded_group[0] : null
                            if (groupName) {
                                callback(null, groupName)
                            } else {
                                callback(null, "")
                            }
                        }
                    });
                }
            }
        )
    }
};
