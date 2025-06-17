import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { finance } from '../api/finance-axios';
import { Transaction } from '../types/transaction';
import { AmlAlert, AMLAlert, Bank, Currency, FeeRange, FilterOptions, PaymentMethod, Refund, Tariff, TopUp, Wallet, WithdrawalRequest } from '../types/finance';

// Define the state interface
interface FinanceState {
  // Entity maps for normalized state
  currencies: Record<string, Currency>;
  paymentMethods: Record<string, PaymentMethod>;
  wallets: Record<string, Wallet>;
  transactions: Record<string, Transaction>;
  withdrawalRequests: Record<string, WithdrawalRequest>;
  topUps: Record<string, TopUp>;
  tariffs: Record<string, Tariff>;
  feeRanges: Record<string, FeeRange[]>;
  banks: Record<string, Bank>;
  refunds: Record<string, Refund>;
  amlAlerts: Record<string, AMLAlert>;

  // Loading states
  loading: {
    currencies: boolean;
    paymentMethods: boolean;
    wallets: boolean;
    transactions: boolean;
    withdrawalRequests: boolean;
    topUps: boolean;
    tariffs: boolean;
    feeRanges: boolean;
    banks: boolean;
    refunds: boolean;
    amlAlerts: boolean;
  };

  // Error states
  errors: {
    currencies?: string;
    paymentMethods?: string;
    wallets?: string;
    transactions?: string;
    withdrawalRequests?: string;
    topUps?: string;
    tariffs?: string;
    feeRanges?: string;
    banks?: string;
    refunds?: string;
    amlAlerts?: string;
  };

  // Action creators for currencies
  fetchCurrencies: () => Promise<Currency[]>;
  fetchCurrency: (id: string) => Promise<Currency>;
  createCurrency: (data: Omit<Currency, 'id'>) => Promise<Currency>;
  updateCurrency: (id: string, data: Partial<Currency>) => Promise<Currency>;
  deleteCurrency: (id: string) => Promise<void>;

  // Action creators for payment methods
  fetchPaymentMethods: () => Promise<PaymentMethod[]>;
  fetchPaymentMethod: (id: string) => Promise<PaymentMethod>;
  createPaymentMethod: (data: Omit<PaymentMethod, 'id'>) => Promise<PaymentMethod>;
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => Promise<PaymentMethod>;
  deletePaymentMethod: (id: string) => Promise<void>;
  togglePaymentMethodStatus: (id: string) => Promise<PaymentMethod>;

