import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    Percent,
    DollarSign,
    Edit,
    Trash2,
    ChevronDown,
    ChevronRight,
    TrendingUp,
    Settings,
    AlertTriangle,
    X,
    Save
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';

interface Range {
    id: string;
    min: number;
    max: number | null;
    fee: number;
}

interface Tariff {
    id: string;
    name: string;
    description: string;
    type: 'flat' | 'percentage';
    value: number;
    status: 'active' | 'inactive';
    lastUpdated: string;
    fixedRanges: Range[];
    percentageRanges: Range[];
}

interface NewRange {
    min: number;
    max: number | null;
    fee: number;
}

const TariffsPage: React.FC = () => {
    const navigate = useNavigate();
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    // Delete tariff modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tariffToDelete, setTariffToDelete] = useState<Tariff | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Add range modal states
    const [showAddRangeModal, setShowAddRangeModal] = useState(false);
    const [selectedTariffForRange, setSelectedTariffForRange] = useState<Tariff | null>(null);
    const [newRange, setNewRange] = useState<NewRange>({ min: 0, max: null, fee: 0 });
    const [isAddingRange, setIsAddingRange] = useState(false);

    // Delete range modal states
    const [showDeleteRangeModal, setShowDeleteRangeModal] = useState(false);
    const [rangeToDelete, setRangeToDelete] = useState<{ range: Range; tariff: Tariff; type: 'fixed' | 'percentage' } | null>(null);
    const [isDeletingRange, setIsDeletingRange] = useState(false);

    useEffect(() => {
        fetchTariffs();
    }, []);

    const fetchTariffs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const tariffsData = await financeService.getAllTariffs();

            const formattedTariffs = tariffsData?.walletBillings?.map((tariff: any) => ({
                id: tariff.id || '',
                name: tariff.name,
                description: tariff.description,
                type: tariff.type,
                value: tariff.value || 0,
                status: tariff.status,
                lastUpdated: tariff.updatedAt ? new Date(tariff.updatedAt).toLocaleDateString() :
                    new Date().toLocaleDateString(),
                fixedRanges: (tariff.fixedRanges || [])
                    .map((range: any) => ({
                        id: range.id,
                        min: range.min,
                        max: range.max,
                        fee: range.fee
                    }))
                    .sort((a: any, b: any) => a.min - b.min),
                percentageRanges: (tariff.percentageRanges || [])
                    .map((range: any) => ({
                        id: range.id,
                        min: range.min,
                        max: range.max,
                        fee: range.fee
                    }))
                    .sort((a: any, b: any) => a.min - b.min)
            })) || [];

            setTariffs(formattedTariffs);
        } catch (err) {
            setError('Failed to fetch tariffs. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTariffs = tariffs.filter(tariff => {
        const matchesSearch = tariff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tariff.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || tariff.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleRowExpansion = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Tariff deletion handlers
    const handleDeleteClick = (tariff: Tariff) => {
        setTariffToDelete(tariff);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!tariffToDelete) return;

        setIsDeleting(true);
        try {
            await financeService.deleteTariff(tariffToDelete.id);
            setTariffs(tariffs.filter(t => t.id !== tariffToDelete.id));
            setShowDeleteModal(false);
            setTariffToDelete(null);
            toast.success('Tariff deleted successfully', {
                style: {
                    background: '#10B981',
                    color: 'white',
                    borderRadius: '12px'
                }
            });
        } catch (err) {
            toast.error('Failed to delete tariff');
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setTariffToDelete(null);
    };

    // Add range handlers
    const handleAddRangeClick = (tariff: Tariff) => {
        setSelectedTariffForRange(tariff);
        setNewRange({ min: 0, max: null, fee: 0 });
        setShowAddRangeModal(true);
    };

    const handleConfirmAddRange = async () => {
        if (!selectedTariffForRange) return;

        // Validation
        if (newRange.min < 0) {
            toast.error('Minimum value cannot be negative');
            return;
        }

        if (newRange.max !== null && newRange.max <= newRange.min) {
            toast.error('Maximum value must be greater than minimum value');
            return;
        }

        if (newRange.fee < 0) {
            toast.error('Fee cannot be negative');
            return;
        }

        setIsAddingRange(true);
        try {
            const rangeData = {
                walletBillingId: selectedTariffForRange.id,
                min: newRange.min,
                max: newRange.max,
                fee: newRange.fee
            };

            if (selectedTariffForRange.type === 'flat') {
                await financeService.createFixedRange(rangeData);
            } else {
                await financeService.createPercentageFeeRange(rangeData);
            }

            // Refresh tariffs to get updated ranges
            await fetchTariffs();

            setShowAddRangeModal(false);
            setSelectedTariffForRange(null);
            setNewRange({ min: 0, max: null, fee: 0 });

            toast.success('Range added successfully', {
                style: {
                    background: '#10B981',
                    color: 'white',
                    borderRadius: '12px'
                }
            });
        } catch (err) {
            toast.error('Failed to add range');
            console.error(err);
        } finally {
            setIsAddingRange(false);
        }
    };

    const handleCancelAddRange = () => {
        setShowAddRangeModal(false);
        setSelectedTariffForRange(null);
        setNewRange({ min: 0, max: null, fee: 0 });
    };

    // Delete range handlers
    const handleDeleteRangeClick = (range: Range, tariff: Tariff, type: 'fixed' | 'percentage') => {
        setRangeToDelete({ range, tariff, type });
        setShowDeleteRangeModal(true);
    };

    const handleConfirmDeleteRange = async () => {
        if (!rangeToDelete) return;

        const { range, tariff, type } = rangeToDelete;
        const ranges = type === 'fixed' ? tariff.fixedRanges : tariff.percentageRanges;

        if (ranges.length === 1) {
            toast.error(`Cannot delete the last ${type} range`);
            setShowDeleteRangeModal(false);
            setRangeToDelete(null);
            return;
        }

        setIsDeletingRange(true);
        try {
            if (type === 'fixed') {
                await financeService.deleteFixedRange(range.id);
            } else {
                await financeService.deletePercentageFeeRange(range.id);
            }

            // Refresh tariffs to get updated ranges
            await fetchTariffs();

            setShowDeleteRangeModal(false);
            setRangeToDelete(null);

            toast.success('Range deleted successfully', {
                style: {
                    background: '#10B981',
                    color: 'white',
                    borderRadius: '12px'
                }
            });
        } catch (err) {
            toast.error('Failed to delete range');
            console.error(err);
        } finally {
            setIsDeletingRange(false);
        }
    };

    const handleCancelDeleteRange = () => {
        setShowDeleteRangeModal(false);
        setRangeToDelete(null);
    };

    const formatRange = (range: any) => {
        if (range.max === null) {
            return `KES ${range.min.toLocaleString()}+`;
        }
        return `KES ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`;
    };

    const getTariffIcon = (type: string) => {
        return type === 'percentage' ? (
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Percent size={18} className="text-primary-600" />
            </div>
        ) : (
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign size={18} className="text-emerald-600" />
            </div>
        );
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchTariffs}
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Tariffs Management</h1>
                            <p className="text-gray-600 mt-1">Configure transaction fees and pricing</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <motion.button
                                onClick={() => navigate('/admin/finance/tariffs/add')}
                                className="flex items-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                <Plus size={18} className="mr-2" />
                                New Tariff
                            </motion.button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mt-6 flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tariffs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all"
                            />
                        </div>

                        <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setStatusFilter('active')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'active'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setStatusFilter('inactive')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'inactive'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Inactive
                            </button>
                        </div>

                        <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">
                            <Filter size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">
                <motion.div
                    className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500">Loading tariffs...</p>
                        </div>
                    ) : filteredTariffs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                                <Settings size={24} className="text-gray-400" />
                            </div>
                            <p className="text-lg font-medium text-gray-900">No tariffs found</p>
                            <p className="text-sm text-gray-500 mb-4">Get started by creating your first tariff</p>
                            <button
                                onClick={() => navigate('/admin/finance/tariffs/add')}
                                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                            >
                                Create Tariff
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {filteredTariffs.map((tariff, index) => (
                                    <motion.div
                                        key={tariff.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.02 }}
                                        className="group hover:bg-gray-50/50 transition-all duration-200"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    {getTariffIcon(tariff.type)}

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-3">
                                                            <h3 className="font-semibold text-gray-900 text-base">{tariff.name}</h3>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tariff.status === 'active'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {tariff.status}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tariff.type === 'percentage'
                                                                ? 'bg-primary-100 text-primary-700'
                                                                : 'bg-emerald-100 text-emerald-700'
                                                                }`}>
                                                                {tariff.type === 'percentage' ? 'Percentage' : 'Fixed Rate'}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mt-1 max-w-md">
                                                            {tariff.description}
                                                        </p>

                                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                            <span>Updated {tariff.lastUpdated}</span>
                                                            {tariff.type === 'percentage' && (
                                                                <span>Base rate: {tariff.value}%</span>
                                                            )}
                                                            <span>
                                                                {tariff.type === 'flat'
                                                                    ? `${tariff.fixedRanges.length} ranges`
                                                                    : `${tariff.percentageRanges.length} ranges`
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <motion.button
                                                        onClick={() => toggleRowExpansion(tariff.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        {expandedRows[tariff.id] ? (
                                                            <ChevronDown size={16} className="text-gray-400" />
                                                        ) : (
                                                            <ChevronRight size={16} className="text-gray-400" />
                                                        )}
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => navigate(`/admin/finance/tariffs/edit/${tariff.id}`, {
                                                            state: { tariff }
                                                        })}
                                                        className="p-2 hover:bg-primary-100 text-gray-400 hover:text-primary-600 rounded-full transition-all"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Edit size={16} />
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => handleDeleteClick(tariff)}
                                                        className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-full transition-all"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 size={16} />
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            <AnimatePresence>
                                                {expandedRows[tariff.id] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="mt-6 pt-6 border-t border-gray-100"
                                                    >
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="font-medium text-gray-900">
                                                                {tariff.type === 'flat' ? 'Fixed Fee Ranges' : 'Percentage Fee Ranges'}
                                                            </h4>
                                                            <motion.button
                                                                onClick={() => handleAddRangeClick(tariff)}
                                                                className="flex items-center px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all text-sm font-medium"
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                <Plus size={14} className="mr-1.5" />
                                                                Add Range
                                                            </motion.button>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {(tariff.type === 'flat' ? tariff.fixedRanges : tariff.percentageRanges).map((range) => (
                                                                <div
                                                                    key={range.id}
                                                                    className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 group/range hover:border-gray-200 transition-all"
                                                                >
                                                                    <div className="flex items-start justify-between mb-2">
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {formatRange(range)}
                                                                        </div>
                                                                        <motion.button
                                                                            onClick={() => handleDeleteRangeClick(range, tariff, tariff.type === 'flat' ? 'fixed' : 'percentage')}
                                                                            className="opacity-0 group-hover/range:opacity-100 p-1 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded transition-all"
                                                                            whileHover={{ scale: 1.1 }}
                                                                            whileTap={{ scale: 0.9 }}
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </motion.button>
                                                                    </div>
                                                                    <div className="text-xs text-gray-600">
                                                                        Fee: {tariff.type === 'flat'
                                                                            ? `KES ${range.fee.toLocaleString()}`
                                                                            : `${range.fee}%`
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    className="mt-6 bg-primary-50/70 backdrop-blur-sm rounded-2xl p-6 border border-primary-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <TrendingUp size={18} className="text-primary-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary-900 mb-2">About Tariffs</h3>
                            <p className="text-primary-700 text-sm leading-relaxed">
                                Tariffs define how transaction fees are calculated. You can set up either fixed rates
                                (specific amounts for transaction ranges) or percentage-based fees. Changes take effect
                                immediately and apply to all new transactions.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showDeleteModal && tariffToDelete && (
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
                            className="bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200/50 p-8 max-w-md w-full mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Warning Icon */}
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={28} className="text-red-600" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                                Delete Tariff
                            </h3>

                            {/* Tariff Info */}
                            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-100">
                                <div className="flex items-center space-x-3 mb-2">
                                    {getTariffIcon(tariffToDelete.type)}
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{tariffToDelete.name}</h4>
                                        <p className="text-sm text-gray-600">{tariffToDelete.type === 'percentage' ? 'Percentage-based' : 'Fixed rate'}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {tariffToDelete.description}
                                </p>
                            </div>

                            {/* Warning Message */}
                            <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-red-100">
                                <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                                    <AlertTriangle size={16} className="mr-2" />
                                    Permanent Action Warning
                                </h4>
                                <div className="space-y-2 text-sm text-red-800">
                                    <p>• This action cannot be undone</p>
                                    <p>• All historical fee calculations using this tariff will lose their reference</p>
                                    <p>• Future transactions will not be able to use this pricing structure</p>
                                    <p>• Reports and analytics may be affected</p>
                                    {tariffToDelete.status === 'active' && (
                                        <p className="font-medium">• This tariff is currently ACTIVE and may be in use</p>
                                    )}
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="bg-primary-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-primary-100">
                                <h4 className="font-semibold text-primary-900 mb-2">💡 Recommendation</h4>
                                <p className="text-sm text-primary-800">
                                    Consider setting the tariff to <span className="font-medium">"inactive"</span> instead of deleting it.
                                    This preserves historical data while preventing future use.
                                </p>
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
                                    whileHover={{ scale: isDeleting ? 1 : 1.02 }}
                                    whileTap={{ scale: isDeleting ? 1 : 0.98 }}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} className="mr-2" />
                                            Delete Tariff
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {/* Additional Warning */}
                            <p className="text-xs text-gray-500 text-center mt-4">
                                This action is irreversible and may impact your billing system
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAddRangeModal && selectedTariffForRange && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleCancelAddRange}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/95 max-h-[90vh] overflow-y-auto backdrop-blur-xl rounded-3xl border border-gray-200/50 p-8 max-w-lg w-full mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    {getTariffIcon(selectedTariffForRange.type)}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Add New Range</h3>
                                        <p className="text-sm text-gray-600">{selectedTariffForRange.name} - {selectedTariffForRange.type === 'percentage' ? 'Percentage' : 'Fixed'} rate</p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={handleCancelAddRange}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={20} className="text-gray-400" />
                                </motion.button>
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Minimum (KES)
                                        </label>
                                        <input
                                            type="number"
                                            value={newRange.min}
                                            onChange={(e) => setNewRange(prev => ({ ...prev, min: parseFloat(e.target.value) || 0 }))}
                                            min="0"
                                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                                            placeholder="0"
                                            disabled={isAddingRange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Maximum (KES)
                                        </label>
                                        <input
                                            type="text"
                                            value={newRange.max === null ? '' : newRange.max}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setNewRange(prev => ({
                                                    ...prev,
                                                    max: value === '' ? null : parseFloat(value) || null
                                                }));
                                            }}
                                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                                            placeholder="Leave empty for 'and above'"
                                            disabled={isAddingRange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fee ({selectedTariffForRange.type === 'flat' ? 'KES' : '%'})
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={newRange.fee}
                                            onChange={(e) => setNewRange(prev => ({ ...prev, fee: parseFloat(e.target.value) || 0 }))}
                                            min="0"
                                            step="0.1"
                                            className="w-full px-4 py-3 pr-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                                            placeholder="0"
                                            disabled={isAddingRange}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                            {selectedTariffForRange.type === 'percentage' ? (
                                                <Percent size={16} className="text-gray-400" />
                                            ) : (
                                                <DollarSign size={16} className="text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="bg-primary-50/70 backdrop-blur-sm rounded-2xl p-4 border border-primary-100">
                                    <h4 className="font-semibold text-primary-900 mb-2">Range Preview</h4>
                                    <div className="text-sm text-primary-800">
                                        <p className="font-medium">
                                            {newRange.max === null
                                                ? `KES ${newRange.min.toLocaleString()}+`
                                                : `KES ${newRange.min.toLocaleString()} - ${newRange.max.toLocaleString()}`
                                            }
                                        </p>
                                        <p>
                                            Fee: {selectedTariffForRange.type === 'flat'
                                                ? `KES ${newRange.fee.toLocaleString()}`
                                                : `${newRange.fee}%`
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-3">
                                    <motion.button
                                        onClick={handleCancelAddRange}
                                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isAddingRange}
                                    >
                                        Cancel
                                    </motion.button>

                                    <motion.button
                                        onClick={handleConfirmAddRange}
                                        className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        whileHover={{ scale: isAddingRange ? 1 : 1.02 }}
                                        whileTap={{ scale: isAddingRange ? 1 : 0.98 }}
                                        disabled={isAddingRange}
                                    >
                                        {isAddingRange ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                Add Range
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteRangeModal && rangeToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleCancelDeleteRange}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/95 max-h-[90vh] overflow-y-auto backdrop-blur-xl rounded-3xl border border-gray-200/50 p-8 max-w-md w-full mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={28} className="text-red-600" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                                Delete Range
                            </h3>

                            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-100">
                                <div className="flex items-center space-x-3 mb-3">
                                    {getTariffIcon(rangeToDelete.tariff.type)}
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{rangeToDelete.tariff.name}</h4>
                                        <p className="text-sm text-gray-600">{rangeToDelete.type === 'percentage' ? 'Percentage' : 'Fixed'} fee range</p>
                                    </div>
                                </div>
                                <div className="bg-white/60 rounded-lg p-3">
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatRange(rangeToDelete.range)}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Fee: {rangeToDelete.type === 'fixed'
                                            ? `KES ${rangeToDelete.range.fee.toLocaleString()}`
                                            : `${rangeToDelete.range.fee}%`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-red-100">
                                <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                                    <AlertTriangle size={16} className="mr-2" />
                                    Deletion Consequences
                                </h4>
                                <div className="space-y-2 text-sm text-red-800">
                                    <p>• This pricing tier will be permanently removed</p>
                                    <p>• Transactions in this range will use default or fallback pricing</p>
                                    <p>• Historical calculations may lose their fee structure reference</p>
                                    <p>• This action cannot be undone</p>
                                    {((rangeToDelete.type === 'fixed' ? rangeToDelete.tariff.fixedRanges : rangeToDelete.tariff.percentageRanges).length === 1) && (
                                        <p className="font-medium text-red-900">• This is the LAST range - tariff will have no pricing tiers!</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-primary-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-primary-100">
                                <h4 className="font-semibold text-primary-900 mb-2">💡 Consider Instead</h4>
                                <p className="text-sm text-primary-800">
                                    You can modify this range by editing the tariff instead of deleting it.
                                    This preserves the pricing structure while allowing adjustments.
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <motion.button
                                    onClick={handleCancelDeleteRange}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isDeletingRange}
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    onClick={handleConfirmDeleteRange}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    whileHover={{ scale: isDeletingRange ? 1 : 1.02 }}
                                    whileTap={{ scale: isDeletingRange ? 1 : 0.98 }}
                                    disabled={isDeletingRange}
                                >
                                    {isDeletingRange ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} className="mr-2" />
                                            Delete Range
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Range deletion affects pricing calculations immediately
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TariffsPage;