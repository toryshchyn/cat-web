export type UploadResponse = {
    id: number;
    filename: string
};

export type CreateItemRequest = {
    name: string;
    description: string | null;
    container_id: number;
    image_id: number | null;
    tags: number[]
};

export type CreateTagRequest = {
    name: string
};

export type CreateContainerRequest = {
    name: string;
    description?: string | null;
};

export type TagRow = {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
};

export type ContainerRow = {
    id: number;
    name: string;
    description: string | null;
    created_at: string | null;
    updated_at: string | null;
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

type ItemResponse = Omit<ItemRow, 'imageUrl'>;

function mapItem(raw: ItemResponse): ItemRow {
    return {
        ...raw,
        imageUrl: raw.image_id
            ? `${import.meta.env.VITE_API_BASE_URL}/api/image/${raw.image_id}` // ✅ без "s"
            : undefined,
    };
}

export class ApiService {
    static accessTokenProvider: () => Promise<string> = async () => {
        throw new Error('Access token provider not set');
    };

    static setAccessToken(accessTokenProvider: () => Promise<string>) {
        this.accessTokenProvider = accessTokenProvider;
    }

    static async getPhoneNumbers(getAccessToken: () => Promise<string> = this.accessTokenProvider) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/phone-numbers`, {
            headers: {
                Authorization: `Bearer ${await getAccessToken?.()}`,
            },
        });
        return await res.json();
    };

    private static async request<T>(
        path: string,
        options: RequestInit = {},
        getAccessToken: () => Promise<string> = this.accessTokenProvider
    ): Promise<T> {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${await getAccessToken?.()}`
            }
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(text || `Request failed (${res.status})`);
        }

        return res.json() as Promise<T>;
    }

    private static async requestForm<T>(
        path: string,
        formData: FormData,
        getAccessToken: () => Promise<string> = this.accessTokenProvider
    ): Promise<T> {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${await getAccessToken?.()}` },
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(text || `Form request failed (${res.status})`);
        }

        return res.json() as Promise<T>;
    }

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

    static uploadImage(file: File, getAccessToken = this.accessTokenProvider) {
        const formData = new FormData();
        formData.append('file', file);
        return this.requestForm<UploadResponse>('/api/image', formData, getAccessToken);
    }

    static createItem(body: CreateItemRequest, getAccessToken = this.accessTokenProvider) {
        return this.request<ItemRow>(
            '/api/item',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            },
            getAccessToken
        );
    }

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