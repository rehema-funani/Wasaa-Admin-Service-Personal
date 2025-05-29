import { SystemWallet, WalletTransaction } from "../types/finance";

export const mockSystemWallets: SystemWallet[] = [
        {
            id: 'wallet-float-001',
            name: 'Platform Float Wallet',
            type: 'float',
            balance: 5783290.75,
            currency: 'KES',
            accountNumber: 'WF-0054321678',
            status: 'active',
            lastUpdated: '2025-05-18T10:45:00Z',
            transactionCount: 892,
            monthlyVolume: 9876543.25,
            description: 'Holds reserve funding for liquidity and payouts'
        },
        {
            id: 'wallet-fee-001',
            name: 'Fee Wallet',
            type: 'fee',
            balance: 2547890.50,
            currency: 'KES',
            accountNumber: 'WC-0012345678',
            status: 'active',
            lastUpdated: '2025-05-18T14:30:00Z',
            transactionCount: 1243,
            monthlyVolume: 4567890.75,
            description: 'Collects platform commissions from each transaction'
        },
        {
            id: 'wallet-refund-001',
            name: 'Refund Wallet',
            type: 'refund',
            balance: 890450.25,
            currency: 'KES',
            accountNumber: 'WR-0087654321',
            status: 'active',
            lastUpdated: '2025-05-18T12:15:00Z',
            transactionCount: 567,
            monthlyVolume: 1234567.50,
            description: 'Issues refunds or reversals in case of errors/disputes'
        },
        {
            id: 'wallet-promotions-001',
            name: 'Promotions Wallet',
            type: 'promotions',
            balance: 456780.30,
            currency: 'KES',
            accountNumber: 'WP-0098765432',
            status: 'active',
            lastUpdated: '2025-05-17T18:20:00Z',
            transactionCount: 123,
            monthlyVolume: 789012.40,
            description: 'Funds user bonuses, cashbacks, or campaign payouts'
        }
    ];

export   const mockTransactions: WalletTransaction[] = [
        {
            id: 'tx-001',
            walletId: 'wallet-fee-001',
            type: 'credit',
            amount: 1250.00,
            reference: 'TRX-23456789',
            description: 'Commission from transaction ID: 45678',
            status: 'completed',
            timestamp: '2025-05-18T14:30:00Z',
            relatedEntity: 'John Doe (User)'
        },
        {
            id: 'tx-002',
            walletId: 'wallet-fee-001',
            type: 'debit',
            amount: 500.00,
            reference: 'TRX-23456790',
            description: 'Monthly settlement to operating account',
            status: 'completed',
            timestamp: '2025-05-17T10:15:00Z',
            relatedEntity: 'System Account'
        },
        {
            id: 'tx-003',
            walletId: 'wallet-refund-001',
            type: 'debit',
            amount: 750.00,
            reference: 'TRX-23456791',
            description: 'Refund for transaction ID: 78901',
            status: 'pending',
            timestamp: '2025-05-18T09:45:00Z',
            relatedEntity: 'Alice Smith (User)'
        },
        {
            id: 'tx-004',
            walletId: 'wallet-refund-001',
            type: 'credit',
            amount: 2000.00,
            reference: 'TRX-23456792',
            description: 'Top up from main account',
            status: 'completed',
            timestamp: '2025-05-16T16:20:00Z',
            relatedEntity: 'System Account'
        },
        {
            id: 'tx-005',
            walletId: 'wallet-float-001',
            type: 'debit',
            amount: 15000.00,
            reference: 'TRX-23456793',
            description: 'Payout to merchant ID: MER-12345',
            status: 'completed',
            timestamp: '2025-05-18T08:30:00Z',
            relatedEntity: 'Acme Store (Merchant)'
        },
        {
            id: 'tx-006',
            walletId: 'wallet-promotions-001',
            type: 'debit',
            amount: 3000.00,
            reference: 'TRX-23456794',
            description: 'Cashback promotion for user ID: USR-78901',
            status: 'completed',
            timestamp: '2025-05-17T13:10:00Z',
            relatedEntity: 'Bob Johnson (User)'
        }
    ];