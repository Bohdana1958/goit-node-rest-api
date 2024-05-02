import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/HttpError.js";
import { v4 } from "uuid";
import fse from "fs-extra";
import jimp from "jimp";

export class ImageService {
  static initUploadImageMiddleware(fieldName) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, callback) => {
      if (file.mimetype.startsWith("image/")) {
        callback(null, true);
      } else {
        callback(new HttpError(400, "Please, upload images only..."), false);
      }
    };
    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(fieldName);
  }

  static async saveImage(file, options, ...pathSegments) {
    if (
      file.size >
      (options?.maxFileSize
        ? options.maxFileSize * 1024 * 1024
        : 1 * 1024 * 1024)
    ) {
      throw new HttpError(400, "File is too large...");
    }
    const fileName = `${v4()}.jpeg`;
    const tmpDir = path.join(process.cwd(), "tmp");
    const fullFilePath = path.join(tmpDir, fileName);
    await fse.ensureDir(tmpDir);
    await fse.outputFile(fullFilePath, file.buffer);

    const avatar = await jimp.read(fullFilePath);
    await avatar
      .cover(options?.width ?? 250, options?.height ?? 250)
      .quality(100)
      .writeAsync(path.join(process.cwd(), "public", "avatars", fileName));

    await fse.unlink(fullFilePath);

    return path.join(...pathSegments, fileName);
  }
}
