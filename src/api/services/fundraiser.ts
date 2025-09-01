import fundraiser from "../fundraiser-axios";

export const fundraiserService = {
  getCampaigns: async (page: number, limit: number) => {
    const response = await fundraiser.get(
      `/campaigns?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getPendingCampaigns: async (page: number, limit: number) => {
    const response = await fundraiser.get(
      `/admin/campaigns/pending?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getCampaignById: async (id: string) => {
    const response = await fundraiser.get(`/campaigns/${id}`);
    return response.data;
  },
  deleteCampaign: async (id: string) => {
    const response = await fundraiser.delete(`/campaigns/${id}`);
    return response.data;
  },
  getCampaignComments: async (id: string) => {
    const response = await fundraiser.get(`/campaigns/${id}/comments`);
    return response.data;
  },
  getCampaignDonations: async (id: string) => {
    const response = await fundraiser.get(`/campaigns/${id}/donations`);
    return response.data;
  },
  publishCampaign: async (id: string, data: any) => {
    const response = await fundraiser.post(
      `/admin/campaigns/${id}/moderate`,
      data
    );
    return response.data;
  },
  rejectCampaign: async (id: string, data: any) => {
    const response = await fundraiser.post(
      `/admin/campaigns/${id}/reject`,
      data
    );
    return response.data;
  },
  getAllDonations: async (startDate: string, endDate: string) => {
    const response = await fundraiser.get(
      `/donations/history?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },
  getPayouts: async () => {
    const response = await fundraiser.get(`/admin/payouts/pending`);
    return response.data;
  },
  getPayoutDetails: async (id: string) => {
    const response = await fundraiser.get(`/payouts/${id}`);
    return response.data;
  },
  approvePayout: async (id: string, data) => {
    const response = await fundraiser.post(
      `/admin/payouts/${id}/approve`,
      data
    );
    return response.data;
  },
  rejectPayout: async (id: string, data) => {
    const response = await fundraiser.post(`/admin/payouts/${id}/reject`, data);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await fundraiser.get(`/admin/dashboard/stats`);
    return response.data;
  },
  getSystemSettings: async () => {
    const response = await fundraiser.get(`/admin/system/settings`);
    return response.data;
  },
  updateSystemSettings: async (data: any) => {
    const response = await fundraiser.put(`/admin/system/settings`, data);
    return response.data;
  },
};
