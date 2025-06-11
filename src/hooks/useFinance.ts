// src/hooks/useFinance.ts
import { useState, useEffect, useCallback } from 'react';
import { useFinanceStore } from '../stores/financeStore';
import { AMLAlert, FilterOptions } from '../types/finance';

/**
 * Hook for working with currencies
 * @param autoFetch - Whether to fetch currencies automatically on mount
 */
export const useCurrencies = (autoFetch = true) => {
  const store = useFinanceStore();
  const currencies = Object.values(store.currencies);
  const isLoading = store.loading.currencies;
  const error = store.errors.currencies;

  useEffect(() => {
    if (autoFetch && currencies.length === 0 && !isLoading) {
      store.fetchCurrencies();
    }
  }, [autoFetch, currencies.length, isLoading, store]);

  return {
    currencies,
    isLoading,
    error,
    fetchCurrencies: store.fetchCurrencies,
    createCurrency: store.createCurrency,
    updateCurrency: store.updateCurrency,
    deleteCurrency: store.deleteCurrency
  };
};

/**
 * Hook for working with payment methods
 * @param autoFetch - Whether to fetch payment methods automatically on mount
 */
export const usePaymentMethods = (autoFetch = true) => {
  const store = useFinanceStore();
  const paymentMethods = Object.values(store.paymentMethods);
  const isLoading = store.loading.paymentMethods;
  const error = store.errors.paymentMethods;

  useEffect(() => {
    if (autoFetch && paymentMethods.length === 0 && !isLoading) {
      store.fetchPaymentMethods();
    }
  }, [autoFetch, paymentMethods.length, isLoading, store]);

  return {
    paymentMethods,
    isLoading,
    error,
    fetchPaymentMethods: store.fetchPaymentMethods,
    createPaymentMethod: store.createPaymentMethod,
    updatePaymentMethod: store.updatePaymentMethod,
    deletePaymentMethod: store.deletePaymentMethod,
    togglePaymentMethodStatus: store.togglePaymentMethodStatus
  };
};

/**
 * Hook for working with wallets
 * @param filters - Filter options for wallets
 * @param autoFetch - Whether to fetch wallets automatically on mount
 */
export const useWallets = (filters: FilterOptions = {}, autoFetch = true) => {
  const store = useFinanceStore();
  const wallets = Object.values(store.wallets);
  const isLoading = store.loading.wallets;
  const error = store.errors.wallets;

  // State for filtered wallets
  const [filteredWallets, setFilteredWallets] = useState(wallets);

  // Function to fetch with filters
  const fetchWallets = useCallback(() => {
    return store.fetchWallets(filters);
  }, [store, filters]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch && !isLoading) {
      fetchWallets().then(newWallets => {
        setFilteredWallets(newWallets);
      });
    }
  }, [autoFetch, isLoading, fetchWallets]);

  // Update filtered wallets when wallets or filters change
  useEffect(() => {
    // Simple client-side filtering in addition to server-side filtering
    let result = wallets;

    if (filters.status) {
      const isActive = filters.status === 'active';
      result = result.filter(wallet => wallet.isActive === isActive);
    }

    if (filters.userId) {
      result = result.filter(wallet => wallet.userId === filters.userId);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(wallet =>
        wallet.id.toLowerCase().includes(search) ||
        (wallet.currency?.code || '').toLowerCase().includes(search)
      );
    }

    setFilteredWallets(result);
  }, [wallets, filters]);

  return {
    wallets: filteredWallets,
    allWallets: wallets,
    isLoading,
    error,
    fetchWallets,
    fetchWallet: store.fetchWallet,
    createWallet: store.createWallet,
    deleteWallet: store.deleteWallet
  };
};

/**
 * Hook for working with wallet transactions
 * @param walletId - ID of the wallet to fetch transactions for
 * @param filters - Filter options for transactions
 * @param autoFetch - Whether to fetch transactions automatically on mount
 */
export const useWalletTransactions = (walletId: string, filters: FilterOptions = {}, autoFetch = true) => {
  const store = useFinanceStore();
  const transactions = Object.values(store.transactions).filter(tx => tx.walletId === walletId);
  const isLoading = store.loading.transactions;
  const error = store.errors.transactions;

  const fetchTransactions = useCallback(() => {
    if (!walletId) return Promise.resolve([]);
    return store.fetchWalletTransactions(walletId, filters);
  }, [store, walletId, filters]);

  useEffect(() => {
    if (autoFetch && walletId && !isLoading) {
      fetchTransactions();
    }
  }, [autoFetch, walletId, isLoading, fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions
  };
};

/**
 * Hook for working with all transactions
 * @param filters - Filter options for transactions
 * @param autoFetch - Whether to fetch transactions automatically on mount
 */
export const useTransactions = (filters: FilterOptions = {}, autoFetch = true) => {
  const store = useFinanceStore();
  const transactions = Object.values(store.transactions);
  const isLoading = store.loading.transactions;
  const error = store.errors.transactions;

  // State for filtered transactions
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  // Function to fetch with filters
  const fetchTransactions = useCallback(() => {
    return store.fetchTransactions(filters);
  }, [store, filters]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch && !isLoading) {
      fetchTransactions().then(newTransactions => {
        setFilteredTransactions(newTransactions);
      });
    }
  }, [autoFetch, isLoading, fetchTransactions]);

  // Update filtered transactions when transactions or filters change
  useEffect(() => {
    let result = transactions;

    if (filters.status) {
      result = result.filter(tx => tx.status === filters.status);
    }

    if (filters.type) {
      result = result.filter(tx => tx.type === filters.type);
    }

    if (filters.walletId) {
      result = result.filter(tx => tx.walletId === filters.walletId);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate).getTime();
      result = result.filter(tx => new Date(tx.createdAt).getTime() >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate).getTime();
      result = result.filter(tx => new Date(tx.createdAt).getTime() <= endDate);
    }

    setFilteredTransactions(result);
  }, [transactions, filters]);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    isLoading,
    error,
    fetchTransactions,
    fetchTransaction: store.fetchTransaction
  };
};

