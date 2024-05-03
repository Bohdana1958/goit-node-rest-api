import { User } from "../models/userModel.js";
import { signToken } from "./jwtService.js";
import { HttpError } from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import { ImageService } from "../services/imageService.js";
import { v4 as uuidv4 } from "uuid";
import { msg } from "../helpers/msg.js";

export const checkUserExistsService = (filter) => User.exists(filter);

export const registerUser = async (userData) => {
  const { email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = uuidv4();
  userData.verificationToken = verificationToken;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    verificationToken,
  });

  newUser.password = undefined;

  msg(newUser.id, newUser.verificationToken, email);

  const token = signToken(newUser.id);

  return { newUser, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }

  const isPasswordValid = await user.checkUserPassword(password, user.password);

  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
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

  user.avatarURL = await ImageService.saveImage(
    file,
    {
      width: 250,
      height: 250,
    },
    "avatars"
  );

  const currentUser = await User.findByIdAndUpdate(id, user, { new: true });

  return await currentUser.save();
};
