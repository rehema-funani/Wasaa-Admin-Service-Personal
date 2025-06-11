// src/services/financeService.ts
import { useFinanceStore } from '../../stores/financeStore';
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

/**
 * Modern Finance Service
 *
 * This service provides a backward-compatible API for existing components
 * while leveraging the Zustand store for state management.
 */
class FinanceService {
  // ======== CURRENCY ENDPOINTS ========
  async getAllCurrencies(): Promise<Currency[]> {
    try {
      return await useFinanceStore.getState().fetchCurrencies();
    } catch (error) {
      this.handleError(error, 'Failed to get currencies');
    }
  }

  async getCurrency(currencyId: string): Promise<Currency> {
    try {
      return await useFinanceStore.getState().fetchCurrency(currencyId);
    } catch (error) {
      this.handleError(error, `Failed to get currency ${currencyId}`);
    }
  }

  async createCurrency(currencyData: Omit<Currency, 'id'>): Promise<Currency> {
    try {
      return await useFinanceStore.getState().createCurrency(currencyData);
    } catch (error) {
      this.handleError(error, 'Failed to create currency');
    }
  }

  async updateCurrency(currencyId: string, currencyData: Partial<Currency>): Promise<Currency> {
    try {
      return await useFinanceStore.getState().updateCurrency(currencyId, currencyData);
    } catch (error) {
      this.handleError(error, `Failed to update currency ${currencyId}`);
    }
  }

  async deleteCurrency(currencyId: string): Promise<void> {
    try {
      await useFinanceStore.getState().deleteCurrency(currencyId);
    } catch (error) {
      this.handleError(error, `Failed to delete currency ${currencyId}`);
    }
  }

