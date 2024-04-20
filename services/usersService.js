import { User } from "../models/userModel.js";
import { signToken } from "./jwtService.js";
import { HttpError } from "../helpers/HttpError.js";
import bcrypt from "bcrypt";

export const checkUserExistsService = (filter) => User.exists(filter);

export const registerUser = async (userData) => {
  const { email, password } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ email, password: hashedPassword });
  newUser.password = undefined;

  const token = signToken(newUser.id);
  return { newUser, token };
};

export const loginUser = async ({ email, password }) => {
  console.log("Attempting login with:", email, password);
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    console.log("User not found");
    throw HttpError(401, "Unauthorized");
  }

  console.log("User password from database:", user.password);
  console.log("User input password:", password);
  // const isPasswordValid = await user.checkUserPassword(password, user.password);
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    console.log("Invalid password");
    throw HttpError(401, "Unauthorized");
  }

  user.password = undefined;
  const token = signToken(user.id);

  return { user, token };
};
