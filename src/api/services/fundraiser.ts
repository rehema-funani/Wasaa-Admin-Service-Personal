import fundraiser from "../fundraiser-axios";

export const fundraiserService = {
  getCampaigns: async (page: number, limit: number) => {
    const response = await fundraiser.get(`/campaigns?page=${page}&limit=${limit}`)
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
  publishCampaign: async (id: string) => {
    const response = await fundraiser.post(`/campaigns/${id}/publish`);
    return response.data;
  },
  getAllDonations: async () => {
    const response = await fundraiser.get(`/donations`);
    return response.data;
  },
  getPayouts: async () => {
    const response = await fundraiser.get(`/payouts`);
    return response.data;
  },
  getPayoutById: async (id: string) => {
    const response = await fundraiser.get(`/payouts/${id}`);
    return response.data;
  },
  approvePayout: async (id: string) => {
    const response = await fundraiser.post(`/payouts/${id}/approve`);
    return response.data;
  },
  rejectPayout: async (id: string) => {
    const response = await fundraiser.post(`/payouts/${id}/reject`);
    return response.data;
  }
};
