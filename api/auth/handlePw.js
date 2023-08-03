const bcrypt = require("bcryptjs");

const hashPw = async (pw) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pw, salt);
};

const comparePw = async (raw, pw) => await bcrypt.compare(raw, pw);

module.exports = {
  hashPw,
  comparePw,
};
