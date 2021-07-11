const express = require('express');
const app = express();
mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//rude setting user
app.use((req, res, next) => {
  req.user = {
    _id: '60de3e2fff5d4d2980515df5' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

//connection to db
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

//routing
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})