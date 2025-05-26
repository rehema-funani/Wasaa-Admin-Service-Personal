// pages/support/CannedResponses.tsx

import React, { useState, useEffect } from 'react';
import {
    PlusCircle, Edit3, Trash2, MessageSquare,
    Search, Copy, Tag, Clock, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import support from '../../../api/services/support';
import { CannedResponse } from '../../../types/support';
import SearchBar from '../../../components/support/Searchbar';
import FilterDropdown from '../../../components/support/FilterDropdown';
import LoadingSpinner from '../../../components/support/LoadingSpinner';
import EmptyState from '../../../components/support/EmptyState';
import ConfirmationModal from '../../../components/support/ConfirmationModal';

const CannedResponses: React.FC = () => {
    // State
    const [responses, setResponses] = useState<CannedResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [responseToDelete, setResponseToDelete] = useState<CannedResponse | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingResponse, setEditingResponse] = useState<CannedResponse | null>(null);
    const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categories: [] as string[],
        status: 'active' as 'active' | 'archived'
    });

    const availableCategories = ['wallet', 'payments', 'account', 'login', 'general'];

    useEffect(() => {
        fetchResponses();
    }, [categoryFilter]);

    const fetchResponses = async () => {
        try {
            setIsLoading(true);
            const data = await support.getCannedResponses(
                categoryFilter !== 'all' ? categoryFilter : undefined
            );
            setResponses(data);
        } catch (error) {
            toast.error('Failed to load canned responses');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!responseToDelete) return;

        try {
            // In real implementation, would call delete API
            toast.success('Canned response deleted successfully');
            setShowDeleteModal(false);
            setResponseToDelete(null);
            fetchResponses();
        } catch (error) {
            toast.error('Failed to delete canned response');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.categories.length === 0) {
            toast.error('Please select at least one category');
            return;
        }

        try {
            if (editingResponse) {
                // In real implementation, would call update API
                toast.success('Canned response updated successfully');
                setShowEditModal(false);
            } else {
                await support.createCannedResponse({
                    ...formData,
                    createdBy: 'current_user' // Would get from auth context
                });
                toast.success('Canned response created successfully');
                setShowAddModal(false);
            }
            setEditingResponse(null);
            resetForm();
            fetchResponses();
        } catch (error) {
            toast.error('Failed to save canned response');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            categories: [],
            status: 'active'
        });
    };

    const openEditModal = (response: CannedResponse) => {
        setEditingResponse(response);
        setFormData({
            title: response.title,
            content: response.content,
            categories: response.categories,
            status: response.status
        });
        setShowEditModal(true);
    };

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard');
    };

    const toggleExpanded = (id: string) => {
        const newExpanded = new Set(expandedResponses);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedResponses(newExpanded);
    };

    const filteredResponses = responses.filter(response => {
        const matchesSearch =
            response.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            response.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        ...availableCategories.map(cat => ({
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1)
        }))
    ];

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">Canned Responses</h1>
                            <p className="text-gray-500 text-sm mt-1">Pre-written templates for common support queries</p>
                        </div>

                        <motion.button
                            onClick={() => {
                                resetForm();
                                setShowAddModal(true);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm transition-all text-sm font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <PlusCircle size={16} />
                            <span>New Response</span>
                        </motion.button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                        <div className="flex-grow">
                            <SearchBar
                                placeholder="Search responses..."
                                value={searchQuery}
                                onChange={setSearchQuery}
                            />
                        </div>

                        <FilterDropdown
                            label="Category"
                            options={categoryOptions}
                            value={categoryFilter}
                            onChange={(value) => setCategoryFilter(value as string)}
                        />
                    </div>
                </div>

                {/* Responses List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="large" message="Loading responses..." />
                    </div>
                ) : filteredResponses.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
                        <EmptyState
                            icon={MessageSquare}
                            title="No canned responses found"
                            description={searchQuery ? "Try adjusting your search" : "Create your first canned response"}
                            action={{
                                label: 'Create Response',
                                onClick: () => {
                                    resetForm();
                                    setShowAddModal(true);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredResponses.map((response) => (
                            <motion.div
                                key={response.id}
                                whileHover={{ y: -1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-medium text-gray-900">{response.title}</h3>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => copyToClipboard(response.content)}
                                                    className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(response)}
                                                    className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setResponseToDelete(response);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={`text-sm text-gray-600 ${expandedResponses.has(response.id) ? '' : 'line-clamp-2'}`}>
                                            {response.content}
                                        </div>

                                        {response.content.length > 150 && (
                                            <button
                                                onClick={() => toggleExpanded(response.id)}
                                                className="text-sm text-primary-600 hover:text-primary-700 mt-1"
                                            >
                                                {expandedResponses.has(response.id) ? 'Show less' : 'Show more'}
                                            </button>
                                        )}

                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center gap-2">
                                                <Tag size={14} className="text-gray-400" />
                                                <div className="flex items-center gap-1">
                                                    {response.categories.map((cat, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                                        >
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock size={12} />
                                                <span>Created {new Date(response.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            {response.status === 'archived' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                    Archived
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

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
                                setEditingResponse(null);
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    {editingResponse ? 'Edit Canned Response' : 'Create Canned Response'}
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Response Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                            placeholder="e.g., Password Reset Instructions"
                                            required
                                        />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Response Content
                                        </label>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                            placeholder="Enter your response template..."
                                            rows={6}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Tip: Use variables like {'{customer_name}'} for personalization
                                        </p>
                                    </div>

                                    {/* Categories */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Categories
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableCategories.map((category) => (
                                                <label
                                                    key={category}
                                                    className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
                            ${formData.categories.includes(category)
                                                            ? 'bg-primary-50 border-primary-300 text-primary-700'
                                                            : 'bg-white border-gray-200 hover:bg-gray-50'
                                                        }
                          `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.categories.includes(category)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData({
                                                                    ...formData,
                                                                    categories: [...formData.categories, category]
                                                                });
                                                            } else {
                                                                setFormData({
                                                                    ...formData,
                                                                    categories: formData.categories.filter(c => c !== category)
                                                                });
                                                            }
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-sm capitalize">{category}</span>
                                                </label>
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
                                                setEditingResponse(null);
                                            }}
                                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all text-sm"
                                        >
                                            {editingResponse ? 'Update Response' : 'Create Response'}
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
                        setResponseToDelete(null);
                    }}
                    onConfirm={handleDelete}
                    title="Delete Canned Response"
                    message={`Are you sure you want to delete "${responseToDelete?.title}"? This action cannot be undone.`}
                    confirmText="Delete"
                    type="danger"
                />
            </div>
        </div>
    );
};

export default CannedResponses;