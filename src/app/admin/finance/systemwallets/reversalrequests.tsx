import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    RefreshCw,
    ExternalLink,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    ChevronDown,
    Eye,
    Download,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    User,
    FileText,
    Shield,
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
// import walletService from '../../../../api/services/wallet';

// Types for reversal requests
interface ReversalRequest {
    id: string;
    transactionId: string;
    userId: string;
    userName: string;
    amount: number;
    currency: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    requestedBy: string;
    requestedAt: string;
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    completedAt?: string;
    notes?: string;
}

// Types for transactions
interface Transaction {
    id: string;
    walletId: string;
    walletName: string;
    type: 'credit' | 'debit';
    amount: number;
    reference: string;
    description: string;
    status: 'completed' | 'pending' | 'failed' | 'reversed';
    timestamp: string;
    relatedEntity?: string;
}

const reversalrequests: React.FC = () => {
    // State management
    const [reversalRequests, setReversalRequests] = useState<ReversalRequest[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
    const [timeframeFilter, setTimeframeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ReversalRequest | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'view' | 'approve' | 'reject' | 'details' | null>(null);
    const [approvalNote, setApprovalNote] = useState<string>('');

    // Mock data for reversal requests
    const mockReversalRequests: ReversalRequest[] = [
        {
            id: 'rev-001',
            transactionId: 'tx-001',
            userId: 'user-001',
            userName: 'John Doe',
            amount: 1250.00,
            currency: 'KES',
            reason: 'Customer requested refund due to service unavailability',
            status: 'pending',
            requestedBy: 'Sarah Admin',
            requestedAt: '2025-05-19T09:30:00Z',
        },
        {
            id: 'rev-002',
            transactionId: 'tx-003',
            userId: 'user-002',
            userName: 'Alice Smith',
            amount: 750.00,
            currency: 'KES',
            reason: 'Double charge detected on customer account',
            status: 'approved',
            requestedBy: 'Mark Support',
            requestedAt: '2025-05-18T14:15:00Z',
            approvedBy: 'Finance Manager',
            approvedAt: '2025-05-18T16:45:00Z',
        },
        {
            id: 'rev-003',
            transactionId: 'tx-006',
            userId: 'user-003',
            userName: 'Bob Johnson',
            amount: 3000.00,
            currency: 'KES',
            reason: 'Transaction was fraudulent - account compromised',
            status: 'rejected',
            requestedBy: 'Customer Support',
            requestedAt: '2025-05-17T11:10:00Z',
            rejectedBy: 'Compliance Officer',
            rejectedAt: '2025-05-17T13:25:00Z',
            notes: 'Investigation found the transaction was legitimate. Customer verified via callback.'
        },
        {
            id: 'rev-004',
            transactionId: 'tx-005',
            userId: 'user-004',
            userName: 'Merchant XYZ',
            amount: 15000.00,
            currency: 'KES',
            reason: 'Incorrect amount sent to merchant',
            status: 'completed',
            requestedBy: 'Finance Dept',
            requestedAt: '2025-05-16T08:20:00Z',
            approvedBy: 'Senior Finance Officer',
            approvedAt: '2025-05-16T09:10:00Z',
            completedAt: '2025-05-16T10:05:00Z'
        },
        {
            id: 'rev-005',
            transactionId: 'tx-002',
            userId: 'user-001',
            userName: 'John Doe',
            amount: 500.00,
            currency: 'KES',
            reason: 'Customer reported unauthorized transaction',
            status: 'pending',
            requestedBy: 'John Support',
            requestedAt: '2025-05-18T13:40:00Z',
        },
        {
            id: 'rev-006',
            transactionId: 'tx-004',
            userId: 'user-002',
            userName: 'Alice Smith',
            amount: 2000.00,
            currency: 'KES',
            reason: 'Service not provided as described',
            status: 'pending',
            requestedBy: 'Customer Service',
            requestedAt: '2025-05-19T07:15:00Z',
        },
    ];

    // Mock transaction data
    const mockTransactions: Transaction[] = [
        {
            id: 'tx-001',
            walletId: 'wallet-fee-001',
            walletName: 'Fee Wallet',
            type: 'credit',
            amount: 1250.00,
            reference: 'TRX-23456789',
            description: 'Commission from transaction ID: 45678',
            status: 'completed',
            timestamp: '2025-05-18T14:30:00Z',
            relatedEntity: 'John Doe (User)'
        },
        {
            id: 'tx-002',
            walletId: 'wallet-fee-001',
            walletName: 'Fee Wallet',
            type: 'debit',
            amount: 500.00,
            reference: 'TRX-23456790',
            description: 'Monthly settlement to operating account',
            status: 'completed',
            timestamp: '2025-05-17T10:15:00Z',
            relatedEntity: 'System Account'
        },
        {
            id: 'tx-003',
            walletId: 'wallet-refund-001',
            walletName: 'Refund Wallet',
            type: 'debit',
            amount: 750.00,
            reference: 'TRX-23456791',
            description: 'Refund for transaction ID: 78901',
            status: 'pending',
            timestamp: '2025-05-18T09:45:00Z',
            relatedEntity: 'Alice Smith (User)'
        },
        {
            id: 'tx-004',
            walletId: 'wallet-refund-001',
            walletName: 'Refund Wallet',
            type: 'credit',
            amount: 2000.00,
            reference: 'TRX-23456792',
            description: 'Top up from main account',
            status: 'completed',
            timestamp: '2025-05-16T16:20:00Z',
            relatedEntity: 'System Account'
        },
        {
            id: 'tx-005',
            walletId: 'wallet-float-001',
            walletName: 'Platform Float Wallet',
            type: 'debit',
            amount: 15000.00,
            reference: 'TRX-23456793',
            description: 'Payout to merchant ID: MER-12345',
            status: 'completed',
            timestamp: '2025-05-18T08:30:00Z',
            relatedEntity: 'Acme Store (Merchant)'
        },
        {
            id: 'tx-006',
            walletId: 'wallet-promotions-001',
            walletName: 'Promotions Wallet',
            type: 'debit',
            amount: 3000.00,
            reference: 'TRX-23456794',
            description: 'Cashback promotion for user ID: USR-78901',
            status: 'completed',
            timestamp: '2025-05-17T13:10:00Z',
            relatedEntity: 'Bob Johnson (User)'
        }
    ];

    // Load reversal request data
    useEffect(() => {
        // Simulating API call
        const fetchReversalRequests = async () => {
            setIsLoading(true);
            try {
                // In a real implementation, this would be:
                // const reversals = await walletService.getReversalRequests();

                // For now, using mock data with a timeout for loading simulation
                setTimeout(() => {
                    setReversalRequests(mockReversalRequests);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Failed to fetch reversal requests', error);
                setErrorMessage('Failed to load reversal requests');
                setIsLoading(false);
            }
        };

        fetchReversalRequests();
    }, []);

    // Filter reversal requests based on search, status and timeframe
    const filteredRequests = reversalRequests.filter(request => {
        const matchesSearch =
            request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

        if (timeframeFilter === 'all') return matchesSearch && matchesStatus;

        const requestDate = new Date(request.requestedAt);
        const now = new Date();
        const timeDiff = now.getTime() - requestDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        const matchesTimeframe =
            (timeframeFilter === '24h' && daysDiff <= 1) ||
            (timeframeFilter === '7d' && daysDiff <= 7) ||
            (timeframeFilter === '30d' && daysDiff <= 30);

        return matchesSearch && matchesStatus && matchesTimeframe;
    });

    // Find transaction by ID
    const getTransactionById = (id: string) => {
        return mockTransactions.find(tx => tx.id === id) || null;
    };

    // Handle request status update
    const handleStatusUpdate = (requestId: string, newStatus: 'approved' | 'rejected' | 'completed', note: string = '') => {
        // In a real implementation, this would call an API
        // For this prototype, we'll just update the state

        const updatedRequests = reversalRequests.map(request => {
            if (request.id === requestId) {
                const updatedRequest = { ...request, status: newStatus };

                if (newStatus === 'approved') {
                    updatedRequest.approvedBy = 'Current Admin';
                    updatedRequest.approvedAt = new Date().toISOString();
                    if (note) updatedRequest.notes = note;
                } else if (newStatus === 'rejected') {
                    updatedRequest.rejectedBy = 'Current Admin';
                    updatedRequest.rejectedAt = new Date().toISOString();
                    if (note) updatedRequest.notes = note;
                } else if (newStatus === 'completed') {
                    updatedRequest.completedAt = new Date().toISOString();
                }

                return updatedRequest;
            }
            return request;
        });

        setReversalRequests(updatedRequests);

        const actionText = newStatus === 'approved'
            ? 'approved'
            : newStatus === 'rejected'
                ? 'rejected'
                : 'completed';

        showSuccess(`Reversal request successfully ${actionText}`);

        // Reset states
        setIsModalOpen(false);
        setModalType(null);
        setSelectedRequest(null);
        setApprovalNote('');
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

    // Open transaction details modal
    const openTransactionDetails = (transactionId: string) => {
        const transaction = getTransactionById(transactionId);
        if (transaction) {
            setSelectedTransaction(transaction);
            setModalType('details');
            setIsModalOpen(true);
        } else {
            showError('Transaction details not found');
        }
    };

    // Open request view modal
    const openRequestViewModal = (request: ReversalRequest) => {
        setSelectedRequest(request);
        setModalType('view');
        setIsModalOpen(true);
    };

    // Open approve request modal
    const openApproveModal = (request: ReversalRequest) => {
        setSelectedRequest(request);
        setModalType('approve');
        setIsModalOpen(true);
    };

    // Open reject request modal
    const openRejectModal = (request: ReversalRequest) => {
        setSelectedRequest(request);
        setModalType('reject');
        setIsModalOpen(true);
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-primary-100 text-primary-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'approved':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // Get modal title
    const getModalTitle = () => {
        if (!selectedRequest && !selectedTransaction) return '';

        switch (modalType) {
            case 'view':
                return `Reversal Request Details`;
            case 'approve':
                return `Approve Reversal Request`;
            case 'reject':
                return `Reject Reversal Request`;
            case 'details':
                return `Transaction Details`;
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">Transaction Reversal Requests</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage and process transaction reversal requests for customer refunds and error corrections</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm"
                                disabled={isLoading}
                                onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        setIsLoading(false);
                                    }, 800);
                                }}
                            >
                                <RefreshCw size={16} />
                                <span>Refresh</span>
                            </button>

                            <button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 text-white rounded-xl shadow-sm hover:bg-primary-700 transition-all text-sm"
                            >
                                <ExternalLink size={16} />
                                <span>View All Transactions</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-5">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by transaction ID, user name or reason..."
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
                                    onClick={() => setStatusFilter('pending')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'pending' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setStatusFilter('approved')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'approved' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Approved
                                </button>
                                <button
                                    onClick={() => setStatusFilter('completed')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'completed' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Completed
                                </button>
                                <button
                                    onClick={() => setStatusFilter('rejected')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === 'rejected' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    Rejected
                                </button>
                            </div>

                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
                                <button
                                    onClick={() => setTimeframeFilter('24h')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${timeframeFilter === '24h' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    24h
                                </button>
                                <button
                                    onClick={() => setTimeframeFilter('7d')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${timeframeFilter === '7d' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    7d
                                </button>
                                <button
                                    onClick={() => setTimeframeFilter('30d')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${timeframeFilter === '30d' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    30d
                                </button>
                                <button
                                    onClick={() => setTimeframeFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${timeframeFilter === 'all' ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    All
                                </button>
                            </div>

                            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>
                </div>

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

                {/* Reversal Requests Summary */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock size={20} className="text-yellow-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Pending Requests</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                            {reversalRequests.filter(r => r.status === 'pending').length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <CheckCircle2 size={20} className="text-primary-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Approved</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                            {reversalRequests.filter(r => r.status === 'approved').length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Pending execution</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle2 size={20} className="text-green-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Completed</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                            {reversalRequests.filter(r => r.status === 'completed').length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle size={20} className="text-red-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Rejected</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                            {reversalRequests.filter(r => r.status === 'rejected').length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Denied by admins</p>
                    </div>
                </div>

                {/* Reversal Requests Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-5 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">Reversal Requests</h2>
                    </div>

                    {isLoading ? (
                        // Loading skeleton
                        <div className="p-8">
                            <div className="flex justify-center items-center">
                                <RefreshCw size={24} className="text-gray-400 animate-spin" />
                                <span className="ml-2 text-gray-500">Loading reversal requests...</span>
                            </div>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="p-8 text-center">
                            <AlertTriangle size={36} className="mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No requests found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{request.id}</div>
                                                        <button
                                                            className="text-xs text-primary-600 hover:text-primary-800 mt-0.5 flex items-center"
                                                            onClick={() => openTransactionDetails(request.transactionId)}
                                                        >
                                                            <ExternalLink size={12} className="mr-1" />
                                                            {request.transactionId}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{request.userName}</div>
                                                <div className="text-xs text-gray-500">ID: {request.userId}</div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(request.amount)}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                    {getStatusIcon(request.status)}
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(request.requestedAt)}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{request.requestedBy}</div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="text-primary-600 hover:text-primary-900 p-1"
                                                        onClick={() => openRequestViewModal(request)}
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    {request.status === 'pending' && (
                                                        <>
                                                            <button
                                                                className="text-green-600 hover:text-green-900 p-1"
                                                                onClick={() => openApproveModal(request)}
                                                            >
                                                                <CheckCircle2 size={18} />
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-900 p-1"
                                                                onClick={() => openRejectModal(request)}
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}

                                                    {request.status === 'approved' && (
                                                        <button
                                                            className="text-green-600 hover:text-green-900 p-1"
                                                            onClick={() => handleStatusUpdate(request.id, 'completed')}
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                    )}
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
                            Showing {filteredRequests.length} of {reversalRequests.length} requests
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
                            <h3 className="text-sm font-medium text-primary-700">About Transaction Reversals</h3>
                            <p className="text-primary-600 text-xs mt-1 leading-relaxed">
                                Transaction reversals require dual approval to ensure security and accuracy. All actions are logged for audit purposes.
                                <br />• <strong>Pending:</strong> Awaiting first admin approval
                                <br />• <strong>Approved:</strong> Confirmed by first admin, awaiting reversal execution
                                <br />• <strong>Completed:</strong> Fully processed and funds reversed
                                <br />• <strong>Rejected:</strong> Denied by admin with documented reason
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setSelectedRequest(null);
                    setSelectedTransaction(null);
                    setApprovalNote('');
                }}
                title={getModalTitle()}
                size={modalType === 'details' ? 'md' : 'md'}
            >
                {modalType === 'view' && selectedRequest && (
                    <div className="space-y-4 p-1">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                                        {getStatusIcon(selectedRequest.status)}
                                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                                    </span>
                                    <span className="text-sm text-gray-500">Request ID: {selectedRequest.id}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-700">
                                    {formatCurrency(selectedRequest.amount)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div className="text-gray-500">Transaction ID:</div>
                                    <div className="font-medium text-gray-800 flex items-center">
                                        {selectedRequest.transactionId}
                                        <button
                                            className="ml-1 text-primary-600 hover:text-primary-800"
                                            onClick={() => openTransactionDetails(selectedRequest.transactionId)}
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500">User:</div>
                                    <div className="font-medium text-gray-800">{selectedRequest.userName} ({selectedRequest.userId})</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Reversal Reason</h3>
                            <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                {selectedRequest.reason}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Request Timeline</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <div className="p-1.5 bg-primary-100 rounded-full">
                                            <FileText size={14} className="text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-800">Requested</div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {formatDate(selectedRequest.requestedAt)} by {selectedRequest.requestedBy}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedRequest.approvedBy && selectedRequest.approvedAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="p-1.5 bg-green-100 rounded-full">
                                                <CheckCircle2 size={14} className="text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-gray-800">Approved</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(selectedRequest.approvedAt)} by {selectedRequest.approvedBy}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedRequest.rejectedBy && selectedRequest.rejectedAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="p-1.5 bg-red-100 rounded-full">
                                                <XCircle size={14} className="text-red-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-gray-800">Rejected</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(selectedRequest.rejectedAt)} by {selectedRequest.rejectedBy}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedRequest.completedAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="p-1.5 bg-green-100 rounded-full">
                                                <CheckCircle2 size={14} className="text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-gray-800">Completed</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(selectedRequest.completedAt)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                                {selectedRequest.notes ? (
                                    <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 min-h-[100px]">
                                        {selectedRequest.notes}
                                    </div>
                                ) : (
                                    <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 min-h-[100px] italic">
                                        No additional notes provided.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>

                            {selectedRequest.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => openRejectModal(selectedRequest)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => openApproveModal(selectedRequest)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                </>
                            )}

                            {selectedRequest.status === 'approved' && (
                                <button
                                    onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700"
                                >
                                    Mark as Completed
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {modalType === 'approve' && selectedRequest && (
                    <div className="space-y-4 p-1">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        You are about to approve a reversal of {formatCurrency(selectedRequest.amount)} for {selectedRequest.userName}.
                                        This action requires dual approval and will be logged for audit purposes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Approval Note (Optional)</label>
                            <textarea
                                value={approvalNote}
                                onChange={(e) => setApprovalNote(e.target.value)}
                                placeholder="Add any additional notes or justification for approving this reversal..."
                                rows={4}
                                className="p-3 w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedRequest.id, 'approved', approvalNote)}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700"
                            >
                                Confirm Approval
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'reject' && selectedRequest && (
                    <div className="space-y-4 p-1">
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        You are about to reject a reversal of {formatCurrency(selectedRequest.amount)} for {selectedRequest.userName}.
                                        Rejection must include a reason and will be logged for audit purposes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason <span className="text-red-500">*</span></label>
                            <textarea
                                value={approvalNote}
                                onChange={(e) => setApprovalNote(e.target.value)}
                                placeholder="Provide a detailed reason for rejecting this reversal request..."
                                rows={4}
                                className="p-3 w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                                required
                            />
                            {approvalNote.length === 0 && (
                                <p className="mt-1 text-sm text-red-600">A rejection reason is required</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected', approvalNote)}
                                disabled={approvalNote.length === 0}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'details' && selectedTransaction && (
                    <div className="space-y-4 p-1">
                        <div className="bg-gray-50 p-4 rounded-lg mb-2">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="text-sm text-gray-500">Transaction ID</div>
                                    <div className="text-lg font-medium text-gray-900">{selectedTransaction.id}</div>
                                </div>
                                <div>
                                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                                        {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-500">Amount</div>
                                    <div className={`text-xl font-semibold ${selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-primary-600'}`}>
                                        {selectedTransaction.type === 'credit' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-sm text-gray-500">Date & Time</div>
                                    <div className="text-sm font-medium text-gray-900">{formatDate(selectedTransaction.timestamp)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Transaction Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <div className="text-gray-500">Type:</div>
                                        <div className="font-medium text-gray-800 capitalize">{selectedTransaction.type}</div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div className="text-gray-500">Reference:</div>
                                        <div className="font-medium text-gray-800">{selectedTransaction.reference}</div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div className="text-gray-500">Wallet:</div>
                                        <div className="font-medium text-gray-800">{selectedTransaction.walletName}</div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div className="text-gray-500">Related Entity:</div>
                                        <div className="font-medium text-gray-800">{selectedTransaction.relatedEntity || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                    {selectedTransaction.description}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default reversalrequests;