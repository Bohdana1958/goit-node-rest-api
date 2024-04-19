import { User } from "../models/userModel.js";
import { signToken } from "./jwtService.js";

export const checkUserExistsService = (filter) => User.exists(filter);

export const registerUser = async (userData) => {
  const newUser = await User.create(userData);
  //   newUser.password = undefined;

  const token = signToken(newUser.id);
  return { newUser, token };
};
