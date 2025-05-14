import React, { useState } from 'react';
import { Save, Check, PlusCircle, Edit, Trash2, ChevronDown, ChevronRight, Search, SlidersHorizontal, Info, AlertCircle, Shield, User, Users, BarChart4 } from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';

type TransactionType = 'send' | 'withdraw_bank' | 'withdraw_mpesa' | 'transfer' | 'gift';

type KycLevel = 'basic' | 'standard' | 'advanced';

interface TransactionLimit {
    id: string;
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

interface KycConfig {
    id: string;
    level: KycLevel;
    name: string;
    description: string;
    requirements: string[];
    transactionLimits: TransactionLimit[];
    status: 'active' | 'inactive';
    lastUpdated: string;
}

type ModalType = 'add' | 'edit' | 'delete' | 'editLimits' | null;

const page = () => {
    const [kycConfigs, setKycConfigs] = useState<KycConfig[]>([
        {
            id: '1',
            level: 'basic',
            name: 'Basic Verification',
            description: 'Limited functionality with minimal verification',
            requirements: [
                'Valid phone number',
                'Email verification'
            ],
            transactionLimits: [
                {
                    id: '1-1',
                    transactionType: 'send',
                    isDailyLimitEnabled: true,
                    dailyLimit: 5000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 20000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 50000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 5000,
                    isAllowed: true
                },
                {
                    id: '1-2',
                    transactionType: 'withdraw_bank',
                    isDailyLimitEnabled: true,
                    dailyLimit: 3000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 10000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 30000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 500,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 3000,
                    isAllowed: true
                },
                {
                    id: '1-3',
                    transactionType: 'withdraw_mpesa',
                    isDailyLimitEnabled: true,
                    dailyLimit: 2000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 8000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 25000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 2000,
                    isAllowed: true
                },
                {
                    id: '1-4',
                    transactionType: 'transfer',
                    isDailyLimitEnabled: true,
                    dailyLimit: 5000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 15000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 40000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 5000,
                    isAllowed: true
                },
                {
                    id: '1-5',
                    transactionType: 'gift',
                    isDailyLimitEnabled: true,
                    dailyLimit: 2000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 5000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 15000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 2000,
                    isAllowed: true
                }
            ],
            status: 'active',
            lastUpdated: '2025-05-10'
        },
        {
            id: '2',
            level: 'standard',
            name: 'Standard Verification',
            description: 'Moderate limits with ID verification',
            requirements: [
                'Valid phone number',
                'Email verification',
                'National ID',
                'Proof of address'
            ],
            transactionLimits: [
                {
                    id: '2-1',
                    transactionType: 'send',
                    isDailyLimitEnabled: true,
                    dailyLimit: 20000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 70000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 200000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 20000,
                    isAllowed: true
                },
                {
                    id: '2-2',
                    transactionType: 'withdraw_bank',
                    isDailyLimitEnabled: true,
                    dailyLimit: 15000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 50000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 150000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 500,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 15000,
                    isAllowed: true
                },
                {
                    id: '2-3',
                    transactionType: 'withdraw_mpesa',
                    isDailyLimitEnabled: true,
                    dailyLimit: 10000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 35000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 100000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 10000,
                    isAllowed: true
                },
                {
                    id: '2-4',
                    transactionType: 'transfer',
                    isDailyLimitEnabled: true,
                    dailyLimit: 20000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 60000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 180000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 20000,
                    isAllowed: true
                },
                {
                    id: '2-5',
                    transactionType: 'gift',
                    isDailyLimitEnabled: true,
                    dailyLimit: 10000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 25000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 80000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 10000,
                    isAllowed: true
                }
            ],
            status: 'active',
            lastUpdated: '2025-05-09'
        },
        {
            id: '3',
            level: 'advanced',
            name: 'Advanced Verification',
            description: 'Highest limits with full verification',
            requirements: [
                'Valid phone number',
                'Email verification',
                'National ID',
                'Proof of address',
                'Bank account verification',
                'Video verification'
            ],
            transactionLimits: [
                {
                    id: '3-1',
                    transactionType: 'send',
                    isDailyLimitEnabled: true,
                    dailyLimit: 100000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 300000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 1000000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 100000,
                    isAllowed: true
                },
                {
                    id: '3-2',
                    transactionType: 'withdraw_bank',
                    isDailyLimitEnabled: true,
                    dailyLimit: 100000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 300000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 1000000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 500,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 100000,
                    isAllowed: true
                },
                {
                    id: '3-3',
                    transactionType: 'withdraw_mpesa',
                    isDailyLimitEnabled: true,
                    dailyLimit: 70000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 200000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 500000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 70000,
                    isAllowed: true
                },
                {
                    id: '3-4',
                    transactionType: 'transfer',
                    isDailyLimitEnabled: true,
                    dailyLimit: 100000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 300000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 1000000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 100000,
                    isAllowed: true
                },
                {
                    id: '3-5',
                    transactionType: 'gift',
                    isDailyLimitEnabled: true,
                    dailyLimit: 50000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 150000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 500000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 100,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 50000,
                    isAllowed: true
                }
            ],
            status: 'active',
            lastUpdated: '2025-05-07'
        }
    ]);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [currentKycConfig, setCurrentKycConfig] = useState<KycConfig | null>(null);
    const [currentTransactionType, setCurrentTransactionType] = useState<TransactionType | null>(null);

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const [formData, setFormData] = useState<Omit<KycConfig, 'id' | 'lastUpdated' | 'transactionLimits'>>({
        level: 'basic',
        name: '',
        description: '',
        requirements: [],
        status: 'active'
    });

    const [limitsFormData, setLimitsFormData] = useState<Omit<TransactionLimit, 'id' | 'transactionType'>>({
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

    const filteredKycConfigs = kycConfigs.filter(config => {
        const matchesSearch = config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    const handleSave = () => {
        console.log('Saving KYC configs:', kycConfigs);

        setSuccessMessage('KYC configurations updated successfully');

        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
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

    // Open modal for editing KYC config
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

    // Open modal for editing transaction limits
    const openEditLimitsModal = (config: KycConfig, transactionType: TransactionType) => {
        setCurrentKycConfig(config);
        setCurrentTransactionType(transactionType);

        // Find the transaction limit
        const limit = config.transactionLimits.find(limit => limit.transactionType === transactionType);

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
            // Default values if limit not found
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

    // Open modal for deleting KYC config
    const openDeleteModal = (config: KycConfig) => {
        setCurrentKycConfig(config);
        setModalType('delete');
        setIsModalOpen(true);
    };

    // Handle form changes for KYC config
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form level change
    const handleFormLevelChange = (level: KycLevel) => {
        setFormData(prev => ({
            ...prev,
            level
        }));
    };

    // Handle form status change
    const handleFormStatusChange = (status: 'active' | 'inactive') => {
        setFormData(prev => ({
            ...prev,
            status
        }));
    };

    // Handle form changes for transaction limits
    const handleLimitsFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setLimitsFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : parseFloat(value) || 0
        }));
    };

    // Handle form submission for KYC config
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Parse requirements from string to array
        const requirementsArray = formData.requirements
            .map(req => req.trim())
            .filter(req => req.length > 0);

        if (modalType === 'add') {
            // Create default transaction limits for new KYC config
            const defaultLimits: TransactionLimit[] = [
                {
                    id: `new-1`,
                    transactionType: 'send',
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
                },
                {
                    id: `new-2`,
                    transactionType: 'withdraw_bank',
                    isDailyLimitEnabled: true,
                    dailyLimit: 5000,
                    isWeeklyLimitEnabled: true,
                    weeklyLimit: 15000,
                    isMonthlyLimitEnabled: true,
                    monthlyLimit: 50000,
                    isPerTransactionMinEnabled: true,
                    perTransactionMin: 500,
                    isPerTransactionMaxEnabled: true,
                    perTransactionMax: 5000,
                    isAllowed: true
                },
                {
                    id: `new-3`,
                    transactionType: 'withdraw_mpesa',
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
                },
                {
                    id: `new-4`,
                    transactionType: 'transfer',
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
                },
                {
                    id: `new-5`,
                    transactionType: 'gift',
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
                }
            ];

            // Add new KYC config
            const newKycConfig: KycConfig = {
                id: Date.now().toString(), // Generate a unique ID
                ...formData,
                requirements: requirementsArray,
                transactionLimits: defaultLimits,
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            setKycConfigs([...kycConfigs, newKycConfig]);
            setSuccessMessage('KYC level added successfully');
        } else if (modalType === 'edit' && currentKycConfig) {
            // Update existing KYC config
            setKycConfigs(kycConfigs.map(config =>
                config.id === currentKycConfig.id
                    ? {
                        ...config,
                        level: formData.level,
                        name: formData.name,
                        description: formData.description,
                        requirements: requirementsArray,
                        status: formData.status,
                        lastUpdated: new Date().toISOString().split('T')[0]
                    }
                    : config
            ));
            setSuccessMessage('KYC level updated successfully');
        }

        // Close modal and reset state
        setIsModalOpen(false);
        setModalType(null);
        setCurrentKycConfig(null);

        // Hide message after 3 seconds
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    // Handle form submission for transaction limits
    const handleLimitsFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentKycConfig && currentTransactionType) {
            // Update transaction limits
            setKycConfigs(kycConfigs.map(config => {
                if (config.id === currentKycConfig.id) {
                    return {
                        ...config,
                        transactionLimits: config.transactionLimits.map(limit => {
                            if (limit.transactionType === currentTransactionType) {
                                return {
                                    ...limit,
                                    ...limitsFormData
                                };
                            }
                            return limit;
                        }),
                        lastUpdated: new Date().toISOString().split('T')[0]
                    };
                }
                return config;
            }));

            setSuccessMessage('Transaction limits updated successfully');
        }

        // Close modal and reset state
        setIsModalOpen(false);
        setModalType(null);
        setCurrentKycConfig(null);
        setCurrentTransactionType(null);

        // Hide message after 3 seconds
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    // Handle KYC config deletion
    const handleDeleteKycConfig = () => {
        if (currentKycConfig) {
            setKycConfigs(kycConfigs.filter(config => config.id !== currentKycConfig.id));
            setSuccessMessage('KYC level deleted successfully');

            // Close modal and reset state
            setIsModalOpen(false);
            setModalType(null);
            setCurrentKycConfig(null);

            // Hide message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    };

    // Generate modal title based on modalType
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
            default:
                return '';
        }
    };

    // Format transaction type for display
    const formatTransactionType = (type: TransactionType | null): string => {
        if (!type) return '';

        switch (type) {
            case 'send':
                return 'Send Money';
            case 'withdraw_bank':
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

    // Get icon for transaction type
    const getTransactionTypeIcon = (type: TransactionType) => {
        switch (type) {
            case 'send':
                return <Users size={16} className="text-blue-500" />;
            case 'withdraw_bank':
                return <BarChart4 size={16} className="text-purple-500" />;
            case 'withdraw_mpesa':
                return <BarChart4 size={16} className="text-green-500" />;
            case 'transfer':
                return <BarChart4 size={16} className="text-amber-500" />;
            case 'gift':
                return <BarChart4 size={16} className="text-pink-500" />;
            default:
                return <BarChart4 size={16} className="text-gray-500" />;
        }
    };

    // Get icon and color for KYC level
    const getKycLevelIcon = (level: KycLevel) => {
        switch (level) {
            case 'basic':
                return { icon: <User size={16} />, color: 'text-blue-500 bg-blue-50' };
            case 'standard':
                return { icon: <Shield size={16} />, color: 'text-amber-500 bg-amber-50' };
            case 'advanced':
                return { icon: <Shield size={16} />, color: 'text-green-500 bg-green-50' };
            default:
                return { icon: <User size={16} />, color: 'text-gray-500 bg-gray-50' };
        }
    };

    // Format currency
    const formatCurrency = (amount: number): string => {
        return `KES ${amount.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">KYC Level Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Configure transaction limits based on user verification level</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500 text-white rounded-xl shadow-sm hover:bg-blue-600 transition-all text-sm"
                            >
                                <Save size={16} />
                                <span>Save Changes</span>
                            </button>

                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm"
                            >
                                <PlusCircle size={16} />
                                <span>New KYC Level</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter */}
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

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-5 flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700">
                        <Check size={16} className="flex-shrink-0" />
                        <span className="text-sm">{successMessage}</span>
                    </div>
                )}

                {/* KYC Levels Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 backdrop-blur-sm bg-white/90">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/80">
                                    <th className="w-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredKycConfigs.length > 0 ? (
                                    filteredKycConfigs.map((config) => (
                                        <React.Fragment key={config.id}>
                                            <tr className={`${expandedRows[config.id] ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'} transition-colors`}>
                                                <td className="px-3 py-3 text-center">
                                                    <button
                                                        onClick={() => toggleRowExpansion(config.id)}
                                                        className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                                                        title="Show transaction limits"
                                                    >
                                                        {expandedRows[config.id] ?
                                                            <ChevronDown size={16} /> :
                                                            <ChevronRight size={16} />
                                                        }
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${getKycLevelIcon(config.level).color}`}>
                                                        {getKycLevelIcon(config.level).icon}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-800 text-sm font-medium">
                                                    {config.name}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">
                                                    {config.description}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {config.requirements.map((req, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                            >
                                                                {req}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.status === 'active'
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {config.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                                                    {config.lastUpdated}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => openEditModal(config)}
                                                            className="p-1 text-gray-400 hover:text-blue-500 rounded-md hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <Edit size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(config)}
                                                            className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Row for Transaction Limits */}
                                            {expandedRows[config.id] && (
                                                <tr className="bg-blue-50/30">
                                                    <td colSpan={8} className="px-6 py-2 border-t border-blue-100">
                                                        <div className="py-2">
                                                            <div className="mb-3">
                                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Limits</h4>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                    {config.transactionLimits.map((limit) => (
                                                                        <div
                                                                            key={limit.id}
                                                                            className={`p-3 bg-white rounded-xl border border-gray-100 shadow-sm ${!limit.isAllowed ? 'opacity-75' : ''}`}
                                                                        >
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    {getTransactionTypeIcon(limit.transactionType)}
                                                                                    <span className="text-sm font-medium text-gray-700">{formatTransactionType(limit.transactionType)}</span>
                                                                                </div>

                                                                                <div className="flex items-center">
                                                                                    {!limit.isAllowed && (
                                                                                        <span className="inline-flex items-center px-1.5 py-0.5 bg-red-50 text-red-700 text-xs rounded-md mr-1.5">
                                                                                            <AlertCircle size={10} className="mr-0.5" />
                                                                                            Disabled
                                                                                        </span>
                                                                                    )}

                                                                                    <button
                                                                                        onClick={() => openEditLimitsModal(config, limit.transactionType)}
                                                                                        className="p-1 text-gray-400 hover:text-blue-500 rounded-md hover:bg-blue-50"
                                                                                        title="Edit Limits"
                                                                                    >
                                                                                        <Edit size={14} />
                                                                                    </button>
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-1 text-xs">
                                                                                {limit.isDailyLimitEnabled && (
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="text-gray-500">Daily Limit:</span>
                                                                                        <span className="text-gray-800 font-medium">{formatCurrency(limit.dailyLimit)}</span>
                                                                                    </div>
                                                                                )}

                                                                                {limit.isWeeklyLimitEnabled && (
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="text-gray-500">Weekly Limit:</span>
                                                                                        <span className="text-gray-800 font-medium">{formatCurrency(limit.weeklyLimit)}</span>
                                                                                    </div>
                                                                                )}

                                                                                {limit.isMonthlyLimitEnabled && (
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="text-gray-500">Monthly Limit:</span>
                                                                                        <span className="text-gray-800 font-medium">{formatCurrency(limit.monthlyLimit)}</span>
                                                                                    </div>
                                                                                )}

                                                                                {limit.isPerTransactionMinEnabled && limit.isPerTransactionMaxEnabled && (
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="text-gray-500">Per Transaction:</span>
                                                                                        <span className="text-gray-800 font-medium">{formatCurrency(limit.perTransactionMin)} - {formatCurrency(limit.perTransactionMax)}</span>
                                                                                    </div>
                                                                                )}

                                                                                {limit.isPerTransactionMinEnabled && !limit.isPerTransactionMaxEnabled && (
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="text-gray-500">Min. Transaction:</span>
                                                                                        <span className="text-gray-800 font-medium">{formatCurrency(limit.perTransactionMin)}</span>
                                                                                    </div>
                                                                                )}

                                                                                {!limit.isPerTransactionMinEnabled && limit.isPerTransactionMaxEnabled && (
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="text-gray-500">Max. Transaction:</span>
                                                                                        <span className="text-gray-800 font-medium">{formatCurrency(limit.perTransactionMax)}</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-5 text-center text-gray-500 text-sm">
                                            No KYC levels found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

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
                    <div className="space-y-3">
                        <p className="text-gray-700 text-sm">
                            Are you sure you want to delete the KYC level <span className="font-semibold">{currentKycConfig?.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentKycConfig(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteKycConfig}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : modalType === 'editLimits' ? (
                    <form onSubmit={handleLimitsFormSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isAllowed"
                                        checked={limitsFormData.isAllowed}
                                        onChange={handleLimitsFormChange}
                                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">Enable this transaction type</span>
                                </label>
                            </div>

                            <div className={`${!limitsFormData.isAllowed ? 'opacity-50 pointer-events-none' : ''}`}>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Daily Limit</h3>
                                <div className="flex items-center mb-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isDailyLimitEnabled"
                                            checked={limitsFormData.isDailyLimitEnabled}
                                            onChange={handleLimitsFormChange}
                                            className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <span className="ml-2 text-xs text-gray-600">Enable daily limit</span>
                                    </label>
                                </div>

                                {limitsFormData.isDailyLimitEnabled && (
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="dailyLimit"
                                            value={limitsFormData.dailyLimit}
                                            onChange={handleLimitsFormChange}
                                            min="0"
                                            step="1"
                                            required
                                            className="w-full py-2 px-3 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-400 text-xs">KES</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`${!limitsFormData.isAllowed ? 'opacity-50 pointer-events-none' : ''}`}>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Weekly Limit</h3>
                                <div className="flex items-center mb-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isWeeklyLimitEnabled"
                                            checked={limitsFormData.isWeeklyLimitEnabled}
                                            onChange={handleLimitsFormChange}
                                            className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <span className="ml-2 text-xs text-gray-600">Enable weekly limit</span>
                                    </label>
                                </div>

                                {limitsFormData.isWeeklyLimitEnabled && (
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="weeklyLimit"
                                            value={limitsFormData.weeklyLimit}
                                            onChange={handleLimitsFormChange}
                                            min="0"
                                            step="1"
                                            required
                                            className="w-full py-2 px-3 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-400 text-xs">KES</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`${!limitsFormData.isAllowed ? 'opacity-50 pointer-events-none' : ''}`}>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Monthly Limit</h3>
                                <div className="flex items-center mb-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isMonthlyLimitEnabled"
                                            checked={limitsFormData.isMonthlyLimitEnabled}
                                            onChange={handleLimitsFormChange}
                                            className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <span className="ml-2 text-xs text-gray-600">Enable monthly limit</span>
                                    </label>
                                </div>

                                {limitsFormData.isMonthlyLimitEnabled && (
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="monthlyLimit"
                                            value={limitsFormData.monthlyLimit}
                                            onChange={handleLimitsFormChange}
                                            min="0"
                                            step="1"
                                            required
                                            className="w-full py-2 px-3 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-400 text-xs">KES</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`${!limitsFormData.isAllowed ? 'opacity-50 pointer-events-none' : ''}`}>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Per Transaction Minimum</h3>
                                <div className="flex items-center mb-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isPerTransactionMinEnabled"
                                            checked={limitsFormData.isPerTransactionMinEnabled}
                                            onChange={handleLimitsFormChange}
                                            className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <span className="ml-2 text-xs text-gray-600">Enable minimum amount per transaction</span>
                                    </label>
                                </div>

                                {limitsFormData.isPerTransactionMinEnabled && (
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="perTransactionMin"
                                            value={limitsFormData.perTransactionMin}
                                            onChange={handleLimitsFormChange}
                                            min="0"
                                            step="1"
                                            required
                                            className="w-full py-2 px-3 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-400 text-xs">KES</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`${!limitsFormData.isAllowed ? 'opacity-50 pointer-events-none' : ''}`}>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Per Transaction Maximum</h3>
                                <div className="flex items-center mb-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isPerTransactionMaxEnabled"
                                            checked={limitsFormData.isPerTransactionMaxEnabled}
                                            onChange={handleLimitsFormChange}
                                            className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <span className="ml-2 text-xs text-gray-600">Enable maximum amount per transaction</span>
                                    </label>
                                </div>

                                {limitsFormData.isPerTransactionMaxEnabled && (
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="perTransactionMax"
                                            value={limitsFormData.perTransactionMax}
                                            onChange={handleLimitsFormChange}
                                            min="0"
                                            step="1"
                                            required
                                            className="w-full py-2 px-3 pr-12 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-400 text-xs">KES</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentKycConfig(null);
                                    setCurrentTransactionType(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                                Save Limits
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    KYC Level
                                </label>
                                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => handleFormLevelChange('basic')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.level === 'basic'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <User size={12} />
                                        <span>Basic</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFormLevelChange('standard')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.level === 'standard'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <Shield size={12} />
                                        <span>Standard</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFormLevelChange('advanced')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.level === 'advanced'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <Shield size={12} />
                                        <span>Advanced</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                                    Level Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                    placeholder="e.g., Basic Verification"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    rows={2}
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                    placeholder="Describe the KYC level"
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="requirements" className="block text-xs font-medium text-gray-700 mb-1">
                                    Requirements (one per line)
                                </label>
                                <textarea
                                    id="requirements"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleFormChange}
                                    rows={4}
                                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                    placeholder="Email verification
Phone number verification
National ID card
Proof of address"
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-1">Enter each requirement on a new line.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => handleFormStatusChange('active')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.status === 'active'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <span>Active</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFormStatusChange('inactive')}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${formData.status === 'inactive'
                                            ? 'bg-white shadow-sm text-gray-800 font-medium'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <span>Inactive</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setCurrentKycConfig(null);
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                                {modalType === 'add' ? 'Add KYC Level' : 'Update KYC Level'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default page;