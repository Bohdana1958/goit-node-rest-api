import HttpError from "../helpers/HttpError.js";
import { User } from "../models/userModel.js";
import { signToken } from "./jwtService.js";

export const checkUserExistsService = (filter) => User.exists(filter);

export const registerUser = async (userData) => {
  const newUser = await User.create(userData);
  // newUser.password = undefined;

  const token = signToken(newUser.id);
  return { newUser, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new HttpError(401, "Unauthorized");

  const isPasswortIsValid = await user.checkUserPassword(
    password,
    user.password
  );

  if (!isPasswortIsValid) throw new HttpError(401, "Unauthorized");
  user.password = undefined;

  const token = signToken(user.id);

  return { user, token };
};
