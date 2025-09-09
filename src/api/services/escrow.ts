import escrow from "../escrow-axios";

export const escrowService = {
  // Milestones
  getMilestones: async () => {
    const response = await escrow.get("/milestones");
    return response.data;
  },

  //   Escrow agreements
  createSystemEscrow: async (data: any) => {
    const response = await escrow.post("/escrow-agreements/system/create", data);
    return response.data;
  },
  getEscrowAgreements: async () => {
    const response = await escrow.get("/escrow-agreements");
    return response.data;
  },
  getEscrowAgreementById: async (id: string) => {
    const response = await escrow.get(`/escrow-agreements/${id}`);
    return response.data;
  },
  getSystemEscrowAgreements: async () => {
    const response = await escrow.get("/escrow-agreements/system");
    return response.data;
  },
  getSystemEscrowById: async (id: string) => {
    const response = await escrow.get(`/escrow-agreements/system/${id}`);
    return response.data;
  },

  //   Escrow transactions
  getLedgerAccounts: async () => {
    const response = await escrow.get("/ledger-accounts");
    return response.data;
  },
  getLedgerAccountById: async (id: string) => {
    const response = await escrow.get(`/ledger-accounts/${id}`);
    return response.data;
  },
  getEscrowTransactions: async () => {
    const response = await escrow.get("/transactions");
    return response.data;
  },
  getEscrowTransactionById: async (id: string) => {
    const response = await escrow.get(`/transactions/${id}`);
    return response.data;
  },
  getEscrowPendingTransactions: async () => {
    const response = await escrow.get("/transactions/pending");
    return response.data;
  },
  createEscrowTransaction: async (data: any) => {
    const response = await escrow.post("/escrow/create", data);
    return response.data;
  },

  //   Escrow disputes
  getAllDisputes: async () => {
    const response = await escrow.get("/disputes");
    return response.data;
  },
  getDisputeById: async (id: string) => {
    const response = await escrow.get(`/disputes/${id}`);
    return response.data;
  },
  getEscalatedDisputes: async () => {
    const response = await escrow.get("/disputes/escalated");
    return response.data;
  },
  getResolvedDisputes: async () => {
    const response = await escrow.get("/disputes/resolved");
    return response.data;
  },
  getResolutionHistory: async () => {
    const response = await escrow.get(`/disputes/resolution-history`);
    return response.data;
  },

  //   Escrow refunds
  getAllRefunds: async () => {
    const response = await escrow.get("/refunds");
    return response.data;
  },
  getRefundById: async (id: string) => {
    const response = await escrow.get(`/refunds/${id}`);
    return response.data;
  },

  //   Escrow accounts
  getAllEscrowAccounts: async () => {
    const response = await escrow.get("/accounts");
    return response.data;
  },
  getEscrowAccountById: async (id: string) => {
    const response = await escrow.get(`/accounts/${id}`);
    return response.data;
  },

  //   Escrow AML/Fraud
  getAmlFraudReports: async () => {
    const response = await escrow.get("/aml");
    return response.data;
  },

  //   Escrow reports
  getTransactionReports: async () => {
    const response = await escrow.get(
      "/escrow-agreements/trends?from=2025-01-01&to=2025-12-31"
    );
    return response.data;
  },
  getEscrowVolumeTrend: async () => {
    const response = await escrow.get("/escrow-agreements/volume-trends");
    return response.data;
  },
  getDisputeReports: async () => {
    const response = await escrow.get(
      "disputes/trends?from=2025-01-01&to=2025-12-31"
    );
    return response.data;
  },
  getRevenueReports: async () => {
    const response = await escrow.get("/reports/revenue");
    return response.data;
  },
  getComplianceReports: async () => {
    const response = await escrow.get("/reports/compliance");
    return response.data;
  },

  //   Escrow settings
  getEscrowSettings: async () => {
    const response = await escrow.get("/settings");
    return response.data;
  },
  updateEscrowSettings: async (data: any) => {
    const response = await escrow.put("/settings", data);
    return response.data;
  },

  //   Escrow dashboard
  getActiveEscrowStats: async () => {
    const response = await escrow.get("/escrow-agreements/stats/active");
    return response.data;
  },

  getPendingDisputes: async () => {
    const response = await escrow.get("/escrow-agreements/stats/pending");
    return response.data;
  },
  getTotalVolumeMetrics: async () => {
    const response = await escrow.get("/escrow-agreements/stats/volume");
    return response.data;
  },
  getLedgerEntryVolumeStats: async () => {
    const response = await escrow.get("/ledger-entries/volume/stats");
    return response.data;
  },
  getLedgerEntrySuccessRate: async () => {
    const response = await escrow.get("/ledger-entries/success-rate");
    return response.data;
  },
  getLedgerEntryCountStats: async () => {
    const response = await escrow.get("/ledger-entries/count/stats");
    return response.data;
  },
  getLedgerEntryDailyVolumeTrend: async (from: string, to: string) => {
    const response = await escrow.get(`/ledger-entries/daily-volume-trend?from=${from}&to=${to}`);
    return response.data;
  },
};
