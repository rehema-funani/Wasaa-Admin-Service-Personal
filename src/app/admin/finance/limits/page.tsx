import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Info, Check, PlusCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { KycConfig, ModalType, TransactionLimit, TransactionType } from '../../../../types/kyc';
import { formatTransactionType } from '../../../../utils/formatters';
import KycConfigList from '../../../../components/kyc/KycConfigList';
import { Modal } from '../../../../components/common/Modal';
import TransactionLimitForm from '../../../../components/kyc/TransactionLimitForm';
import KycConfigForm from '../../../../components/kyc/KycConfigForm';
import kycService from '../../../../api/services/kyc';

const DEFAULT_TRANSACTION_TYPES: TransactionType[] = ['send', 'WITHDRAW', 'withdraw_mpesa', 'transfer', 'gift'];

const KycManagementPage: React.FC = () => {
    const [kycConfigs, setKycConfigs] = useState<KycConfig[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [currentKycConfig, setCurrentKycConfig] = useState<KycConfig | null>(null);
    const [currentTransactionType, setCurrentTransactionType] = useState<TransactionType | null>(null);
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const [formData, setFormData] = useState<Omit<KycConfig, 'id' | 'lastUpdated' | 'transactionLimits'>>({
        level: 'basic',
        name: '',
        description: '',
        requirements: [],
        status: 'active'
    });

    const [limitsFormData, setLimitsFormData] = useState<Omit<TransactionLimit, 'id' | 'transactionType' | 'kycConfigId'>>({
        isDailyLimitEnabled: true,
        dailyLimit: 0,
        isWeeklyLimitEnabled: true,
        weeklyLimit: 0,
        isMonthlyLimitEnabled: true,
        monthlyLimit: 0,
        isPerTransactionMinEnabled: true,
        perTransactionMin: 0,
        isPerTransactionMaxEnabled: true,
        perTransactionMax: 0,
        isAllowed: true
    });

    useEffect(() => {
        fetchKycConfigs();
    }, []);

    const fetchKycConfigs = async () => {
        setIsLoading(true);
        try {
            const configs = await kycService.getAllKycConfigs();
            setKycConfigs(configs);
        } catch (error) {
            console.error('Failed to fetch KYC configs', error);
            showSuccess('Failed to load KYC configurations');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredKycConfigs = kycConfigs?.filter(config => {
        const matchesSearch = config?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            config.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || config.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleRowExpansion = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    const openAddLimitModal = (config: KycConfig) => {
        setCurrentKycConfig(config);
        setCurrentTransactionType(null); 

        setLimitsFormData({
            isDailyLimitEnabled: true,
            dailyLimit: 5000,
            isWeeklyLimitEnabled: true,
            weeklyLimit: 15000,
            isMonthlyLimitEnabled: true,
            monthlyLimit: 50000,
            isPerTransactionMinEnabled: true,
            perTransactionMin: 100,
            isPerTransactionMaxEnabled: true,
            perTransactionMax: 5000,
            isAllowed: true
        });

        setModalType('addLimit');
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setFormData({
            level: 'basic',
            name: '',
            description: '',
            requirements: [],
            status: 'active'
        });
        setModalType('add');
        setIsModalOpen(true);
    };

    const openEditModal = (config: KycConfig) => {
        setCurrentKycConfig(config);
        setFormData({
            level: config.level,
            name: config.name,
            description: config.description,
            requirements: config.requirements,
            status: config.status
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    const openEditLimitsModal = (config: KycConfig, transactionType: TransactionType) => {
        setCurrentKycConfig(config);
        setCurrentTransactionType(transactionType);

        const limit = config.transactionLimits?.find(limit => limit.transactionType === transactionType);

        if (limit) {
            setLimitsFormData({
                isDailyLimitEnabled: limit.isDailyLimitEnabled,
                dailyLimit: limit.dailyLimit,
                isWeeklyLimitEnabled: limit.isWeeklyLimitEnabled,
                weeklyLimit: limit.weeklyLimit,
                isMonthlyLimitEnabled: limit.isMonthlyLimitEnabled,
                monthlyLimit: limit.monthlyLimit,
                isPerTransactionMinEnabled: limit.isPerTransactionMinEnabled,
                perTransactionMin: limit.perTransactionMin,
                isPerTransactionMaxEnabled: limit.isPerTransactionMaxEnabled,
                perTransactionMax: limit.perTransactionMax,
                isAllowed: limit.isAllowed
            });
        } else {
            setLimitsFormData({
                isDailyLimitEnabled: true,
                dailyLimit: 5000,
                isWeeklyLimitEnabled: true,
                weeklyLimit: 15000,
                isMonthlyLimitEnabled: true,
                monthlyLimit: 50000,
                isPerTransactionMinEnabled: true,
                perTransactionMin: 100,
                isPerTransactionMaxEnabled: true,
                perTransactionMax: 5000,
                isAllowed: true
            });
        }

        setModalType('editLimits');
        setIsModalOpen(true);
    };

    const openDeleteModal = (config: KycConfig) => {
        setCurrentKycConfig(config);
        setModalType('delete');
        setDeleteConfirmed(false);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (newFormData: Omit<KycConfig, 'id' | 'lastUpdated' | 'transactionLimits'>) => {
        setIsLoading(true);

        try {
            if (modalType === 'add') {
                const newConfig = await kycService.createKycConfig(newFormData);

                await Promise.all(DEFAULT_TRANSACTION_TYPES.map(async (type) => {
                    await kycService.createTransactionLimit({
                        kycConfigId: newConfig.id,
                        transactionType: type,
                        isDailyLimitEnabled: true,
                        dailyLimit: 5000,
                        isWeeklyLimitEnabled: true,
                        weeklyLimit: 15000,
                        isMonthlyLimitEnabled: true,
                        monthlyLimit: 50000,
                        isPerTransactionMinEnabled: true,
                        perTransactionMin: 100,
                        isPerTransactionMaxEnabled: true,
                        perTransactionMax: 5000,
                        isAllowed: true
                    });
                }));

                const limits = await kycService.getTransactionLimits(newConfig.id!);

                setKycConfigs([...kycConfigs, { ...newConfig, transactionLimits: limits }]);
                showSuccess('KYC level added successfully');
            } else if (modalType === 'edit' && currentKycConfig) {
                const updatedConfig = await kycService.updateKycConfig(currentKycConfig.id!, newFormData);

                setKycConfigs(kycConfigs.map(config =>
                    config.id === currentKycConfig.id
                        ? { ...updatedConfig, transactionLimits: config.transactionLimits }
                        : config
                ));
                showSuccess('KYC level updated successfully');
            }
        } catch (error) {
            console.error('KYC config operation failed', error);
            showSuccess('Operation failed. Please try again.');
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setModalType(null);
            setCurrentKycConfig(null);
        }
    };

    const getAvailableTransactionTypes = (): TransactionType[] => {
        if (!currentKycConfig) return DEFAULT_TRANSACTION_TYPES;

        const existingTypes = currentKycConfig.transactionLimits?.map(limit => limit.transactionType) || [];
        return DEFAULT_TRANSACTION_TYPES.filter(type => !existingTypes.includes(type));
    };

    const handleLimitsFormSubmit = async (newLimitsData: Omit<TransactionLimit, 'id' | 'transactionType' | 'kycConfigId'>) => {
        if (!currentKycConfig || !currentTransactionType) return;

        setIsLoading(true);

        try {
            await kycService.updateTransactionLimit(
                currentKycConfig.id!,
                currentTransactionType,
                newLimitsData
            );

            setKycConfigs(kycConfigs.map(config => {
                if (config.id === currentKycConfig.id) {
                    return {
                        ...config,
                        transactionLimits: config.transactionLimits?.map(limit => {
                            if (limit.transactionType === currentTransactionType) {
                                return {
                                    ...limit,
                                    ...newLimitsData
                                };
                            }
                            return limit;
                        }) || []
                    };
                }
                return config;
            }));

            showSuccess('Transaction limits updated successfully');
        } catch (error) {
            console.error('Failed to update transaction limits', error);
            showSuccess('Failed to update limits. Please try again.');
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setModalType(null);
            setCurrentKycConfig(null);
            setCurrentTransactionType(null);
        }
    };

    const handleDeleteKycConfig = async () => {
        if (!currentKycConfig) return;

        setIsLoading(true);

        try {
            await kycService.deleteKycConfig(currentKycConfig.id!);

            setKycConfigs(kycConfigs.filter(config => config.id !== currentKycConfig.id));
            showSuccess('KYC level deleted successfully');
        } catch (error) {
            console.error('Failed to delete KYC config', error);
            showSuccess('Failed to delete. Please try again.');
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setModalType(null);
            setCurrentKycConfig(null);
        }
    };

    const handleAddLimitFormSubmit = async (newLimitData: Omit<TransactionLimit, 'id' | 'kycConfigId'> & { transactionType: TransactionType }) => {
        if (!currentKycConfig || !newLimitData.transactionType) return;

        setIsLoading(true);

        try {
            // Add transaction limit
            const newLimit = await kycService.createTransactionLimit({
                kycConfigId: currentKycConfig.id!,
                ...newLimitData
            });

            // Update local state
            setKycConfigs(kycConfigs.map(config => {
                if (config.id === currentKycConfig.id) {
                    // Add the new limit to the config's limits array
                    return {
                        ...config,
                        transactionLimits: [
                            ...(config.transactionLimits || []),
                            newLimit
                        ]
                    };
                }
                return config;
            }));

            showSuccess('Transaction limit added successfully');
        } catch (error) {
            console.error('Failed to add transaction limit', error);
            showSuccess('Failed to add limit. Please try again.');
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setModalType(null);
            setCurrentKycConfig(null);
        }
    };
    

    const getModalTitle = () => {
        switch (modalType) {
            case 'add':
                return 'Add New KYC Level';
            case 'edit':
                return 'Edit KYC Level';
            case 'delete':
                return 'Delete KYC Level';
            case 'editLimits':
                return `Edit Transaction Limits: ${formatTransactionType(currentTransactionType)}`;
            case 'addLimit':
                return 'Add New Transaction Limit';
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">KYC Level Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Configure transaction limits based on user verification level</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm"
                                disabled={isLoading}
                            >
                                <PlusCircle size={16} />
                                <span>New KYC Level</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-5">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search KYC levels..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'all' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setStatusFilter('active')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'active' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setStatusFilter('inactive')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'inactive' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Inactive
                                </button>
                            </div>

                            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                                <SlidersHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-5 flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700">
                        <Check size={16} className="flex-shrink-0" />
                        <span className="text-sm">{successMessage}</span>
                    </div>
                )}

                <KycConfigList
                    kycConfigs={filteredKycConfigs}
                    expandedRows={expandedRows}
                    toggleRowExpansion={toggleRowExpansion}
                    openEditModal={openEditModal}
                    openDeleteModal={openDeleteModal}
                    openEditLimitsModal={openEditLimitsModal}
                    openAddLimitModal={openAddLimitModal}
                />

                <div className="mt-6 bg-blue-50/70 rounded-xl p-3 border border-blue-100 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-700">About KYC Levels</h3>
                            <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                                KYC (Know Your Customer) levels determine what transactions users can perform and their associated limits.
                                Higher verification levels typically allow for higher transaction limits and more transaction types.
                                Configure requirements, limits, and enabled transaction types for each KYC level.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setCurrentKycConfig(null);
                    setCurrentTransactionType(null);
                }}
                title={getModalTitle()}
                size={modalType === 'delete' ? 'sm' : modalType === 'editLimits' ? 'md' : 'lg'}
            >
                {modalType === 'delete' ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                            <div className="bg-red-100 p-3 rounded-full animate-pulse">
                                <AlertTriangle size={32} className="text-red-600" />
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-bold text-red-700 mb-1">Danger Zone</h3>
                            <p className="text-gray-700">
                                You are about to <span className="font-bold text-red-600">permanently delete</span> the KYC level:
                            </p>
                            <p className="text-lg font-semibold mt-2 mb-3 text-gray-900 border-y border-red-100 py-2">
                                {currentKycConfig?.name}
                            </p>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
                            <p className="text-sm text-red-800">
                                <span className="font-bold">WARNING:</span> This action is irreversible. All transaction limits and requirements associated with this KYC level will be permanently lost. Users assigned to this level may lose transaction capabilities.
                            </p>
                        </div>

                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-red-300 text-red-600 focus:ring-red-500 h-4 w-4"
                                    onChange={(e) => setDeleteConfirmed(e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    I understand that this action cannot be undone
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-between gap-2 mt-5 pt-3 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentKycConfig(null);
                                }}
                                className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteKycConfig}
                                disabled={!deleteConfirmed}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5
                                ${deleteConfirmed
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-red-200 text-white cursor-not-allowed'}`}
                            >
                                <Trash2 size={16} />
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                ) : modalType === 'editLimits' && currentTransactionType ? (
                    <TransactionLimitForm
                        transactionType={currentTransactionType}
                        initialData={limitsFormData}
                        onSubmit={handleLimitsFormSubmit}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setModalType(null);
                            setCurrentKycConfig(null);
                            setCurrentTransactionType(null);
                        }}
                    />
                ) : (modalType === 'add' || modalType === 'edit') ? (
                    <KycConfigForm
                        initialData={formData}
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setModalType(null);
                            setCurrentKycConfig(null);
                        }}
                        isAdd={modalType === 'add'}
                    />
                        ) : modalType === 'addLimit' ? (
                            <TransactionLimitForm
                                isAdd={true}
                                initialData={limitsFormData}
                                onSubmit={handleAddLimitFormSubmit}
                                onCancel={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentKycConfig(null);
                                }}
                                availableTransactionTypes={getAvailableTransactionTypes()}
                            />
                ) : null}
            </Modal>
        </div>
    );
};

export default KycManagementPage;