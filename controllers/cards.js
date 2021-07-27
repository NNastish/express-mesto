const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Неверно переданы данные');
      }
      // eslint-disable-next-line no-shadow
      const { name, link, owner } = card;
      res.send({
        name,
        link,
        owner,
      });
    })
    .catch(next);
};

// TODO: check if user has rights.
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(new NotFoundError('Карточка с переданным id не найдена'))
    .then((card) => {
      if (card.owner === req.user._id) {
        Card.remove(card)
          .then((deleted) => res.send(deleted))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(new NotFoundError('Карточка с переданным id не найдена'))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(new NotFoundError('Карточка с переданным id не найдена'))
    .then((card) => res.send(card))
    .catch(next);
};
