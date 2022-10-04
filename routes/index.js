const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');
const NotFound = require('../errors/NotFound');
const { signinValidate, signupValidate } = require('../middlewares/validate');

router.post('/signin', signinValidate, login);
router.post('/signup', signupValidate, createUser);

router.use(auth);

router.use('/', users);
router.use('/', movies);
router.use('*', (req, res, next) => {
  next(new NotFound());
});

module.exports = router;
