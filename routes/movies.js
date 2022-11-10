const movieRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  removeMovie,
} = require('../controllers/movies');

const {
  createMovieValidation,
  getMovieIdValidation,
} = require('../middlewares/validation');

movieRouter.get('/', getMovies);
movieRouter.post('/', createMovieValidation, createMovie);
movieRouter.delete('/:movieId', getMovieIdValidation, removeMovie);

module.exports = movieRouter;
