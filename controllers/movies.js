const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenEror');

const {
  INVALID_DATA_MESSAGE,
  NOT_FOUND_MOVIE_ID_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  CAST_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(INVALID_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).orFail(new NotFoundError(NOT_FOUND_MOVIE_ID_MESSAGE))
    .then((movie) => {
      const user = String(req.user._id);
      const movieOwner = String(movie.owner);

      if (user === movieOwner) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((removedMovie) => res.send(removedMovie))
          .catch(next);
      } else {
        next(new ForbiddenError(FORBIDDEN_ERROR_MESSAGE));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(CAST_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};
