const jwt = require("jsonwebtoken");
function refreshToken() {
  const tokenId = require("crypto").randomBytes(32).toString("base64");
  const issuedAt = Math.floor(Date.now() / 1000);
  const notBefore = issuedAt;
  const expire = notBefore + 60; // Make sure TOKEN_EXPIRE is defined

  // Payload data of the token
  const data = {
    iat: issuedAt, // Issued at: time when the token was generated
    jti: tokenId, // Json Token Id: an unique identifier for the token
    iss: "a18ff78e7a9e44f38de372e093d87ca1", // Issuer (replace API_KEY with your actual API key)
    nbf: notBefore, // Not before
    exp: expire, // Expire
  };


  // Encode the array to a JWT string
  const jwtToken = jwt.sign(data, "9623ac03057e433f95d86cf4f3bef5cc", {
    algorithm: "HS256",
  });

  return jwtToken;
}

module.exports = {
  refreshToken: refreshToken,
};
