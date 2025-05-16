import { TransactionType } from "../types/kyc";

export const formatTransactionType = (type: TransactionType | null): string => {
    if (!type) return '';

    switch (type) {
        case 'send':
            return 'Send Money';
        case 'WITHDRAW':
            return 'Withdraw to Bank';
        case 'withdraw_mpesa':
            return 'Withdraw to M-Pesa';
        case 'transfer':
            return 'Transfer Between Accounts';
        case 'gift':
            return 'Gift to User';
        default:
            return String(type).replace('_', ' ');
    }
};

export const formatCurrency = (amount: number): string => {
    return `KES ${amount.toLocaleString()}`;
};