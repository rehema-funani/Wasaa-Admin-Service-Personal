// import apiClient from '../apiClient';

// // This interface is based on the Postman response you provided.
// // It helps ensure your data is typed correctly.
// interface ApiBusiness {
//   id: string;
//   tenant_id: string;
//   name: string;
//   type: string;
//   registration_number: string;
//   country: string;
//   status: string;
//   verification_status: string;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   // Add any other fields that might come from the API
// }

// export const businessService = {
//   /**
//    * Fetches all businesses from the API.
//    */
//   async getAllBusinesses(): Promise<ApiBusiness[]> {
//     try {
//       // IMPORTANT: Replace '/businesses' with your actual endpoint for fetching all businesses.
//       const response = await apiClient.get('/businesses');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching businesses:', error);
//       // Depending on your error handling strategy, you might want to throw the error
//       // or return an empty array to prevent the page from crashing.
//       throw error;
//     }
//   },

//   // You can add other business-related API calls here, for example:
//   // async getBusinessById(id: string): Promise<ApiBusiness> { ... }
//   // async createBusiness(data: any): Promise<ApiBusiness> { ... }
// };
