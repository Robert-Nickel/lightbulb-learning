const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const jwt_decode = require("jwt-decode");
var AWS = require('aws-sdk');

/** This authorization lambda function is expected to provide an ACCESS token, to validate the request for upgrading a group from free to standard. Only users who have an ADMIN_OF_GROUP property can upgrade this group. */
exports.handler = function (event, context, callback) {
    // loggerLightbulb

    AWS.config.region = 'eu-central-1';
    var lambda = new AWS.Lambda();
    
    var params = {
        FunctionName: 'loggerLightbulb', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: event
    };

    lambda.invoke(params, function(err, data) {
        if (err) {
            context.fail(err);
        } else {
            context.succeed('Lambda_B said '+ data.Payload);
        }
    });


    callback("event:" + JSON.stringify(event))
    console.log("event", event);
    callback(null, generateSimpleResponse(true));
    
    if (event.requestContext.http.method === 'OPTIONS') {
    } else {
        console.log(event.headers.authorization);
        const jwt_token = JSON.parse(event.headers.authorization).jwtToken;
        const decoded_token = jwt_decode(jwt_token);
        const decoded_token_header = jwt_decode(jwt_token, { header: true })

        axios.get(`${decoded_token['iss']}/.well-known/jwks.json`).then(
            response => {
                const valid_jwks = response.data.keys.filter(jwk => jwk['kid'] == decoded_token_header['kid'])

                if (valid_jwks.length !== 1) {
                    console.error("no valid jwk or multiple jwks found")
                    callback("Error: no valid JWK for JWT found")
                } else {
                    jwk = valid_jwks[0];
                    const decoded = jwt.verify(jwt_token, jwkToPem(jwk))
                    console.log("decoded", decoded)
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
    }
};

const generateSimpleResponse = function (isAllowed) {
    return {
        "isAuthorized": isAllowed
    };
}
