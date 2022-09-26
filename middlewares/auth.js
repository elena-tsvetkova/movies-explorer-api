const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new Unauthorized();
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    let secret = 'some-secret-key';
    if (NODE_ENV === 'production') {
      secret = JWT_SECRET;
    }
    payload = jwt.verify(token, secret);
  } catch (err) {
    next(new Unauthorized());
    return;
  }

  req.user = payload;

  next();
};
