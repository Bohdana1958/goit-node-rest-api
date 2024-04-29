import { User } from "../models/userModel.js";
import { signToken } from "./jwtService.js";
import { HttpError } from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import { ImageService } from "../services/imageService.js";

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
  console.log("token:", token);
  return { newUser, token };
};

export const loginUser = async ({ email, password }) => {
  console.log("email:", email);
  console.log("pass:", password);
  const user = await User.findOne({ email }).select("+password");
  console.log("USER:", user);

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await user.checkUserPassword(password, user.password);
  console.log("isPasswordValid:", isPasswordValid);

  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
  }

  user.password = undefined;
  const token = signToken(user.id);
  console.log("TOKEN:", token);

  return { user, token };
};

export async function listUsers() {
  const user = await User.find();
  return user;
}

export const getUserByIdService = (id) => User.findById(id);

export async function deleteToken(id) {
  const user = await User.findByIdAndUpdate(id, { token: null });

  return user;
}

export const saveTokenToDatabase = async (userId, token) => {
  const user = await User.findByIdAndUpdate(userId, { token });

  return user;
};

export const findUserByToken = async (token) => {
  return User.findOne({ token });
};

export const updateAvatarService = async (user, file) => {
  const id = user.id;

  user.avatarUrl = await ImageService.saveImage(
    file,
    {
      maxFileSize: 2,
      width: 250,
      height: 250,
    },
    "avatars",
    user.id
  );

  const currentUser = await User.findByIdAndUpdate(id, user, { new: true });
  return await currentUser.save();
};