/**
 * Hook for working with tariffs
 * @param autoFetch - Whether to fetch tariffs automatically on mount
 */
export const useTariffs = (autoFetch = true) => {
  const store = useFinanceStore();
  const tariffs = Object.values(store.tariffs);
  const isLoading = store.loading.tariffs;
  const error = store.errors.tariffs;

  useEffect(() => {
    if (autoFetch && tariffs.length === 0 && !isLoading) {
      store.fetchTariffs();
    }
  }, [autoFetch, tariffs.length, isLoading, store]);

  return {
    tariffs,
    isLoading,
    error,
    fetchTariffs: store.fetchTariffs,
    fetchTariff: store.fetchTariff,
    createTariff: store.createTariff,
    updateTariff: store.updateTariff,
    deleteTariff: store.deleteTariff
  };
};

/**
 * Hook for working with fee ranges for a specific tariff
 * @param tariffId - ID of the tariff to fetch fee ranges for
 * @param autoFetch - Whether to fetch fee ranges automatically on mount
 */
export const useFeeRanges = (tariffId: string, autoFetch = true) => {
  const store = useFinanceStore();
  const feeRanges = store.feeRanges[tariffId] || [];
  const isLoading = store.loading.feeRanges;
  const error = store.errors.feeRanges;

  useEffect(() => {
    if (autoFetch && tariffId && !isLoading && !feeRanges.length) {
      store.fetchFeeRanges(tariffId);
    }
  }, [autoFetch, tariffId, feeRanges.length, isLoading, store]);

  return {
    feeRanges,
    isLoading,
    error,
    fetchFeeRanges: () => store.fetchFeeRanges(tariffId),
    createFixedRange: store.createFixedRange,
    createPercentageFeeRange: store.createPercentageFeeRange,
    updateFixedRange: store.updateFixedRange,
    updatePercentageFeeRange: store.updatePercentageFeeRange,
    deleteFixedRange: store.deleteFixedRange,
    deletePercentageFeeRange: store.deletePercentageFeeRange
  };
};

/**
 * Hook for working with top-ups
 * @param filters - Filter options for top-ups
 * @param autoFetch - Whether to fetch top-ups automatically on mount
 */
export const useTopUps = (filters: FilterOptions = {}, autoFetch = true) => {
  const store = useFinanceStore();
  const topUps = Object.values(store.topUps);
  const isLoading = store.loading.topUps;
  const error = store.errors.topUps;

  // State for filtered top-ups
  const [filteredTopUps, setFilteredTopUps] = useState(topUps);

  // Function to fetch with filters
  const fetchTopUps = useCallback(() => {
    return store.fetchTopUps(filters);
  }, [store, filters]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch && !isLoading) {
      fetchTopUps().then(newTopUps => {
        setFilteredTopUps(newTopUps);
      });
    }
  }, [autoFetch, isLoading, fetchTopUps]);

  // Update filtered top-ups when top-ups or filters change
  useEffect(() => {
    let result = topUps;

    if (filters.status) {
      result = result.filter(topUp => topUp.status === filters.status);
    }

    if (filters.walletId) {
      result = result.filter(topUp => topUp.walletId === filters.walletId);
    }

    if (filters.userId) {
      result = result.filter(topUp => topUp.userId === filters.userId);
    }

    setFilteredTopUps(result);
  }, [topUps, filters]);

  return {
    topUps: filteredTopUps,
    allTopUps: topUps,
    isLoading,
    error,
    fetchTopUps,
    fetchTopUp: store.fetchTopUp,
    createTopUp: store.createTopUp,
    approveTopUp: store.approveTopUp,
    rejectTopUp: store.rejectTopUp
  };
};

/**
 * Hook for working with withdrawal requests
 * @param filters - Filter options for withdrawal requests
 * @param autoFetch - Whether to fetch withdrawal requests automatically on mount
 */
