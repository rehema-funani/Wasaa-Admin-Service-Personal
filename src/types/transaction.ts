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
    UserWallet: {
        id: string;
        user_uuid: string;
        currencyId: string;
        debit: string;
        credit: string;
        balance: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    user?: any;
}