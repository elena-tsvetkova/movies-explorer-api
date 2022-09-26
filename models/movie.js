const mongoose = require('mongoose');
const BadRequest = require("../errors/BadRequest");

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new BadRequest();
      }
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new BadRequest();
      }
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new BadRequest();
      }
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
