import multer from "multer";
import path from "path";
import { v4 } from "uuid";
import { HttpError } from "../helpers/HttpError.js";
import Jimp from "jimp";

const multerStorage = multer.diskStorage({
  //config Storage
  destination: (req, file, callback) => {
    console.log("dest file:", req.file);
    callback(null, path.join("public", "avatars"));
  },
  filename: (req, file, callback) => {
    console.log("name file:", req.file);
    const extention = file.mimetype.split("/")[1];
    Jimp.read(`${req.user.id}.${extention}`, (err, ava) => {
      if (err) return err;
      ava.resize(250, 250).write("ava_small.jpg");
    });
    callback(null, `${req.user.id}-${v4}.${extention}`);
  },
});
//config filter
const multerFilter = (req, file, callback) => {
  console.log("filter file:", req.file);
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(new HttpError(400, "Please, upload images only..."), false);
  }
};

//create multer middelware
export const multerUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single("avatar");
