const Card = require('../models/card');
const { errorController } = require('./errorController');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then(cards => res.status(200).send(cards))
    .catch(error => errorController(error, res, __filename))
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then(card => {
      const {name, link, owner} = card;
      res.send({
        name: name,
        link: link,
        owner: owner
      })
    })
    .catch(error => errorController(error, res, __filename))
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(new Error('NotFound'))
    .then(card => res.send(card))
    .catch(error => errorController(error, res, __filename))
}

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(new Error('NotFound'))
    .then(card => res.send(card))
    .catch(error => errorController(error, res, __filename))
}

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(new Error('NotFound'))
    .then(card => res.send(card))
    .catch(error => errorController(error, res, __filename))
}