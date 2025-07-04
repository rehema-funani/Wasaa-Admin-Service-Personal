import type {
  Currency,
  PaymentMethod,
  Wallet,
  WithdrawalRequest,
  TopUp,
  Tariff,
  FeeRange,
  Bank,
  Refund,
  AmlAlert,
  FilterOptions
} from '../../types/finance';
import type { Transaction } from '../../types/transaction';
import { finance } from '../finance-axios';

class FinanceService {
  // ======== CURRENCY ENDPOINTS ========
  async getAllCurrencies(): Promise<Currency[]> {
    try {
      const response = await finance.get('/currencies');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get currencies');
    }
  }

  async getCurrency(currencyId: string): Promise<Currency> {
    try {
      const response = await finance.get(`/currencies/${currencyId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get currency ${currencyId}`);
    }
  }

  async createCurrency(currencyData: Omit<Currency, 'id'>): Promise<Currency> {
    try {
      const response = await finance.post('/currencies', currencyData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create currency');
    }
  }

  async updateCurrency(currencyId: string, currencyData: Partial<Currency>): Promise<Currency> {
    try {
      const response = await finance.put(`/currencies/${currencyId}`, currencyData);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to update currency ${currencyId}`);
    }
  }

  async deleteCurrency(currencyId: string): Promise<void> {
    try {
      await finance.delete(`/currencies/${currencyId}`);
    } catch (error) {
      this.handleError(error, `Failed to delete currency ${currencyId}`);
    }
  }

  // ======== PAYMENT METHOD ENDPOINTS ========
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await finance.get('/paymentMethods');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get payment methods');
    }
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      const response = await finance.get(`/paymentMethods/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get payment method ${id}`);
    }
  }

  async createPaymentMethod(methodData: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    try {
      const response = await finance.post('/payment-methods', methodData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create payment method');
    }
  }

  async updatePaymentMethod(methodId: string, methodData: Partial<PaymentMethod>): Promise<PaymentMethod> {
    try {
      const response = await finance.put(`/payment-methods/${methodId}`, methodData);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to update payment method ${methodId}`);
    }
  }

  async deletePaymentMethod(methodId: string): Promise<void> {
    try {
      await finance.delete(`/payment-methods/${methodId}`);
    } catch (error) {
      this.handleError(error, `Failed to delete payment method ${methodId}`);
    }
  }

