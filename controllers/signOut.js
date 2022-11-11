const { EXIT_MESSAGE } = require('../utils/constants');

module.exports.signOut = (req, res) => {
  res.clearCookie('jwt').send({ message: EXIT_MESSAGE });
};
