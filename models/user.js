const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/authError');

const { emailCheck, url, signinError } = require('../constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return emailCheck.test(v);
      },
      message: 'Укажите верную почту!',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return url.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(signinError);
        // return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // return Promise.reject(new AuthError('Неправильные почта или пароль'));
            throw new AuthError(signinError);
          }
          return user;
        });
    });
};

// FIXME: repair salt after
userSchema.statics.createWithHash = function (req) {
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => this.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }));
};

module.exports = mongoose.model('user', userSchema);
