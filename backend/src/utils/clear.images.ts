import fs from "fs";
import path from "path";

export const clearImages = (
  filesOrFileNames: Express.Multer.File[] | string | string[],
) => {
  const removeFile = (filePath: string) => {
    const fullPath = path.join(__dirname, "..", "..", "images", filePath);
    fs.unlink(fullPath, (err) => {
      if (err) console.log("Failed to delete file:", fullPath, err.message);
    });
  };

  if (typeof filesOrFileNames === "string") {
    removeFile(filesOrFileNames);
  } else if (Array.isArray(filesOrFileNames)) {
    if (filesOrFileNames.length === 0) return;

    const first = filesOrFileNames[0];
    if (typeof first === "string") {
      (filesOrFileNames as string[]).forEach(removeFile);
    } else {
      (filesOrFileNames as Express.Multer.File[]).forEach((file) =>
        removeFile(file.filename),
      );
    }
  }
};
