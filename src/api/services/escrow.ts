import escrow from "../escrow-axios";

export const escrowService = {
  getMilestones: async () => {
    const response = await escrow.get('/milestones');
    return response.data;
  },
};
