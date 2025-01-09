import { dim } from "$std/fmt/colors.ts";

export async function validateFile(file: File) {
  const maxFileSize = 8 * 1024 * 1024;

  if (file.size > maxFileSize) {
    throw new Error("File size exceeds 8MB limit");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload jpeg, png or gif");
  }

  return true;
}
