const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const jwt_decode = require("jwt-decode");

exports.handler =  function(event, context, callback) {
    axios.get("https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_bAc9VMMys/.well-known/jwks.json").then(
        response => {
            const jwt_token = event.headers.authorization;
            const decoded_token = jwt_decode(jwt_token, { header: true })
            const valid_jwks = response.data.keys.filter(jwk => jwk['kid'] == decoded_token['kid'])

            // auslesen welcher user es ist und Attribute AdminOfGroup
            // ID Token enhaelt custom:adminOfGroup
            // siehe auth.ts -> wir vertrauen ID token, da es jwtToken enthaelt und wir das abgleichen koennen, stimmt es ueberein, nehmen wir an, dass die Anfrage ok ist.

            if(valid_jwks.length !== 1) {
                console.error("no valid jwk or multiple jwks found")
                callback("Error: no valid JWK for JWT found")
            } else {
                jwk = valid_jwks[0];
                if(jwt_token.length > 0) {
                    const decoded = jwt.verify(jwt_token, jwkToPem(jwk))
                    console.log(decoded)
                    callback(null, generateSimpleResponse(true));
                } else {
                    callback("Error: Invalid JWT token"); // Return a 500 Invalid token 
                }    
            }
        }
    )
};

var generateSimpleResponse = function(isAllowed) {
    return {
        "isAuthorized": isAllowed
    };
}
