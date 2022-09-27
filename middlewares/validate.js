const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.signinValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
});

module.exports.signupValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
});

module.exports.userUpdateValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
  }),
});

module.exports.moviesCreateValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (!validator.isURL(value)) {
        return helpers.error('Ссылка некорректна');
      }
      return value;
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (!validator.isURL(value)) {
        return helpers.error('Ссылка некорректна');
      }
      return value;
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (!validator.isURL(value)) {
        return helpers.error('Ссылка некорректна');
      }
      return value;
    }),
    movieId: Joi.number().required(),
  }),
});

module.exports.deleteMovieValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});
