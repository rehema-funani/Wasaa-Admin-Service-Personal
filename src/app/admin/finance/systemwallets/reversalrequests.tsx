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
    Eye,
    Shield,
    ArrowLeft,
    ChevronDown,
    BadgeDollarSign,
    ArrowDownUp,
    Download,
    Calendar,
    Info,
    FileCheck,
    ChevronsRight,
    Landmark
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
import financeService from '../../../../api/services/finance';
import ReversalDetails from '../../../../components/finance/ReversalDetails';
import ViewRefund from '../../../../components/finance/ViewRefund';
import ApproveRefund from '../../../../components/finance/ApproveRefund';
import RejectRefund from '../../../../components/finance/RejectRefund';
import { RefundRequest, ReversalRequest } from '../../../../types/finance';
import { Transaction } from '../../../../types/transaction';
import toast from 'react-hot-toast';

const ReversalRequestsPage: React.FC = () => {
    // State management
    const [reversalRequests, setReversalRequests] = useState<ReversalRequest[]>([]);
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
    const [timeframeFilter, setTimeframeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ReversalRequest | null>(null);
    const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'view' | 'approve' | 'reject' | 'details' | null>(null);
    const [approvalNote, setApprovalNote] = useState<string>('');

    const fetchReversalRequests = async () => {
        setIsLoading(true);
        try {
            const refundsData = await financeService.getRefunds();

            if (refundsData && refundsData.refunds) {
                setRefunds(refundsData.refunds);

                const transformedRequests: ReversalRequest[] = refundsData.refunds.map((refund: RefundRequest) => {
                    let userName = "Client";
                    if (refund.OriginalTransaction.description) {
                        const match = refund.OriginalTransaction.description.match(/to\s+(.+)$/);
                        if (match && match[1]) {
                            userName = match[1].trim();
                        }
                    }

                    let status: 'pending' | 'approved' | 'rejected' | 'completed' = 'pending';
                    switch (refund.status) {
                        case 'INITIATED':
                            status = 'pending';
                            break;
                        case 'APPROVED':
                            status = 'approved';
                            break;
                        case 'COMPLETED':
                            status = 'completed';
                            break;
                        case 'REJECTED':
                            status = 'rejected';
                            break;
                    }

                    return {
                        id: refund.id,
                        transactionId: refund.originalTransactionId,
                        userId: refund.UserWallet.user_uuid,
                        userName: userName,
                        amount: parseFloat(refund.amount || '0'),
                        currency: 'KES',
                        reason: refund.refundReason,
                        status: status,
                        requestedBy: 'System Admin',
                        requestedAt: refund.createdAt,
                    };
                });

                setReversalRequests(transformedRequests);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch reversal requests', error);
            setErrorMessage('Failed to load reversal requests');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReversalRequests();
    }, []);

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

    const getRefundById = (id: string) => {
        return refunds.find(refund => refund.id === id);
    };

    const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected' | 'completed', note: string = '') => {
        try {
            setIsLoading(true);

            let response;

            if (newStatus === 'approved') {
                response = await financeService.approveRefund(requestId);
                showSuccess('Reversal request successfully approved');
            } else if (newStatus === 'rejected') {
                if (!note) {
                    showError('A rejection reason is required');
                    setIsLoading(false);
                    return;
                }
                response = await financeService.rejectRefund(requestId, note);
                showSuccess('Reversal request successfully rejected');
            } else {
                toast.error('Action not supported');
            }

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

            setIsModalOpen(false);
            setModalType(null);
            setSelectedRequest(null);
            setSelectedRefund(null);
            setApprovalNote('');

            fetchReversalRequests();

        } catch (error) {
            console.error('Failed to update refund status:', error);
            let errorMessage = 'Failed to process the request. Please try again.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setErrorMessage(null);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setSuccessMessage(null);
        setTimeout(() => {
            setErrorMessage(null);
        }, 3000);
    };

    const openRefundDetails = (requestId: string) => {
        const refund = getRefundById(requestId);
        if (refund) {
            setSelectedRefund(refund);
            setModalType('details');
            setIsModalOpen(true);
        } else {
            showError('Transaction details not found');
        }
    };

    const openRequestViewModal = (request: ReversalRequest) => {
        setSelectedRequest(request);
        const refund = getRefundById(request.id);
        if (refund) {
            setSelectedRefund(refund);
        }
        setModalType('view');
        setIsModalOpen(true);
    };

    const openApproveModal = (request: ReversalRequest) => {
        setSelectedRequest(request);
        setModalType('approve');
        setIsModalOpen(true);
    };

    const openRejectModal = (request: ReversalRequest) => {
        setSelectedRequest(request);
        setModalType('reject');
        setIsModalOpen(true);
    };

    const formatCurrency = (amount: number | string) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2
        }).format(numAmount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'initiated':
                return 'bg-warning-50 text-warning-700 border border-warning-200';
            case 'approved':
                return 'bg-primary-50 text-primary-700 border border-primary-200';
            case 'completed':
                return 'bg-success-50 text-success-700 border border-success-200';
            case 'rejected':
                return 'bg-danger-50 text-danger-700 border border-danger-200';
            default:
                return 'bg-neutral-50 text-neutral-700 border border-neutral-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'initiated':
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

    const getWalletTypeDisplay = (type: string, purpose: string | null) => {
        if (type === 'system') {
            if (purpose === 'platform_float_wallet') {
                return 'Corporate Float Wallet';
            }
            return 'System Wallet';
        }
        return 'Client Wallet';
    };

    const getModalTitle = () => {
        if (!selectedRequest && !selectedRefund) return '';

        switch (modalType) {
            case 'view':
                return `Reversal Request Details`;
            case 'approve':
                return `Approve Reversal Request`;
            case 'reject':
                return `Reject Reversal Request`;
            case 'details':
                return `Original Transaction Details`;
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen p-2">
            <div className="w-full mx-auto">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <div className="inline-block px-3 py-1 bg-primary-50 border border-primary-100 rounded-lg text-primary-600 text-xs font-medium mb-2">
                                Finance Operations
                            </div>
                            <h1 className="text-2xl font-semibold text-neutral-800 tracking-tight flex items-center">
                                <BadgeDollarSign size={24} className="text-primary-600 mr-2" />
                                Transaction Reversal Requests
                            </h1>
                            <p className="text-neutral-500 text-sm mt-1">Manage and process transaction reversal requests for customer refunds and error corrections</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg shadow-sm hover:bg-neutral-50 transition-all text-sm"
                                disabled={isLoading}
                                onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        setIsLoading(false);
                                    }, 800);
                                }}
                            >
                                <RefreshCw size={16} />
                                <span>Refresh Data</span>
                            </button>

                            <button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 text-white rounded-lg shadow-button hover:bg-primary-700 transition-all text-sm"
                            >
                                <Download size={16} />
                                <span>Export Report</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
                        <div className="relative md:col-span-5">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-neutral-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by transaction ID, user or reason..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-3 py-2.5 w-full bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-neutral-700 text-sm shadow-sm"
                            />
                        </div>

                        <div className="relative md:col-span-3">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Calendar size={16} className="text-neutral-400" />
                            </div>
                            <select
                                value={timeframeFilter}
                                onChange={(e) => setTimeframeFilter(e.target.value as any)}
                                className="pl-10 pr-10 py-2.5 w-full bg-white border border-neutral-200 rounded-lg appearance-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-neutral-700 text-sm shadow-sm"
                            >
                                <option value="24h">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="all">All Time</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown size={16} className="text-neutral-400" />
                            </div>
                        </div>

                        <div className="relative md:col-span-3">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <FileCheck size={16} className="text-neutral-400" />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="pl-10 pr-10 py-2.5 w-full bg-white border border-neutral-200 rounded-lg appearance-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-neutral-700 text-sm shadow-sm"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown size={16} className="text-neutral-400" />
                            </div>
                        </div>

                        <div className="md:col-span-1 flex justify-end">
                            <button className="p-2.5 h-full bg-white border border-neutral-200 rounded-lg text-neutral-500 hover:bg-neutral-50 shadow-sm">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-5 flex items-center gap-2 p-3 bg-success-50 rounded-lg border border-success-200 text-success-700">
                        <CheckCircle2 size={16} className="flex-shrink-0" />
                        <span className="text-sm">{successMessage}</span>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-5 flex items-center gap-2 p-3 bg-danger-50 rounded-lg border border-danger-200 text-danger-700">
                        <AlertTriangle size={16} className="flex-shrink-0" />
                        <span className="text-sm">{errorMessage}</span>
                    </div>
                )}

                {/* Reversal Requests Summary */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-warning-100 rounded-lg">
                                <Clock size={20} className="text-warning-600" />
                            </div>
                            <h3 className="text-sm font-medium text-neutral-800">Pending Requests</h3>
                        </div>
                        <p className="text-2xl font-semibold text-neutral-900 font-finance">
                            {reversalRequests.filter(r => r.status === 'pending').length}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">Awaiting approval</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <CheckCircle2 size={20} className="text-primary-600" />
                            </div>
                            <h3 className="text-sm font-medium text-neutral-800">Approved</h3>
                        </div>
                        <p className="text-2xl font-semibold text-neutral-900 font-finance">
                            {reversalRequests.filter(r => r.status === 'approved').length}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">Pending execution</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-success-100 rounded-lg">
                                <CheckCircle2 size={20} className="text-success-600" />
                            </div>
                            <h3 className="text-sm font-medium text-neutral-800">Completed</h3>
                        </div>
                        <p className="text-2xl font-semibold text-neutral-900 font-finance">
                            {reversalRequests.filter(r => r.status === 'completed').length}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">Successfully processed</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-danger-100 rounded-lg">
                                <XCircle size={20} className="text-danger-600" />
                            </div>
                            <h3 className="text-sm font-medium text-neutral-800">Rejected</h3>
                        </div>
                        <p className="text-2xl font-semibold text-neutral-900 font-finance">
                            {reversalRequests.filter(r => r.status === 'rejected').length}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">Denied by administrators</p>
                    </div>
                </div>

                {/* Reversal Requests Table */}
                <div className="bg-white rounded-lg shadow-card border border-neutral-200 overflow-hidden mb-8">
                    <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                        <h2 className="text-base font-medium text-neutral-800 flex items-center">
                            <ArrowDownUp size={18} className="text-primary-600 mr-2" />
                            Reversal Request Registry
                        </h2>

                        <div className="flex items-center text-xs text-neutral-500">
                            <Clock size={14} className="mr-1" />
                            <span>Last updated: {new Date().toLocaleString()}</span>
                        </div>
                    </div>

                    {isLoading ? (
                        // Loading skeleton
                        <div className="p-8">
                            <div className="flex justify-center items-center">
                                <div className="animate-spin w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full mr-3"></div>
                                <span className="text-neutral-500">Loading reversal requests...</span>
                            </div>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={24} className="text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-700 mb-1">No requests found</h3>
                            <p className="text-neutral-500 text-sm">Try adjusting your search criteria or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-neutral-200">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Request ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Original Transaction</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Requested</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Reason</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {filteredRequests.map((request) => {
                                        const refund = getRefundById(request.id);
                                        const walletType = refund ? getWalletTypeDisplay(refund.UserWallet.type, refund.UserWallet.purpose) : '';

                                        return (
                                            <tr key={request.id} className="hover:bg-primary-50/20 transition-colors">
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-neutral-900 font-mono">{request.id.substring(0, 8)}...</div>
                                                            <div className="text-xs text-neutral-500">{walletType}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <button
                                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                                        onClick={() => openRefundDetails(request.id)}
                                                    >
                                                        <span className="font-mono">{request.transactionId.substring(0, 8)}...</span>
                                                        <ExternalLink size={14} className="ml-1" />
                                                    </button>
                                                    <div className="text-xs text-neutral-500 mt-1">
                                                        {refund?.OriginalTransaction.description || 'No description'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-neutral-900">
                                                        {formatCurrency(request.amount)}
                                                    </div>
                                                    {refund && (
                                                        <div className="text-xs text-neutral-500">
                                                            Balance: {formatCurrency(refund.UserWallet.balance)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(request.status)}`}>
                                                        {getStatusIcon(request.status)}
                                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-500">
                                                    {formatDate(request.requestedAt)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm text-neutral-700 max-w-xs truncate">
                                                        {request.reason}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            className="text-primary-600 hover:text-primary-700 p-1 hover:bg-primary-50 rounded-lg transition-colors"
                                                            onClick={() => openRequestViewModal(request)}
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>

                                                        {request.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    className="text-success-600 hover:text-success-700 p-1 hover:bg-success-50 rounded-lg transition-colors"
                                                                    onClick={() => openApproveModal(request)}
                                                                    title="Approve"
                                                                >
                                                                    <CheckCircle2 size={16} />
                                                                </button>
                                                                <button
                                                                    className="text-danger-600 hover:text-danger-700 p-1 hover:bg-danger-50 rounded-lg transition-colors"
                                                                    onClick={() => openRejectModal(request)}
                                                                    title="Reject"
                                                                >
                                                                    <XCircle size={16} />
                                                                </button>
                                                            </>
                                                        )}

                                                        {request.status === 'approved' && (
                                                            <button
                                                                className="text-success-600 hover:text-success-700 p-1 hover:bg-success-50 rounded-lg transition-colors"
                                                                onClick={() => handleStatusUpdate(request.id, 'completed')}
                                                                title="Mark as Completed"
                                                            >
                                                                <CheckCircle2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="px-6 py-4 flex items-center justify-between border-t border-neutral-200 bg-neutral-50/70">
                        <div className="text-sm text-neutral-600">
                            Showing {filteredRequests.length} of {reversalRequests.length} reversal requests
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 rounded-lg border border-neutral-200 text-neutral-300 cursor-not-allowed"
                                disabled
                            >
                                <ArrowLeft size={16} />
                                <span className="sr-only">Previous</span>
                            </button>

                            <div className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium">
                                1
                            </div>

                            <button
                                className="p-2 rounded-lg border border-neutral-200 text-neutral-300 cursor-not-allowed"
                                disabled
                            >
                                <ChevronsRight size={16} />
                                <span className="sr-only">Next</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-primary-50/70 rounded-lg p-4 border border-primary-100 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                            <Landmark size={20} className="text-primary-600" />
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

                <div className="mt-4 text-xs text-neutral-500 flex items-center justify-between">
                    <div className="flex items-center">
                        <Info size={14} className="mr-1" />
                        <span>All reversal operations are recorded in the audit log for compliance purposes</span>
                    </div>
                    <div className="flex items-center">
                        <Shield size={14} className="mr-1 text-primary-600" />
                        <span>Financial Operations Department</span>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setSelectedRequest(null);
                    setSelectedRefund(null);
                    setSelectedTransaction(null);
                    setApprovalNote('');
                }}
                title={getModalTitle()}
                size={modalType === 'details' ? 'md' : 'md'}
            >
                {modalType === 'view' && selectedRequest && selectedRefund && (
                    <ViewRefund
                        selectedRequest={selectedRequest}
                        selectedRefund={selectedRefund}
                        setIsModalOpen={setIsModalOpen}
                        getStatusColor={getStatusColor}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        getWalletTypeDisplay={getWalletTypeDisplay}
                        getStatusIcon={getStatusIcon}
                        openRefundDetails={openRefundDetails}
                        openRejectModal={openRejectModal}
                        openApproveModal={openApproveModal}
                        handleStatusUpdate={handleStatusUpdate}
                    />
                )}

                {modalType === 'approve' && selectedRequest && (
                    <ApproveRefund
                        selectedRequest={selectedRequest}
                        setIsModalOpen={setIsModalOpen}
                        handleStatusUpdate={handleStatusUpdate}
                        formatCurrency={formatCurrency}
                        approvalNote={approvalNote}
                        setApprovalNote={setApprovalNote}
                    />
                )}

                {modalType === 'reject' && selectedRequest && (
                    <RejectRefund
                        selectedRequest={selectedRequest}
                        setIsModalOpen={setIsModalOpen}
                        handleStatusUpdate={handleStatusUpdate}
                        formatCurrency={formatCurrency}
                        approvalNote={approvalNote}
                        setApprovalNote={setApprovalNote}
                    />
                )}

                {modalType === 'details' && selectedRefund && (
                    <ReversalDetails
                        selectedRefund={selectedRefund}
                        setIsModalOpen={setIsModalOpen}
                        getStatusColor={getStatusColor}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        getWalletTypeDisplay={getWalletTypeDisplay}
                     />
                )}
            </Modal>
        </div>
    );
};

export default ReversalRequestsPage;