const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UserConflictError = require('../errors/UserConflictError');

const {
  NOT_FOUND_USER_ID_MESSAGE,
  CAST_ERROR_MESSAGE,
  INVALID_DATA_MESSAGE,
  USER_CONFLICT_MESSAGE,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(201).send({
      _id: user._id, email, name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserConflictError(USER_CONFLICT_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(INVALID_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 7 * 24 * 3600000,
        expires: new Date(Date.now() + 7 * 24 * 3600000),
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });

      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId).orFail(new NotFoundError(NOT_FOUND_USER_ID_MESSAGE))
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(CAST_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserConflictError(USER_CONFLICT_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(INVALID_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};
