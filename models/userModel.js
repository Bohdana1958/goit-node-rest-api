import { model, Schema } from "mongoose";
import { handleError } from "../helpers/handleError.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
    avatarURL: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");

    console.log("EmailHash:", emailHash);

    this.avatarURL = `https://gravatar.com/avatar/${emailHash}.jpg?d=robohash`;
  }

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.post("save", handleError);
userSchema.methods.checkUserPassword = (candidate, passwordHash) =>
  bcrypt.compare(candidate, passwordHash);

export const User = model("user", userSchema);

// export const signup = async (data) => {
//   const hashPassword = await bcrypt.hash(data.password, 10);
//   return User.create({ ...data, password: hashPassword });
// };
// export const validatePassword = (password, hashPassword) =>
//   bcrypt.compare(password, hashPassword);
