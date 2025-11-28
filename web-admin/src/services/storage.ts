import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

// Upload a file
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  
  // Upload file
  const snapshot = await uploadBytes(storageRef, file);
  
  // Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  if (onProgress) {
    onProgress(100);
  }
  
  return downloadURL;
}

// Upload institution image
export async function uploadInstitutionImage(
  institutionId: string,
  file: File,
  imageType: "logo" | "cover" | "gallery"
): Promise<string> {
  const extension = file.name.split(".").pop();
  const timestamp = Date.now();
  const path = `institutions/${institutionId}/${imageType}_${timestamp}.${extension}`;
  
  return uploadFile(file, path);
}

// Upload user avatar
export async function uploadUserAvatar(userId: string, file: File): Promise<string> {
  const extension = file.name.split(".").pop();
  const path = `users/${userId}/avatar.${extension}`;
  
  return uploadFile(file, path);
}

// Upload CSV/Excel file for bulk import
export async function uploadDataFile(file: File, type: string): Promise<string> {
  const timestamp = Date.now();
  const path = `uploads/${type}/${timestamp}_${file.name}`;
  
  return uploadFile(file, path);
}

// Delete a file
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// Get all files in a directory
export async function listFiles(path: string): Promise<string[]> {
  const storageRef = ref(storage, path);
  const result = await listAll(storageRef);
  
  const urls: string[] = [];
  for (const item of result.items) {
    const url = await getDownloadURL(item);
    urls.push(url);
  }
  
  return urls;
}

// Get institution images
export async function getInstitutionImages(institutionId: string): Promise<string[]> {
  return listFiles(`institutions/${institutionId}`);
}
