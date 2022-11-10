const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');

const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');
const { signOut } = require('../controllers/signOut');

const { loginValidation, createUserValidation } = require('../middlewares/validation');

const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('/signout', signOut);

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
