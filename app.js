require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/notFoundError');

const app = express();
const { PORT = 3000 } = process.env;
const { mongoUrl, mongoOptions, resourceNotFound } = require('./constants');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection to db
mongoose.connect(mongoUrl, mongoOptions);

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

// routing
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError(resourceNotFound));
});

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
