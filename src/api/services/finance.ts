import axios from 'axios';
import { finance } from '../finance-axios';

export interface Tariff {
  id?: string;
  name: string;
  description: string;
  type: 'flat' | 'percentage' | 'tiered';
  status: 'active' | 'inactive';
}

export interface FeeRange {
  id?: string;
  walletBillingId: string;
  min: number;
  max: number | null;
  fee: number;
}

export const financeService = {  
  async getAllCurrencies(): Promise<any> {
    try {
      const response = await finance.get('/currencies');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get currencies');
      }
      throw new Error('Failed to get currencies. Please check your network connection.');
    }
  },

  async getCurrency(currencyId: string): Promise<any> {
    try {
      const response = await finance.get(`/currencies/${currencyId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get currency');
      }
      throw new Error('Failed to get currency. Please check your network connection.');
    }
  },

  async createCurrency(currencyData: any): Promise<any> {
    try {
      const response = await finance.post('/currencies', currencyData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create currency');
      }
      throw new Error('Failed to create currency. Please check your network connection.');
    }
  },

  async updateCurrency(currencyId: string, currencyData: any): Promise<any> {
    try {
      const response = await finance.put(`/currencies/${currencyId}`, currencyData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update currency');
      }
      throw new Error('Failed to update currency. Please check your network connection.');
    }
  },

  async deleteCurrency(currencyId: string): Promise<any> {
    try {
      const response = await finance.delete(`/currencies/${currencyId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to delete currency');
      }
      throw new Error('Failed to delete currency. Please check your network connection.');
    }
  },

  // ======== PAYMENT METHOD ENDPOINTS ========

  async getAllPaymentMethods(): Promise<any> {
    try {
      const response = await finance.get('/paymentMethods');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get payment methods');
      }
      throw new Error('Failed to get payment methods. Please check your network connection.');
    }
  },

  async getPaymentMethod(id: string): Promise<any> {
    try {
      const response = await finance.get(`/paymentMethods/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get payment method');
      }
      throw new Error('Failed to get payment method. Please check your network connection.');
    }
  },

  async createPaymentMethod(methodData: any): Promise<any> {
    try {
      const response = await finance.post('/payment-methods', methodData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create payment method');
      }
      throw new Error('Failed to create payment method. Please check your network connection.');
    }
  },

  async updatePaymentMethod(methodId: string, methodData: any): Promise<any> {
    try {
      const response = await finance.put(`/payment-methods/${methodId}`, methodData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update payment method');
      }
      throw new Error('Failed to update payment method. Please check your network connection.');
    }
  },

  async deletePaymentMethod(methodId: string): Promise<any> {
    try {
      const response = await finance.delete(`/payment-methods/${methodId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to delete payment method');
      }
      throw new Error('Failed to delete payment method. Please check your network connection.');
    }
  },

  async togglePaymentMethodStatus(methodId: string): Promise<any> {
    try {
      const response = await finance.patch(`/payment-methods/${methodId}/toggle-status`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to toggle payment method status');
      }
      throw new Error('Failed to toggle payment method status. Please check your network connection.');
    }
  },

  // ======== USER WALLET ENDPOINTS ========

  async getAllWallets(filters = {}): Promise<any> {
    try {
      const response = await finance.get('/userWallets', { params: filters });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get wallets');
      }
      throw new Error('Failed to get wallets. Please check your network connection.');
    }
  },

  async getWallet(walletId: string): Promise<any> {
    try {
      const response = await finance.get(`/wallets/${walletId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get wallet');
      }
      throw new Error('Failed to get wallet. Please check your network connection.');
    }
  },

  async getWalletById(walletId: string): Promise<any> {
    try {
      const response = await finance.get(`/userWallets/${walletId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get wallet by ID');
      }
      throw new Error('Failed to get wallet by ID. Please check your network connection.');
    }
  },

  async getWalletTransactions(walletId: string, filters = {}): Promise<any> {
    try {
      const response = await finance.get(`/userWalletTransactions/${walletId}`, { params: filters });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get wallet transactions');
      }
      throw new Error('Failed to get wallet transactions. Please check your network connection.');
    }
  },

  // Create a new wallet
  async createWallet(walletData: any): Promise<any> {
    try {
      const response = await finance.post('/wallets', walletData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create wallet');
      }
      throw new Error('Failed to create wallet. Please check your network connection.');
    }
  },

  // Delete a wallet
  async deleteWallet(walletId: string): Promise<any> {
    try {
      const response = await finance.delete(`/wallets/${walletId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to delete wallet');
      }
      throw new Error('Failed to delete wallet. Please check your network connection.');
    }
  },

  // Filter wallets
  async filterWallets(filters: any): Promise<any> {
    try {
      const response = await finance.get('/wallets/filter', { params: filters });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to filter wallets');
      }
      throw new Error('Failed to filter wallets. Please check your network connection.');
    }
  },

  // ======== WITHDRAWAL REQUEST ENDPOINTS ========

  // Get all transactions
  async getAllTransactions(filters = {}): Promise<any> {
    try {
      const response = await finance.get('/userWalletTransactions/filter', { params: filters });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get transactions');
      }
      throw new Error('Failed to get transactions. Please check your network connection.');
    }
  },

  // Get a specific transaction
  async getTransaction(transactionId: string): Promise<any> {
    try {
      const response = await finance.get(`/userWalletTransactions/${transactionId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get transaction');
      }
      throw new Error('Failed to get transaction. Please check your network connection.');
    }
  },

  // Get all withdrawal requests
  async getAllWithdrawalRequests(filters = {}): Promise<any> {
    try {
      const response = await finance.get('/withdrawals', { params: filters });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get withdrawal requests');
      }
      throw new Error('Failed to get withdrawal requests. Please check your network connection.');
    }
  },

  async getWithdrawalRequest(requestId: string): Promise<any> {
    try {
      const response = await finance.get(`/withdrawal-requests/${requestId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get withdrawal request');
      }
      throw new Error('Failed to get withdrawal request. Please check your network connection.');
    }
  },

  // Create a withdrawal request
  async createWithdrawalRequest(requestData: any): Promise<any> {
    try {
      const response = await finance.post('/withdrawal-requests', requestData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create withdrawal request');
      }
      throw new Error('Failed to create withdrawal request. Please check your network connection.');
    }
  },

  async getAllWithdrawals(filters = {}): Promise<any> {
    try {
      const response = await finance.get('/withdrawals', { params: filters });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get withdrawals');
      }
      throw new Error('Failed to get withdrawals. Please check your network connection.');
    }
  },

  // ======== TOP-UP ENDPOINTS ========

  // Get all top-ups
  async getAllTopUps(filters = {}): Promise<any> {
    try {
      const response = await finance.get('/deposits/filter', { params: filters });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get top-ups');
      }
      throw new Error('Failed to get top-ups. Please check your network connection.');
    }
  },

  // Get a specific top-up
  async getTopUp(topUpId: string): Promise<any> {
    try {
      const response = await finance.get(`/top-ups/${topUpId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get top-up');
      }
      throw new Error('Failed to get top-up. Please check your network connection.');
    }
  },

  // Create a top-up
  async createTopUp(topUpData: any): Promise<any> {
    try {
      const response = await finance.post('/top-ups', topUpData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create top-up');
      }
      throw new Error('Failed to create top-up. Please check your network connection.');
    }
  },

  // Approve a top-up
  async approveTopUp(topUpId: string): Promise<any> {
    try {
      const response = await finance.patch(`/top-ups/${topUpId}/approve`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to approve top-up');
      }
      throw new Error('Failed to approve top-up. Please check your network connection.');
    }
  },

  // Reject a top-up
  async rejectTopUp(topUpId: string, reason: string): Promise<any> {
    try {
      const response = await finance.patch(`/top-ups/${topUpId}/reject`, { reason });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to reject top-up');
      }
      throw new Error('Failed to reject top-up. Please check your network connection.');
    }
  },

