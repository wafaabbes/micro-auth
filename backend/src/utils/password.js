
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};
