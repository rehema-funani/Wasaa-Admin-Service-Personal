import fundraiser from "../fundraiser-axios";

export const fundraiserService = {
  getCampaigns: async (page: number, limit: number) => {
    const response = await fundraiser.get(`/campaigns?page=${page}&limit=${limit}`)
    return response.data;
  },
};
