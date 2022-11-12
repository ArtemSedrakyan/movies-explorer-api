const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const BadRequestError = require('../errors/BadRequestError');
const { INVALID_DATA_MESSAGE } = require('../utils/constants');

const validateLink = (link) => {
  if (!validator.isURL(link, { require_protocol: true })) {
    throw new BadRequestError(INVALID_DATA_MESSAGE);
  } else {
    return link;
  }
};

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateLink),
    trailerLink: Joi.string().required().custom(validateLink),
    thumbnail: Joi.string().required().custom(validateLink),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const getMovieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  loginValidation,
  createUserValidation,
  updateUserValidation,
  createMovieValidation,
  getMovieIdValidation,
};
