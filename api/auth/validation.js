const Joi = require("joi");

const name = Joi.string().required();
const username = Joi.string();
const email = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  })
  .required()
  .max(30);
const password = Joi.string().required();
const confirmPassword = Joi.ref("password");

const registerSchema = Joi.object({
  name,
  email,
  username,
  password,
  confirmPassword,
});

const loginSchema = Joi.object({
  email,
  password,
});

module.exports = { registerSchema, loginSchema };
