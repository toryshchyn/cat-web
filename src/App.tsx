import './App.css'
import { useAuth0 } from '@auth0/auth0-react'
import useApiService from './hooks/useApiService';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const App:React.FC = () => {
  const [containers, setContainers] = useState<{id: number, name: string}[]>([]);
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    error,
    user
  } = useAuth0();

  const apiService = useApiService();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Load containers');
      apiService.getContainers().then((containers) => {
        setContainers(containers);
      });
    }
  }, [isAuthenticated, apiService]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Oops... {error.message}</div>;

  const handleCallProtectedApi = async () => {
    try {
      const phoneNumbers = await apiService.getPhoneNumbers();
      console.log('Phone numbers:', phoneNumbers);
      toast.success('Phone numbers loaded.');
    } catch (err) {
      console.error('API call failed', err);
      toast.error('Failed to load phone numbers.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Auth0 + React + Vite</h1>

      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Login</button>
      ) : (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Logout
          </button>
          <button onClick={() => handleCallProtectedApi()} style={{ marginLeft: '1rem' }}>
            Call Protected API
          </button>
          <div>
            <select>
              {containers.map((container) => (
                <option key={container.id} value={container.id}>
                  {container.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
