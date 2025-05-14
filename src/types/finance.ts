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