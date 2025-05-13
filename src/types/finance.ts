export interface Tariff {
    id: string;
    category: string;
    name: string;
    description: string;
    minAmount: number;
    maxAmount: number | null;
    feeType: 'fixed' | 'percentage' | 'tiered';
    feeValue: number;
    minFee?: number;
    maxFee?: number;
    currency: string;
    isActive: boolean;
    provider: string;
    lastUpdated: string;
    tiers?: { from: number; to: number | null; fee: number }[];
}