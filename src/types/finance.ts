export type TariffType = 'flat' | 'percentage' | 'tiered';

export interface TariffRange {
    id: string;
    min: number;
    max: number | null;
    fee: number;
}

export interface Tariff {
    id: string;
    name: string;
    description: string;
    type: string;
    value: number;
    fixedRanges: any[];
    percentageRanges: any[];
    status: string;
    lastUpdated: string;
    category?: string;
    minAmount?: number;
    maxAmount?: number | null;
    feeType?: string;
}

export type ModalType = 
    | 'add' 
    | 'edit' 
    | 'delete' 
    | 'addFixedRange' 
    | 'editFixedRange' 
    | 'deleteFixedRange'
    | 'addPercentageRange'
    | 'editPercentageRange'
    | 'deletePercentageRange'
    | null;


export interface Transaction {
    id: string;
    walletId: string;
    walletName: string;
    type: 'credit' | 'debit';
    amount: number;
    reference: string;
    description: string;
    status: 'completed' | 'pending' | 'failed' | 'reversed';
    timestamp: string;
    relatedEntity?: string;
}

export interface ReversalRequest {
    id: string;
    transactionId: string;
    userId: string;
    userName: string;
    amount: number;
    currency: string;
    reason: string;
    status: string;
    isDebit?: boolean;
    walletType?: string;
    walletPurpose?: string;
    walletBalance?: any;
    requestedBy: string;
    requestedAt: string;
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    completedAt?: string;
    notes?: string;
}

export interface RefundRequest {
    id: string;
    originalTransactionId: string;
    userWalletId: string;
    amount: string;
    refundReason: string;
    status: string;
    processedBy: string | null;
    createdAt: string;
    updatedAt: string;
    OriginalTransaction: {
        id: string;
        userWalletId: string;
        debit: number;
        credit: number;
        balance: number;
        status: string;
        description: string;
        external_id: string | null;
        createdAt: string;
        updatedAt: string;
    };
    UserWallet: {
        id: string;
        user_uuid: string;
        group_uuid: string | null;
        type: string;
        purpose: string | null;
        currencyId: string;
        debit: string;
        credit: string;
        balance: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface Withdrawal {
  id: string;
  user_uuid: string;
  paymentMethodId: number;
  amount: number;
  phone: string;
  description: string;
  transactionCode: string | null;
  status: 'pending' | 'completed' | 'failed';
  metadata: any;
  createdAt: string;
  updatedAt: string;
  PaymentMethod?: {
    id: number;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  user?: {
    id: string;
    username: string;
    phone_number: string;
    email: string | null;
    profile_picture: string | null;
    preferences: any;
  };
  formattedDate?: string;
  formattedTime?: string;
  currency?: string;
}

export interface AlertType {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface RiskLevel {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface GroupedCount {
    riskLevelId: string;
    riskLevelName: 'low' | 'medium' | 'high';
    statuses: {
        new: number;
        under_review: number;
        escalated: number;
        resolved: number;
    };
}

export interface AMLAlert {
    id: string;
    userUuid: string;
    alertTypeUuid: string;
    riskLevelId: string;
    status: 'new' | 'under_review' | 'escalated' | 'resolved' | 'false_positive';
    description: string;
    assignedTo: string | null;
    reviewedAt: string | null;
    resolvedAt: string | null;
    userWalletTransactionIds: string[];
    createdAt: string;
    updatedAt: string;
    AlertType: AlertType;
    RiskLevel: RiskLevel;
    // Adding extra fields for display purposes
    userName?: string;
}

export interface APIResponse {
    status: boolean;
    message: string;
    data: {
        groupedCounts: GroupedCount[];
        amlAlerts: AMLAlert[];
    };
}

export interface RiskMetrics {
    totalAlerts: number;
    newAlerts: number;
    underReviewAlerts: number;
    escalatedAlerts: number;
    resolvedAlerts: number;
    falsePositives: number;
    highRiskAlerts: number;
    mediumRiskAlerts: number;
    lowRiskAlerts: number;
    alertsByType: {
        name: string;
        value: number;
    }[];
    alertsByRisk: {
        name: string;
        value: number;
    }[];
}

export interface ListEntry {
    id: string;
    type: 'blacklist' | 'whitelist';
    entityType: 'user' | 'email' | 'phone' | 'ip_address' | 'device_id' | 'account';
    userWalletId: string;
    reason: string | null;
    status: 'pending' | 'active' | 'inactive' | 'approved' | 'rejected';
    addedBy: string | null;
    addedAt: string;
    notes: string | null;
    lastTriggered: string | null;
    triggerCount: number;
    riskScore: number | null;
    createdAt: string;
    updatedAt: string;
    UserWallet: {
        id: string;
        user_uuid: string | null;
        group_uuid: string;
        type: string;
        purpose: string | null;
        currencyId: string;
        debit: string;
        credit: string;
        balance: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    user: any | null;
}

export interface SystemWallet {
    id: string;
    name: string;
    type: 'float' | 'fee' | 'refund' | 'promotions';
    balance: number;
    currency: string;
    accountNumber: string;
    status: 'active' | 'inactive' | 'pending';
    lastUpdated: string;
    transactionCount: number;
    monthlyVolume: number;
    description: string;
}

export interface WalletTransaction {
    id: string;
    walletId: string;
    type: 'credit' | 'debit';
    amount: number;
    reference: string;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    timestamp: string;
    relatedEntity?: string;
}
