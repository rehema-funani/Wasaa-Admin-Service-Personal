import { api } from "../axios";

export const permissionService = {
  getPermissions: async () => {
    const response = await api.get('/roles/permissions');
    return response.data;
  },

  getPermission: async (id: string) => {
    const response = await api.get(`/permissions/${id}`);
    return response.data;
  },

  createPermission: async (permissionData: any) => {
    const response = await api.post('/permissions', permissionData);
    return response.data;
  },

  updatePermission: async (id: string, permissionData: any) => {
    const response = await api.put(`/permissions/${id}`, permissionData);
    return response.data;
  },

  deletePermission: async (id: string) => {
    const response = await api.delete(`/permissions/${id}`);
    return response.data;
  }
};