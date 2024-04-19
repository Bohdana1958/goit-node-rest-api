import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { registerUserDataValidator } from "../helpers/userValidator.js";
import { checkUserExistsService } from "../services/usersService.js";

export const checkRegisterData = catchAsync(async (req, res, next) => {
  const { value, error } = registerUserDataValidator(req.body);
  if (error)
    throw new HttpError(
      400,
      "Помилка від Joi або іншої бібліотеки валідації",
      error
    );
  const userExist = await checkUserExistsService({ email: value.email });
  if (userExist) throw new HttpError(409, "Email in use");
  req.body = value;
  next();
});

export const authorizate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }
  //checkToken, findUserById
  const id = checkToken(token);
  const user = await findUserById(id);

  if (!user || !user.token || user.token !== token) {
    next(HttpError(401, "Not authorized"));
  }

  req.user = user;

  next();
};
