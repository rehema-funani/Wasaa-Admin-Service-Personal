import notification from "../notification-axios";

export const notificationService = {

  // ======== NOTIFICATIONS ==========
  getNotifications: async (params: any) => {
    const response = await notification.get('/notifications', { params });
    return response.data;
  },

  getUserNotifications: async (user_id: String) => {
    const response = await notification.get(`/notifications?user_id=${user_id}`);
    return response.data;
  },

  // ======== TEMPLATES ==========
  getTemplates: async () => {
    const response = await notification.get('/templates');
    return response.data;
  },

  createTemplate: async (templateData: any) => {
    const response = await notification.post('/templates', templateData);
    return response.data;
  },

  validateTemplate: async (templateData: any) => {
    const response = await notification.post('/templates/validate', templateData);
    return response.data;
  },

  getTemplateById: async (id: string) => {
    const response = await notification.get(`/templates/${id}`);
    return response.data;
  },

  deleteTemplate: async (id: string) => {
    const response = await notification.delete(`/templates/${id}`);
    return response.data;
  },

  updateTemplate: async (id: string, templateData: any) => {
    const response = await notification.put(`/templates/${id}`, templateData);
    return response.data;
  },

  previewTemplate: async (id: string, previewData: any) => {
    const response = await notification.post(`/templates/${id}/preview`, previewData);
    return response.data;
  },

  duplicateTemplate: async (id: string) => {
    const response = await notification.post(`/templates/${id}/duplicate`);
    return response.data;
  },


  // ======== BROADCASTS ==========
  getBroadcasts: async () => {
    const response = await notification.get(`/broadcasts`);
    return response.data;
  },

  createBroadcast: async (broadcastData: any) => {
    const response = await notification.post('/broadcasts', broadcastData);
    return response.data;
  },

  createAdminBroadcast: async (broadcastData: any) => {
    const response = await notification.post('/admin/broadcasts', broadcastData);
    return response.data;
  },

  getBroadcast: async (id: string) => {
    const response = await notification.get(`/broadcasts/${id}`);
    return response.data;
  },

  deleteBroadcast: async (id: string) => {
    const response = await notification.delete(`/broadcasts/${id}`);
    return response.data;
  },

  updateBroadcast: async (id: string, broadcastData: any) => {
    const response = await notification.put(`/broadcasts/${id}`, broadcastData);
    return response.data;
  },

  scheduleBroadcast: async (id: string, scheduleData: any) => {
    const response = await notification.post(`/broadcasts/${id}/schedule`, scheduleData);
    return response.data;
  },

  executeBroadcast: async (id: string) => {
    const response = await notification.post(`/broadcasts/${id}/send`);
    return response.data;
  },

  pauseBroadcast: async (id: string) => {
    const response = await notification.post(`/broadcasts/${id}/pause`);
    return response.data;
  },

  resumeBroadcast: async (id: string) => {
    const response = await notification.post(`/broadcasts/${id}/resume`);
    return response.data;
  }
};