  async togglePaymentMethodStatus(methodId: string): Promise<PaymentMethod> {
    try {
      const response = await finance.patch(`/payment-methods/${methodId}/toggle-status`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to toggle payment method status ${methodId}`);
    }
  }

  // ======= SYSTEM WALLET ENDPOINTS ========
  async getSystemWallets(filters: FilterOptions = {}): Promise<Wallet[]> {
    try {
      const response = await finance.get('/wallets/system', { params: filters });
      return response.data.wallets;
    } catch (error) {
      this.handleError(error, 'Failed to get system wallets');
    }
  }

  // ======== USER WALLET ENDPOINTS ========
  async getAllWallets(filters: FilterOptions = {}): Promise<Wallet[]> {
    try {
      const response = await finance.get('/wallets/filter?type=user', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get wallets');
    }
  }

  async getWallet(walletId: string): Promise<Wallet> {
    try {
      const response = await finance.get(`/wallets/${walletId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get wallet ${walletId}`);
    }
  }

  async getWalletById(walletId: string): Promise<Wallet> {
    return this.getWallet(walletId);
  }

  async getWalletTransactions(walletId: string, filters: FilterOptions = {}): Promise<Transaction[]> {
    try {
      const response = await finance.get(`/transactions/${walletId}`, { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get wallet transactions for ${walletId}`);
    }
  }

  async createWallet(walletData: any): Promise<Wallet> {
    try {
      const response = await finance.post('/wallets', walletData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create wallet');
    }
  }

  async deleteWallet(walletId: string): Promise<void> {
    try {
      await finance.delete(`/wallets/${walletId}`);
    } catch (error) {
      this.handleError(error, `Failed to delete wallet ${walletId}`);
    }
  }

  async filterWallets(filters: FilterOptions): Promise<Wallet[]> {
    return this.getAllWallets(filters);
  }

  // ======== TRANSACTION ENDPOINTS ========
  async getAllTransactions(filters: any = {}): Promise<any[]> {
    try {
      const response = await finance.get('/transactions/filter', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get transactions');
    }
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    try {
      const response = await finance.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get transaction ${transactionId}`);
    }
  }

  // ======== WITHDRAWAL REQUEST ENDPOINTS ========
  async getAllWithdrawalRequests(filters: FilterOptions = {}): Promise<WithdrawalRequest[]> {
    try {
      const response = await finance.get('/withdrawals', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get withdrawal requests');
    }
  }

  async getWithdrawalRequest(requestId: string): Promise<WithdrawalRequest> {
    try {
      const response = await finance.get(`/withdrawal-requests/${requestId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get withdrawal request ${requestId}`);
    }
  }

  async createWithdrawalRequest(requestData: any): Promise<WithdrawalRequest> {
    try {
      const response = await finance.post('/withdrawal-requests', requestData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create withdrawal request');
    }
  }

  async getAllWithdrawals(filters: FilterOptions = {}): Promise<WithdrawalRequest[]> {
    return this.getAllWithdrawalRequests(filters);
  }

  // ======== TOP-UP ENDPOINTS ========
  async getAllTopUps(filters: FilterOptions = {}): Promise<TopUp[]> {
    try {
      const response = await finance.get('/deposits', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get top-ups');
    }
  }

  async getTopUp(topUpId: string): Promise<TopUp> {
    try {
      const response = await finance.get(`/top-ups/${topUpId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get top-up ${topUpId}`);
    }
  }

  async createTopUp(topUpData: any): Promise<TopUp> {
    try {
      const response = await finance.post('/top-ups', topUpData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create top-up');
    }
  }

  async approveTopUp(topUpId: string): Promise<TopUp> {
    try {
      const response = await finance.patch(`/top-ups/${topUpId}/approve`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to approve top-up ${topUpId}`);
    }
  }

  async rejectTopUp(topUpId: string, reason: string): Promise<TopUp> {
    try {
      const response = await finance.patch(`/top-ups/${topUpId}/reject`, { reason });
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to reject top-up ${topUpId}`);
    }
  }

  // ======== TARIFF ENDPOINTS ========
  async getAllFeeRules(): Promise<any[]> {
    try {
      const response = await finance.get('/fee-rules');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get tariffs');
    }
  }

  async getFeeRuleById(tariffId: string): Promise<any> {
    try {
      const response = await finance.get(`/fee-rules/${tariffId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get tariff ${tariffId}`);
    }
  }

  async createFeeRule(feeRuleData): Promise<any> {
    try {
      const response = await finance.post('/fee-rules', feeRuleData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create tariff');
    }
  }

  async updateFeeRule(tariffId: string, tariffData): Promise<any> {
    try {
      const response = await finance.put(`/fee-rules/${tariffId}`, tariffData);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to update tariff ${tariffId}`);
    }
  }

  async deleteFeeRule(tariffId: string): Promise<void> {
    try {
      await finance.delete(`/tariffs/${tariffId}`);
    } catch (error) {
      this.handleError(error, `Failed to delete tariff ${tariffId}`);
    }
  }

  // ======== FEE RANGE ENDPOINTS ========
  async getFeeRangesByTariffId(tariffId: string): Promise<FeeRange[]> {
    try {
      const response = await finance.get(`/fee-ranges?walletBillingId=${tariffId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get fee ranges for tariff ${tariffId}`);
    }
  }

  async createFixedRange(feeRangeData: Omit<FeeRange, 'id'>): Promise<FeeRange> {
    try {
      const response = await finance.post('/walletBillingFixedRanges', feeRangeData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create fixed range');
    }
  }

  async createPercentageFeeRange(feeRangeData: Omit<FeeRange, 'id'>): Promise<FeeRange> {
    try {
      const response = await finance.post('/walletBillingPercentageRanges', feeRangeData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create percentage fee range');
    }
  }

  async updateFixedRange(feeRangeId: string, feeRangeData: Partial<Omit<FeeRange, 'id' | 'walletBillingId'>>): Promise<FeeRange> {
    try {
      const response = await finance.put(`/walletBillingFixedRanges/${feeRangeId}`, feeRangeData);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to update fixed range ${feeRangeId}`);
    }
  }

  async updatePercentageFeeRange(feeRangeId: string, feeRangeData: Partial<Omit<FeeRange, 'id' | 'walletBillingId'>>): Promise<FeeRange> {
    try {
      const response = await finance.put(`/walletBillingPercentageRanges/${feeRangeId}`, feeRangeData);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to update percentage fee range ${feeRangeId}`);
    }
  }

  async deleteFixedRange(feeRangeId: string): Promise<void> {
    try {
      await finance.delete(`/walletBillingFixedRanges/${feeRangeId}`);
    } catch (error) {
      this.handleError(error, `Failed to delete fixed range ${feeRangeId}`);
    }
  }

  async deletePercentageFeeRange(feeRangeId: string): Promise<void> {
    try {
      await finance.delete(`/walletBillingPercentageRanges/${feeRangeId}`);
    } catch (error) {
      this.handleError(error, `Failed to delete percentage fee range ${feeRangeId}`);
    }
  }

  // ======== WALLET REFUND ENDPOINTS ========
  async getRefunds(filters: FilterOptions = {}): Promise<Refund[]> {
    try {
      const response = await finance.get('/disputes', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get refunds');
    }
  }

  async getRefund(refundId: string): Promise<Refund> {
    try {
      const response = await finance.get(`/disputes/${refundId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get refund ${refundId}`);
    }
  }

  async approveRefund(refundId: string): Promise<Refund> {
    try {
      const response = await finance.put(`/walletRefunds/${refundId}/approve`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to approve refund ${refundId}`);
    }
  }

  async rejectRefund(refundId: string, reason: string): Promise<Refund> {
    try {
      const response = await finance.put(`/walletRefunds/${refundId}/reject`, { reason });
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to reject refund ${refundId}`);
    }
  }

  // ======== ANTI-MONEY LAUNDERING ENDPOINTS ========
  async getAMLChecks(filters: FilterOptions = {}): Promise<AmlAlert[]> {
    try {
      const response = await finance.get('/amlAlerts', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get AML checks');
    }
  }

  async getAllBlacklistEntries(filters: FilterOptions = {}): Promise<any[]> {
    try {
      const response = await finance.get('/blackList', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get blacklist entries');
    }
  }

  // ======== BANK ENDPOINTS ========
  async getAllBanks(): Promise<Bank[]> {
    try {
      const response = await finance.get('/banks');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get banks');
    }
  }

  async addBank(bankData: Omit<Bank, 'id'>): Promise<Bank> {
    try {
      const response = await finance.post('/banks', bankData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to add bank');
    }
  }

  async updateBank(bankId: string, bankData: Partial<Bank>): Promise<Bank> {
    try {
      const response = await finance.put(`/banks/${bankId}`, bankData);
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to update bank ${bankId}`);
    }
  }

  async deleteBank(bankId: string): Promise<void> {
    try {
      await finance.delete(`/banks/${bankId}`);
    } catch (error) {
      this.handleError(error, `Failed to delete bank ${bankId}`);
    }
  }

  // Error handling helper
  private handleError(error: unknown, fallbackMessage: string): never {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(fallbackMessage);
  }
}

// Export singleton instance
export const financeService = new FinanceService();

// Export default for backward compatibility
export default financeService;
