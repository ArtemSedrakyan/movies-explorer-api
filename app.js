require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { hostLink } = require('./utils/host');
const { limiter } = require('./utils/rateLimit');
const { port } = require('./utils/port');

const corsMiddleware = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');

const router = require('./routes');

const app = express();
mongoose.connect(hostLink);

app.use(corsMiddleware);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(error);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