  // ======== PAYMENT METHOD ENDPOINTS ========
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      return await useFinanceStore.getState().fetchPaymentMethods();
    } catch (error) {
      this.handleError(error, 'Failed to get payment methods');
    }
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      return await useFinanceStore.getState().fetchPaymentMethod(id);
    } catch (error) {
      this.handleError(error, `Failed to get payment method ${id}`);
    }
  }

  async createPaymentMethod(methodData: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    try {
      return await useFinanceStore.getState().createPaymentMethod(methodData);
    } catch (error) {
      this.handleError(error, 'Failed to create payment method');
    }
  }

  async updatePaymentMethod(methodId: string, methodData: Partial<PaymentMethod>): Promise<PaymentMethod> {
    try {
      return await useFinanceStore.getState().updatePaymentMethod(methodId, methodData);
    } catch (error) {
      this.handleError(error, `Failed to update payment method ${methodId}`);
    }
  }

  async deletePaymentMethod(methodId: string): Promise<void> {
    try {
      await useFinanceStore.getState().deletePaymentMethod(methodId);
    } catch (error) {
      this.handleError(error, `Failed to delete payment method ${methodId}`);
    }
  }

  async togglePaymentMethodStatus(methodId: string): Promise<PaymentMethod> {
    try {
      return await useFinanceStore.getState().togglePaymentMethodStatus(methodId);
    } catch (error) {
      this.handleError(error, `Failed to toggle payment method status ${methodId}`);
    }
  }

  // ======== USER WALLET ENDPOINTS ========
  async getAllWallets(filters: FilterOptions = {}): Promise<Wallet[]> {
    try {
      return await useFinanceStore.getState().fetchWallets(filters);
    } catch (error) {
      this.handleError(error, 'Failed to get wallets');
    }
  }

  async getWallet(walletId: string): Promise<Wallet> {
    try {
      return await useFinanceStore.getState().fetchWallet(walletId);
    } catch (error) {
      this.handleError(error, `Failed to get wallet ${walletId}`);
    }
  }

  async getWalletById(walletId: string): Promise<Wallet> {
    return this.getWallet(walletId);
  }

  async getWalletTransactions(walletId: string, filters: FilterOptions = {}): Promise<Transaction[]> {
    try {
      return await useFinanceStore.getState().fetchWalletTransactions(walletId, filters);
    } catch (error) {
      this.handleError(error, `Failed to get wallet transactions for ${walletId}`);
    }
  }

  async createWallet(walletData: any): Promise<Wallet> {
    try {
      return await useFinanceStore.getState().createWallet(walletData);
    } catch (error) {
      this.handleError(error, 'Failed to create wallet');
    }
  }

  async deleteWallet(walletId: string): Promise<void> {
    try {
      await useFinanceStore.getState().deleteWallet(walletId);
    } catch (error) {
      this.handleError(error, `Failed to delete wallet ${walletId}`);
    }
  }

  async filterWallets(filters: FilterOptions): Promise<Wallet[]> {
    return this.getAllWallets(filters);
  }

  // ======== TRANSACTION ENDPOINTS ========
  async getAllTransactions(filters: FilterOptions = {}): Promise<Transaction[]> {
    try {
      return await useFinanceStore.getState().fetchTransactions(filters);
    } catch (error) {
      this.handleError(error, 'Failed to get transactions');
    }
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    try {
      return await useFinanceStore.getState().fetchTransaction(transactionId);
    } catch (error) {
      this.handleError(error, `Failed to get transaction ${transactionId}`);
    }
  }

  // ======== WITHDRAWAL REQUEST ENDPOINTS ========
  async getAllWithdrawalRequests(filters: FilterOptions = {}): Promise<WithdrawalRequest[]> {
    try {
      return await useFinanceStore.getState().fetchWithdrawalRequests(filters);
    } catch (error) {
      this.handleError(error, 'Failed to get withdrawal requests');
    }
  }

  async getWithdrawalRequest(requestId: string): Promise<WithdrawalRequest> {
    try {
      return await useFinanceStore.getState().fetchWithdrawalRequest(requestId);
    } catch (error) {
      this.handleError(error, `Failed to get withdrawal request ${requestId}`);
    }
  }

  async createWithdrawalRequest(requestData: any): Promise<WithdrawalRequest> {
    try {
      return await useFinanceStore.getState().createWithdrawalRequest(requestData);
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
      return await useFinanceStore.getState().fetchTopUps(filters);
    } catch (error) {
      this.handleError(error, 'Failed to get top-ups');
    }
  }

  async getTopUp(topUpId: string): Promise<TopUp> {
    try {
      return await useFinanceStore.getState().fetchTopUp(topUpId);
    } catch (error) {
      this.handleError(error, `Failed to get top-up ${topUpId}`);
    }
  }

  async createTopUp(topUpData: any): Promise<TopUp> {
    try {
      return await useFinanceStore.getState().createTopUp(topUpData);
    } catch (error) {
      this.handleError(error, 'Failed to create top-up');
    }
  }

  async approveTopUp(topUpId: string): Promise<TopUp> {
    try {
      return await useFinanceStore.getState().approveTopUp(topUpId);
    } catch (error) {
      this.handleError(error, `Failed to approve top-up ${topUpId}`);
    }
  }

  async rejectTopUp(topUpId: string, reason: string): Promise<TopUp> {
    try {
      return await useFinanceStore.getState().rejectTopUp(topUpId, reason);
    } catch (error) {
      this.handleError(error, `Failed to reject top-up ${topUpId}`);
    }
  }

  // ======== TARIFF ENDPOINTS ========
  async getAllTariffs(): Promise<Tariff[]> {
    try {
      return await useFinanceStore.getState().fetchTariffs();
    } catch (error) {
      this.handleError(error, 'Failed to get tariffs');
    }
  }

  async getTariff(tariffId: string): Promise<Tariff> {
    try {
      return await useFinanceStore.getState().fetchTariff(tariffId);
    } catch (error) {
      this.handleError(error, `Failed to get tariff ${tariffId}`);
    }
  }

  async createTariff(tariffData: Omit<Tariff, 'id'>): Promise<Tariff> {
    try {
      return await useFinanceStore.getState().createTariff(tariffData);
    } catch (error) {
      this.handleError(error, 'Failed to create tariff');
    }
  }

  async updateTariff(tariffId: string, tariffData: Partial<Tariff>): Promise<Tariff> {
    try {
      return await useFinanceStore.getState().updateTariff(tariffId, tariffData);
    } catch (error) {
      this.handleError(error, `Failed to update tariff ${tariffId}`);
    }
  }

  async deleteTariff(tariffId: string): Promise<void> {
    try {
      await useFinanceStore.getState().deleteTariff(tariffId);
    } catch (error) {
      this.handleError(error, `Failed to delete tariff ${tariffId}`);
    }
  }

  // ======== FEE RANGE ENDPOINTS ========
  async getFeeRangesByTariffId(tariffId: string): Promise<FeeRange[]> {
    try {
      return await useFinanceStore.getState().fetchFeeRanges(tariffId);
    } catch (error) {
      this.handleError(error, `Failed to get fee ranges for tariff ${tariffId}`);
    }
  }

  async createFixedRange(feeRangeData: Omit<FeeRange, 'id'>): Promise<FeeRange> {
    try {
      return await useFinanceStore.getState().createFixedRange(feeRangeData);
    } catch (error) {
      this.handleError(error, 'Failed to create fixed range');
    }
  }

  async createPercentageFeeRange(feeRangeData: Omit<FeeRange, 'id'>): Promise<FeeRange> {
    try {
      return await useFinanceStore.getState().createPercentageFeeRange(feeRangeData);
    } catch (error) {
      this.handleError(error, 'Failed to create percentage fee range');
    }
  }

  async updateFixedRange(feeRangeId: string, feeRangeData: Partial<Omit<FeeRange, 'id' | 'walletBillingId'>>): Promise<FeeRange> {
    try {
      return await useFinanceStore.getState().updateFixedRange(feeRangeId, feeRangeData);
    } catch (error) {
      this.handleError(error, `Failed to update fixed range ${feeRangeId}`);
    }
  }

  async updatePercentageFeeRange(feeRangeId: string, feeRangeData: Partial<Omit<FeeRange, 'id' | 'walletBillingId'>>): Promise<FeeRange> {
    try {
      return await useFinanceStore.getState().updatePercentageFeeRange(feeRangeId, feeRangeData);
    } catch (error) {
      this.handleError(error, `Failed to update percentage fee range ${feeRangeId}`);
    }
  }

  async deleteFixedRange(feeRangeId: string): Promise<void> {
    try {
      await useFinanceStore.getState().deleteFixedRange(feeRangeId);
    } catch (error) {
      this.handleError(error, `Failed to delete fixed range ${feeRangeId}`);
    }
  }

  async deletePercentageFeeRange(feeRangeId: string): Promise<void> {
    try {
      await useFinanceStore.getState().deletePercentageFeeRange(feeRangeId);
    } catch (error) {
      this.handleError(error, `Failed to delete percentage fee range ${feeRangeId}`);
    }
  }

  // ======== WALLET REFUND ENDPOINTS ========
  async getRefunds(filters: FilterOptions = {}): Promise<Refund[]> {
    try {
      return await useFinanceStore.getState().fetchRefunds(filters);
    } catch (error) {
      this.handleError(error, 'Failed to get refunds');
    }
  }

  async getRefund(refundId: string): Promise<Refund> {
    try {
      return await useFinanceStore.getState().fetchRefund(refundId);
    } catch (error) {
      this.handleError(error, `Failed to get refund ${refundId}`);
    }
  }

  async approveRefund(refundId: string): Promise<Refund> {
    try {
      return await useFinanceStore.getState().approveRefund(refundId);
    } catch (error) {
      this.handleError(error, `Failed to approve refund ${refundId}`);
    }
  }

  async rejectRefund(refundId: string, reason: string): Promise<Refund> {
    try {
      return await useFinanceStore.getState().rejectRefund(refundId, reason);
    } catch (error) {
      this.handleError(error, `Failed to reject refund ${refundId}`);
    }
  }

  // ======== ANTI-MONEY LAUNDERING ENDPOINTS ========
  async getAMLChecks(filters: FilterOptions = {}): Promise<AmlAlert[]> {
    try {
      return await useFinanceStore.getState().fetchAmlAlerts(filters);
    } catch (error) {
      this.handleError(error, 'Failed to get AML checks');
    }
  }

  async getAllBlacklistEntries(filters: FilterOptions = {}): Promise<any[]> {
    try {
      return await useFinanceStore.getState().fetchBlacklistEntries(filters);
    } catch (error) {
      this.handleError(error, 'Failed to get blacklist entries');
    }
  }

  // ======== BANK ENDPOINTS ========
  async getAllBanks(): Promise<Bank[]> {
    try {
      return await useFinanceStore.getState().fetchBanks();
    } catch (error) {
      this.handleError(error, 'Failed to get banks');
    }
  }

  async addBank(bankData: Omit<Bank, 'id'>): Promise<Bank> {
    try {
      return await useFinanceStore.getState().createBank(bankData);
    } catch (error) {
      this.handleError(error, 'Failed to add bank');
    }
  }

  async updateBank(bankId: string, bankData: Partial<Bank>): Promise<Bank> {
    try {
      return await useFinanceStore.getState().updateBank(bankId, bankData);
    } catch (error) {
      this.handleError(error, `Failed to update bank ${bankId}`);
    }
  }

  async deleteBank(bankId: string): Promise<void> {
    try {
      await useFinanceStore.getState().deleteBank(bankId);
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
