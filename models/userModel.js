import { model, Schema } from "mongoose";
import { handleError } from "../helpers/handleError.js";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.post("save", handleError);
userSchema.methods.checkUserPassword = (candidate, passwordHash) =>
  bcrypt.compare(candidate, passwordHash);

export const User = model("user", userSchema);
