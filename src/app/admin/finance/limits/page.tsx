import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Info, Check, PlusCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KycConfig, TransactionType } from '../../../../types/kyc';
import KycConfigList from '../../../../components/kyc/KycConfigList';
import kycService from '../../../../api/services/kyc';
import { toast } from 'react-hot-toast';

const KycManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const [kycConfigs, setKycConfigs] = useState<KycConfig[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    // Delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [configToDelete, setConfigToDelete] = useState<KycConfig | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);

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
            toast.error('Failed to load KYC configurations');
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

    // Navigation handlers
    const handleAddKycConfig = () => {
        navigate('/admin/finance/limits/add');
    };

    const handleEditKycConfig = (config: KycConfig) => {
        navigate(`/admin/finance/limits/edit/${config.id}`);
    };

    const handleAddTransactionLimit = (config: KycConfig) => {
        navigate(`/admin/finance/limits/${config.id}/limits/add`);
    };

    const handleEditTransactionLimit = (config: KycConfig, transactionType: TransactionType) => {
        navigate(`/admin/finance/limits/${config.id}/limits/edit/${transactionType}`);
    };

    // Delete modal handlers
    const handleDeleteClick = (config: KycConfig) => {
        setConfigToDelete(config);
        setDeleteConfirmed(false);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!configToDelete || !deleteConfirmed) return;

        setIsDeleting(true);
        try {
            await kycService.deleteKycConfig(configToDelete.id!);
            setKycConfigs(kycConfigs.filter(config => config.id !== configToDelete.id));
            setShowDeleteModal(false);
            setConfigToDelete(null);
            setDeleteConfirmed(false);
            toast.success('KYC level deleted successfully', {
                style: {
                    background: '#10B981',
                    color: 'white',
                    borderRadius: '12px'
                }
            });
        } catch (error) {
            console.error('Failed to delete KYC config', error);
            toast.error('Failed to delete KYC level. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setConfigToDelete(null);
        setDeleteConfirmed(false);
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
                            <motion.button
                                onClick={handleAddKycConfig}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm transition-all text-sm font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                <PlusCircle size={16} />
                                <span>New KYC Level</span>
                            </motion.button>
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
                                className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
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
                    openEditModal={handleEditKycConfig}
                    openDeleteModal={handleDeleteClick}
                    openEditLimitsModal={handleEditTransactionLimit}
                    openAddLimitModal={handleAddTransactionLimit}
                />

                <div className="mt-6 bg-primary-50/70 rounded-xl p-3 border border-primary-100 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-primary-700">About KYC Levels</h3>
                            <p className="text-primary-600 text-xs mt-0.5 leading-relaxed">
                                KYC (Know Your Customer) levels determine what transactions users can perform and their associated limits.
                                Higher verification levels typically allow for higher transaction limits and more transaction types.
                                Configure requirements, limits, and enabled transaction types for each KYC level.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && configToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleCancelDelete}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/95 max-h-[90vh] overflow-y-auto backdrop-blur-xl rounded-3xl border border-gray-200/50 p-8 max-w-md w-full mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Warning Icon */}
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={28} className="text-red-600" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                                Delete KYC Level
                            </h3>

                            {/* KYC Config Info */}
                            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-100">
                                <div className="text-center">
                                    <h4 className="font-semibold text-gray-900 mb-1">{configToDelete.name}</h4>
                                    <p className="text-sm text-gray-600 capitalize">{configToDelete.level} level</p>
                                    <p className="text-sm text-gray-600 mt-1">{configToDelete.description}</p>
                                </div>
                            </div>

                            {/* Warning Message */}
                            <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-red-100">
                                <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                                    <AlertTriangle size={16} className="mr-2" />
                                    Permanent Action Warning
                                </h4>
                                <div className="space-y-2 text-sm text-red-800">
                                    <p>• This action cannot be undone</p>
                                    <p>• All transaction limits for this KYC level will be permanently deleted</p>
                                    <p>• Users assigned to this level may lose transaction capabilities</p>
                                    <p>• Historical KYC records will lose their reference</p>
                                    <p>• This may affect compliance and audit trails</p>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="bg-primary-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-primary-100">
                                <h4 className="font-semibold text-primary-900 mb-2">💡 Recommendation</h4>
                                <p className="text-sm text-primary-800">
                                    Consider setting the KYC level to <span className="font-medium">"inactive"</span> instead of deleting it.
                                    This preserves historical data while preventing new assignments.
                                </p>
                            </div>

                            {/* Confirmation Checkbox */}
                            <div className="mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-red-300 text-red-600 focus:ring-red-500 h-4 w-4"
                                        checked={deleteConfirmed}
                                        onChange={(e) => setDeleteConfirmed(e.target.checked)}
                                    />
                                    <span className="ml-3 text-sm text-gray-700">
                                        I understand that this action cannot be undone and may affect users and compliance
                                    </span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3">
                                <motion.button
                                    onClick={handleCancelDelete}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    whileHover={{ scale: isDeleting || !deleteConfirmed ? 1 : 1.02 }}
                                    whileTap={{ scale: isDeleting || !deleteConfirmed ? 1 : 0.98 }}
                                    disabled={isDeleting || !deleteConfirmed}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} className="mr-2" />
                                            Delete
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                This action is irreversible and may impact user verification and compliance
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default KycManagementPage;