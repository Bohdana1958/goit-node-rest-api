import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/HttpError.js";
import dotenv from "dotenv";

dotenv.config();

export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const checkToken = (token) => {
  if (!token) throw HttpError(401, "Not authorized");

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    return id;
  } catch (error) {
    throw HttpError(401, "Not authorized");
  }
};

export const checkTokenValidity = async (req, res, next) => {
  // Отримати токен з заголовків запиту
  const token = req.headers.authorization;

  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // Декодувати токен і отримати ідентифікатор користувача
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Перевірити, чи користувач ще існує в системі або чи токен не було вже видалено
    const user = await User.findById(userId);

    console.log("User:", user);

    if (!user || !user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    next();
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(401).json({ message: "Not authorized" });
  }
};
