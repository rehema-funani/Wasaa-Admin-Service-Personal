import fundraiser from "../fundraiser-axios";

export const fundraiserService = {
  getCampaigns: async () => {
    const response = await fundraiser.get('/campaigns');
    return response.data;
  },
};