// ======== TARIFF ENDPOINTS ========

// Get all tariffs
async getAllTariffs(): Promise<any[]> {
  try {
    const response = await finance.get('/walletBillings');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get tariffs');
    }
    throw new Error('Failed to get tariffs. Please check your network connection.');
  }
},

async getTariff(tariffId: string): Promise<any> {
  try {
    const response = await finance.get(`/tariffs/${tariffId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get tariff');
    }
    throw new Error('Failed to get tariff. Please check your network connection.');
  }
},

async createTariff(tariffData: Omit<any, 'id'>): Promise<any> {
  try {
    const response = await finance.post('/walletBillings', tariffData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create tariff');
    }
    throw new Error('Failed to create tariff. Please check your network connection.');
  }
},

async updateTariff(tariffId: string, tariffData: Partial<any>): Promise<any> {
  try {
    const response = await finance.put(`/walletBillings/${tariffId}`, tariffData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update tariff');
    }
    throw new Error('Failed to update tariff. Please check your network connection.');
  }
},

async deleteTariff(tariffId: string): Promise<any> {
  try {
    const response = await finance.delete(`/tariffs/${tariffId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete tariff');
    }
    throw new Error('Failed to delete tariff. Please check your network connection.');
  }
},

// ======== FEE RANGE ENDPOINTS ========

async getFeeRangesByTariffId(tariffId: string): Promise<any[]> {
  try {
    const response = await finance.get(`/fee-ranges?walletBillingId=${tariffId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get fee ranges');
    }
    throw new Error('Failed to get fee ranges. Please check your network connection.');
  }
},

async createFixedRange(feeRangeData: Omit<any, 'id'>): Promise<any> {
  try {
    const response = await finance.post('/walletBillingFixedRanges', feeRangeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create fee range');
    }
    throw new Error('Failed to create fee range. Please check your network connection.');
  }
},

async createPercentageFeeRange(feeRangeData: Omit<any, 'id'>): Promise<any> {
  try {
    const response = await finance.post('/walletBillingPercentageRanges', feeRangeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create percentage fee range');
    }
    throw new Error('Failed to create percentage fee range. Please check your network connection.');
  }
},

async updateFixedRange (feeRangeId: string, feeRangeData: Partial<Omit<any, 'id' | 'walletBillingId'>>): Promise<any> {
  try {
    const response = await finance.put(`/walletBillingFixedRanges/${feeRangeId}`, feeRangeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update fixed range');
    }
    throw new Error('Failed to update fixed range. Please check your network connection.');
  }
},

async updatePercentageFeeRange(feeRangeId: string, feeRangeData: Partial<Omit<any, 'id' | 'walletBillingId'>>): Promise<any> {
  try {
    const response = await finance.put(`/walletBillingPercentageRanges/${feeRangeId}`, feeRangeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update percentage fee range');
    }
    throw new Error('Failed to update percentage fee range. Please check your network connection.');
  }
},

async deleteFixedRange(feeRangeId: string): Promise<any> {
  try {
    const response = await finance.delete(`/walletBillingFixedRanges/${feeRangeId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete fee range');
    }
    throw new Error('Failed to delete fee range. Please check your network connection.');
  }
},

async deletePercentageFeeRange(feeRangeId: string): Promise<any> {
  try {
    const response = await finance.delete(`/walletBillingPercentageRanges/${feeRangeId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete percentage fee range');
    }
    throw new Error('Failed to delete percentage fee range. Please check your network connection.');
  }
  },

// ======== WALLET REFUND  ========
async getRefunds(filters = {}): Promise<any> {
  try {
    const response = await finance.get('/walletRefunds', {params: filters });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get reversal requests');
    }
    throw new Error('Failed to get reversal requests. Please check your network connection.');
  }
},

async getRefund(refundId: string): Promise<any> {
  try {
    const response = await finance.get(`/walletRefunds/${refundId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get refund');
    }
    throw new Error('Failed to get refund. Please check your network connection.');
  }
},

async approveRefund(refundId: string): Promise<any> {
  try {
    const response = await finance.put(`/walletRefunds/${refundId}/approve`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to approve refund');
    }
    throw new Error('Failed to approve refund. Please check your network connection.');
  }
},

async rejectRefund(refundId: string, reason: string): Promise<any> {
  try {
    const response = await finance.put(`/walletRefunds/${refundId}/reject`, { reason });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to reject refund');
    }
    throw new Error('Failed to reject refund. Please check your network connection.');
  }
},

// ======== antimoney laundering ========

async getAMLChecks(filters = {}): Promise<any> {
  try {
    const response = await finance.get('/amlAlerts', { params: filters });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get AML checks');
    }
    throw new Error('Failed to get AML checks. Please check your network connection.');
  }
},

async getAllBlacklistEntries(filters = {}): Promise<any> {
  try {
    const response = await finance.get('/blackList', { params: filters });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get blacklist entries');
    }
    throw new Error('Failed to get blacklist entries. Please check your network connection.');
  }
},
};

export default financeService;
