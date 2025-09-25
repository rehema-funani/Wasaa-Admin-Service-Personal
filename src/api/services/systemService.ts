import axios from 'axios';
import { businessApi } from '../business-axios'; // Reusing businessApi for simplicity, ideally a separate systemApi

const getSystemHealthMetrics = async (): Promise<any[]> => {
    try {
        // Assuming an API endpoint like /system/health or /metrics
        // This endpoint should return an array of service health objects
        const response = await businessApi.get('/system/health'); 
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to fetch system health metrics';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while fetching system health metrics.');
    }
};

const systemService = {
    getSystemHealthMetrics,
};

export default systemService;
