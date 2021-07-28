const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const { userNotFound, jwtDevelopment } = require('../constants');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

exports.getMyInfo = (req, res, next) => {
  // User.findById(req.user._id).orFail(new NotFoundError(userNotFound))
  User.findById(req.user._id).orFail(new NotFoundError(req.user._id))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.id).orFail(new NotFoundError(userNotFound))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(next);
};

exports.createUser = (req, res, next) => User.createWithHash(req)
  .then((user) => res.send({
    email: user.email,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
  }))
  .catch(next);

exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он будет создан
  }).orFail(new NotFoundError(userNotFound))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(next);
};

exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  }).orFail(new NotFoundError(userNotFound))
    .then((user) => res.send({ avatar: user.avatar }))
    .catch(next);
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : jwtDevelopment,
        { expiresIn: '7d' },
      );
      // res.cookie('jwt', token, {
      //   maxAge: 3600000 * 24 * 7,
      //   httpOnly: true,
      // })
      //   .end();
      res.send({ token });
    })
    .catch(next);
};
