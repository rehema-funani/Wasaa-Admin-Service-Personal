// pages/support/CategoryManagement.tsx

import React, { useState, useEffect } from 'react';
import {
    PlusCircle, Edit3, Trash2, Archive,
    Tag, AlertTriangle, Info, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { TicketCategory } from '../../../types/support';
import support from '../../../api/services/support';
import LoadingSpinner from '../../../components/support/LoadingSpinner';
import EmptyState from '../../../components/support/EmptyState';
import PriorityBadge from '../../../components/support/PriorityBadge';
import ConfirmationModal from '../../../components/support/ConfirmationModal';

const CategoryManagement: React.FC = () => {
    // State
    const [categories, setCategories] = useState<TicketCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<TicketCategory | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        defaultPriority: 'medium' as 'critical' | 'high' | 'medium' | 'low',
        icon: '📋',
        color: '#6B7280',
        status: 'active' as 'active' | 'archived'
    });

    const availableIcons = ['💰', '💳', '👤', '🔐', '📋', '🎯', '🛡️', '⚡', '🔔', '📱'];
    const availableColors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
        '#6B7280', '#8B5CF6', '#EC4899', '#14B8A6'
    ];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await support.getCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        try {
            // In real implementation, would call delete API
            toast.success('Category archived successfully');
            setShowDeleteModal(false);
            setCategoryToDelete(null);
            fetchCategories();
        } catch (error) {
            toast.error('Failed to archive category');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await support.updateCategory(editingCategory.id, formData);
                toast.success('Category updated successfully');
                setShowEditModal(false);
            } else {
                await support.createCategory(formData);
                toast.success('Category created successfully');
                setShowAddModal(false);
            }
            setEditingCategory(null);
            resetForm();
            fetchCategories();
        } catch (error) {
            toast.error('Failed to save category');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            defaultPriority: 'medium',
            icon: '📋',
            color: '#6B7280',
            status: 'active'
        });
    };

    const openEditModal = (category: TicketCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            defaultPriority: category.defaultPriority,
            icon: category.icon || '📋',
            color: category.color || '#6B7280',
            status: category.status
        });
        setShowEditModal(true);
    };

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">Ticket Categories</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage issue categories and routing rules</p>
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
                            <span>New Category</span>
                        </motion.button>
                    </div>
                </div>

                {/* Categories Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="large" message="Loading categories..." />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
                        <EmptyState
                            icon={Tag}
                            title="No categories found"
                            description="Create your first category to organize support tickets"
                            action={{
                                label: 'Create Category',
                                onClick: () => {
                                    resetForm();
                                    setShowAddModal(true);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <motion.div
                                key={category.id}
                                whileHover={{ y: -2 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
                            >
                                {/* Category Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: `${category.color}20` }}
                                        >
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${category.status === 'active' ? 'text-green-600' : 'text-gray-500'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${category.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`} />
                                                {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCategoryToDelete(category);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Archive size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Default Priority */}
                                <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-1">Default Priority</p>
                                    <PriorityBadge priority={category.defaultPriority} size="small" />
                                </div>

                                {/* Routing Rule */}
                                {category.routingRule && (
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 mb-1">Auto-routing</p>
                                        <p className="text-sm text-gray-700">{category.routingRule}</p>
                                    </div>
                                )}

                                {/* Statistics */}
                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                    <span>Active tickets: 24</span>
                                    <span>This week: +12</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-6 bg-blue-50/70 rounded-xl p-3 border border-blue-100 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-700">About Categories</h3>
                            <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                                Categories help organize tickets and can have default priority levels and routing rules.
                                Archived categories remain in the system for historical reference but cannot be selected for new tickets.
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
                                setEditingCategory(null);
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
                                    {editingCategory ? 'Edit Category' : 'Create Category'}
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            placeholder="e.g., Payments"
                                            required
                                        />
                                    </div>

                                    {/* Icon and Color */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Icon
                                            </label>
                                            <div className="grid grid-cols-5 gap-2">
                                                {availableIcons.map((icon) => (
                                                    <button
                                                        key={icon}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, icon })}
                                                        className={`p-2 rounded-lg text-xl transition-all ${formData.icon === icon
                                                            ? 'bg-indigo-100 ring-2 ring-indigo-500'
                                                            : 'bg-gray-100 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {icon}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Color
                                            </label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {availableColors.map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, color })}
                                                        className={`h-8 rounded-lg transition-all ${formData.color === color
                                                            ? 'ring-2 ring-offset-2 ring-gray-400'
                                                            : ''
                                                            }`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Default Priority */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Default Priority
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {(['critical', 'high', 'medium', 'low'] as const).map((priority) => (
                                                <button
                                                    key={priority}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, defaultPriority: priority })}
                                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${formData.defaultPriority === priority
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                                </button>
                                            ))}
                                        </div>
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
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'archived' })}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Active</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="archived"
                                                    checked={formData.status === 'archived'}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'archived' })}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Archived</span>
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
                                                setEditingCategory(null);
                                            }}
                                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all text-sm"
                                        >
                                            {editingCategory ? 'Update Category' : 'Create Category'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Archive Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setCategoryToDelete(null);
                    }}
                    onConfirm={handleDelete}
                    title="Archive Category"
                    message={`Are you sure you want to archive "${categoryToDelete?.name}"? Archived categories cannot be used for new tickets but will remain for historical reference.`}
                    confirmText="Archive"
                    type="warning"
                />
            </div>
        </div>
    );
};

export default CategoryManagement;