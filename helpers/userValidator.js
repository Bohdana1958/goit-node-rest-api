// import Joi from "joi";
// import { joiValidator } from "./joiValidator.js";

// export const registerUserDataValidator = joiValidator((data) => {
//   Joi.object()
//     .options({ abortEarly: false })
//     .keys({
//       email: Joi.string()
//         .email({
//           minDomainSegments: 2,
//           tlds: { allow: ["com", "net", "org", "net"] },
//         })
//         .required(),
//       password: Joi.string().min(6).max(30).required(),
//       subscription: Joi.string().min(3).max(14),
//     })
//     .validate(data);
// });

import Joi from "joi";
import { joiValidator } from "./joiValidator.js";

export const registerUserDataValidator = joiValidator((data) => {
  // Створюємо схему для валідації
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "net"] },
      })
      .required(),
    password: Joi.string().min(6).max(30).required(),
    subscription: Joi.string().min(3).max(14),
  }).options({ abortEarly: false }); // Встановлюємо опцію для відключення раннього відмову при помилках

  // Виконуємо валідацію даних за схемою
  const validationResult = schema.validate(data);

  // Перевіряємо результат валідації
  if (validationResult.error) {
    // Якщо є помилки, повертаємо їх
    throw new Error(
      validationResult.error.details.map((err) => err.message).join("; ")
    );
  }

  // Якщо валідація успішна, повертаємо об'єкт даних
  return validationResult.value;
});
