import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "net"] },
    })
    .required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),

  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
