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

    protected static async request<T>(
        path: string,
        options: RequestInit = {},
        getAccessToken: () => Promise<string> = this.accessTokenProvider
    ): Promise<T> {
        const token = await getAccessToken?.();
        console.log("Access token: ", token);

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

    protected static async requestForm<T>(
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
}
