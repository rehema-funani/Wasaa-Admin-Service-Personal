import gift from "../gift-axios";

export const giftService = {
  getGiftCardHistory: async () => {
    const response = await gift.get('/admin/gift-cards/history');
    return response.data;
  },

  getGiftCardRedemptions: async () => {
    const response = await gift.get('/admin/gift-cards/redemptions');
    return response.data;
  },

  getSentGiftCards: async () => {
    const response = await gift.get('/admin/gift-cards/sent');
    return response.data;
  },
};


// nkbh