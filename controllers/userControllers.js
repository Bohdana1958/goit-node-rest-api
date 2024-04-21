import { catchAsync } from "../helpers/catchAsync.js";
import {
  deleteToken,
  listUsers,
  loginUser,
  registerUser,
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
  console.log("User:", user);
  console.log("Token:", token);

  const { email, subscription } = user;
  res.status(200).json({
    user: {
      email: email,
      subscription: subscription,
    },
    token,
  });
});

export const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

export const logout = catchAsync(async (req, res) => {
  const { _id } = req.user;
  await deleteToken(_id);

  res.sendStatus(204);
});
