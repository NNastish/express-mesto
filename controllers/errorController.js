const path = require('path');

module.exports.errorController = (error, response, filename) => {
  let ERROR_CODE = 500;
  let ERROR_MESSAGE = 'Ошибка по умолчанию. Кто-то применяет магию вне Хогвардса.';
  let RESOURCE = resourceNames[extractFileName(filename)];
  if (error.name === 'CastError') {
    ERROR_CODE = 404;
    ERROR_MESSAGE = `Запрашиваемый ресурс (${RESOURCE}) не найден.`
  }
  if (error.name === 'ValidationError') {
    ERROR_CODE = 400;
    ERROR_MESSAGE = `Поданы некорректные данные, либо данные не в полном объеме.`
  }
  response.status(ERROR_CODE).send({message: ERROR_MESSAGE});
}

const extractFileName = (filename) => path.parse(filename).name;

const resourceNames = {
  "users": "Пользователь",
  "cards": "Карточка"
}