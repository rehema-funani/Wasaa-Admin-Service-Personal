import shortaxios from "../shorts-axios";

export const shortsService = {
  pendingModShorts: async () => {
    const response = await shortaxios.get('/admin/shorts/pending');
    return response.data;
  },

  moderateShort: async (data: any, id: string) => {
    const response = await shortaxios.post(`/admin/shorts/${id}/moderate`, data);
    return response.data;
  },

  getModStats: async () => {
    const response = await shortaxios.get('/admin/moderation/stats');
    return response.data;
  },

  updateModSettings: async (data: any) => {
    const response = await shortaxios.post('/admin/moderation/settings', data);
    return response.data;
  },

//   ============= WALLET SERVICES =============
  getTransactions: async (params: any) => {
    const response = await shortaxios.get('/admin/transactions', { params });
    return response.data;
  },

  updateTransactionStatus: async (data: any, id: string) => {
    const response = await shortaxios.post(`/admin/transactions/${id}/update-status`, data);
    return response.data;
  },

  monetizeCreator: async (data: any, id: string) => {
    const response = await shortaxios.post(`/admin/creators/${id}/monetize`, data);
    return response.data;
  },

  demonetizeCreator: async (data: any, id: string) => {
    const response = await shortaxios.post(`/admin/creators/${id}/demonetize`, data);
    return response.data;
  },

  resolveDispute: async (data: any, id: string) => {
    const response = await shortaxios.post(`/admin/disputes/${id}/resolve`, data);
    return response.data;
  },


    //   ============ TAGS SERVICES =============

    getTags: async (params: any) => {
        const response = await shortaxios.get('/admin/tags', { params });
        return response.data;
    },
    
    blockTag: async (data: any) => {
        const response = await shortaxios.post('/admin/tags/block', data);
        return response.data;
    },
    
    unblockTag: async (data: any) => {
        const response = await shortaxios.put(`/admin/tags/unblock`, data);
        return response.data;
    },

    mergeTags: async (data: any) => {
        const response = await shortaxios.post('/admin/tags/merge', data);
        return response.data;
    },
    
    updateTagStatus: async (data: any, id: string) => {
        const response = await shortaxios.post(`/admin/tags/${id}/update-status`, data);
        return response.data;
    },

};