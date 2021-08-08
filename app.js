require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { mongoUrl, mongoOptions, resourceNotFound } = require('./constants');
const { checkCors } = require('./middlewares/cors');

const app = express();
// const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection to db
mongoose.connect(mongoUrl, mongoOptions);

// подключаем логгер
app.use(requestLogger);

app.use(checkCors);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

// routing
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorLogger);

app.use('*', (req, res, next) => {
  next(new NotFoundError(resourceNotFound));
});

app.use(handleErrors);

module.exports = app;
// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });
