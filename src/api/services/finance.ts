import axios from 'axios';
import { finance } from '../finance-axios';

export const financeService = {
  // ======== CURRENCY ENDPOINTS ========
  
  // Get all currencies
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

  // Create a new currency
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

  // Update a currency
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

  // Delete a currency
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

  // Get all payment methods
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

  // Get a specific payment method
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

  // Create a new payment method
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

  // Update a payment method
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

  // Delete a payment method
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

  // Toggle payment method status (active/inactive)
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

  // Get all user wallets
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

  // Get a specific user wallet
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

  // Get all withdrawal requests
  async getAllWithdrawalRequests(filters = {}): Promise<any> {
    try {
      const response = await finance.get('/withdrawal-requests', { params: filters });
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
  }
};

export default financeService;