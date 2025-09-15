import { ApiService } from "./api-service";

export type CreateTagRequest = {
  name: string
};

export type TagRow = {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
};

export class TagApi extends ApiService {
  static async createTag(body: CreateTagRequest, getAccessToken = this.accessTokenProvider) {
    try {
      return await this.request<TagRow>(
        '/api/tag',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        getAccessToken
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('(409)')) {
        const all = await this.getTags(getAccessToken);
        return all.find(t => t.name.toLowerCase() === body.name.toLowerCase()) ?? null;
      }
      throw err;
    }
  }

  static async getTags(getAccessToken = this.accessTokenProvider) {
    return this.request<TagRow[]>('/api/tags', {}, getAccessToken);
  }
}
