const { NODE_ENV, DB_HOST } = process.env;

const hostLink = NODE_ENV === 'production' ? DB_HOST : 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  hostLink,
};
