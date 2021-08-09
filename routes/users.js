const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { url } = require('../constants');

const {
  getUsers, getUserById, updateUser, updateUserAvatar, getMyInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMyInfo);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(url),
  }),
}), updateUserAvatar);

module.exports = router;
