export type TransactionType = 'send' | 'WITHDRAW' | 'withdraw_mpesa' | 'transfer' | 'gift';
export type KycLevel = 'basic' | 'standard' | 'advanced';

export interface TransactionLimit {
    id?: string;
    kycConfigId?: string;
    transactionType: TransactionType;
    isDailyLimitEnabled: boolean;
    dailyLimit: number;
    isWeeklyLimitEnabled: boolean;
    weeklyLimit: number;
    isMonthlyLimitEnabled: boolean;
    monthlyLimit: number;
    isPerTransactionMinEnabled: boolean;
    perTransactionMin: number;
    isPerTransactionMaxEnabled: boolean;
    perTransactionMax: number;
    isAllowed: boolean;
}

export interface KycConfig {
    id?: string;
    level: KycLevel;
    name: string;
    description: string;
    requirements: string[];
    transactionLimits?: TransactionLimit[];
    status: 'active' | 'inactive';
    lastUpdated?: string;
}

export type ModalType = 'add' | 'edit' | 'delete' | 'editLimits' | 'addLimit' | null;