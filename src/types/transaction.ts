export interface Transaction {
    id: string;
    userWalletId: string;
    debit: number;
    credit: number;
    balance: number;
    status: string;
    description: string;
    external_id: string;
    createdAt: string;
    updatedAt: string;
    UserWallet: any;
    user?: any;
    walletId?: string;
    type?: string
}
