// uploadImageToStorage.ts
import { uploadFileToStorage, generateStoragePath } from "./storage";

export interface UploadResult {
  success: boolean;
  downloadURL: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  userId: string;
  uploadedAt: string;
}

/**
 * Upload an image to Firebase Storage (Client SDK)
 */
export async function uploadImageToStorage(
  file: File,
  userId: string = "anonymous"
): Promise<UploadResult> {
  try {
    const storagePath = generateStoragePath(userId, file.name, "images");
    const downloadURL = await uploadFileToStorage(file, storagePath);

    return {
      success: true,
      downloadURL,
      storagePath,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      userId,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }
}
