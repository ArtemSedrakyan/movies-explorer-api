const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000,
  max: 100,
  message: 'Достигнут лимит по запросам на сервер. Пожалуйста, подождите 10 минут',
  standartHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  limiter,
};
