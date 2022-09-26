const {celebrate, Joi} = require("celebrate");
const {login, createUser} = require("../controllers/users");
const auth = require("../middlewares/auth");
const users = require("./users");
const cards = require("./cards");
const NotFound = require("../errors/NotFound");
const router = require('express').Router();


router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/', users);
router.use('/', cards);
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
