const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new BadRequest({ message: 'Некорректный email' });
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findOne(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized());
      }
      return bcrypt.compare(password, user.password)

        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized());
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
