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
    Eye,
    MoreHorizontal
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';

interface Tariff {
    id: string;
    name: string;
    description: string;
    type: 'flat' | 'percentage';
    value: number;
    status: 'active' | 'inactive';
    lastUpdated: string;
    fixedRanges: Array<{
        id: string;
        min: number;
        max: number | null;
        fee: number;
    }>;
    percentageRanges: Array<{
        id: string;
        min: number;
        max: number | null;
        fee: number;
    }>;
}

const TariffsPage = () => {
    const navigate = useNavigate();
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

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

    const handleDelete = async (tariff: Tariff) => {
        if (!confirm(`Are you sure you want to delete "${tariff.name}"? This action cannot be undone.`)) {
            return;
        }

        setIsLoading(true);
        try {
            await financeService.deleteTariff(tariff.id);
            setTariffs(tariffs.filter(t => t.id !== tariff.id));
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
            setIsLoading(false);
        }
    };

    const formatRange = (range: any) => {
        if (range.max === null) {
            return `KES ${range.min.toLocaleString()}+`;
        }
        return `KES ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`;
    };

    const getTariffIcon = (type: string) => {
        return type === 'percentage' ? (
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Percent size={18} className="text-blue-600" />
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
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
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
                                className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all"
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
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all"
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
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
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
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
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
                                                                    ? 'bg-blue-100 text-blue-700'
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
                                                        className="p-2 hover:bg-indigo-100 text-gray-400 hover:text-indigo-600 rounded-full transition-all"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Edit size={16} />
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => handleDelete(tariff)}
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
                                                        <h4 className="font-medium text-gray-900 mb-4">
                                                            {tariff.type === 'flat' ? 'Fixed Fee Ranges' : 'Percentage Fee Ranges'}
                                                        </h4>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {(tariff.type === 'flat' ? tariff.fixedRanges : tariff.percentageRanges).map((range) => (
                                                                <div
                                                                    key={range.id}
                                                                    className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100"
                                                                >
                                                                    <div className="text-sm font-medium text-gray-900 mb-2">
                                                                        {formatRange(range)}
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

                {/* Info Card */}
                <motion.div
                    className="mt-6 bg-indigo-50/70 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <TrendingUp size={18} className="text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-indigo-900 mb-2">About Tariffs</h3>
                            <p className="text-indigo-700 text-sm leading-relaxed">
                                Tariffs define how transaction fees are calculated. You can set up either fixed rates
                                (specific amounts for transaction ranges) or percentage-based fees. Changes take effect
                                immediately and apply to all new transactions.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TariffsPage;