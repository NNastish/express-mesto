const path = require('path');

const resourceNames = {
  users: 'Пользователь',
  cards: 'Карточка',
};
const extractFileName = (filename) => path.parse(filename).name;
module.exports.errorController = (error, response, filename) => {
  let ERROR_CODE = 500;
  let ERROR_MESSAGE = 'Ошибка по умолчанию. Кто-то применяет магию вне Хогвардса.';
  const RESOURCE = resourceNames[extractFileName(filename)];
  if (error.message === 'NotFound') {
    ERROR_CODE = 404;
    ERROR_MESSAGE = `Запрашиваемый ресурс (${RESOURCE}) не найден.`;
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    ERROR_CODE = 400;
    ERROR_MESSAGE = 'Поданы некорректные данные, либо данные не в полном объеме.';
  }
  response.status(ERROR_CODE).send({ message: ERROR_MESSAGE });
};
