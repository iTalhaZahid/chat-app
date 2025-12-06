import { Platform } from "react-native";

export const API_URL=Platform.OS=='android'?'http://192.168.1.9:3000':'http://localhost:3000';

export const CLOUDINARY_CLOUD_NAME='djv8uovkg';
export const CLOUDINARY_UPLOAD_PRESET='chatImages';
