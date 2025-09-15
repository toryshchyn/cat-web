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

export class ContainerApi extends ApiService {
  static async createContainer(body: CreateContainerRequest, getAccessToken = this.accessTokenProvider) {
    try {
      return await this.request<ContainerRow>(
        '/api/container',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        getAccessToken
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('(409)')) {
        const all = await this.getContainers(getAccessToken);
        return all.find(c => c.name.toLowerCase() === (body.name ?? '').toLowerCase()) ?? null;
      }
      throw err;
    }
  }

  static async getContainers(getAccessToken = this.accessTokenProvider) {
    return this.request<ContainerRow[]>('/api/containers', {}, getAccessToken);
  }

  static async getContainer(id: number, getAccessToken = this.accessTokenProvider) {
    return this.request<ContainerRow | null>(`/api/container/${id}`, {}, getAccessToken);
  }

  static async findContainerByName(name: string, getAccessToken = this.accessTokenProvider) {
    const all = await this.getContainers(getAccessToken);
    return all.find(c => c.name.toLowerCase() === name.toLowerCase()) ?? null;
  }
}
