const AppError = require('../utils/AppError');

const validation = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const message = error.details.map(el => el.message).join(', ');
    return next(new AppError(message, 400));
  }

  req.body = value;
  next();
};


module.exports = validation