import { ApiService } from "./api-service";

export type CreateItemRequest = {
  name: string;
  description?: string | null;
  container_id: number;
  tags: number[];
  image_id?: number | null;
};

export type ItemRow = {
  id: number;
  name: string;
  description?: string | null;
  container_id: number;
  containerName?: string;
  image_id?: number | null;
  imageUrl?: string;
  tags?: number[];
};

export type ItemResponse = Omit<ItemRow, "imageUrl">;

export function mapItem(raw: ItemResponse): ItemRow {
  return {
    ...raw,
    imageUrl: raw.image_id
      ? `${import.meta.env.VITE_API_BASE_URL}/api/image/${raw.image_id}`
      : undefined,
  };
}

export class ItemApiService extends ApiService {
  static createItem(body: CreateItemRequest) {
    return super.request<ItemRow>("/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  static async getItemsByContainer(containerId: number): Promise<ItemRow[]> {
    const data = await super.request<ItemResponse[]>(
      `/api/items/by-container/${containerId}`
    );
    return data.map(mapItem);
  }

  static async getItemsByTag(tagId: number): Promise<ItemRow[]> {
    const data = await super.request<ItemResponse[]>(
      `/api/items/by-tag/${tagId}`
    );
    return data.map(mapItem);
  }

  static async updateItem(id: number, body: Partial<ItemRow>) {
    return super.request<ItemRow>(`/api/item/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  static async getItemById(id: number) {
    const raw = await super.request<ItemResponse>(`/api/item/${id}`);
    return mapItem(raw);
  }

  static async deleteItem(id: number) {
    return super.requestVoid(`/api/item/${id}`, { method: "DELETE" });
  }
}
