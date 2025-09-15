import { ApiService } from "../services/api-service"
import { useAuth0 } from '@auth0/auth0-react'

const useApiService = () => {
    const { getAccessTokenSilently } = useAuth0();
    ApiService.setAccessToken(getAccessTokenSilently);
    return ApiService;
}

export default useApiService;
