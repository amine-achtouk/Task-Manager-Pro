const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(5).max(100).required().trim(),
  description: Joi.string().max(500).allow(''),
  status: Joi.string().valid('pending', 'in_progress', 'completed').default('pending')
});

module.exports = { createTaskSchema };