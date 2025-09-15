import { ApiService } from "./api-service";

export type CreateItemRequest = {
  name: string;
  description: string | null;
  container_id: number;
  image_id: number | null;
  tags: number[]
};

export type ItemRow = {
  id: number;
  name: string;
  description?: string | null;
  container_id: number;
  image_id?: number | null;
  imageUrl?: string;
  tags?: number[];
};

export type ItemResponse = Omit<ItemRow, 'imageUrl'>;

export function mapItem(raw: ItemResponse): ItemRow {
  return {
    ...raw,
    imageUrl: raw.image_id
      ? `${import.meta.env.VITE_API_BASE_URL}/api/image/${raw.image_id}`
      : undefined,
  };
}

export class ItemApi extends ApiService {
  static createItem(body: CreateItemRequest, getAccessToken = this.accessTokenProvider) {
    return this.request<ItemRow>(
      "/api/item",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      getAccessToken
    );
  }

  static async getItemsByContainer(
    containerId: number,
    getAccessToken = this.accessTokenProvider
  ): Promise<ItemRow[]> {
    const data = await this.request<ItemResponse[]>(
      `/api/items/by-container/${containerId}`,
      {},
      getAccessToken
    );
    return data.map(mapItem);
  }
}