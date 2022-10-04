const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const codes = require('../codes');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');

module.exports.getThisUser = (req, res, next) => {
  const userId = req.user._id;
  Users.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователя с таким id не существует');
    })
    .then((user) => {
      res.send({ email: user.email, name: user.name });
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => Users.create({ name, email, password: hash }))
    .then((user) => {
      const userData = {
        email: user.email,
        name: user.name,
        _id: user._id,
      };
      res.status(codes.CREATED).send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователя с таким id не существует');
    })
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest('Не переданы email или пароль');
  }
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      let secret = 'some-secret-key';
      if (NODE_ENV === 'production') {
        secret = JWT_SECRET;
      }
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};
