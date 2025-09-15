import { ApiService } from "./api-service";

export type UploadResponse = {
  id: number;
  filename: string
};

export class ImageApi extends ApiService {
  static uploadImage(file: File, getAccessToken = this.accessTokenProvider) {
    const formData = new FormData();
    formData.append('file', file);
    return this.requestForm<UploadResponse>('/api/image', formData, getAccessToken);
  }
}
