// pages/support/SLAManagement.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, PlusCircle, Edit3, Trash2, AlertTriangle,
    TrendingUp, Info, CheckCircle, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { SLAConfig } from '../../../types/support';
import support from '../../../api/services/support';
import LoadingSpinner from '../../../components/support/LoadingSpinner';
import EmptyState from '../../../components/support/EmptyState';
import PriorityBadge from '../../../components/support/PriorityBadge';
import ConfirmationModal from '../../../components/support/ConfirmationModal';

const SLAManagement: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [slaConfigs, setSlaConfigs] = useState<SLAConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [configToDelete, setConfigToDelete] = useState<SLAConfig | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingConfig, setEditingConfig] = useState<SLAConfig | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        priority: 'medium' as 'critical' | 'high' | 'medium' | 'low',
        category: '',
        responseTimeSLA: 60,
        resolutionTimeSLA: 240,
        escalationWindow: 30,
        status: 'active' as 'active' | 'inactive'
    });

    useEffect(() => {
        fetchSLAConfigs();
    }, []);

    const fetchSLAConfigs = async () => {
        try {
            setIsLoading(true);
            const data = await support.getSLAConfigs();
            setSlaConfigs(data);
        } catch (error) {
            toast.error('Failed to load SLA configurations');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!configToDelete) return;

        try {
            await support.deleteSLAConfig(configToDelete.id);
            toast.success('SLA configuration deleted successfully');
            setShowDeleteModal(false);
            setConfigToDelete(null);
            fetchSLAConfigs();
        } catch (error) {
            toast.error('Failed to delete SLA configuration');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingConfig) {
                await support.updateSLAConfig(editingConfig.id, formData);
                toast.success('SLA configuration updated successfully');
                setShowEditModal(false);
            } else {
                await support.createSLAConfig(formData);
                toast.success('SLA configuration created successfully');
                setShowAddModal(false);
            }
            setEditingConfig(null);
            resetForm();
            fetchSLAConfigs();
        } catch (error) {
            toast.error('Failed to save SLA configuration');
        }
    };

    const resetForm = () => {
        setFormData({
            priority: 'medium',
            category: '',
            responseTimeSLA: 60,
            resolutionTimeSLA: 240,
            escalationWindow: 30,
            status: 'active'
        });
    };

    const openEditModal = (config: SLAConfig) => {
        setEditingConfig(config);
        setFormData({
            priority: config.priority,
            category: config.category,
            responseTimeSLA: config.responseTimeSLA,
            resolutionTimeSLA: config.resolutionTimeSLA,
            escalationWindow: config.escalationWindow || 30,
            status: config.status
        });
        setShowEditModal(true);
    };

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const categories = ['wallet', 'payments', 'account', 'login', 'general'];

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">SLA Configuration</h1>
                            <p className="text-gray-500 text-sm mt-1">Define response and resolution time targets</p>
                        </div>

                        <motion.button
                            onClick={() => {
                                resetForm();
                                setShowAddModal(true);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all text-sm font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <PlusCircle size={16} />
                            <span>New SLA Rule</span>
                        </motion.button>
                    </div>
                </div>

                {/* SLA Rules Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner size="large" message="Loading SLA configurations..." />
                        </div>
                    ) : slaConfigs.length === 0 ? (
                        <EmptyState
                            icon={Clock}
                            title="No SLA rules configured"
                            description="Create your first SLA rule to set response time targets"
                            action={{
                                label: 'Create SLA Rule',
                                onClick: () => {
                                    resetForm();
                                    setShowAddModal(true);
                                }
                            }}
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Priority Level</th>
                                        <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Category</th>
                                        <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">Response Time</th>
                                        <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">Resolution Time</th>
                                        <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">Escalation</th>
                                        <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">Status</th>
                                        <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slaConfigs.map((config) => (
                                        <tr key={config.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <PriorityBadge priority={config.priority} size="small" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-900 capitalize">{config.category}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-1">
                                                    <Clock size={14} className="text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {formatTime(config.responseTimeSLA)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-1">
                                                    <CheckCircle size={14} className="text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {formatTime(config.resolutionTimeSLA)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {config.escalationWindow ? (
                                                    <div className="inline-flex items-center gap-1">
                                                        <TrendingUp size={14} className="text-orange-500" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {formatTime(config.escalationWindow)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${config.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${config.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                                                        }`} />
                                                    {config.status.charAt(0).toUpperCase() + config.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(config)}
                                                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setConfigToDelete(config);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="mt-6 bg-blue-50/70 rounded-xl p-3 border border-blue-100 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-700">About SLA Rules</h3>
                            <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                                SLA (Service Level Agreement) rules define the expected response and resolution times for tickets based on their priority and category.
                                Tickets that exceed these times will be marked as breached and can trigger escalations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {(showAddModal || showEditModal) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => {
                                setShowAddModal(false);
                                setShowEditModal(false);
                                setEditingConfig(null);
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md w-full shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    {editingConfig ? 'Edit SLA Rule' : 'Create SLA Rule'}
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Priority */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority Level
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {(['critical', 'high', 'medium', 'low'] as const).map((priority) => (
                                                <button
                                                    key={priority}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, priority })}
                                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${formData.priority === priority
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Response Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Response Time (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            min="5"
                                            max="4320"
                                            value={formData.responseTimeSLA}
                                            onChange={(e) => setFormData({ ...formData, responseTimeSLA: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Minimum: 5 minutes, Maximum: 72 hours</p>
                                    </div>

                                    {/* Resolution Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Resolution Time (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            min="5"
                                            max="4320"
                                            value={formData.resolutionTimeSLA}
                                            onChange={(e) => setFormData({ ...formData, resolutionTimeSLA: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Escalation Window */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Escalation Window (minutes) - Optional
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="4320"
                                            value={formData.escalationWindow}
                                            onChange={(e) => setFormData({ ...formData, escalationWindow: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Time before automatic escalation</p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="active"
                                                    checked={formData.status === 'active'}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Active</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="inactive"
                                                    checked={formData.status === 'inactive'}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Inactive</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setShowEditModal(false);
                                                setEditingConfig(null);
                                            }}
                                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all text-sm"
                                        >
                                            {editingConfig ? 'Update Rule' : 'Create Rule'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setConfigToDelete(null);
                    }}
                    onConfirm={handleDelete}
                    title="Delete SLA Rule"
                    message={`Are you sure you want to delete this SLA rule for ${configToDelete?.priority} priority ${configToDelete?.category} tickets? This action cannot be undone.`}
                    confirmText="Delete"
                    type="danger"
                />
            </div>
        </div>
    );
};

export default SLAManagement;