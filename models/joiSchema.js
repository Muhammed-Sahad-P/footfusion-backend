const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

const createProductSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).required(),
  image: Joi.string().optional(),
  category: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema, createProductSchema };
