const jwt = require("jsonwebtoken");
const {ACCESS_TOKEN_SECRET} = require("../configs")

const TIMEOUT_ACCESS_TOKEN = "30d";

const generateAccessToken = (userId) => {
  const payload = { userId };

  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: TIMEOUT_ACCESS_TOKEN,
  });

  return token;
};



module.exports = { generateAccessToken };
