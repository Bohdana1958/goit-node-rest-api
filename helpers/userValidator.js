import Joi from "joi";
import { joiValidator } from "./joiValidator.js";

export const registerUserDataValidator = joiValidator((data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "net"] },
      })
      .required(),
    password: Joi.string().min(6).max(30).required(),
    subscription: Joi.string().min(3).max(14),
  });
  return schema.validate(data, { abortEarly: false });
});

export const loginUserDataValidator = joiValidator((data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
  });

  return schema.validate(data, { abortEarly: false });
});
