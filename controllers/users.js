const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const EmailCreationError = require('../errors/emailCreationError');
const { userNotFound, jwtDevelopment, emailAlreadyTaken } = require('../constants');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

exports.getMyInfo = (req, res, next) => {
  const { _id: id } = req.user;
  User.findById(id).orFail(new NotFoundError(userNotFound))
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
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
  .catch((error) => {
    let mistake = error;
    if (error.code === 11000 && error.name === 'MongoError') {
      mistake = new EmailCreationError(emailAlreadyTaken);
    }
    next(mistake);
  });

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
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(next);
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const jwtToken = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : jwtDevelopment,
        { expiresIn: '7d' },
      );
      res.send({
        token: jwtToken,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};
