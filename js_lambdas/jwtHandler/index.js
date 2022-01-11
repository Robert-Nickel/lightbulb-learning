const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const jwt_decode = require("jwt-decode");

exports.handler = function (event, context, callback) {
    const jwt_token = event.jwtToken;
    const decoded_token = jwt_decode(jwt_token);
    const decoded_token_header = jwt_decode(jwt_token, { header: true })
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
                const decoded = jwt.verify(jwt_token, jwkToPem(jwk))
                console.log("decoded", decoded)
                callback(decoded);
            }
        }
    )
};

