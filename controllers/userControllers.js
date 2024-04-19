import { catchAsync } from "../helpers/catchAsync.js";
import { registerUser } from "../services/usersService.js";

export const register = catchAsync(async (req, res) => {
  const { newUser, token } = await registerUser(req.body);
  res.status(201).json({
    newUser,
    token,
  });
});
