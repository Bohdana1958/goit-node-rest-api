import { catchAsync } from "../helpers/catchAsync.js";
import { loginUser, registerUser } from "../services/usersService.js";

export const register = catchAsync(async (req, res) => {
  const { newUser, token } = await registerUser(req.body);
  res.status(201).json({
    newUser,
    token,
  });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await loginUser(req.body);
  res.status(200).json({
    user,
    token,
  });
});
