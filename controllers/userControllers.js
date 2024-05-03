import { error, log } from "console";
import { HttpError } from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { User } from "../models/userModel.js";
import {
  deleteToken,
  findUserByToken,
  listUsers,
  loginUser,
  registerUser,
  saveTokenToDatabase,
  updateAvatarService,
} from "../services/usersService.js";

import { msg } from "../helpers/msg.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await listUsers();
  res.status(200).json(users);
});

export const register = catchAsync(async (req, res) => {
  const { newUser } = await registerUser({ ...req.body });

  const { email, subscription, avatarURL } = newUser;
  res.status(201).json({
    newUser: {
      email: email,
      subscription: subscription,
      avatarURL: avatarURL,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await loginUser({ ...req.body });

  const { email, subscription } = user;

  await saveTokenToDatabase(user._id, token);

  res.status(200).json({
    user: {
      email: email,
      subscription: subscription,
    },
    token,
  });
});

export const getCurrent = async (req, res) => {
  const { email, subscription, token } = req.user;

  const user = await findUserByToken(token);

  if (!user) throw HttpError(401, "Not authorized");

  res.status(200).json({
    email,
    subscription,
  });
};

export const logout = catchAsync(async (req, res) => {
  const { _id } = req.user;
  await deleteToken({ _id }, { token: null });

  res.status(204).send();
});

export const updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }
  const user = await updateAvatarService(req.user, req.file);

  res.status(200).json({
    avatarURL: user.avatarURL,
  });
});

export const verificationToken = async (req, res, next) => {
  try {
    const userId = req.params.verificationToken;

    if (!userId) throw HttpError(404, "User not found");

    const query = { verificationToken: userId };

    const user = await User.findOne(query);

    if (!user) throw HttpError(404, "User not found");

    user.verificationToken = false;

    user.verify = true;

    user.save();

    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw HttpError(400, "missing required field email");

    const user = await User.findOne({ email });

    if (user.verify === true)
      throw HttpError(400, "Verification has already been passed");
    msg(user.id, user.verificationToken, email);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обробка помилки без next
  }
};
