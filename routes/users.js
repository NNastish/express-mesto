const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getMyInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/me', getMyInfo);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
