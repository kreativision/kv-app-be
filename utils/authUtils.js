const jwt = require("jsonwebtoken");
require("dotenv").config();

const authKey = process.env.AUTH_KEY;

/**
 * Function to issue a JWT for a successful login.
 */
function issueJWT(user) {
  const payload = {
    sub: user._id,
    role: user.role,
  };

  return jwt.sign(payload, authKey, {
    expiresIn: "3h",
  });
}

/**
 * Function to verify tokens
 */
function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, authKey, (err, tokenData) => {
    if (err) return res.sendStatus(403);
    req.user = tokenData;
    return next();
  });
}

module.exports = { issueJWT, verifyJWT };
