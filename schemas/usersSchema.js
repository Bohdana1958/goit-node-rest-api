import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().email.required(),
  password: Joi.string().min(6).max(30).required(),
  subscription: Joi.string().min(3).max(14),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email.required(),
  password: Joi.string().required(),
});
