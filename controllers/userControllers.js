import { catchAsync } from "../helpers/catchAsync.js";
import {
  deleteToken,
  findUserByToken,
  listUsers,
  loginUser,
  registerUser,
  saveTokenToDatabase,
} from "../services/usersService.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await listUsers();
  res.status(200).json(users);
});

export const register = catchAsync(async (req, res) => {
  const { newUser } = await registerUser({ ...req.body });
  const { email, subscription } = newUser;
  res.status(201).json({
    newUser: {
      email: email,
      subscription: subscription,
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
