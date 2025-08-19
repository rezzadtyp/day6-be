import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { join } from "path";
import { ApiError } from "./api-error";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

export const uploader = (
  filePrefix: string,
  foldername?: string,
  fileLimit?: number
) => {
  const defaultDir = join(process.cwd(), "public");

  // multer storage configuration
  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File, // @types/multer
      cb: DestinationCallback
    ) => {
      const destination = foldername
        ? join(defaultDir, foldername)
        : defaultDir;
      cb(null, destination);
    },
    filename(req: Request, file: Express.Multer.File, cb: FilenameCallback) {
      const originalnameParts = file.originalname.split(".");
      const fileExtension = originalnameParts[originalnameParts.length - 1];
      const newFilename =
        filePrefix +
        Date.now() +
        file.originalname.length +
        "." +
        fileExtension;
      cb(null, newFilename);
    },
  });

  // file filter configuration
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // regex untuk file extension
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/;
    // cek apakah file yang diterima backend sesuai dengan regex
    const isExtMatch = file.originalname.toLowerCase().match(allowedExtensions);

    if (isExtMatch) {
      cb(null, true);
    } else {
      const error = new ApiError("Your file extension is not allowed", 400);
      cb(error);
    }
  };

  const limits = { fileSize: fileLimit || 10 * 1024 * 1024 };

  return multer({ storage, fileFilter, limits });
};
