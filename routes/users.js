const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getMyInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);
router.get('/users/me', getMyInfo);

module.exports = router;
