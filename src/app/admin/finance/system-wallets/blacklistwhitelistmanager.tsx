import React, { useState, useEffect } from 'react';
import {
    UserX,
    UserCheck,
    Search,
    RefreshCw,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Shield,
    User,
    Download,
    Trash2,
    PlusCircle,
    Mail,
    Smartphone,
    Network,
    Wallet,
    TrendingUp,
    Eye,
    Edit3,
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
import financeService from '../../../../api/services/finance';
import { ListEntry } from '../../../../types/finance';
import ViewBlackListModal from '../../../../components/finance/ViewBlackListModal';
import AddEditBlacklistModal from '../../../../components/finance/AddEditBlacklistModal';

const BlacklistWhitelistManager: React.FC = () => {
    const [entries, setEntries] = useState<ListEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'blacklist' | 'whitelist'>('blacklist');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [entityTypeFilter, setEntityTypeFilter] = useState<'all' | 'user' | 'email' | 'phone' | 'ip_address' | 'device_id' | 'account'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'inactive' | 'approved' | 'rejected'>('all');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<ListEntry | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'view' | 'add' | 'edit' | 'delete' | null>(null);

    const [formData, setFormData] = useState({
        entityType: 'user',
        userWalletId: '',
        reason: '',
        notes: ''
    });

    useEffect(() => {
        fetchListEntries();
    }, []);

    const fetchListEntries = async () => {
        setIsLoading(true);
        try {
            const response = await financeService.getAllBlacklistEntries();
            if (response && response.data) {
                setEntries(response.data);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch blacklist/whitelist data', error);
            setErrorMessage('Failed to load blacklist/whitelist data');
            setIsLoading(false);
        }
    };

    const filteredEntries = entries.filter(entry => {
        const matchesTab = entry.type === activeTab;

        const matchesSearch = 
            entry.userWalletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (entry.reason?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (entry.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            entry.UserWallet.user_uuid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.UserWallet.group_uuid.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesEntityType = entityTypeFilter === 'all' || entry.entityType === entityTypeFilter;
        const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;

        return matchesTab && matchesSearch && matchesEntityType && matchesStatus;
    });

    const handleAddEntry = async () => {
        try {
            const newEntry: Partial<ListEntry> = {
                type: activeTab,
                entityType: formData.entityType as any,
                userWalletId: formData.userWalletId,
                reason: formData.reason,
                notes: formData.notes || null,
                status: 'pending'
            };

            // Call API to add entry
            // await financeService.addBlacklistEntry(newEntry);
            
            showSuccess(`${activeTab === 'blacklist' ? 'Blacklist' : 'Whitelist'} entry added successfully`);
            
            // Refresh the list
            await fetchListEntries();
            
            resetForm();
            setIsModalOpen(false);
            setModalType(null);
        } catch (error) {
            showError('Failed to add entry');
        }
    };

    const handleUpdateEntry = async () => {
        if (!selectedEntry) return;

        try {
            // await financeService.updateBlacklistEntry(selectedEntry.id, formData);
            
            showSuccess(`${activeTab === 'blacklist' ? 'Blacklist' : 'Whitelist'} entry updated successfully`);
            
            await fetchListEntries();
            
            resetForm();
            setIsModalOpen(false);
            setModalType(null);
            setSelectedEntry(null);
        } catch (error) {
            showError('Failed to update entry');
        }
    };

    const handleDeleteEntry = async () => {
        if (!selectedEntry) return;

        try {
            // await financeService.deleteBlacklistEntry(selectedEntry.id);
            
            showSuccess(`${activeTab === 'blacklist' ? 'Blacklist' : 'Whitelist'} entry deleted successfully`);
            
            // Refresh the list
            await fetchListEntries();
            
            setIsModalOpen(false);
            setModalType(null);
            setSelectedEntry(null);
        } catch (error) {
            showError('Failed to delete entry');
        }
    };

    const toggleEntryStatus = async (entryId: string) => {
        try {
            // In a real implementation, this would call an API
            // await financeService.toggleBlacklistEntryStatus(entryId);
            
            showSuccess('Entry status updated successfully');
            
            // Refresh the list
            await fetchListEntries();
        } catch (error) {
            showError('Failed to update entry status');
        }
    };

    const resetForm = () => {
        setFormData({
            entityType: 'user',
            userWalletId: '',
            reason: '',
            notes: ''
        });
    };

    // Modal handlers
    const openViewModal = (entry: ListEntry) => {
        setSelectedEntry(entry);
        setModalType('view');
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        resetForm();
        setModalType('add');
        setIsModalOpen(true);
    };

    const openEditModal = (entry: ListEntry) => {
        setSelectedEntry(entry);
        setFormData({
            entityType: entry.entityType,
            userWalletId: entry.userWalletId,
            reason: entry.reason || '',
            notes: entry.notes || ''
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    const openDeleteModal = (entry: ListEntry) => {
        setSelectedEntry(entry);
        setModalType('delete');
        setIsModalOpen(true);
    };

    // Utility functions
    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setErrorMessage(null);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setSuccessMessage(null);
        setTimeout(() => setErrorMessage(null), 3000);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(parseFloat(amount));
    };

    const getEntityTypeIcon = (type: string) => {
        switch (type) {
            case 'user':
                return <User className="w-4 h-4" />;
            case 'email':
                return <Mail className="w-4 h-4" />;
            case 'phone':
                return <Smartphone className="w-4 h-4" />;
            case 'ip_address':
                return <Network className="w-4 h-4" />;
            case 'device_id':
                return <Smartphone className="w-4 h-4" />;
            case 'account':
                return <Wallet className="w-4 h-4" />;
            default:
                return <User className="w-4 h-4" />;
        }
    };

    const formatEntityType = (type: string) => {
        switch (type) {
            case 'user':
                return 'User';
            case 'email':
                return 'Email';
            case 'phone':
                return 'Phone';
            case 'ip_address':
                return 'IP Address';
            case 'device_id':
                return 'Device ID';
            case 'account':
                return 'Account';
            default:
                return type;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'inactive':
            case 'rejected':
                return 'bg-slate-50 text-slate-700 border-slate-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
            case 'approved':
                return <CheckCircle2 className="w-3 h-3" />;
            case 'pending':
                return <Clock className="w-3 h-3" />;
            case 'inactive':
            case 'rejected':
                return <XCircle className="w-3 h-3" />;
            default:
                return <Clock className="w-3 h-3" />;
        }
    };

    const getRiskColor = (riskScore: number | null) => {
        if (riskScore === null) return 'text-slate-400';
        if (riskScore >= 80) return 'text-red-600';
        if (riskScore >= 60) return 'text-orange-600';
        if (riskScore >= 40) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getModalTitle = () => {
        switch (modalType) {
            case 'view':
                return `${selectedEntry?.type === 'blacklist' ? 'Blacklist' : 'Whitelist'} Entry Details`;
            case 'add':
                return `Add ${activeTab === 'blacklist' ? 'Blacklist' : 'Whitelist'} Entry`;
            case 'edit':
                return `Edit ${selectedEntry?.type === 'blacklist' ? 'Blacklist' : 'Whitelist'} Entry`;
            case 'delete':
                return `Delete ${selectedEntry?.type === 'blacklist' ? 'Blacklist' : 'Whitelist'} Entry`;
            default:
                return '';
        }
    };

    const blacklistCount = entries.filter(e => e.type === 'blacklist').length;
    const whitelistCount = entries.filter(e => e.type === 'whitelist').length;
    const pendingCount = entries.filter(e => e.status === 'pending').length;
    const activeCount = entries.filter(e => e.status === 'active' || e.status === 'approved').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Risk Management Center
                            </h1>
                            <p className="text-slate-600 mt-2">
                                Advanced blacklist and whitelist management for financial compliance
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                            >
                                <PlusCircle size={18} />
                                Add Entry
                            </button>
                            
                            <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200 font-medium">
                                <Download size={18} />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Alert Messages */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-100 rounded-full">
                                <CheckCircle2 size={16} className="text-emerald-600" />
                            </div>
                            <span className="text-emerald-800 font-medium">{successMessage}</span>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-red-100 rounded-full">
                                <AlertTriangle size={16} className="text-red-600" />
                            </div>
                            <span className="text-red-800 font-medium">{errorMessage}</span>
                        </div>
                    </div>
                )}

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl">
                                <UserX className="w-6 h-6 text-red-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{blacklistCount}</p>
                            <p className="text-sm text-slate-600 mt-1">Blacklisted Entities</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
                                <UserCheck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{whitelistCount}</p>
                            <p className="text-sm text-slate-600 mt-1">Whitelisted Entities</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl">
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                            <p className="text-sm text-slate-600 mt-1">Pending Review</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
                            <p className="text-sm text-slate-600 mt-1">Active Rules</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-white/50 mb-8">
                    <button
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                            activeTab === 'blacklist'
                                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                        }`}
                        onClick={() => setActiveTab('blacklist')}
                    >
                        <UserX size={20} />
                        Blacklist ({blacklistCount})
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                            activeTab === 'whitelist'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                        }`}
                        onClick={() => setActiveTab('whitelist')}
                    >
                        <UserCheck size={20} />
                        Whitelist ({whitelistCount})
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-200/50">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeTab} entries...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <select
                                    value={entityTypeFilter}
                                    onChange={(e) => setEntityTypeFilter(e.target.value as any)}
                                    className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                                >
                                    <option value="all">All Types</option>
                                    <option value="user">Users</option>
                                    <option value="email">Emails</option>
                                    <option value="phone">Phone Numbers</option>
                                    <option value="ip_address">IP Addresses</option>
                                    <option value="device_id">Device IDs</option>
                                    <option value="account">Accounts</option>
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as any)}
                                    className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="approved">Approved</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                                <button
                                    onClick={fetchListEntries}
                                    disabled={isLoading}
                                    className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl hover:bg-slate-100/50 transition-all text-slate-600 disabled:opacity-50"
                                >
                                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center">
                            <RefreshCw size={32} className="mx-auto text-blue-500 animate-spin mb-4" />
                            <p className="text-slate-600 font-medium">Loading {activeTab} entries...</p>
                            <p className="text-slate-400 text-sm mt-1">Please wait while we fetch the data</p>
                        </div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                                {activeTab === 'blacklist' ? (
                                    <UserX size={32} className="text-slate-400" />
                                ) : (
                                    <UserCheck size={32} className="text-slate-400" />
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">No entries found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                            <button
                                onClick={openAddModal}
                                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                            >
                                Add First Entry
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Entity</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Wallet Info</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Reason</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Risk Score</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Added</th>
                                        <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50">
                                    {filteredEntries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                                                        {getEntityTypeIcon(entry.entityType)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{formatEntityType(entry.entityType)}</p>
                                                        <p className="text-sm text-slate-500">ID: {entry.id.substring(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Wallet className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm font-mono text-slate-600">
                                                            {entry.userWalletId.substring(0, 8)}...
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-500">Balance:</span>
                                                        <span className="text-xs font-semibold text-slate-700">
                                                            {formatCurrency(entry.UserWallet.balance)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-700 max-w-xs truncate" title={entry.reason || 'No reason provided'}>
                                                    {entry.reason || 'No reason provided'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(entry.status)}`}>
                                                    {getStatusIcon(entry.status)}
                                                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {entry.riskScore !== null ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm font-bold ${getRiskColor(entry.riskScore)}`}>
                                                            {entry.riskScore}
                                                        </span>
                                                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all ${
                                                                    entry.riskScore >= 80 ? 'bg-red-500' :
                                                                    entry.riskScore >= 60 ? 'bg-orange-500' :
                                                                    entry.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                                                                }`}
                                                                style={{ width: `${entry.riskScore}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600">
                                                    {formatDate(entry.addedAt)}
                                                </div>
                                                {entry.addedBy && (
                                                    <div className="text-xs text-slate-400">
                                                        by {entry.addedBy}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openViewModal(entry)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(entry)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Edit Entry"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleEntryStatus(entry.id)}
                                                        className={`p-2 rounded-lg transition-all ${
                                                            entry.status === 'active' || entry.status === 'approved'
                                                                ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                                                : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                                                        }`}
                                                        title={entry.status === 'active' || entry.status === 'approved' ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {entry.status === 'active' || entry.status === 'approved' ? (
                                                            <XCircle size={16} />
                                                        ) : (
                                                            <CheckCircle2 size={16} />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(entry)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Entry"
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

                    <div className="px-6 py-4 border-t border-slate-200/50 flex items-center justify-between bg-slate-50/50">
                        <div className="text-sm text-slate-600">
                            Showing {filteredEntries.length} of {entries.filter(e => e.type === activeTab).length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all" disabled>
                                Previous
                            </button>
                            <button className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all" disabled>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setSelectedEntry(null);
                    resetForm();
                }}
                title={getModalTitle()}
                size="lg"
            >
                {modalType === 'view' && selectedEntry && (
                    <ViewBlackListModal
                        selectedEntry={selectedEntry}
                        setIsModalOpen={setIsModalOpen}
                        openEditModal={openEditModal}
                        getEntityTypeIcon={getEntityTypeIcon}
                        formatEntityType={formatEntityType}
                        getStatusIcon={getStatusIcon}
                        getStatusColor={getStatusColor}
                        formatCurrency={formatCurrency}
                        getRiskColor={getRiskColor}
                        formatDate={formatDate}
                    />
                )}

                {(modalType === 'add' || modalType === 'edit') && (
                    <AddEditBlacklistModal
                        modalType={modalType}
                        setModalType={setModalType}
                        activeTab={activeTab}
                        selectedEntry={selectedEntry}
                        formData={formData}
                        setFormData={setFormData}
                        handleAddEntry={handleAddEntry}
                        handleUpdateEntry={handleUpdateEntry}
                        setIsModalOpen={setIsModalOpen}
                        resetForm={resetForm}
                    />
                )}

                {modalType === 'delete' && selectedEntry && (
                    <div className="space-y-6">
                        <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <p className="text-sm font-medium text-red-800">
                                    Are you sure you want to delete this {selectedEntry.type} entry? This action cannot be undone and will be logged for audit purposes.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500">Entity Type:</span>
                                    <p className="font-semibold text-slate-700">{formatEntityType(selectedEntry.entityType)}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Wallet ID:</span>
                                    <p className="font-mono text-slate-700 break-all">{selectedEntry.userWalletId}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-500">Reason:</span>
                                <p className="font-medium text-slate-700">{selectedEntry.reason || 'No reason provided'}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setSelectedEntry(null);
                                }}
                                className="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteEntry}
                                className="px-6 py-3 text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-sm font-medium"
                            >
                                Delete Entry
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BlacklistWhitelistManager;