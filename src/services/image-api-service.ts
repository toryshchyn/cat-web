import { ApiService } from "./api-service";

export type UploadResponse = {
  id: number;
  filename: string;
};

export class ImageApiService extends ApiService {
  static uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return super.requestForm<UploadResponse>("/api/image", formData);
  }
}
