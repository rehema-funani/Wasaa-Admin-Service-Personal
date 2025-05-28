import React, { useState, useEffect } from 'react';
import {
    UserX,
    UserCheck,
    Search,
    RefreshCw,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Shield,
    Calendar,
    User,
    Globe,
    FileText,
    Download,
    Trash2,
    PlusCircle,
    Copy,
    Mail,
    Smartphone,
    Network,
    ChevronDown,
    Hash
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
// import amlService from '../../../../api/services/aml';

// Types for blacklist/whitelist entries
interface ListEntry {
    id: string;
    type: 'blacklist' | 'whitelist';
    entityType: 'user' | 'email' | 'phone' | 'ip_address' | 'device_id' | 'account';
    value: string;
    reason: string;
    status: 'active' | 'inactive';
    addedBy: string;
    addedAt: string;
    expiresAt?: string;
    notes?: string;
    lastTriggered?: string;
    triggerCount?: number;
    riskScore?: number;
}

const BlacklistWhitelistManager: React.FC = () => {
    const [entries, setEntries] = useState<ListEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'blacklist' | 'whitelist'>('blacklist');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [entityTypeFilter, setEntityTypeFilter] = useState<'all' | 'user' | 'email' | 'phone' | 'ip_address' | 'device_id' | 'account'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<ListEntry | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'view' | 'add' | 'edit' | 'delete' | null>(null);

    const [formData, setFormData] = useState({
        entityType: 'user',
        value: '',
        reason: '',
        expiresAt: '',
        notes: ''
    });

    const mockEntries: ListEntry[] = [
        {
            id: 'bl-001',
            type: 'blacklist',
            entityType: 'user',
            value: 'user-045',
            reason: 'Multiple fraud attempts detected',
            status: 'active',
            addedBy: 'Compliance Officer',
            addedAt: '2025-05-15T09:30:00Z',
            notes: 'User attempted to circumvent transaction limits with multiple accounts',
            lastTriggered: '2025-05-18T14:20:00Z',
            triggerCount: 3,
            riskScore: 85
        },
        {
            id: 'bl-002',
            type: 'blacklist',
            entityType: 'email',
            value: 'suspicious@example.com',
            reason: 'Associated with phishing campaign',
            status: 'active',
            addedBy: 'Security Team',
            addedAt: '2025-05-16T11:45:00Z',
            expiresAt: '2025-08-16T11:45:00Z',
            triggerCount: 0,
            riskScore: 72
        },
        {
            id: 'bl-003',
            type: 'blacklist',
            entityType: 'ip_address',
            value: '192.168.23.45',
            reason: 'Multiple failed login attempts',
            status: 'active',
            addedBy: 'Security Alert System',
            addedAt: '2025-05-17T08:15:00Z',
            lastTriggered: '2025-05-17T15:10:00Z',
            triggerCount: 12,
            riskScore: 68
        },
        {
            id: 'bl-004',
            type: 'blacklist',
            entityType: 'device_id',
            value: 'dev-7890abcd-1234',
            reason: 'Device associated with fraud',
            status: 'inactive',
            addedBy: 'Fraud Team',
            addedAt: '2025-05-10T16:20:00Z',
            expiresAt: '2025-06-10T16:20:00Z',
            notes: 'Device was blacklisted but investigation showed false positive',
            triggerCount: 1,
            riskScore: 45
        },
        {
            id: 'bl-005',
            type: 'blacklist',
            entityType: 'phone',
            value: '+254712345678',
            reason: 'Phone number used in multiple fraud cases',
            status: 'active',
            addedBy: 'Compliance Manager',
            addedAt: '2025-05-18T13:40:00Z',
            riskScore: 92
        },
        {
            id: 'wl-001',
            type: 'whitelist',
            entityType: 'user',
            value: 'user-123',
            reason: 'Verified high-value customer',
            status: 'active',
            addedBy: 'Customer Service Manager',
            addedAt: '2025-05-12T10:30:00Z',
            notes: 'Customer has completed enhanced due diligence'
        },
        {
            id: 'wl-002',
            type: 'whitelist',
            entityType: 'ip_address',
            value: '156.78.90.123',
            reason: 'Corporate office IP range',
            status: 'active',
            addedBy: 'Security Team',
            addedAt: '2025-05-14T09:15:00Z',
            notes: 'Company headquarters IP range'
        },
        {
            id: 'wl-003',
            type: 'whitelist',
            entityType: 'email',
            value: 'verified@corporation.com',
            reason: 'Corporate email domain',
            status: 'active',
            addedBy: 'Compliance Officer',
            addedAt: '2025-05-16T14:25:00Z'
        },
        {
            id: 'wl-004',
            type: 'whitelist',
            entityType: 'device_id',
            value: 'dev-5678efgh-9012',
            reason: 'CEO device',
            status: 'active',
            addedBy: 'Security Team',
            addedAt: '2025-05-15T11:50:00Z',
            notes: 'Device registered to company CEO'
        }
    ];

    useEffect(() => {
        const fetchListEntries = async () => {
            setIsLoading(true);
            try {
                // const entries = await amlService.getBlacklistWhitelist();

                setTimeout(() => {
                    setEntries(mockEntries);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Failed to fetch blacklist/whitelist data', error);
                setErrorMessage('Failed to load blacklist/whitelist data');
                setIsLoading(false);
            }
        };

        fetchListEntries();
    }, []);

    const filteredEntries = entries.filter(entry => {
        const matchesTab = entry.type === activeTab;

        const matchesSearch =
            entry.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (entry.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

        const matchesEntityType = entityTypeFilter === 'all' || entry.entityType === entityTypeFilter;
        const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;

        return matchesTab && matchesSearch && matchesEntityType && matchesStatus;
    });

    // Add new entry
    const handleAddEntry = () => {
        // In a real implementation, this would call an API
        const newEntry: ListEntry = {
            id: `${activeTab === 'blacklist' ? 'bl' : 'wl'}-${Date.now()}`,
            type: activeTab,
            entityType: formData.entityType as any,
            value: formData.value,
            reason: formData.reason,
            status: 'active',
            addedBy: 'Current Admin',
            addedAt: new Date().toISOString(),
            notes: formData.notes || undefined,
            expiresAt: formData.expiresAt || undefined,
            triggerCount: 0,
            riskScore: activeTab === 'blacklist' ? 50 : undefined
        };

        setEntries([...entries, newEntry]);
        showSuccess(`${activeTab === 'blacklist' ? 'Blacklist' : 'Whitelist'} entry added successfully`);

        // Reset form and close modal
        resetForm();
        setIsModalOpen(false);
        setModalType(null);
    };

    // Update existing entry
    const handleUpdateEntry = () => {
        if (!selectedEntry) return;

        // In a real implementation, this would call an API
        const updatedEntries = entries.map(entry => {
            if (entry.id === selectedEntry.id) {
                return {
                    ...entry,
                    entityType: formData.entityType as any,
                    value: formData.value,
                    reason: formData.reason,
                    notes: formData.notes || undefined,
                    expiresAt: formData.expiresAt || undefined
                };
            }
            return entry;
        });

        setEntries(updatedEntries);
        showSuccess(`${activeTab === 'blacklist' ? 'Blacklist' : 'Whitelist'} entry updated successfully`);

        // Reset form and close modal
        resetForm();
        setIsModalOpen(false);
        setModalType(null);
        setSelectedEntry(null);
    };

    // Delete entry
    const handleDeleteEntry = () => {
        if (!selectedEntry) return;

        // In a real implementation, this would call an API
        const updatedEntries = entries.filter(entry => entry.id !== selectedEntry.id);

        setEntries(updatedEntries);
        showSuccess(`${activeTab === 'blacklist' ? 'Blacklist' : 'Whitelist'} entry deleted successfully`);

        // Reset and close modal
        setIsModalOpen(false);
        setModalType(null);
        setSelectedEntry(null);
    };

    // Toggle entry status
    const toggleEntryStatus = (entryId: string) => {
        // In a real implementation, this would call an API
        const updatedEntries = entries.map(entry => {
            if (entry.id === entryId) {
                return {
                    ...entry,
                    status: entry.status === 'active' ? 'inactive' as 'inactive' : 'active' as 'active'
                };
            }
            return entry;
        });

        setEntries(updatedEntries);
        showSuccess(`Entry status updated successfully`);
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            entityType: 'user',
            value: '',
            reason: '',
            expiresAt: '',
            notes: ''
        });
    };

    // Open view entry modal
    const openViewModal = (entry: ListEntry) => {
        setSelectedEntry(entry);
        setModalType('view');
        setIsModalOpen(true);
    };

    // Open add entry modal
    const openAddModal = () => {
        resetForm();
        setModalType('add');
        setIsModalOpen(true);
    };

    // Open edit entry modal
    const openEditModal = (entry: ListEntry) => {
        setSelectedEntry(entry);
        setFormData({
            entityType: entry.entityType,
            value: entry.value,
            reason: entry.reason,
            expiresAt: entry.expiresAt || '',
            notes: entry.notes || ''
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    // Open delete confirmation modal
    const openDeleteModal = (entry: ListEntry) => {
        setSelectedEntry(entry);
        setModalType('delete');
        setIsModalOpen(true);
    };

    // Show success message with a timeout
    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setErrorMessage(null);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    // Show error message with a timeout
    const showError = (message: string) => {
        setErrorMessage(message);
        setSuccessMessage(null);
        setTimeout(() => {
            setErrorMessage(null);
        }, 3000);
    };

    // Format date
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

    // Get entity type icon
    const getEntityTypeIcon = (type: string) => {
        switch (type) {
            case 'user':
                return <User className="w-4 h-4 text-gray-600" />;
            case 'email':
                return <Mail className="w-4 h-4 text-purple-600" />;
            case 'phone':
                return <Smartphone className="w-4 h-4 text-primary-600" />;
            case 'ip_address':
                return <Network className="w-4 h-4 text-primary-600" />;
            case 'device_id':
                return <Smartphone className="w-4 h-4 text-green-600" />;
            case 'account':
                return <Hash className="w-4 h-4 text-orange-600" />;
            default:
                return <User className="w-4 h-4 text-gray-600" />;
        }
    };

    // Format entity type
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

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'inactive':
                return <XCircle className="w-4 h-4" />;
            default:
                return <CheckCircle2 className="w-4 h-4" />;
        }
    };

    // Get modal title
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

    return (
        <div>
            {successMessage && (
                <div className="mb-5 flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700">
                    <CheckCircle2 size={16} className="flex-shrink-0" />
                    <span className="text-sm">{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100 text-red-700">
                    <AlertTriangle size={16} className="flex-shrink-0" />
                    <span className="text-sm">{errorMessage}</span>
                </div>
            )}

            {/* Blacklist/Whitelist Overview */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    className={`bg-white rounded-xl shadow-sm border ${activeTab === 'blacklist' ? 'border-red-200' : 'border-gray-200'} p-4 cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => setActiveTab('blacklist')}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <UserX size={20} className="text-red-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">Blacklist</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                        {entries.filter(e => e.type === 'blacklist').length}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            Active: {entries.filter(e => e.type === 'blacklist' && e.status === 'active').length}
                        </span>
                        <span className="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full">
                            Inactive: {entries.filter(e => e.type === 'blacklist' && e.status === 'inactive').length}
                        </span>
                    </div>
                </div>

                <div
                    className={`bg-white rounded-xl shadow-sm border ${activeTab === 'whitelist' ? 'border-green-200' : 'border-gray-200'} p-4 cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => setActiveTab('whitelist')}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <UserCheck size={20} className="text-green-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">Whitelist</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                        {entries.filter(e => e.type === 'whitelist').length}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            Active: {entries.filter(e => e.type === 'whitelist' && e.status === 'active').length}
                        </span>
                        <span className="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full">
                            Inactive: {entries.filter(e => e.type === 'whitelist' && e.status === 'inactive').length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Blacklist/Whitelist Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">
                        {activeTab === 'blacklist' ? 'Blacklisted' : 'Whitelisted'} Entries
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                        >
                            <PlusCircle size={16} />
                            <span>Add Entry</span>
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b border-gray-200 flex flex-wrap md:flex-nowrap gap-3 items-center justify-between">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={entityTypeFilter}
                            onChange={(e) => setEntityTypeFilter(e.target.value as any)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
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
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                            onClick={() => {
                                setIsLoading(true);
                                setTimeout(() => {
                                    setIsLoading(false);
                                }, 800);
                            }}
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-8">
                        <div className="flex justify-center items-center">
                            <RefreshCw size={24} className="text-gray-400 animate-spin" />
                            <span className="ml-2 text-gray-500">Loading {activeTab} entries...</span>
                        </div>
                    </div>
                ) : filteredEntries.length === 0 ? (
                    <div className="p-8 text-center">
                        {activeTab === 'blacklist' ? (
                            <UserX size={36} className="mx-auto text-gray-400 mb-3" />
                        ) : (
                            <UserCheck size={36} className="mx-auto text-gray-400 mb-3" />
                        )}
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No entries found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredEntries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="p-1.5 bg-gray-100 rounded-full mr-2">
                                                    {getEntityTypeIcon(entry.entityType)}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatEntityType(entry.entityType)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{entry.value}</div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="text-sm text-gray-900 max-w-[200px] truncate" title={entry.reason}>
                                                {entry.reason}
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                                                {getStatusIcon(entry.status)}
                                                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(entry.addedAt)}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {entry.expiresAt ? formatDate(entry.expiresAt) : 'Never'}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    className="text-primary-600 hover:text-primary-900 p-1"
                                                    onClick={() => openViewModal(entry)}
                                                >
                                                    <FileText size={16} />
                                                </button>
                                                <button
                                                    className="text-primary-600 hover:text-primary-900 p-1"
                                                    onClick={() => openEditModal(entry)}
                                                >
                                                    <PlusCircle size={16} />
                                                </button>
                                                <button
                                                    className={`${entry.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} p-1`}
                                                    onClick={() => toggleEntryStatus(entry.id)}
                                                >
                                                    {entry.status === 'active' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    onClick={() => openDeleteModal(entry)}
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

                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing {filteredEntries.length} of {entries.filter(e => e.type === activeTab).length} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm disabled:opacity-50"
                            disabled
                        >
                            Previous
                        </button>
                        <button
                            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-600 text-sm disabled:opacity-50"
                            disabled
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-primary-50/70 rounded-xl p-4 border border-primary-100 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                        <Shield size={20} className="text-primary-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-primary-700">About Blacklist & Whitelist</h3>
                        <p className="text-primary-600 text-xs mt-1 leading-relaxed">
                            {activeTab === 'blacklist' ? (
                                <>
                                    Blacklisting restricts specific entities from accessing the platform:
                                    <br />• Users flagged for suspicious activities
                                    <br />• Email domains associated with fraud
                                    <br />• Phone numbers used in multiple fraud cases
                                    <br />• IP addresses with unusual access patterns
                                    <br />• Device IDs linked to fraudulent accounts
                                </>
                            ) : (
                                <>
                                    Whitelisting provides special allowances for trusted entities:
                                    <br />• Pre-approved users with enhanced verification
                                    <br />• Trusted email domains for corporate clients
                                    <br />• Verified phone numbers for high-value customers
                                    <br />• Corporate IP ranges for secure access
                                    <br />• Registered device IDs for authorized personnel
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setSelectedEntry(null);
                    resetForm();
                }}
                title={getModalTitle()}
                size="md"
            >
                {modalType === 'view' && selectedEntry && (
                    <div className="space-y-4 p-1">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEntry.status)}`}>
                                        {getStatusIcon(selectedEntry.status)}
                                        {selectedEntry.status.charAt(0).toUpperCase() + selectedEntry.status.slice(1)}
                                    </span>
                                    <span className="text-sm text-gray-500">ID: {selectedEntry.id}</span>
                                </div>
                                <div>
                                    {selectedEntry.type === 'blacklist' ? (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg font-medium">
                                            Blacklisted
                                        </span>
                                    ) : (
                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-lg font-medium">
                                            Whitelisted
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">Entity Type:</div>
                                    <div className="font-medium text-gray-800 flex items-center">
                                        <div className="mr-2">
                                            {getEntityTypeIcon(selectedEntry.entityType)}
                                        </div>
                                        {formatEntityType(selectedEntry.entityType)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Value:</div>
                                    <div className="font-medium text-gray-800 flex items-center justify-between">
                                        <span className="truncate max-w-[150px]" title={selectedEntry.value}>
                                            {selectedEntry.value}
                                        </span>
                                        <button
                                            className="text-primary-600 hover:text-primary-800 p-1"
                                            onClick={() => {
                                                navigator.clipboard.writeText(selectedEntry.value);
                                                showSuccess('Value copied to clipboard');
                                            }}
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Reason</h3>
                            <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                {selectedEntry.reason}
                            </div>
                        </div>

                        {selectedEntry.notes && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                    {selectedEntry.notes}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Added By</h3>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                    <div>{selectedEntry.addedBy}</div>
                                    <div className="text-xs text-gray-500 mt-1">{formatDate(selectedEntry.addedAt)}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Expiration</h3>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                    {selectedEntry.expiresAt ? (
                                        <>
                                            <div>{formatDate(selectedEntry.expiresAt)}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(selectedEntry.expiresAt) > new Date() ? 'Active' : 'Expired'}
                                            </div>
                                        </>
                                    ) : (
                                        <div>No expiration (permanent)</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedEntry.type === 'blacklist' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Last Triggered</h3>
                                    <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                        {selectedEntry.lastTriggered ? formatDate(selectedEntry.lastTriggered) : 'Never triggered'}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Statistics</h3>
                                    <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                        <div>Trigger Count: {selectedEntry.triggerCount || 0}</div>
                                        {selectedEntry.riskScore !== undefined && (
                                            <div className="text-xs mt-1">
                                                Risk Score: <span className={`font-medium ${selectedEntry.riskScore > 75 ? 'text-red-600' :
                                                    selectedEntry.riskScore > 50 ? 'text-orange-600' :
                                                        'text-yellow-600'
                                                    }`}>{selectedEntry.riskScore}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>

                            <button
                                onClick={() => openEditModal(selectedEntry)}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                )}

                {(modalType === 'add' || modalType === 'edit') && (
                    <div className="space-y-4 p-1">
                        {modalType === 'add' ? (
                            <div className="bg-primary-50 border-l-4 border-primary-400 p-3 rounded-md mb-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-primary-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-primary-700">
                                            You are adding a new entry to the {activeTab}. This action will be logged for audit purposes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mb-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            You are editing an entry in the {selectedEntry?.type}. This action will be logged for audit purposes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                            <select
                                value={formData.entityType}
                                onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                            >
                                <option value="user">User</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="ip_address">IP Address</option>
                                <option value="device_id">Device ID</option>
                                <option value="account">Account</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                            <input
                                type="text"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                placeholder={`Enter ${formData.entityType} value...`}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <textarea
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder={`Why is this entity being ${activeTab === 'blacklist' ? 'blacklisted' : 'whitelisted'}?`}
                                rows={3}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
                            <input
                                type="datetime-local"
                                value={formData.expiresAt}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave blank for no expiration (permanent).</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional information about this entry..."
                                rows={3}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    resetForm();
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={modalType === 'add' ? handleAddEntry : handleUpdateEntry}
                                disabled={!formData.value || !formData.reason}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {modalType === 'add' ? 'Add' : 'Update'} Entry
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'delete' && selectedEntry && (
                    <div className="space-y-4 p-1">
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        Are you sure you want to delete this {selectedEntry.type} entry? This action cannot be undone and will be logged for audit purposes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">Entity Type:</div>
                                    <div className="font-medium text-gray-800">{formatEntityType(selectedEntry.entityType)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Value:</div>
                                    <div className="font-medium text-gray-800 truncate" title={selectedEntry.value}>{selectedEntry.value}</div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="text-gray-500">Reason:</div>
                                <div className="font-medium text-gray-800">{selectedEntry.reason}</div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setModalType(null);
                                    setSelectedEntry(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteEntry}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
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