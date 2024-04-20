import { HttpError } from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import {
  loginUserDataValidator,
  registerUserDataValidator,
} from "../helpers/userValidator.js";
import { checkToken } from "../services/jwtService.js";
import {
  checkUserExistsService,
  getUserByIdService,
} from "../services/usersService.js";

export const checkRegisterData = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const { value, error } = registerUserDataValidator({
    email,
    password,
  });

  if (error) {
    console.error("Validation error:", error);
    throw HttpError(400, "Bad Request", error);
  }

  const userExist = await checkUserExistsService({ email: value.email });

  if (userExist) {
    throw HttpError(409, "Email in use");
  }

  req.body = value;
  next();
});

export const checkLoginData = (req, res, next) => {
  const { value, error } = loginUserDataValidator(req.body);
  if (error) throw new HttpError(400, "Bad request", error);
  req.body = value;
  next();
};

export const protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];
  const userId = checkToken(token);

  if (!userId) throw HttpError(401, "Not authorized");

  const currentUser = await getUserByIdService(userId);

  if (!currentUser) throw HttpError(401, "Not authorized");

  req.user = currentUser;

  next();
});