export const useWithdrawalRequests = (filters: FilterOptions = {}, autoFetch = true) => {
  const store = useFinanceStore();
  const withdrawalRequests = Object.values(store.withdrawalRequests);
  const isLoading = store.loading.withdrawalRequests;
  const error = store.errors.withdrawalRequests;

  // State for filtered withdrawal requests
  const [filteredRequests, setFilteredRequests] = useState(withdrawalRequests);

  // Function to fetch with filters
  const fetchWithdrawalRequests = useCallback(() => {
    return store.fetchWithdrawalRequests(filters);
  }, [store, filters]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch && !isLoading) {
      fetchWithdrawalRequests().then(newRequests => {
        setFilteredRequests(newRequests);
      });
    }
  }, [autoFetch, isLoading, fetchWithdrawalRequests]);

  // Update filtered requests when requests or filters change
  useEffect(() => {
    let result = withdrawalRequests;

    if (filters.status) {
      result = result.filter(req => req.status === filters.status);
    }

    if (filters.walletId) {
      result = result.filter(req => req.walletId === filters.walletId);
    }

    if (filters.userId) {
      result = result.filter(req => req.userId === filters.userId);
    }

    setFilteredRequests(result);
  }, [withdrawalRequests, filters]);

  return {
    withdrawalRequests: filteredRequests,
    allWithdrawalRequests: withdrawalRequests,
    isLoading,
    error,
    fetchWithdrawalRequests,
    fetchWithdrawalRequest: store.fetchWithdrawalRequest,
    createWithdrawalRequest: store.createWithdrawalRequest
  };
};

/**
 * Hook for working with banks
 * @param autoFetch - Whether to fetch banks automatically on mount
 */
export const useBanks = (autoFetch = true) => {
  const store = useFinanceStore();
  const banks = Object.values(store.banks);
  const isLoading = store.loading.banks;
  const error = store.errors.banks;

  useEffect(() => {
    if (autoFetch && banks.length === 0 && !isLoading) {
      store.fetchBanks();
    }
  }, [autoFetch, banks.length, isLoading, store]);

  return {
    banks,
    isLoading,
    error,
    fetchBanks: store.fetchBanks,
    createBank: store.createBank,
    updateBank: store.updateBank,
    deleteBank: store.deleteBank
  };
};

/**
 * Hook for working with refunds
 * @param filters - Filter options for refunds
 * @param autoFetch - Whether to fetch refunds automatically on mount
 */
export const useRefunds = (filters: FilterOptions = {}, autoFetch = true) => {
  const store = useFinanceStore();
  const refunds = Object.values(store.refunds);
  const isLoading = store.loading.refunds;
  const error = store.errors.refunds;

  // State for filtered refunds
  const [filteredRefunds, setFilteredRefunds] = useState(refunds);

  // Function to fetch with filters
  const fetchRefunds = useCallback(() => {
    return store.fetchRefunds(filters);
  }, [store, filters]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch && !isLoading) {
      fetchRefunds().then(newRefunds => {
        setFilteredRefunds(newRefunds);
      });
    }
  }, [autoFetch, isLoading, fetchRefunds]);

  // Update filtered refunds when refunds or filters change
  useEffect(() => {
    let result = refunds;

    if (filters.status) {
      result = result.filter(refund => refund.status === filters.status);
    }

    if (filters.walletId) {
      result = result.filter(refund => refund.walletId === filters.walletId);
    }

    setFilteredRefunds(result);
  }, [refunds, filters]);

  return {
    refunds: filteredRefunds,
    allRefunds: refunds,
    isLoading,
    error,
    fetchRefunds,
    fetchRefund: store.fetchRefund,
    approveRefund: store.approveRefund,
    rejectRefund: store.rejectRefund
  };
};

/**
 * Hook for working with AML alerts
 * @param filters - Filter options for AML alerts
 * @param autoFetch - Whether to fetch AML alerts automatically on mount
 */
export const useAmlAlerts = (filters: FilterOptions = {}, autoFetch = true) => {
  const store = useFinanceStore();
  const amlAlerts = Object.values(store.amlAlerts);
  const isLoading = store.loading.amlAlerts;
  const error = store.errors.amlAlerts;

  // State for filtered alerts
  const [filteredAlerts, setFilteredAlerts] = useState(amlAlerts);

  // Function to fetch with filters
  const fetchAmlAlerts = useCallback(() => {
    return store.fetchAmlAlerts(filters);
  }, [store, filters]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch && !isLoading) {
      fetchAmlAlerts().then((newAlerts) => {
        setFilteredAlerts(newAlerts as any);
      });
    }
  }, [autoFetch, isLoading, fetchAmlAlerts]);

  // Update filtered alerts when alerts or filters change
  useEffect(() => {
    let result = amlAlerts;

    if (filters.status) {
      result = result.filter(alert => alert.status === filters.status);
    }

    if (filters.userId) {
      result = result.filter(alert => alert.userId === filters.userId);
    }

    setFilteredAlerts(result);
  }, [amlAlerts, filters]);

  return {
    amlAlerts: filteredAlerts,
    allAmlAlerts: amlAlerts,
    isLoading,
    error,
    fetchAmlAlerts
  };
};
