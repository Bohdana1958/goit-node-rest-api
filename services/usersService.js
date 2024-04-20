import { User } from "../models/userModel.js";
import { signToken } from "./jwtService.js";
import { HttpError } from "../helpers/HttpError.js";
import bcrypt from "bcrypt";

export const checkUserExistsService = (filter) => User.exists(filter);

export const registerUser = async (userData) => {
  const { email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ email, password: hashedPassword });
  newUser.password = undefined;

  const token = signToken(newUser.id);
  return { newUser, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw HttpError(401, "Unauthorized");
  }

  const isPasswordValid = await user.checkUserPassword(password, user.password);

  if (!isPasswordValid) {
    throw HttpError(401, "Unauthorized");
  }

  user.password = undefined;
  const token = signToken(user.id);

  return { user, token };
};

export async function listUsers() {
  const user = await User.find();
  return user;
}

export const getUserByIdService = (id) => User.findById(id);

export async function deleteToken(id) {
  const result = await User.findByIdAndUpdate(id, { token: "" });
  console.log(id);
  return result;
}
