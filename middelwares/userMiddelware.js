import { ImageService } from "../services/imageService.js";

export const multerUpload = ImageService.initUploadImageMiddleware("avatar");
