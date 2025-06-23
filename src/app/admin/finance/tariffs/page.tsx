import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Settings,
  AlertTriangle,
  Info,
  DollarSign,
  Percent,
  Tag,
  Users,
  Activity
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';

interface FeeRule {
  id: string;
  operation: string;
  flat_fee: string;
  percent_fee: string;
  min_amount: string;
  max_amount: string;
  is_active: boolean;
  tier: string;
  kyc_level: string;
  applied_to: string;
  created_at: string;
}

const FeeRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [feeRules, setFeeRules] = useState<FeeRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [operationFilter, setOperationFilter] = useState('all');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<FeeRule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchFeeRules();
  }, []);

  const fetchFeeRules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await financeService.getAllFeeRules();
      setFeeRules(response.rules);

    } catch (err) {
      setError('Failed to fetch fee rules. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRules = feeRules.filter(rule => {
    const matchesSearch = rule.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.tier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.kyc_level.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && rule.is_active) ||
      (statusFilter === 'inactive' && !rule.is_active);

    const matchesOperation = operationFilter === 'all' || rule.operation === operationFilter;

    return matchesSearch && matchesStatus && matchesOperation;
  });

  // Rule deletion handlers
  const handleDeleteClick = (rule: FeeRule) => {
    setRuleToDelete(rule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return;

    setIsDeleting(true);
    try {
      await financeService.deleteFeeRule(ruleToDelete.id);
      setFeeRules(feeRules.filter(r => r.id !== ruleToDelete.id));
      setShowDeleteModal(false);
      setRuleToDelete(null);
      toast.success('Fee rule deleted successfully', {
        style: {
          background: '#10B981',
          color: 'white',
          borderRadius: '12px'
        }
      });
    } catch (err) {
      toast.error('Failed to delete fee rule');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRuleToDelete(null);
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'WITHDRAW':
        return <Activity size={18} className="text-amber-600" />;
      case 'DEPOSIT':
        return <DollarSign size={18} className="text-emerald-600" />;
      case 'TRANSFER':
        return <Users size={18} className="text-primary-600" />;
      default:
        return <Tag size={18} className="text-gray-600" />;
    }
  };

  const getOperationBackground = (operation: string) => {
    switch (operation) {
      case 'WITHDRAW':
        return 'bg-amber-100';
      case 'DEPOSIT':
        return 'bg-emerald-100';
      case 'TRANSFER':
        return 'bg-primary-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatCurrency = (value: string) => {
    return `KES ${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get unique operations for filtering
  const operations = ['all', ...new Set(feeRules.map(rule => rule.operation))];

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
            onClick={fetchFeeRules}
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
              <h1 className="text-2xl font-bold text-gray-900">Fee Rules Management</h1>
              <p className="text-gray-600 mt-1">Configure transaction fees and pricing</p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => navigate('/admin/finance/fee-rules/add')}
                className="flex items-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <Plus size={18} className="mr-2" />
                New Fee Rule
              </motion.button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search fee rules..."
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

            <div className="relative">
              <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors flex items-center">
                <Filter size={18} className="text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Operations</span>
              </button>
              <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-gray-100 p-2 w-48 z-20">
                {operations.map(op => (
                  <button
                    key={op}
                    onClick={() => setOperationFilter(op)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${operationFilter === op
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {op === 'all' ? 'All Operations' : op}
                  </button>
                ))}
              </div>
            </div>
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
              <p className="text-gray-500">Loading fee rules...</p>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Settings size={24} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900">No fee rules found</p>
              <p className="text-sm text-gray-500 mb-4">Get started by creating your first fee rule</p>
              <button
                onClick={() => navigate('/admin/finance/fee-rules/add')}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Create Fee Rule
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fees
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Range
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredRules.map((rule, index) => (
                      <motion.tr
                        key={rule.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="group hover:bg-gray-50/50 transition-all duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 ${getOperationBackground(rule.operation)} rounded-xl flex items-center justify-center`}>
                              {getOperationIcon(rule.operation)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{rule.operation}</div>
                              <div className="text-xs text-gray-500">Created {formatDate(rule.created_at)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900 flex items-center">
                              <DollarSign size={14} className="mr-1 text-gray-500" />
                              Flat: {formatCurrency(rule.flat_fee)}
                            </span>
                            <span className="text-sm text-gray-900 flex items-center mt-1">
                              <Percent size={14} className="mr-1 text-gray-500" />
                              Percentage: {parseFloat(rule.percent_fee).toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(rule.min_amount)} - {rule.max_amount ? formatCurrency(rule.max_amount) : 'Unlimited'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">
                              Tier: <span className="font-medium">{rule.tier}</span>
                            </span>
                            <span className="text-sm text-gray-900 mt-1">
                              KYC: <span className="font-medium">{rule.kyc_level}</span>
                            </span>
                            <span className="text-sm text-gray-900 mt-1">
                              Applied to: <span className="font-medium">{rule.applied_to}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${rule.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <motion.button
                              onClick={() => navigate(`/admin/finance/fee-rules/edit/${rule.id}`, {
                                state: { rule }
                              })}
                              className="p-2 hover:bg-primary-100 text-gray-400 hover:text-primary-600 rounded-full transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit size={16} />
                            </motion.button>

                            <motion.button
                              onClick={() => handleDeleteClick(rule)}
                              className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-full transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              disabled={isLoading}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
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
              <Info size={18} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-900 mb-2">About Fee Rules</h3>
              <p className="text-primary-700 text-sm leading-relaxed">
                Fee rules define how transaction fees are calculated based on operation type, amount range,
                user tier, and KYC level. Each rule can have both a flat fee and a percentage component.
                Changes take effect immediately and apply to all new transactions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showDeleteModal && ruleToDelete && (
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
              className="bg-white/95 backdrop-blur-xl max-h-[85vh] mt-6 overflow-y-auto rounded-3xl border border-gray-200/50 p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={28} className="text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                Delete Fee Rule
              </h3>

              {/* Rule Info */}
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 ${getOperationBackground(ruleToDelete.operation)} rounded-xl flex items-center justify-center`}>
                    {getOperationIcon(ruleToDelete.operation)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{ruleToDelete.operation}</h4>
                    <p className="text-sm text-gray-600">{ruleToDelete.tier} tier, {ruleToDelete.kyc_level} KYC</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Flat Fee:</span> {formatCurrency(ruleToDelete.flat_fee)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Percentage Fee:</span> {parseFloat(ruleToDelete.percent_fee).toFixed(2)}%
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Amount Range:</span> {formatCurrency(ruleToDelete.min_amount)} - {ruleToDelete.max_amount ? formatCurrency(ruleToDelete.max_amount) : 'Unlimited'}
                  </p>
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
                  <p>• All historical fee calculations using this rule will lose their reference</p>
                  <p>• Future transactions will not be able to use this pricing structure</p>
                  <p>• Reports and analytics may be affected</p>
                  {ruleToDelete.is_active && (
                    <p className="font-medium">• This fee rule is currently ACTIVE and may be in use</p>
                  )}
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-primary-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-primary-100">
                <h4 className="font-semibold text-primary-900 mb-2">💡 Recommendation</h4>
                <p className="text-sm text-primary-800">
                  Consider setting the fee rule to <span className="font-medium">"inactive"</span> instead of deleting it.
                  This preserves historical data while preventing future use.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={handleCancelDelete}
                  className="flex-1 px-6 py-3 bg-gray-100 border hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all"
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
                      Delete
                    </>
                  )}
                </motion.button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                This action is irreversible and may impact the billing of the system
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeeRulesPage;
