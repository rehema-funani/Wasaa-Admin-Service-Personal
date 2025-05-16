import axios from 'axios';
import { KycConfig, TransactionLimit } from '../../types/kyc';
import { finance } from '../finance-axios';

const kycService = {
    async getAllKycConfigs(): Promise<KycConfig[]> {
        try {
            const response = await finance.get(`/kycConfigs`);
            
            const kycConfigs = response.data.kycConfigs || [];
            
            return kycConfigs.map((config: any) => ({
                id: config.id,
                level: config.level.toLowerCase(),
                name: config.name,
                description: config.description,
                requirements: (config.requirements || []).map((req: any) => req.name),
                transactionLimits: config.transactionLimits ? [
                    {
                        id: config.transactionLimits.id,
                        kycConfigId: config.transactionLimits.kycConfigId,
                        transactionType: config.transactionLimits.transactionType.toLowerCase(),
                        isDailyLimitEnabled: config.transactionLimits.isDailyLimitEnabled,
                        dailyLimit: config.transactionLimits.dailyLimit,
                        isWeeklyLimitEnabled: config.transactionLimits.isWeeklyLimitEnabled,
                        weeklyLimit: config.transactionLimits.weeklyLimit,
                        isMonthlyLimitEnabled: config.transactionLimits.isMonthlyLimitEnabled,
                        monthlyLimit: config.transactionLimits.monthlyLimit,
                        isPerTransactionMinEnabled: config.transactionLimits.isPerTransactionMinEnabled,
                        perTransactionMin: config.transactionLimits.perTransactionMin,
                        isPerTransactionMaxEnabled: config.transactionLimits.isPerTransactionMaxEnabled,
                        perTransactionMax: config.transactionLimits.perTransactionMax,
                        isAllowed: config.transactionLimits.isAllowed
                    }
                ] : [],
                status: config.status || 'active',
                lastUpdated: config.updatedAt
            }));
        } catch (error) {
            console.error('Failed to fetch KYC configs', error);
            throw error;
        }
    },

    async createKycConfig(kycConfig: Omit<KycConfig, 'id' | 'lastUpdated'>): Promise<KycConfig> {
        try {
            const response = await axios.post(`/configs`, kycConfig);
            return response.data;
        } catch (error) {
            console.error('Failed to create KYC config', error);
            throw error;
        }
    },

    async updateKycConfig(id: string, kycConfig: Partial<Omit<KycConfig, 'id' | 'lastUpdated'>>): Promise<KycConfig> {
        try {
            const response = await axios.put(`/configs/${id}`, kycConfig);
            return response.data;
        } catch (error) {
            console.error('Failed to update KYC config', error);
            throw error;
        }
    },

    async deleteKycConfig(id: string): Promise<void> {
        try {
            await axios.delete(`/configs/${id}`);
        } catch (error) {
            console.error('Failed to delete KYC config', error);
            throw error;
        }
    },

    async getTransactionLimits(kycConfigId: string): Promise<TransactionLimit[]> {
        try {
            const response = await finance.get(`/configs/${kycConfigId}/transaction-limits`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch transaction limits', error);
            throw error;
        }
    },

    async createTransactionLimit(transactionLimit: Omit<TransactionLimit, 'id'>): Promise<TransactionLimit> {
        try {
            const response = await finance.post(`/kycConfigTransactionLimits`, transactionLimit);
            return response.data;
        } catch (error) {
            console.error('Failed to create transaction limit', error);
            throw error;
        }
    },

    async updateTransactionLimit(kycConfigId: string, transactionType: string, limitData: Partial<Omit<TransactionLimit, 'id' | 'kycConfigId' | 'transactionType'>>): Promise<TransactionLimit> {
        try {
            const response = await axios.put(`/configs/${kycConfigId}/transaction-limits/${transactionType}`, limitData);
            return response.data;
        } catch (error) {
            console.error('Failed to update transaction limit', error);
            throw error;
        }
    }
};

export default kycService;