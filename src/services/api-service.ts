export abstract class ApiService {
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

    static async request<T>(
        path: string,
        options: RequestInit = {},
        getAccessToken: () => Promise<string> = ApiService.accessTokenProvider
    ): Promise<T> {
        const token = await getAccessToken?.();
        console.log("Access token", token);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(text || `Request failed (${response.status})`);
        }

        return response.json() as Promise<T>;
    }

    static async requestForm<T>(
        path: string,
        formData: FormData,
        getAccessToken: () => Promise<string> = this.accessTokenProvider
    ): Promise<T> {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${await getAccessToken?.()}` },
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(text || `Form request failed (${response.status})`);
        }

        return response.json() as Promise<T>;
    }

    static async requestVoid(
        path: string,
        options: RequestInit = {},
        getAccessToken: () => Promise<string> = ApiService.accessTokenProvider
    ): Promise<void> {
        const token = await getAccessToken?.();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(text || `Request failed (${response.status})`);
        }
    }
}
