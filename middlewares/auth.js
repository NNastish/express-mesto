const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');
const AccessError = require('../errors/accessError');

const { NODE_ENV, JWT_SECRET } = process.env;
const { authError, jwtDevelopment } = require('../constants');
// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError(authError));
  }
  const token = authorization.replace('Bearer ', '');
  const passFraze = NODE_ENV === 'production' ? JWT_SECRET : jwtDevelopment;
  let payload;
  try {
    payload = jwt.verify(token, passFraze);
  } catch (err) {
    throw new AccessError(authError);
  }
  req.user = payload;
  next();
};
