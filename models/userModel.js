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
  },
  {
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");
    this.avatarURL = `https://gravatar.com/avatar/${emailHash}.jpg?d=robohash`;
    if (!this.isModified("password")) return next();
  }
});

userSchema.post("save", async function () {
  if (this.isModified("avatarURL")) {
    const pathSegments = this.avatarURL.split("/");
    const fileName = pathSegments[pathSegments.length - 1];
    this.avatarURL = `/avatars/${this.id}/${fileName}`;
    await this.save();
  }
});

userSchema.post("save", handleError);

userSchema.methods.checkUserPassword = async function (
  candidatePassword,
  passwordHash
) {
  return await bcrypt.compare(candidatePassword, passwordHash);
};

export const User = model("user", userSchema);
