const User = require('../models/user');
const { errorController } = require('./errorController');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch(error => errorController(error, res, __filename))
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id).orFail(new Error('NotFound'))
    .then(user => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch(error => errorController(error, res, __filename))
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({name, about, avatar})
    .then(user => {
      const {name, about, avatar} = user;
      res.status(200).send({
        name: name,
        about: about,
        avatar: avatar,
        _id: user._id
      })
    })
    .catch(error => errorController(error, res, __filename))
}

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false // если пользователь не найден, он будет создан
  }).orFail(new Error('NotFound'))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch(error => errorController(error, res, __filename))
}

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {avatar: req.body.avatar}, {
    new: true,
    runValidators: true,
    upsert: false
  }).orFail(new Error('NotFound'))
    .then(user => res.send({avatar: user.avatar}))
    .catch(error => errorController(error, res, __filename))
}