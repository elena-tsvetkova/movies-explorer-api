require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');
const helmet = require('helmet');

const { NODE_ENV, PORT = 3000, DB_CONNECT } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_CONNECT : 'mongodb://0.0.0.0:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(NODE_ENV === 'production' ? PORT : 3000, () => {
  console.log(`Приложение запущено на порту: ${NODE_ENV === 'production' ? PORT : 3000}`);
});
