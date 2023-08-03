const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { ACCESS_TOKEN_SECRET } = require("../configs");

const verifyAccessToken = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) throw createError.Unauthorized();
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return next(createError.Unauthorized(err.message));

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verifyAccessToken };
