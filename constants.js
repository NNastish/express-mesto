const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
const url = new RegExp(urlRegex, 'i');
const emailRegex = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$';
const emailCheck = new RegExp(emailRegex);
const mongoOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
const mongoUrl = 'mongodb://localhost:27017/mestodb';
const userNotFound = 'Пользователь не найден';
const cardNotFound = 'Карточка с переданным id не найдена';
const invalidData = 'Неверно переданы данные';
const accessDenied = 'Ошибка доступа.';
const signinError = 'Неправильная почта или пароль';
const authError = 'Необходима авторизация';
const resourceNotFound = '404. Resource is not Found.';
const jwtDevelopment = 'some-secret-key';

module.exports = {
  url,
  emailCheck,
  mongoOptions,
  mongoUrl,
  userNotFound,
  jwtDevelopment,
  cardNotFound,
  invalidData,
  accessDenied,
  signinError,
  authError,
  resourceNotFound,
};
