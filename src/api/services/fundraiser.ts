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
  
};
