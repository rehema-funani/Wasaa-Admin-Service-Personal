import { api } from "../axios";

export const roleService = {
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  getRole: async (id: string) => {
    const response = await api.get(`/roles/role/${id}`);
    return response.data;
  },

  createRole: async (roleData: any) => {
    const response = await api.post('/roles', roleData);
    return response.data;
  },

  updateRole: async (id: string, roleData: any) => {
    const response = await api.put(`/roles/role/${id}`, roleData);
    return response.data;
  },

  deleteRole: async (id: string) => {
    const response = await api.delete(`/roles/role/${id}`);
    return response.data;
  }
};
