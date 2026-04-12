import { ApiService } from "./api-service";

export type CreateContainerRequest = {
  name: string;
  description?: string | null;
};

export type ContainerRow = {
  id: number;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export class ContainerApiService extends ApiService {
  static async createContainer(body: CreateContainerRequest) {
    try {
      return await super.request<ContainerRow>(
        "/api/container",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("(409)")) {
        const all = await this.getContainers();
        return all.find(
          (c) => c.name.toLowerCase() === (body.name ?? "").toLowerCase()
        ) ?? null;
      }
      throw error;
    }
  }

  static async getContainers() {
    return super.request<ContainerRow[]>("/api/containers");
  }

  static async getContainerById(id: number) {
    return super.request<ContainerRow | null>(`/api/container/${id}`);
  }

  static async getContainerByName(name: string) {
    const all = await this.getContainers();
    return (
      all.find((c) => c.name.toLowerCase() === name.toLowerCase()) ?? null
    );
  }
}
