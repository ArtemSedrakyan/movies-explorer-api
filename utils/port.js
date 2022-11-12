const { NODE_ENV, PORT } = process.env;

const port = NODE_ENV === 'production' ? PORT : 4001;

module.exports = {
  port,
};
