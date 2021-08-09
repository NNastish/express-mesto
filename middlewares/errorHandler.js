// eslint-disable-next-line no-unused-vars
module.exports.handleErrors = (err, req, res, next) => {
  let { statusCode = 500, message } = err;
  // if (err.name === 'ValidationError' || err.name === 'CastError') {
  //   statusCode = 400;
  //   message = 'Поданы некорректные данные, либо данные не в полном объеме.';
  // }
  // if (err.name === 'MongoError' && err.code === 11000) {
  //   statusCode = 409;
  //   message = 'Переданный email уже используется другим пользователем.';
  // }
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
};
