const movieRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { moviesCreateValidate, deleteMovieValidate } = require('../middlewares/validate');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', moviesCreateValidate, createMovie);
movieRouter.delete('/movies/:movieId', deleteMovieValidate, deleteMovie);

module.exports = movieRouter;
