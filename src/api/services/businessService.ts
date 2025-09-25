import axios from 'axios';
import { businessApi } from '../business-axios';
// import { Business } from '../../types/business';
import { Business } from '../../types/business';

const registerBusiness = async (userId: string, businessData: any) => {
    try {
        // We are not handling file uploads for now to focus on creating the business.
        // In a real scenario, you'd likely use FormData for file uploads.
        const response = await businessApi.post(`/business/${userId}`, businessData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Log the full error response for better debugging
            console.error("API Error Response:", error.response.data);

            const errorData = error.response.data;

            // Handle structured validation errors (if the API sends them)
            if (errorData && Array.isArray(errorData.errors)) {
                const errorMessages = errorData.errors.map(e => e.message || JSON.stringify(e)).join(', ');
                throw new Error(errorMessages);
            }

            // The API might return an error object with a 'message' property.
            // We default to a generic message if `error.response.data.message` is not available.
            const errorMessage = errorData?.error || errorData?.message || 'Failed to register business. Please check the console for details.';
            throw new Error(errorMessage);
        }
        // Fallback for non-Axios errors or network issues
        throw new Error('An unexpected error occurred. Please check your network connection.');
    }
};

const getAllBusinesses = async (): Promise<Business[]> => {
    try {
        const response = await businessApi.get('/business');
        // The API returns an object like { businesses: [...] }. Let's handle that.
        if (response.data && Array.isArray(response.data.businesses)) {
            return response.data.businesses;
        }
        // If the structure is not an array, log a warning and return an empty array to prevent UI crash.
        console.warn("getAllBusinesses: API response was not an array or did not contain a 'businesses' property.", response.data);
        return [];
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to fetch businesses';
            throw new Error(errorMessage);
        }
        // Fallback for non-Axios errors or network issues
        throw new Error('An unexpected error occurred while fetching businesses.');
    }
};

const getBusinessById = async (businessId: string): Promise<Business> => {
    try {
        const response = await businessApi.get(`/business/${businessId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to fetch business details';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while fetching business details.');
    }
};

const getBusinessStats = async (): Promise<any> => {
    try {
        const response = await businessApi.get('/business/stats');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to fetch business statistics';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while fetching business statistics.');
    }
};

const updateBusiness = async (businessId: string, businessData: Partial<Business>): Promise<Business> => {
    try {
        const response = await businessApi.put(`/business/${businessId}`, businessData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to update business details';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while updating business details.');
    }
};

const getBusinessCategories = async (): Promise<any[]> => {
    try {
        const response = await businessApi.get('/business-categories');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to fetch business categories';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while fetching business categories.');
    }
};

const createBusinessCategory = async (data: { name: string; description: string }): Promise<any> => {
    try {
        const response = await businessApi.post('/business-categories', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to create business category';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while creating the business category.');
    }
};

const updateBusinessCategory = async (id: string, data: { name: string; description: string }): Promise<any> => {
    try {
        const response = await businessApi.put(`/business-categories/${id}`, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to update business category';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while updating the business category.');
    }
};

const deleteBusinessCategory = async (id: string): Promise<void> => {
    try {
        await businessApi.delete(`/business-categories/${id}`);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to delete business category';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while deleting the business category.');
    }
};

const getVerificationRequests = async (params: any): Promise<any> => {
    try {
        // NOTE: Assuming an API endpoint like /business/verification-requests
        const response = await businessApi.get('/business/verification-requests', { params });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to fetch verification requests';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while fetching verification requests.');
    }
};

const getBusinessSettings = async (): Promise<any> => {
    try {
        // NOTE: Assuming an API endpoint like /business/settings
        const response = await businessApi.get('/business/settings');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to fetch business settings';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while fetching business settings.');
    }
};

const updateBusinessSettings = async (settings: any): Promise<any> => {
    try {
        // NOTE: Assuming an API endpoint like /business/settings
        const response = await businessApi.put('/business/settings', settings);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to update business settings';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while updating business settings.');
    }
};

const createBusinessProfile = async (businessId: string, profileData: any): Promise<any> => {
    try {
        const response = await businessApi.post(`/business-profile/${businessId}`, profileData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to create business profile';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while creating the business profile.');
    }
};

const getBusinessProfile = async (businessId: string): Promise<any> => {
    try {
        const response = await businessApi.get(`/business-profile/${businessId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // A 404 here means a profile hasn't been created yet, which is not a critical error.
            if (error.response.status === 404) {
                return null;
            }
            const errorMessage = error.response.data?.message || 'Failed to fetch business profile';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while fetching the business profile.');
    }
};

const updateBusinessProfile = async (businessId: string, profileData: any): Promise<any> => {
    try {
        const response = await businessApi.put(`/business-profile/${businessId}`, profileData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to update business profile';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while updating the business profile.');
    }
};

const getBusinessUsers = async (businessId: string): Promise<any[]> => {
    try {
        const response = await businessApi.get(`/business-users/${businessId}/users`);
        return response.data.users || [];
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // A 404 might just mean no users, not a critical error for this page logic
            if (error.response.status === 404) return [];
            const errorMessage = error.response.data?.message || 'Failed to fetch business users';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while fetching business users.');
    }
};

const assignUserToBusiness = async (businessId: string, userId: string, roleId: string): Promise<any> => {
    try {
        // Using POST as per the endpoint documentation for creating an assignment
        const response = await businessApi.post(`/business-users/${businessId}/user/${userId}/assign-role/${roleId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.message || 'Failed to assign user to business';
            throw new Error(errorMessage);
        }
        throw new Error('An unexpected error occurred while assigning the user.');
    }
};
const businessService = {
    registerBusiness,
    getAllBusinesses,
    getBusinessById,
    getBusinessStats,
    updateBusiness,
    getBusinessCategories,
    createBusinessCategory,
    updateBusinessCategory,
    deleteBusinessCategory,
    getVerificationRequests,
    getBusinessSettings,
    updateBusinessSettings,
    createBusinessProfile,
    getBusinessProfile,
    updateBusinessProfile,
    getBusinessUsers,
    assignUserToBusiness,
};

export default businessService;
