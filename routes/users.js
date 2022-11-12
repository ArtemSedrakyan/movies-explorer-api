const userRouter = require('express').Router();

const { getCurrentUser, updateUserInfo } = require('../controllers/users');

const { updateUserValidation } = require('../middlewares/validation');

userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', updateUserValidation, updateUserInfo);

module.exports = userRouter;
