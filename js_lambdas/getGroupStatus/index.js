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

        new CognitoIdentityServiceProvider().getUser({
            AccessToken: jwt
        }, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                callback(err);
            }
            else {
                console.log("data", data)
                const admin_of_group = data.UserAttributes.find(e => e.Name === 'custom:admin_of_group')
                const toReturn = admin_of_group ? admin_of_group.Value : ""
                callback(null, toReturn)
            }
        }
        )
    }
};
