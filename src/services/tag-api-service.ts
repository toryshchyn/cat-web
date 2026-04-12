import { ApiService } from "./api-service";

export type CreateTagRequest = { name: string };

export type TagRow = {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
};

export type TagWithCount = TagRow & { count: number };

export class TagApiService extends ApiService {
  static async createTag(body: CreateTagRequest) {
    try {
      return await super.request<TagRow>("/api/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("(409)")) {
        const all = await this.getTags();
        return (
          all.find(
            (t) => t.name.toLowerCase() === body.name.toLowerCase()
          ) ?? null
        );
      }
      throw error;
    }
  }

  static async getTags() {
    return super.request<TagRow[]>("/api/tags");
  }

  static async getTagById(id: number) {
    return super.request<TagRow>(`/api/tag/${id}`);
  }

  static async getTagsWithCounts() {
    return super.request<TagWithCount[]>("/api/tags-with-counts");
  }
}