  // Action creators for wallets
  fetchWallets: (filters?: FilterOptions) => Promise<Wallet[]>;
  fetchWallet: (id: string) => Promise<Wallet>;
  createWallet: (data: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Wallet>;
  deleteWallet: (id: string) => Promise<void>;

  // Action creators for transactions
  fetchTransactions: (filters?: FilterOptions) => Promise<Transaction[]>;
  fetchTransaction: (id: string) => Promise<Transaction>;
  fetchWalletTransactions: (walletId: string, filters?: FilterOptions) => Promise<Transaction[]>;

  // Action creators for withdrawal requests
  fetchWithdrawalRequests: (filters?: FilterOptions) => Promise<WithdrawalRequest[]>;
  fetchWithdrawalRequest: (id: string) => Promise<WithdrawalRequest>;
  createWithdrawalRequest: (data: Omit<WithdrawalRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<WithdrawalRequest>;

  // Action creators for top-ups
  fetchTopUps: (filters?: FilterOptions) => Promise<TopUp[]>;
  fetchTopUp: (id: string) => Promise<TopUp>;
  createTopUp: (data: Omit<TopUp, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<TopUp>;
  approveTopUp: (id: string) => Promise<TopUp>;
  rejectTopUp: (id: string, reason: string) => Promise<TopUp>;

  // Action creators for tariffs
  fetchTariffs: () => Promise<Tariff[]>;
  fetchTariff: (id: string) => Promise<Tariff>;
  createTariff: (data: Omit<Tariff, 'id'>) => Promise<Tariff>;
  updateTariff: (id: string, data: Partial<Tariff>) => Promise<Tariff>;
  deleteTariff: (id: string) => Promise<void>;

  // Action creators for fee ranges
  fetchFeeRanges: (tariffId: string) => Promise<FeeRange[]>;
  createFixedRange: (data: Omit<FeeRange, 'id'>) => Promise<FeeRange>;
  createPercentageFeeRange: (data: Omit<FeeRange, 'id'>) => Promise<FeeRange>;
  updateFixedRange: (id: string, data: Partial<Omit<FeeRange, 'id' | 'walletBillingId'>>) => Promise<FeeRange>;
  updatePercentageFeeRange: (id: string, data: Partial<Omit<FeeRange, 'id' | 'walletBillingId'>>) => Promise<FeeRange>;
  deleteFixedRange: (id: string) => Promise<void>;
  deletePercentageFeeRange: (id: string) => Promise<void>;

  // Action creators for banks
  fetchBanks: () => Promise<Bank[]>;
  createBank: (data: Omit<Bank, 'id'>) => Promise<Bank>;
  updateBank: (id: string, data: Partial<Bank>) => Promise<Bank>;
  deleteBank: (id: string) => Promise<void>;

  // Action creators for refunds
  fetchRefunds: (filters?: FilterOptions) => Promise<Refund[]>;
  fetchRefund: (id: string) => Promise<Refund>;
  approveRefund: (id: string) => Promise<Refund>;
  rejectRefund: (id: string, reason: string) => Promise<Refund>;

  // Action creators for AML
  fetchAmlAlerts: (filters?: FilterOptions) => Promise<AmlAlert[]>;
  fetchBlacklistEntries: (filters?: FilterOptions) => Promise<any[]>;

  // Utility actions
  clearErrors: () => void;
  resetStore: () => void;
}

// Helper function to convert arrays to record objects
const arrayToRecord = <T extends { id: string }>(array: T[]): Record<string, T> => {
  return array.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, T>);
};

// Create the finance store
export const useFinanceStore = create<FinanceState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      currencies: {},
      paymentMethods: {},
      wallets: {},
      transactions: {},
      withdrawalRequests: {},
      topUps: {},
      tariffs: {},
      feeRanges: {},
      banks: {},
      refunds: {},
      amlAlerts: {},

      loading: {
        currencies: false,
        paymentMethods: false,
        wallets: false,
        transactions: false,
        withdrawalRequests: false,
        topUps: false,
        tariffs: false,
        feeRanges: false,
        banks: false,
        refunds: false,
        amlAlerts: false,
      },

      errors: {},

      // Currency actions
      fetchCurrencies: async () => {
        set(state => { state.loading.currencies = true; state.errors.currencies = undefined; });

        try {
          const response = await finance.get('/currencies');
          const currencies = response.data;

          set(state => {
            state.currencies = arrayToRecord(currencies);
            state.loading.currencies = false;
          });

          return currencies;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch currencies';

          set(state => {
            state.errors.currencies = errorMessage;
            state.loading.currencies = false;
          });

          throw error;
        }
      },

      fetchCurrency: async (id) => {
        try {
          const response = await finance.get(`/currencies/${id}`);
          const currency = response.data;

          set(state => {
            state.currencies[id] = currency;
          });

          return currency;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch currency ${id}`;

          set(state => {
            state.errors.currencies = errorMessage;
          });

          throw error;
        }
      },

      createCurrency: async (data) => {
        try {
          const response = await finance.post('/currencies', data);
          const currency = response.data;

          set(state => {
            state.currencies[currency.id] = currency;
          });

          return currency;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create currency';

          set(state => {
            state.errors.currencies = errorMessage;
          });

          throw error;
        }
      },

      updateCurrency: async (id, data) => {
        try {
          const response = await finance.put(`/currencies/${id}`, data);
          const currency = response.data;

          set(state => {
            state.currencies[id] = currency;
          });

          return currency;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to update currency ${id}`;

          set(state => {
            state.errors.currencies = errorMessage;
          });

          throw error;
        }
      },

      deleteCurrency: async (id) => {
        try {
          await finance.delete(`/currencies/${id}`);

          set(state => {
            delete state.currencies[id];
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to delete currency ${id}`;

          set(state => {
            state.errors.currencies = errorMessage;
          });

          throw error;
        }
      },

      // Payment method actions
      fetchPaymentMethods: async () => {
        set(state => { state.loading.paymentMethods = true; state.errors.paymentMethods = undefined; });

        try {
          const response = await finance.get('/paymentMethods');
          const paymentMethods = response.data;

          set(state => {
            state.paymentMethods = arrayToRecord(paymentMethods);
            state.loading.paymentMethods = false;
          });

          return paymentMethods;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payment methods';

          set(state => {
            state.errors.paymentMethods = errorMessage;
            state.loading.paymentMethods = false;
          });

          throw error;
        }
      },

      fetchPaymentMethod: async (id) => {
        try {
          const response = await finance.get(`/paymentMethods/${id}`);
          const paymentMethod = response.data;

          set(state => {
            state.paymentMethods[id] = paymentMethod;
          });

          return paymentMethod;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch payment method ${id}`;

          set(state => {
            state.errors.paymentMethods = errorMessage;
          });

          throw error;
        }
      },

      createPaymentMethod: async (data) => {
        try {
          const response = await finance.post('/payment-methods', data);
          const paymentMethod = response.data;

          set(state => {
            state.paymentMethods[paymentMethod.id] = paymentMethod;
          });

          return paymentMethod;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create payment method';

          set(state => {
            state.errors.paymentMethods = errorMessage;
          });

          throw error;
        }
      },

      updatePaymentMethod: async (id, data) => {
        try {
          const response = await finance.put(`/payment-methods/${id}`, data);
          const paymentMethod = response.data;

          set(state => {
            state.paymentMethods[id] = paymentMethod;
          });

          return paymentMethod;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to update payment method ${id}`;

          set(state => {
            state.errors.paymentMethods = errorMessage;
          });

          throw error;
        }
      },

      deletePaymentMethod: async (id) => {
        try {
          await finance.delete(`/payment-methods/${id}`);

          set(state => {
            delete state.paymentMethods[id];
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to delete payment method ${id}`;

          set(state => {
            state.errors.paymentMethods = errorMessage;
          });

          throw error;
        }
      },

      togglePaymentMethodStatus: async (id) => {
        try {
          const response = await finance.patch(`/payment-methods/${id}/toggle-status`);
          const paymentMethod = response.data;

          set(state => {
            state.paymentMethods[id] = paymentMethod;
          });

          return paymentMethod;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to toggle payment method status ${id}`;

          set(state => {
            state.errors.paymentMethods = errorMessage;
          });

          throw error;
        }
      },

      // Wallet actions
      fetchWallets: async (filters = {}) => {
        set(state => { state.loading.wallets = true; state.errors.wallets = undefined; });

        try {
          const response = await finance.get('/userWallets', { params: filters });
          const wallets = response.data;

          set(state => {
            // Merge with existing wallets rather than replacing
            state.wallets = {
              ...state.wallets,
              ...arrayToRecord(wallets)
            };
            state.loading.wallets = false;
          });

          return wallets;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallets';

          set(state => {
            state.errors.wallets = errorMessage;
            state.loading.wallets = false;
          });

          throw error;
        }
      },

      fetchWallet: async (id) => {
        try {
          const response = await finance.get(`/userWallets/${id}`);
          const wallet = response.data;

          set(state => {
            state.wallets[id] = wallet;
          });

          return wallet;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch wallet ${id}`;

          set(state => {
            state.errors.wallets = errorMessage;
          });

          throw error;
        }
      },

      createWallet: async (data) => {
        try {
          const response = await finance.post('/wallets', data);
          const wallet = response.data;

          set(state => {
            state.wallets[wallet.id] = wallet;
          });

          return wallet;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create wallet';

          set(state => {
            state.errors.wallets = errorMessage;
          });

          throw error;
        }
      },

      deleteWallet: async (id) => {
        try {
          await finance.delete(`/wallets/${id}`);

          set(state => {
            delete state.wallets[id];
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to delete wallet ${id}`;

          set(state => {
            state.errors.wallets = errorMessage;
          });

          throw error;
        }
      },

      fetchTransactions: async (filters = {}) => {
        set(state => { state.loading.transactions = true; state.errors.transactions = undefined; });

        try {
          const response = await finance.get('/transactions/filter', { params: filters });
          const transactions = response.data;

          set(state => {
            state.transactions = {
              ...state.transactions,
              ...arrayToRecord(transactions)
            };
            state.loading.transactions = false;
          });

          return transactions;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';

          set(state => {
            state.errors.transactions = errorMessage;
            state.loading.transactions = false;
          });

          throw error;
        }
      },

      fetchTransaction: async (id) => {
        try {
          const response = await finance.get(`/userWalletTransactions/${id}`);
          const transaction = response.data;

          set(state => {
            state.transactions[id] = transaction;
          });

          return transaction;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch transaction ${id}`;

          set(state => {
            state.errors.transactions = errorMessage;
          });

          throw error;
        }
      },

      fetchWalletTransactions: async (walletId, filters = {}) => {
        try {
          const response = await finance.get(`/userWalletTransactions/${walletId}`, { params: filters });
          const transactions = response.data;

          set(state => {
            // Add to existing transactions
            transactions.forEach((transaction: Transaction) => {
              state.transactions[transaction.id] = transaction;
            });
          });

          return transactions;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch wallet transactions for ${walletId}`;

          set(state => {
            state.errors.transactions = errorMessage;
          });

          throw error;
        }
      },

      // Withdrawal request actions
      fetchWithdrawalRequests: async (filters = {}) => {
        set(state => { state.loading.withdrawalRequests = true; state.errors.withdrawalRequests = undefined; });

        try {
          const response = await finance.get('/withdrawals', { params: filters });
          const withdrawalRequests = response.data;

          set(state => {
            state.withdrawalRequests = {
              ...state.withdrawalRequests,
              ...arrayToRecord(withdrawalRequests)
            };
            state.loading.withdrawalRequests = false;
          });

          return withdrawalRequests;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch withdrawal requests';

          set(state => {
            state.errors.withdrawalRequests = errorMessage;
            state.loading.withdrawalRequests = false;
          });

          throw error;
        }
      },

      fetchWithdrawalRequest: async (id) => {
        try {
          const response = await finance.get(`/withdrawal-requests/${id}`);
          const withdrawalRequest = response.data;

          set(state => {
            state.withdrawalRequests[id] = withdrawalRequest;
          });

          return withdrawalRequest;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch withdrawal request ${id}`;

          set(state => {
            state.errors.withdrawalRequests = errorMessage;
          });

          throw error;
        }
      },

      createWithdrawalRequest: async (data) => {
        try {
          const response = await finance.post('/withdrawal-requests', data);
          const withdrawalRequest = response.data;

          set(state => {
            state.withdrawalRequests[withdrawalRequest.id] = withdrawalRequest;
          });

          return withdrawalRequest;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create withdrawal request';

          set(state => {
            state.errors.withdrawalRequests = errorMessage;
          });

          throw error;
        }
      },

      // Top-up actions
      fetchTopUps: async (filters = {}) => {
        set(state => { state.loading.topUps = true; state.errors.topUps = undefined; });

        try {
          const response = await finance.get('/deposits/filter', { params: filters });
          const topUps = response.data;

          set(state => {
            state.topUps = {
              ...state.topUps,
              ...arrayToRecord(topUps)
            };
            state.loading.topUps = false;
          });

          return topUps;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch top-ups';

          set(state => {
            state.errors.topUps = errorMessage;
            state.loading.topUps = false;
          });

          throw error;
        }
      },

      fetchTopUp: async (id) => {
        try {
          const response = await finance.get(`/top-ups/${id}`);
          const topUp = response.data;

          set(state => {
            state.topUps[id] = topUp;
          });

          return topUp;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch top-up ${id}`;

          set(state => {
            state.errors.topUps = errorMessage;
          });

          throw error;
        }
      },

      createTopUp: async (data) => {
        try {
          const response = await finance.post('/top-ups', data);
          const topUp = response.data;

          set(state => {
            state.topUps[topUp.id] = topUp;
          });

          return topUp;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create top-up';

          set(state => {
            state.errors.topUps = errorMessage;
          });

          throw error;
        }
      },

      approveTopUp: async (id) => {
        try {
          const response = await finance.patch(`/top-ups/${id}/approve`);
          const topUp = response.data;

          set(state => {
            state.topUps[id] = topUp;
          });

          return topUp;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to approve top-up ${id}`;

          set(state => {
            state.errors.topUps = errorMessage;
          });

          throw error;
        }
      },

      rejectTopUp: async (id, reason) => {
        try {
          const response = await finance.patch(`/top-ups/${id}/reject`, { reason });
          const topUp = response.data;

          set(state => {
            state.topUps[id] = topUp;
          });

          return topUp;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to reject top-up ${id}`;

          set(state => {
            state.errors.topUps = errorMessage;
          });

          throw error;
        }
      },

      // Tariff actions
      fetchTariffs: async () => {
        set(state => { state.loading.tariffs = true; state.errors.tariffs = undefined; });

        try {
          const response = await finance.get('/walletBillings');
          const tariffs = response.data;

          set(state => {
            state.tariffs = arrayToRecord(tariffs);
            state.loading.tariffs = false;
          });

          return tariffs;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tariffs';

          set(state => {
            state.errors.tariffs = errorMessage;
            state.loading.tariffs = false;
          });

          throw error;
        }
      },

      fetchTariff: async (id) => {
        try {
          const response = await finance.get(`/tariffs/${id}`);
          const tariff = response.data;

          set(state => {
            state.tariffs[id] = tariff;
          });

          return tariff;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch tariff ${id}`;

          set(state => {
            state.errors.tariffs = errorMessage;
          });

          throw error;
        }
      },

      createTariff: async (data) => {
        try {
          const response = await finance.post('/walletBillings', data);
          const tariff = response.data;

          set(state => {
            state.tariffs[tariff.id] = tariff;
          });

          return tariff;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create tariff';

          set(state => {
            state.errors.tariffs = errorMessage;
          });

          throw error;
        }
      },

      updateTariff: async (id, data) => {
        try {
          const response = await finance.put(`/walletBillings/${id}`, data);
          const tariff = response.data;

          set(state => {
            state.tariffs[id] = tariff;
          });

          return tariff;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to update tariff ${id}`;

          set(state => {
            state.errors.tariffs = errorMessage;
          });

          throw error;
        }
      },

      deleteTariff: async (id) => {
        try {
          await finance.delete(`/tariffs/${id}`);

          set(state => {
            delete state.tariffs[id];
            delete state.feeRanges[id]; // Also delete associated fee ranges
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to delete tariff ${id}`;

          set(state => {
            state.errors.tariffs = errorMessage;
          });

          throw error;
        }
      },

      // Fee range actions
      fetchFeeRanges: async (tariffId) => {
        set(state => { state.loading.feeRanges = true; state.errors.feeRanges = undefined; });

        try {
          const response = await finance.get(`/fee-ranges?walletBillingId=${tariffId}`);
          const feeRanges = response.data;

          set(state => {
            state.feeRanges[tariffId] = feeRanges;
            state.loading.feeRanges = false;
          });

          return feeRanges;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch fee ranges for tariff ${tariffId}`;

          set(state => {
            state.errors.feeRanges = errorMessage;
            state.loading.feeRanges = false;
          });

          throw error;
        }
      },

      createFixedRange: async (data) => {
        try {
          const response = await finance.post('/walletBillingFixedRanges', data);
          const feeRange = response.data;
          const tariffId = data.walletBillingId;

          set(state => {
            if (!state.feeRanges[tariffId]) {
              state.feeRanges[tariffId] = [];
            }
            state.feeRanges[tariffId].push(feeRange);
          });

          return feeRange;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create fixed fee range';

          set(state => {
            state.errors.feeRanges = errorMessage;
          });

          throw error;
        }
      },

      createPercentageFeeRange: async (data) => {
        try {
          const response = await finance.post('/walletBillingPercentageRanges', data);
          const feeRange = response.data;
          const tariffId = data.walletBillingId;

          set(state => {
            if (!state.feeRanges[tariffId]) {
              state.feeRanges[tariffId] = [];
            }
            state.feeRanges[tariffId].push(feeRange);
          });

          return feeRange;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create percentage fee range';

          set(state => {
            state.errors.feeRanges = errorMessage;
          });

          throw error;
        }
      },

      updateFixedRange: async (id, data) => {
        try {
          const response = await finance.put(`/walletBillingFixedRanges/${id}`, data);
          const updatedRange = response.data;

          set(state => {
            // Find the tariff this range belongs to
            Object.keys(state.feeRanges).forEach(tariffId => {
              const index = state.feeRanges[tariffId].findIndex(range => range.id === id);

              if (index !== -1) {
                state.feeRanges[tariffId][index] = updatedRange;
              }
            });
          });

          return updatedRange;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to update fixed range ${id}`;

          set(state => {
            state.errors.feeRanges = errorMessage;
          });

          throw error;
        }
      },

      updatePercentageFeeRange: async (id, data) => {
        try {
          const response = await finance.put(`/walletBillingPercentageRanges/${id}`, data);
          const updatedRange = response.data;

          set(state => {
            // Find the tariff this range belongs to
            Object.keys(state.feeRanges).forEach(tariffId => {
              const index = state.feeRanges[tariffId].findIndex(range => range.id === id);

              if (index !== -1) {
                state.feeRanges[tariffId][index] = updatedRange;
              }
            });
          });

          return updatedRange;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to update percentage range ${id}`;

          set(state => {
            state.errors.feeRanges = errorMessage;
          });

          throw error;
        }
      },

      deleteFixedRange: async (id) => {
        try {
          await finance.delete(`/walletBillingFixedRanges/${id}`);

          set(state => {
            // Remove from all tariffs
            Object.keys(state.feeRanges).forEach(tariffId => {
              state.feeRanges[tariffId] = state.feeRanges[tariffId].filter(range => range.id !== id);
            });
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to delete fixed range ${id}`;

          set(state => {
            state.errors.feeRanges = errorMessage;
          });

          throw error;
        }
      },

      deletePercentageFeeRange: async (id) => {
        try {
          await finance.delete(`/walletBillingPercentageRanges/${id}`);

          set(state => {
            // Remove from all tariffs
            Object.keys(state.feeRanges).forEach(tariffId => {
              state.feeRanges[tariffId] = state.feeRanges[tariffId].filter(range => range.id !== id);
            });
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to delete percentage range ${id}`;

          set(state => {
            state.errors.feeRanges = errorMessage;
          });

          throw error;
        }
      },

      // Bank actions
      fetchBanks: async () => {
        set(state => { state.loading.banks = true; state.errors.banks = undefined; });

        try {
          const response = await finance.get('/banks');
          const banks = response.data;

          set(state => {
            state.banks = arrayToRecord(banks);
            state.loading.banks = false;
          });

          return banks;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch banks';

          set(state => {
            state.errors.banks = errorMessage;
            state.loading.banks = false;
          });

          throw error;
        }
      },

      createBank: async (data) => {
        try {
          const response = await finance.post('/banks', data);
          const bank = response.data;

          set(state => {
            state.banks[bank.id] = bank;
          });

          return bank;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create bank';

          set(state => {
            state.errors.banks = errorMessage;
          });

          throw error;
        }
      },

      updateBank: async (id, data) => {
        try {
          const response = await finance.put(`/banks/${id}`, data);
          const bank = response.data;

          set(state => {
            state.banks[id] = bank;
          });

          return bank;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to update bank ${id}`;

          set(state => {
            state.errors.banks = errorMessage;
          });

          throw error;
        }
      },

      deleteBank: async (id) => {
        try {
          await finance.delete(`/banks/${id}`);

          set(state => {
            delete state.banks[id];
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to delete bank ${id}`;

          set(state => {
            state.errors.banks = errorMessage;
          });

          throw error;
        }
      },

      // Refund actions
      fetchRefunds: async (filters = {}) => {
        set(state => { state.loading.refunds = true; state.errors.refunds = undefined; });

        try {
          const response = await finance.get('/walletRefunds', { params: filters });
          const refunds = response.data;

          set(state => {
            state.refunds = {
              ...state.refunds,
              ...arrayToRecord(refunds)
            };
            state.loading.refunds = false;
          });

          return refunds;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch refunds';

          set(state => {
            state.errors.refunds = errorMessage;
            state.loading.refunds = false;
          });

          throw error;
        }
      },

      fetchRefund: async (id) => {
        try {
          const response = await finance.get(`/walletRefunds/${id}`);
          const refund = response.data;

          set(state => {
            state.refunds[id] = refund;
          });

          return refund;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to fetch refund ${id}`;

          set(state => {
            state.errors.refunds = errorMessage;
          });

          throw error;
        }
      },

      approveRefund: async (id) => {
        try {
          const response = await finance.put(`/walletRefunds/${id}/approve`);
          const refund = response.data;

          set(state => {
            state.refunds[id] = refund;
          });

          return refund;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to approve refund ${id}`;

          set(state => {
            state.errors.refunds = errorMessage;
          });

          throw error;
        }
      },

      rejectRefund: async (id, reason) => {
        try {
          const response = await finance.put(`/walletRefunds/${id}/reject`, { reason });
          const refund = response.data;

          set(state => {
            state.refunds[id] = refund;
          });

          return refund;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : `Failed to reject refund ${id}`;

          set(state => {
            state.errors.refunds = errorMessage;
          });

          throw error;
        }
      },

      // AML actions
      fetchAmlAlerts: async (filters = {}) => {
        set(state => { state.loading.amlAlerts = true; state.errors.amlAlerts = undefined; });

        try {
          const response = await finance.get('/amlAlerts', { params: filters });
          const alerts = response.data;

          set(state => {
            state.amlAlerts = {
              ...state.amlAlerts,
              ...arrayToRecord(alerts)
            };
            state.loading.amlAlerts = false;
          });

          return alerts;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch AML alerts';

          set(state => {
            state.errors.amlAlerts = errorMessage;
            state.loading.amlAlerts = false;
          });

          throw error;
        }
      },

      fetchBlacklistEntries: async (filters = {}) => {
        try {
          const response = await finance.get('/blackList', { params: filters });
          return response.data;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blacklist entries';

          set(state => {
            state.errors.amlAlerts = errorMessage;
          });

          throw error;
        }
      },

      // Utility actions
      clearErrors: () => {
        set(state => {
          state.errors = {};
        });
      },

      resetStore: () => {
        set({
          currencies: {},
          paymentMethods: {},
          wallets: {},
          transactions: {},
          withdrawalRequests: {},
          topUps: {},
          tariffs: {},
          feeRanges: {},
          banks: {},
          refunds: {},
          amlAlerts: {},

          loading: {
            currencies: false,
            paymentMethods: false,
            wallets: false,
            transactions: false,
            withdrawalRequests: false,
            topUps: false,
            tariffs: false,
            feeRanges: false,
            banks: false,
            refunds: false,
            amlAlerts: false,
          },

          errors: {}
        });
      }
    }))
  )
);

// Selector hooks for better component integration
export const useCurrencies = () => {
  const currencies = useFinanceStore(state => Object.values(state.currencies));
  const isLoading = useFinanceStore(state => state.loading.currencies);
  const error = useFinanceStore(state => state.errors.currencies);
  const fetchCurrencies = useFinanceStore(state => state.fetchCurrencies);

  return { currencies, isLoading, error, fetchCurrencies };
};

export const useWallets = (filters?: FilterOptions) => {
  const wallets = useFinanceStore(state => Object.values(state.wallets));
  const isLoading = useFinanceStore(state => state.loading.wallets);
  const error = useFinanceStore(state => state.errors.wallets);
  const fetchWallets = useFinanceStore(state => state.fetchWallets);

  return {
    wallets,
    isLoading,
    error,
    fetchWallets: () => fetchWallets(filters)
  };
};

// Add more custom hooks as needed
