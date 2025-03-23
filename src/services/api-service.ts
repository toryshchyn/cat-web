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
}