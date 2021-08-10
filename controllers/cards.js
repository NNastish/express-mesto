const Card = require('../models/card');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const AccessError = require('../errors/accessError');
const { cardNotFound, invalidData, accessDenied } = require('../constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = await User.findById(req.user._id);
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (e) {
    next(new BadRequestError(invalidData));
  }
};

// TODO: check if user has rights.
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).populate('owner').orFail(new NotFoundError(cardNotFound))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(cardId)
          .then((deleted) => res.send(deleted))
          .catch(next);
      } else {
        throw new AccessError(accessDenied);
      }
    })
    .catch(next);
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(new NotFoundError(cardNotFound))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(new NotFoundError(cardNotFound))
    .then((card) => res.send(card))
    .catch(next);
};
