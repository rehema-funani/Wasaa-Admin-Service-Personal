import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    Wallet,
    BadgeDollarSign,
    User,
    ArrowUp,
    ArrowDown,
    Calendar,
    ExternalLink,
    Landmark,
    Download,
    FileText,
    Info,
    AlertTriangle,
    BarChart2,
    Send,
    Repeat,
    RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import financeService from '../../../../api/services/finance';
import { RefundRequest, ReversalRequest } from '../../../../types/finance';
import toast from 'react-hot-toast';
import ApproveRefund from '../../../../components/finance/ApproveRefund';
import RejectRefund from '../../../../components/finance/RejectRefund';

// This component serves as a dedicated page for viewing reversal details
const ReversalDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [refund, setRefund] = useState<RefundRequest | null>(null);
    const [request, setRequest] = useState<ReversalRequest | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'details' | 'transaction' | 'logs'>('details');
    const [showApprovePanel, setShowApprovePanel] = useState<boolean>(false);
    const [showRejectPanel, setShowRejectPanel] = useState<boolean>(false);
    const [approvalNote, setApprovalNote] = useState<string>('');

    useEffect(() => {
        const fetchReversalDetails = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                // Fetch the specific refund by ID
                const response = await financeService.getRefund(id);

                if (response && response.refund) {
                    setRefund(response.refund);

                    // Transform refund data to create a request object
                    const isDebit = response.refund.OriginalTransaction.debit < 0 ||
                        parseFloat(response.refund.OriginalTransaction.debit.toString()) < 0;

                    let transactionAmount = isDebit
                        ? Math.abs(parseFloat(response.refund.OriginalTransaction.debit.toString()))
                        : parseFloat(response.refund.OriginalTransaction.credit.toString());

                    let amount = parseFloat(response.refund.amount || '0');
                    if (amount === 0) {
                        amount = transactionAmount;
                    }

                    // Extract user name from transaction description
                    let userName = "Client";
                    if (response.refund.OriginalTransaction.description) {
                        let toMatch = response.refund.OriginalTransaction.description.match(/to\s+(.+)$/);
                        if (toMatch && toMatch[1]) {
                            userName = toMatch[1].trim();
                        } else {
                            let fromMatch = response.refund.OriginalTransaction.description.match(/from\s+(.+)$/);
                            if (fromMatch && fromMatch[1]) {
                                userName = fromMatch[1].trim();
                            }
                        }
                    }

                    // Determine status
                    let status: 'pending' | 'approved' | 'rejected' | 'completed' = 'pending';
                    switch (response.refund.status) {
                        case 'INITIATED':
                            status = 'pending';
                            break;
                        case 'APPROVED':
                            status = 'approved';
                            break;
                        case 'COMPLETED':
                            status = 'completed';
                            break;
                        case 'FAILED':
                            status = 'rejected';
                            break;
                        default:
                            status = 'pending';
                    }

                    const requestData: ReversalRequest = {
                        id: response.refund.id,
                        transactionId: response.refund.originalTransactionId,
                        userId: response.refund.UserWallet.user_uuid,
                        userName: userName,
                        amount: amount,
                        isDebit: isDebit,
                        currency: 'KES',
                        reason: response.refund.refundReason,
                        status: status,
                        requestedBy: 'System Admin',
                        requestedAt: response.refund.createdAt,
                        walletType: response.refund.UserWallet.type,
                        walletPurpose: response.refund.UserWallet.purpose,
                        walletBalance: parseFloat(response.refund.UserWallet.balance || '0'),
                    };

                    setRequest(requestData);
                } else {
                    toast.error('Failed to load reversal details');
                    navigate('/finance/reversals');
                }
            } catch (error) {
                console.error('Error fetching reversal details:', error);
                toast.error('Error loading reversal details');
                navigate('/finance/reversals');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReversalDetails();
    }, [id, navigate]);

    const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'FAILED' | 'completed', note: string = '') => {
        try {
            setIsLoading(true);

            let response;

            if (newStatus === 'approved') {
                response = await financeService.approveRefund(requestId);
                toast.success('Reversal request successfully approved');
            } else if (newStatus === 'FAILED') {
                if (!note) {
                    toast.error('A rejection reason is required');
                    setIsLoading(false);
                    return;
                }
                response = await financeService.rejectRefund(requestId, note);
                toast.success('Reversal request successfully rejected');
            } else {
                toast.error('Action not supported');
            }

            // After successful update, navigate back to the list
            navigate('/finance/reversals');
        } catch (error) {
            console.error('Failed to update refund status:', error);
            let errorMessage = 'Failed to process the request. Please try again.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
            setShowApprovePanel(false);
            setShowRejectPanel(false);
            setApprovalNote('');
        }
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
            case 'failed':
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
            case 'failed':
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

    if (isLoading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
                    <p className="mt-4 text-neutral-600">Loading reversal details...</p>
                </div>
            </div>
        );
    }

    if (!refund || !request) {
        return (
            <div className="min-h-screen p-6">
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 max-w-2xl mx-auto">
                    <div className="flex items-start">
                        <AlertTriangle className="text-danger-500 mr-3 mt-0.5" />
                        <div>
                            <h3 className="text-danger-700 font-medium">Error Loading Reversal Details</h3>
                            <p className="text-danger-600 mt-1">The requested reversal details could not be found or loaded.</p>
                            <Link to="/finance/reversals" className="mt-3 inline-flex items-center text-primary-600 hover:text-primary-700">
                                <ArrowLeft size={16} className="mr-1" />
                                Return to Reversal Requests
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header section */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
                        <div>
                            <Link
                                to="/admin/finance/wallets/reversal-requests"
                                className="inline-flex items-center text-sm text-neutral-500 hover:text-primary-600 mb-2"
                            >
                                <ArrowLeft size={16} className="mr-1" />
                                Back to Reversals
                            </Link>
                            <div className="inline-block px-3 py-1 bg-primary-50 border border-primary-100 rounded-lg text-primary-600 text-xs font-medium mb-2 ml-3">
                                Reversal Details
                            </div>
                            <h1 className="text-2xl font-semibold text-neutral-800 tracking-tight flex items-center">
                                <BadgeDollarSign size={24} className="text-primary-600 mr-2" />
                                Transaction Reversal #{request.id.substring(0, 8)}
                            </h1>
                            <p className="text-neutral-500 text-sm mt-1">
                                {request.reason} • Requested on {formatDate(request.requestedAt)}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg shadow-sm hover:bg-neutral-50 transition-all text-sm"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft size={16} />
                                <span>Close Details</span>
                            </motion.button>

                            <motion.button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 text-white rounded-lg shadow-button hover:bg-primary-700 transition-all text-sm"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Download size={16} />
                                <span>Export PDF</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="bg-neutral-50 dark:bg-dark-elevated/80 border border-neutral-200 dark:border-dark-border rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center">
                                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium ${getStatusColor(request.status)}`}>
                                    {getStatusIcon(request.status)}
                                    <span className="ml-1">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                                </span>

                                {request.status === 'pending' && (
                                    <div className="flex ml-4 gap-2">
                                        <motion.button
                                            className="flex items-center gap-1 px-3 py-1.5 bg-success-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-success-700 transition-all"
                                            onClick={() => setShowApprovePanel(true)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <CheckCircle2 size={16} />
                                            <span>Approve</span>
                                        </motion.button>

                                        <motion.button
                                            className="flex items-center gap-1 px-3 py-1.5 bg-danger-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-danger-700 transition-all"
                                            onClick={() => setShowRejectPanel(true)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <XCircle size={16} />
                                            <span>Reject</span>
                                        </motion.button>
                                    </div>
                                )}

                                {request.status === 'approved' && (
                                    <motion.button
                                        className="flex items-center gap-1 px-3 py-1.5 bg-success-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-success-700 transition-all ml-4"
                                        onClick={() => handleStatusUpdate(request.id, 'completed')}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <CheckCircle2 size={16} />
                                        <span>Mark as Completed</span>
                                    </motion.button>
                                )}
                            </div>

                            <div className="flex items-center text-sm text-neutral-500">
                                <Calendar size={16} className="mr-1.5" />
                                <span>Last Updated: {formatDate(refund.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Approval Panel */}
                {showApprovePanel && (
                    <motion.div
                        className="mb-6 bg-white border border-success-200 rounded-lg p-5 shadow-lg"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <h3 className="text-lg font-medium text-success-700 mb-3 flex items-center">
                            <CheckCircle2 size={20} className="mr-2" />
                            Approve Reversal Request
                        </h3>

                        <div className="mb-4 p-3 bg-success-50 rounded-lg">
                            <p className="text-success-700 text-sm">
                                You are about to approve a reversal request for <strong>{formatCurrency(request.amount)}</strong>.
                                This action will process the refund to the customer's wallet.
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Approval Note (Optional)
                            </label>
                            <textarea
                                value={approvalNote}
                                onChange={(e) => setApprovalNote(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                placeholder="Add any notes about this approval..."
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <motion.button
                                className="px-4 py-2 border border-neutral-300 text-neutral-600 rounded-lg hover:bg-neutral-50"
                                onClick={() => {
                                    setShowApprovePanel(false);
                                    setApprovalNote('');
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                className="px-4 py-2 bg-success-600 text-white rounded-lg shadow-sm hover:bg-success-700"
                                onClick={() => handleStatusUpdate(request.id, 'approved', approvalNote)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Confirm Approval'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Reject Panel */}
                {showRejectPanel && (
                    <motion.div
                        className="mb-6 bg-white border border-danger-200 rounded-lg p-5 shadow-lg"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <h3 className="text-lg font-medium text-danger-700 mb-3 flex items-center">
                            <XCircle size={20} className="mr-2" />
                            Reject Reversal Request
                        </h3>

                        <div className="mb-4 p-3 bg-danger-50 rounded-lg">
                            <p className="text-danger-700 text-sm">
                                You are about to reject a reversal request for <strong>{formatCurrency(request.amount)}</strong>.
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Rejection Reason <span className="text-danger-500">*</span>
                            </label>
                            <textarea
                                value={approvalNote}
                                onChange={(e) => setApprovalNote(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                placeholder="Provide a reason for rejecting this request..."
                                rows={3}
                                required
                            />
                            {approvalNote === '' && (
                                <p className="mt-1 text-xs text-danger-600">A rejection reason is required</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <motion.button
                                className="px-4 py-2 border border-neutral-300 text-neutral-600 rounded-lg hover:bg-neutral-50"
                                onClick={() => {
                                    setShowRejectPanel(false);
                                    setApprovalNote('');
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                className="px-4 py-2 bg-danger-600 text-white rounded-lg shadow-sm hover:bg-danger-700"
                                onClick={() => handleStatusUpdate(request.id, 'FAILED', approvalNote)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading || approvalNote === ''}
                            >
                                {isLoading ? 'Processing...' : 'Confirm Rejection'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-neutral-200 mb-6">
                    <button
                        className={`px-4 py-3 text-sm font-medium transition-colors duration-200 relative ${activeTab === 'details'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-neutral-600 hover:text-primary-600'
                            }`}
                        onClick={() => setActiveTab('details')}
                    >
                        Reversal Details
                    </button>
                    <button
                        className={`px-4 py-3 text-sm font-medium transition-colors duration-200 relative ${activeTab === 'transaction'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-neutral-600 hover:text-primary-600'
                            }`}
                        onClick={() => setActiveTab('transaction')}
                    >
                        Original Transaction
                    </button>
                    <button
                        className={`px-4 py-3 text-sm font-medium transition-colors duration-200 relative ${activeTab === 'logs'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-neutral-600 hover:text-primary-600'
                            }`}
                        onClick={() => setActiveTab('logs')}
                    >
                        Audit Logs
                    </button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main content based on selected tab */}
                    <div className="lg:col-span-2">
                        {activeTab === 'details' && (
                            <motion.div
                                className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                                    <h2 className="text-lg font-medium text-neutral-800 flex items-center">
                                        <FileText size={18} className="text-primary-600 mr-2" />
                                        Reversal Request Information
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Request ID</h3>
                                            <p className="text-neutral-800 font-mono">{request.id}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Status</h3>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {getStatusIcon(request.status)}
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Amount</h3>
                                            <p className={`text-lg font-semibold ${request.isDebit ? 'text-danger-600' : 'text-success-600'}`}>
                                                {formatCurrency(request.amount)}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Requested At</h3>
                                            <p className="text-neutral-800">{formatDate(request.requestedAt)}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Original Transaction ID</h3>
                                            <p className="text-neutral-800 font-mono">{request.transactionId}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">User</h3>
                                            <p className="text-neutral-800 flex items-center">
                                                <User size={16} className="text-neutral-400 mr-1" />
                                                {request.userName}
                                            </p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <h3 className="text-sm text-neutral-500 mb-1">Reason for Reversal</h3>
                                            <p className="text-neutral-800 p-3 bg-neutral-50 rounded-lg">{request.reason}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'transaction' && (
                            <motion.div
                                className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                                    <h2 className="text-lg font-medium text-neutral-800 flex items-center">
                                        <RefreshCw size={18} className="text-primary-600 mr-2" />
                                        Original Transaction Details
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Transaction ID</h3>
                                            <p className="text-neutral-800 font-mono">{refund.originalTransactionId}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Status</h3>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-success-50 text-success-700 border border-success-200">
                                                <CheckCircle2 size={14} />
                                                {refund.OriginalTransaction.status}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Transaction Type</h3>
                                            <p className={`flex items-center font-medium ${request.isDebit ? 'text-danger-600' : 'text-success-600'}`}>
                                                {request.isDebit ? (
                                                    <>
                                                        <ArrowDown size={16} className="mr-1" />
                                                        Debit (Money Out)
                                                    </>
                                                ) : (
                                                    <>
                                                        <ArrowUp size={16} className="mr-1" />
                                                        Credit (Money In)
                                                    </>
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Transaction Date</h3>
                                            <p className="text-neutral-800">{formatDate(refund.OriginalTransaction.createdAt)}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Debit Amount</h3>
                                            <p className="text-neutral-800">
                                                {formatCurrency(Math.abs(parseFloat(refund.OriginalTransaction.debit.toString()) || 0))}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Credit Amount</h3>
                                            <p className="text-neutral-800">
                                                {formatCurrency(parseFloat(refund.OriginalTransaction.credit.toString()) || 0)}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">Balance After Transaction</h3>
                                            <p className="text-neutral-800 font-medium">
                                                {formatCurrency(parseFloat(refund.OriginalTransaction.balance.toString()) || 0)}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm text-neutral-500 mb-1">External ID</h3>
                                            <p className="text-neutral-800 font-mono">
                                                {refund.OriginalTransaction.external_id || 'N/A'}
                                            </p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <h3 className="text-sm text-neutral-500 mb-1">Transaction Description</h3>
                                            <p className="text-neutral-800 p-3 bg-neutral-50 rounded-lg">
                                                {refund.OriginalTransaction.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'logs' && (
                            <motion.div
                                className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                                    <h2 className="text-lg font-medium text-neutral-800 flex items-center">
                                        <BarChart2 size={18} className="text-primary-600 mr-2" />
                                        Audit Logs
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="border-l-2 border-primary-200 pl-4 pb-5 relative">
                                            <div className="absolute w-3 h-3 bg-primary-400 rounded-full -left-[7px] top-1.5"></div>
                                            <p className="text-sm font-medium text-neutral-800">Request Created</p>
                                            <p className="text-xs text-neutral-500">{formatDate(request.requestedAt)}</p>
                                            <p className="text-sm text-neutral-600 mt-1">
                                                Reversal request created by System Admin
                                            </p>
                                        </div>

                                        {refund.status !== 'INITIATED' && (
                                            <div className="border-l-2 border-primary-200 pl-4 pb-5 relative">
                                                <div className="absolute w-3 h-3 bg-primary-400 rounded-full -left-[7px] top-1.5"></div>
                                                <p className="text-sm font-medium text-neutral-800">Status Updated</p>
                                                <p className="text-xs text-neutral-500">{formatDate(refund.updatedAt)}</p>
                                                <p className="text-sm text-neutral-600 mt-1">
                                                    Status changed to {refund.status.toLowerCase()}
                                                </p>
                                            </div>
                                        )}

                                        {/* This would ideally be populated from actual audit logs if available */}
                                        <div className="text-center py-3 text-neutral-500 text-sm">
                                            <p>Additional audit logs would appear here</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Fixed sidebar with wallet and actions */}
                    <div className="lg:col-span-1">
                        {/* Wallet Information */}
                        <motion.div
                            className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <div className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                                <h2 className="text-base font-medium text-neutral-800 flex items-center">
                                    <Wallet size={18} className="text-primary-600 mr-2" />
                                    Wallet Information
                                </h2>
                            </div>

                            <div className="p-5">
                                <div className="mb-4 flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-3">
                                        <Wallet size={18} className="text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-800">
                                            {getWalletTypeDisplay(refund.UserWallet.type, refund.UserWallet.purpose)}
                                        </p>
                                        <p className="text-xs text-neutral-500">ID: {refund.UserWallet.id.substring(0, 8)}...</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-neutral-500">User UUID</p>
                                        <p className="text-sm text-neutral-800 font-mono truncate">
                                            {refund.UserWallet.user_uuid}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-neutral-500">Current Balance</p>
                                        <p className="text-base font-semibold text-neutral-800">
                                            {formatCurrency(parseFloat(refund.UserWallet.balance) || 0)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-neutral-500">Wallet Status</p>
                                        <p className="text-sm text-neutral-800">
                                            <span className="inline-block w-2 h-2 rounded-full bg-success-500 mr-1"></span>
                                            {refund.UserWallet.status}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-neutral-500">Total Debit</p>
                                        <p className="text-sm text-danger-600">
                                            {formatCurrency(Math.abs(parseFloat(refund.UserWallet.debit) || 0))}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-neutral-500">Total Credit</p>
                                        <p className="text-sm text-success-600">
                                            {formatCurrency(parseFloat(refund.UserWallet.credit) || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <div className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                                <h2 className="text-base font-medium text-neutral-800">Quick Actions</h2>
                            </div>

                            <div className="p-5">
                                <div className="space-y-3">
                                    <Link
                                        to="/finance/reversals"
                                        className="flex items-center w-full p-3 text-sm text-neutral-700 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                                    >
                                        <ArrowLeft size={16} className="text-neutral-500 mr-2" />
                                        Return to Reversal Requests
                                    </Link>

                                    <button
                                        className="flex items-center w-full p-3 text-sm text-neutral-700 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                                    >
                                        <ExternalLink size={16} className="text-neutral-500 mr-2" />
                                        View User Profile
                                    </button>

                                    <button
                                        className="flex items-center w-full p-3 text-sm text-neutral-700 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                                    >
                                        <Send size={16} className="text-neutral-500 mr-2" />
                                        Contact User
                                    </button>

                                    <button
                                        className="flex items-center w-full p-3 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                                    >
                                        <Download size={16} className="mr-2" />
                                        Download Transaction History
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Info Box */}
                <motion.div
                    className="mt-6 bg-gradient-to-r from-primary-50/80 to-primary-50/60 dark:from-primary-900/10 dark:to-primary-800/10 rounded-lg p-4 border border-primary-100 dark:border-primary-800/20 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-800/40 rounded-lg flex-shrink-0">
                            <Landmark size={20} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-primary-700 dark:text-primary-300">About Transaction Reversals</h3>
                            <p className="text-primary-600 dark:text-primary-400 text-xs mt-1 leading-relaxed">
                                Transaction reversals require dual approval to ensure security and accuracy. All actions are logged for audit purposes.
                                <br />• <strong>Pending:</strong> Awaiting first admin approval
                                <br />• <strong>Approved:</strong> Confirmed by first admin, awaiting reversal execution
                                <br />• <strong>Completed:</strong> Fully processed and funds reversed
                                <br />• <strong>Rejected:</strong> Denied by admin with documented reason
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ReversalDetailPage;