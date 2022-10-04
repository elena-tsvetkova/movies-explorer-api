const router = require('express').Router();
const { updateUser, getThisUser } = require('../controllers/users');
const { userUpdateValidate } = require('../middlewares/validate');

router.get('/users/me', getThisUser);
router.patch('/users/me', userUpdateValidate, updateUser);

module.exports = router;
