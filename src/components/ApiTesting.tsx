import React, { useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { toast } from 'react-toastify';
import useApiService from '../hooks/useApiService';
import { useAuth0 } from '@auth0/auth0-react';

const ApiTesting: React.FC = () => {
    const { isAuthenticated } = useAuth0();
    const [containers, setContainers] = React.useState<{ id: number; name: string }[]>([]);
    const apiService = useApiService();
    useEffect(() => {
        if (isAuthenticated) {
        console.log('Load containers');
        apiService.getContainers().then((containers) => {
            setContainers(containers);
        });
        }
    }, [isAuthenticated, apiService]);



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
        <Box sx={{ padding: 2 }}>
            <Button onClick={handleCallProtectedApi}>
                Call Protected API
            </Button>
            {containers.length > 0 && (
                <Box sx={{ marginTop: 2 }}>
                    <FormControl fullWidth>
                    <InputLabel id="container-select-label">Container</InputLabel>
                    <Select
                        labelId="container-select-label"
                        id="container-select"
                        value={containers.length > 0 ? containers[0].id : ''}
                        label="Container"
                        onChange={(e) => console.log(e.target.value)}
                    >
                        {containers.map((container) => (
                        <MenuItem key={container.id} value={container.id}>
                            {container.name}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </Box>
            )}
        </Box>
    );
};

export default ApiTesting;
