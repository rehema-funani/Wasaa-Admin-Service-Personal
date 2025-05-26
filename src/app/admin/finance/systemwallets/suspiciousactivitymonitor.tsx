import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Search,
    RefreshCw,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    Download,
    FileText,
    Flag,
    UserX,
    User,
    Calendar,
    BarChart3,
    PieChart,
    ChevronDown,
    ArrowUpRight,
    ArrowDownLeft,
    Zap,
    MapPin,
    Globe,
    Activity,
    Users,
    Repeat,
    CircleDollarSign,
    Shield
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
// import amlService from '../../../../api/services/aml';

// Types for suspicious activities
interface SuspiciousActivity {
    id: string;
    userId: string;
    userName: string;
    activityType: 'transaction_velocity' | 'geo_location_mismatch' | 'unusual_amount' | 'circular_transaction' | 'time_pattern' | 'first_time_recipient' | 'account_dormancy';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    status: 'detected' | 'under_review' | 'escalated' | 'resolved' | 'false_positive';
    description: string;
    detectedAt: string;
    assignedTo?: string;
    reviewedAt?: string;
    resolvedAt?: string;
    resolution?: string;
    transactionIds?: string[];
    deviceInfo?: string;
    ipAddress?: string;
    location?: string;
    relatedUsers?: string[];
    amount?: number;
    currency?: string;
}

// Types for suspicious activity details
interface ActivityDetails {
    id: string;
    deviceType: string;
    browser: string;
    operatingSystem: string;
    ipAddressDetails: {
        ip: string;
        country: string;
        city: string;
        isp: string;
        proxy: boolean;
        vpn: boolean;
        tor: boolean;
    };
    locationHistory: {
        timestamp: string;
        latitude: number;
        longitude: number;
        location: string;
    }[];
    transactionDetails?: {
        id: string;
        type: string;
        amount: number;
        currency: string;
        timestamp: string;
        status: string;
        receiverInfo?: string;
        senderInfo?: string;
    }[];
}

// Types for transactions
interface Transaction {
    id: string;
    userId: string;
    type: 'credit' | 'debit' | 'transfer';
    amount: number;
    currency: string;
    receiverId?: string;
    receiverName?: string;
    reference: string;
    description: string;
    status: 'completed' | 'pending' | 'failed' | 'reversed';
    timestamp: string;
}

const SuspiciousActivityMonitor: React.FC = () => {
    // State management
    const [activities, setActivities] = useState<SuspiciousActivity[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activityTypeFilter, setActivityTypeFilter] = useState<'all' | 'transaction_velocity' | 'geo_location_mismatch' | 'unusual_amount' | 'circular_transaction' | 'time_pattern' | 'first_time_recipient' | 'account_dormancy'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'detected' | 'under_review' | 'escalated' | 'resolved' | 'false_positive'>('all');
    const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
    const [timeframeFilter, setTimeframeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<SuspiciousActivity | null>(null);
    const [activityDetails, setActivityDetails] = useState<ActivityDetails | null>(null);
    const [relatedTransactions, setRelatedTransactions] = useState<Transaction[]>([]);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'view' | 'update' | 'transactions' | null>(null);
    const [resolutionNote, setResolutionNote] = useState<string>('');

    // Mock data for suspicious activities
    const mockActivities: SuspiciousActivity[] = [
        {
            id: 'act-001',
            userId: 'user-045',
            userName: 'John Smith',
            activityType: 'transaction_velocity',
            riskLevel: 'high',
            status: 'detected',
            description: 'Multiple high-value transactions in short time period (15 transactions in 20 minutes)',
            detectedAt: '2025-05-19T08:30:00Z',
            transactionIds: ['tx-4567', 'tx-4568', 'tx-4569', 'tx-4570', 'tx-4571'],
            deviceInfo: 'Android Samsung Galaxy S22',
            ipAddress: '197.232.61.23',
            location: 'Nairobi, Kenya'
        },
        {
            id: 'act-002',
            userId: 'user-089',
            userName: 'Alice Johnson',
            activityType: 'geo_location_mismatch',
            riskLevel: 'critical',
            status: 'under_review',
            description: 'Login from new location 5,000km from previous login within 2 hours',
            detectedAt: '2025-05-18T14:15:00Z',
            assignedTo: 'Security Analyst',
            deviceInfo: 'Windows 11 Chrome',
            ipAddress: '41.203.167.132',
            location: 'Lagos, Nigeria'
        },
        {
            id: 'act-003',
            userId: 'user-112',
            userName: 'Robert Williams',
            activityType: 'circular_transaction',
            riskLevel: 'high',
            status: 'escalated',
            description: 'Circular funds movement through 3 connected accounts within 24 hours',
            detectedAt: '2025-05-18T10:45:00Z',
            assignedTo: 'Senior Compliance Manager',
            reviewedAt: '2025-05-18T11:30:00Z',
            transactionIds: ['tx-3892', 'tx-3900', 'tx-3910'],
            relatedUsers: ['user-113', 'user-115', 'user-120'],
            amount: 250000,
            currency: 'KES'
        },
        {
            id: 'act-004',
            userId: 'user-076',
            userName: 'Maria Garcia',
            activityType: 'unusual_amount',
            riskLevel: 'medium',
            status: 'resolved',
            description: 'Transaction amount 20x higher than user average',
            detectedAt: '2025-05-17T09:20:00Z',
            assignedTo: 'Fraud Analyst',
            reviewedAt: '2025-05-17T11:45:00Z',
            resolvedAt: '2025-05-17T16:30:00Z',
            resolution: 'Verified legitimate purchase of business equipment with supporting documentation',
            transactionIds: ['tx-2901'],
            amount: 540000,
            currency: 'KES'
        },
        {
            id: 'act-005',
            userId: 'user-132',
            userName: 'David Brown',
            activityType: 'time_pattern',
            riskLevel: 'medium',
            status: 'false_positive',
            description: 'Consistent transactions at unusual hours (2AM-4AM) for past 5 days',
            detectedAt: '2025-05-16T13:10:00Z',
            assignedTo: 'Security Officer',
            reviewedAt: '2025-05-16T15:20:00Z',
            resolvedAt: '2025-05-16T17:40:00Z',
            resolution: 'User confirmed night shift worker with legitimate transaction pattern',
            transactionIds: ['tx-2765', 'tx-2766', 'tx-2767', 'tx-2768', 'tx-2769']
        },
        {
            id: 'act-006',
            userId: 'user-056',
            userName: 'James Wilson',
            activityType: 'first_time_recipient',
            riskLevel: 'low',
            status: 'detected',
            description: 'Multiple large transfers to new recipients within 48 hours',
            detectedAt: '2025-05-19T07:55:00Z',
            transactionIds: ['tx-4571', 'tx-4580', 'tx-4585'],
            amount: 150000,
            currency: 'KES'
        },
        {
            id: 'act-007',
            userId: 'user-078',
            userName: 'Sarah Davis',
            activityType: 'account_dormancy',
            riskLevel: 'low',
            status: 'under_review',
            description: 'Account inactive for 6 months, then 15 transactions in 2 days',
            detectedAt: '2025-05-18T16:40:00Z',
            assignedTo: 'Compliance Analyst',
            transactionIds: ['tx-4127', 'tx-4128', 'tx-4135']
        }
    ];

    // Mock data for activity details
    const mockActivityDetails: ActivityDetails = {
        id: 'act-001',
        deviceType: 'Mobile',
        browser: 'Chrome Mobile',
        operatingSystem: 'Android 12',
        ipAddressDetails: {
            ip: '197.232.61.23',
            country: 'Kenya',
            city: 'Nairobi',
            isp: 'Safaricom',
            proxy: false,
            vpn: false,
            tor: false
        },
        locationHistory: [
            {
                timestamp: '2025-05-19T08:15:00Z',
                latitude: -1.2864,
                longitude: 36.8172,
                location: 'Nairobi, Kenya'
            },
            {
                timestamp: '2025-05-18T18:30:00Z',
                latitude: -1.2864,
                longitude: 36.8172,
                location: 'Nairobi, Kenya'
            },
            {
                timestamp: '2025-05-17T12:45:00Z',
                latitude: -1.2864,
                longitude: 36.8172,
                location: 'Nairobi, Kenya'
            }
        ],
        transactionDetails: [
            {
                id: 'tx-4567',
                type: 'transfer',
                amount: 35000,
                currency: 'KES',
                timestamp: '2025-05-19T08:25:00Z',
                status: 'completed',
                receiverInfo: 'Jane Doe (user-098)'
            },
            {
                id: 'tx-4568',
                type: 'transfer',
                amount: 42500,
                currency: 'KES',
                timestamp: '2025-05-19T08:26:30Z',
                status: 'completed',
                receiverInfo: 'Bob Smith (user-102)'
            },
            {
                id: 'tx-4569',
                type: 'transfer',
                amount: 28750,
                currency: 'KES',
                timestamp: '2025-05-19T08:28:15Z',
                status: 'completed',
                receiverInfo: 'Alice Johnson (user-089)'
            },
            {
                id: 'tx-4570',
                type: 'transfer',
                amount: 31000,
                currency: 'KES',
                timestamp: '2025-05-19T08:29:45Z',
                status: 'completed',
                receiverInfo: 'Robert Williams (user-112)'
            },
            {
                id: 'tx-4571',
                type: 'transfer',
                amount: 39800,
                currency: 'KES',
                timestamp: '2025-05-19T08:30:20Z',
                status: 'completed',
                receiverInfo: 'Maria Garcia (user-076)'
            }
        ]
    };

    // Mock data for transactions
    const mockTransactions: Transaction[] = [
        {
            id: 'tx-4567',
            userId: 'user-045',
            type: 'transfer',
            amount: 35000,
            currency: 'KES',
            receiverId: 'user-098',
            receiverName: 'Jane Doe',
            reference: 'TRF-45612378',
            description: 'Payment for services',
            status: 'completed',
            timestamp: '2025-05-19T08:25:00Z'
        },
        {
            id: 'tx-4568',
            userId: 'user-045',
            type: 'transfer',
            amount: 42500,
            currency: 'KES',
            receiverId: 'user-102',
            receiverName: 'Bob Smith',
            reference: 'TRF-45612379',
            description: 'Invoice payment',
            status: 'completed',
            timestamp: '2025-05-19T08:26:30Z'
        },
        {
            id: 'tx-4569',
            userId: 'user-045',
            type: 'transfer',
            amount: 28750,
            currency: 'KES',
            receiverId: 'user-089',
            receiverName: 'Alice Johnson',
            reference: 'TRF-45612380',
            description: 'Contract payment',
            status: 'completed',
            timestamp: '2025-05-19T08:28:15Z'
        },
        {
            id: 'tx-4570',
            userId: 'user-045',
            type: 'transfer',
            amount: 31000,
            currency: 'KES',
            receiverId: 'user-112',
            receiverName: 'Robert Williams',
            reference: 'TRF-45612381',
            description: 'Supplier payment',
            status: 'completed',
            timestamp: '2025-05-19T08:29:45Z'
        },
        {
            id: 'tx-4571',
            userId: 'user-045',
            type: 'transfer',
            amount: 39800,
            currency: 'KES',
            receiverId: 'user-076',
            receiverName: 'Maria Garcia',
            reference: 'TRF-45612382',
            description: 'Consulting services',
            status: 'completed',
            timestamp: '2025-05-19T08:30:20Z'
        }
    ];

    // Load suspicious activity data
    useEffect(() => {
        // Simulating API call
        const fetchActivities = async () => {
            setIsLoading(true);
            try {
                // In a real implementation, this would be:
                // const activities = await amlService.getSuspiciousActivities();

                // For now, using mock data with a timeout for loading simulation
                setTimeout(() => {
                    setActivities(mockActivities);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Failed to fetch suspicious activities', error);
                setErrorMessage('Failed to load suspicious activities');
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, []);

    // Filter activities based on search, type, status, risk level and timeframe
    const filteredActivities = activities.filter(activity => {
        const matchesSearch =
            activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = activityTypeFilter === 'all' || activity.activityType === activityTypeFilter;
        const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
        const matchesRisk = riskFilter === 'all' || activity.riskLevel === riskFilter;

        if (timeframeFilter === 'all') return matchesSearch && matchesType && matchesStatus && matchesRisk;

        const detectedDate = new Date(activity.detectedAt);
        const now = new Date();
        const timeDiff = now.getTime() - detectedDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        const matchesTimeframe =
            (timeframeFilter === '24h' && daysDiff <= 1) ||
            (timeframeFilter === '7d' && daysDiff <= 7) ||
            (timeframeFilter === '30d' && daysDiff <= 30);

        return matchesSearch && matchesType && matchesStatus && matchesRisk && matchesTimeframe;
    });

    // Load activity details and transactions
    const loadActivityDetails = (activity: SuspiciousActivity) => {
        // In a real implementation, this would call an API
        // For this prototype, we'll just use mock data

        setActivityDetails(mockActivityDetails);

        if (activity.transactionIds && activity.transactionIds.length > 0) {
            // In a real implementation, this would filter transactions based on the IDs
            setRelatedTransactions(mockTransactions);
        } else {
            setRelatedTransactions([]);
        }
    };

    // Handle status update
    const handleStatusUpdate = (activityId: string, newStatus: SuspiciousActivity['status'], note: string = '') => {
        // In a real implementation, this would call an API
        const updatedActivities = activities.map(activity => {
            if (activity.id === activityId) {
                const updatedActivity = { ...activity, status: newStatus };

                if (newStatus === 'under_review' && activity.status === 'detected') {
                    updatedActivity.assignedTo = 'Current Analyst';
                    updatedActivity.reviewedAt = new Date().toISOString();
                } else if (newStatus === 'escalated') {
                    updatedActivity.assignedTo = 'Senior Compliance Manager';
                    updatedActivity.reviewedAt = new Date().toISOString();
                } else if (newStatus === 'resolved' || newStatus === 'false_positive') {
                    updatedActivity.resolvedAt = new Date().toISOString();
                    if (note) updatedActivity.resolution = note;
                }

                return updatedActivity;
            }
            return activity;
        });

        setActivities(updatedActivities);

        const actionText = newStatus === 'under_review'
            ? 'marked for review'
            : newStatus === 'escalated'
                ? 'escalated'
                : newStatus === 'resolved'
                    ? 'resolved'
                    : 'marked as false positive';

        showSuccess(`Suspicious activity successfully ${actionText}`);

        // Reset states
        setIsModalOpen(false);
        setModalType(null);
        setSelectedActivity(null);
        setResolutionNote('');
        setActivityDetails(null);
        setRelatedTransactions([]);
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

    // Open activity view modal
    const openActivityViewModal = (activity: SuspiciousActivity) => {
        setSelectedActivity(activity);
        loadActivityDetails(activity);
        setModalType('view');
        setIsModalOpen(true);
    };

    // Open update status modal
    const openUpdateStatusModal = (activity: SuspiciousActivity) => {
        setSelectedActivity(activity);
        setModalType('update');
        setIsModalOpen(true);
    };

    // Open transactions modal
    const openTransactionsModal = (activity: SuspiciousActivity) => {
        setSelectedActivity(activity);
        loadActivityDetails(activity);
        setModalType('transactions');
        setIsModalOpen(true);
    };

    // Format date
    const formatDate = (dateString: string) => {
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

    // Format activity type
    const formatActivityType = (type: string) => {
        switch (type) {
            case 'transaction_velocity':
                return 'Transaction Velocity';
            case 'geo_location_mismatch':
                return 'Geolocation Mismatch';
            case 'unusual_amount':
                return 'Unusual Amount';
            case 'circular_transaction':
                return 'Circular Transaction';
            case 'time_pattern':
                return 'Time Pattern';
            case 'first_time_recipient':
                return 'First-time Recipient';
            case 'account_dormancy':
                return 'Account Dormancy';
            default:
                return type;
        }
    };

    // Format currency
    const formatCurrency = (amount: number, currency: string = 'KES') => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'detected':
                return 'bg-primary-100 text-primary-800';
            case 'under_review':
                return 'bg-yellow-100 text-yellow-800';
            case 'escalated':
                return 'bg-orange-100 text-orange-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'false_positive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get risk level badge color
    const getRiskLevelColor = (level: string) => {
        switch (level) {
            case 'low':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get activity type icon
    const getActivityTypeIcon = (type: string) => {
        switch (type) {
            case 'transaction_velocity':
                return <Zap className="w-4 h-4 text-primary-600" />;
            case 'geo_location_mismatch':
                return <MapPin className="w-4 h-4 text-red-600" />;
            case 'unusual_amount':
                return <CircleDollarSign className="w-4 h-4 text-green-600" />;
            case 'circular_transaction':
                return <Repeat className="w-4 h-4 text-purple-600" />;
            case 'time_pattern':
                return <Clock className="w-4 h-4 text-orange-600" />;
            case 'first_time_recipient':
                return <User className="w-4 h-4 text-primary-600" />;
            case 'account_dormancy':
                return <Activity className="w-4 h-4 text-yellow-600" />;
            default:
                return <AlertTriangle className="w-4 h-4 text-gray-600" />;
        }
    };

    // Get risk level icon
    const getRiskLevelIcon = (level: string) => {
        switch (level) {
            case 'low':
                return <AlertTriangle className="w-4 h-4" />;
            case 'medium':
                return <AlertTriangle className="w-4 h-4" />;
            case 'high':
                return <AlertTriangle className="w-4 h-4" />;
            case 'critical':
                return <AlertTriangle className="w-4 h-4" />;
            default:
                return <AlertTriangle className="w-4 h-4" />;
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'detected':
                return <AlertTriangle className="w-4 h-4" />;
            case 'under_review':
                return <Eye className="w-4 h-4" />;
            case 'escalated':
                return <Flag className="w-4 h-4" />;
            case 'resolved':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'false_positive':
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertTriangle className="w-4 h-4" />;
        }
    };

    // Get modal title
    const getModalTitle = () => {
        if (!selectedActivity) return '';

        switch (modalType) {
            case 'view':
                return `Suspicious Activity: ${formatActivityType(selectedActivity.activityType)}`;
            case 'update':
                return 'Update Activity Status';
            case 'transactions':
                return 'Related Transactions';
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

            {/* Activity Metrics */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                            <AlertTriangle size={20} className="text-primary-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">Detected Activities</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                        {activities.filter(a => a.status === 'detected').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Eye size={20} className="text-yellow-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">Under Review</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                        {activities.filter(a => a.status === 'under_review').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">In progress</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Flag size={20} className="text-orange-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">Escalated</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                        {activities.filter(a => a.status === 'escalated').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Escalated to senior team</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle2 size={20} className="text-green-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800">Resolved</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">
                        {activities.filter(a => a.status === 'resolved' || a.status === 'false_positive').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Completed reviews</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by user, description or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-2 w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={activityTypeFilter}
                            onChange={(e) => setActivityTypeFilter(e.target.value as any)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm flex-grow md:flex-grow-0"
                        >
                            <option value="all">All Activity Types</option>
                            <option value="transaction_velocity">Transaction Velocity</option>
                            <option value="geo_location_mismatch">Geolocation Mismatch</option>
                            <option value="unusual_amount">Unusual Amount</option>
                            <option value="circular_transaction">Circular Transaction</option>
                            <option value="time_pattern">Time Pattern</option>
                            <option value="first_time_recipient">First-time Recipient</option>
                            <option value="account_dormancy">Account Dormancy</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="detected">Detected</option>
                            <option value="under_review">Under Review</option>
                            <option value="escalated">Escalated</option>
                            <option value="resolved">Resolved</option>
                            <option value="false_positive">False Positive</option>
                        </select>

                        <select
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value as any)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                        >
                            <option value="all">All Risk Levels</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>

                        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
                            {['24h', '7d', '30d', 'all'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setTimeframeFilter(period as any)}
                                    className={`px-2 py-1 rounded-lg text-xs transition-all ${timeframeFilter === period
                                        ? 'bg-gray-100 text-gray-800 font-medium'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    {period === 'all' ? 'All Time' : period}
                                </button>
                            ))}
                        </div>

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
            </div>

            {/* Activities Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Suspicious Activities</h2>
                    <button
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm"
                    >
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-8">
                        <div className="flex justify-center items-center">
                            <RefreshCw size={24} className="text-gray-400 animate-spin" />
                            <span className="ml-2 text-gray-500">Loading suspicious activities...</span>
                        </div>
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div className="p-8 text-center">
                        <Shield size={36} className="mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No activities found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detected</th>
                                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredActivities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                    {getActivityTypeIcon(activity.activityType)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{formatActivityType(activity.activityType)}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5 w-48 truncate" title={activity.description}>
                                                        {activity.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{activity.userName}</div>
                                            <div className="text-xs text-gray-500">ID: {activity.userId}</div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="flex flex-col text-xs text-gray-700">
                                                {activity.ipAddress && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Globe size={12} className="text-gray-400" />
                                                        <span>{activity.ipAddress}</span>
                                                    </div>
                                                )}
                                                {activity.location && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={12} className="text-gray-400" />
                                                        <span>{activity.location}</span>
                                                    </div>
                                                )}
                                                {activity.amount && activity.currency && (
                                                    <div className="flex items-center gap-1.5">
                                                        <CircleDollarSign size={12} className="text-gray-400" />
                                                        <span>{formatCurrency(activity.amount, activity.currency)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(activity.riskLevel)}`}>
                                                {getRiskLevelIcon(activity.riskLevel)}
                                                {activity.riskLevel.charAt(0).toUpperCase() + activity.riskLevel.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                                {getStatusIcon(activity.status)}
                                                {activity.status === 'under_review'
                                                    ? 'Under Review'
                                                    : activity.status === 'false_positive'
                                                        ? 'False Positive'
                                                        : activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(activity.detectedAt)}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    className="text-primary-600 hover:text-primary-900 p-1"
                                                    onClick={() => openActivityViewModal(activity)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {activity.transactionIds && activity.transactionIds.length > 0 && (
                                                    <button
                                                        className="text-primary-600 hover:text-primary-900 p-1"
                                                        onClick={() => openTransactionsModal(activity)}
                                                    >
                                                        <FileText size={16} />
                                                    </button>
                                                )}
                                                {(activity.status === 'detected' || activity.status === 'under_review') && (
                                                    <button
                                                        className="text-orange-600 hover:text-orange-900 p-1"
                                                        onClick={() => openUpdateStatusModal(activity)}
                                                    >
                                                        <Flag size={16} />
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
                        Showing {filteredActivities.length} of {activities.length} activities
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

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setSelectedActivity(null);
                    setResolutionNote('');
                    setActivityDetails(null);
                    setRelatedTransactions([]);
                }}
                title={getModalTitle()}
                size={modalType === 'transactions' ? 'lg' : 'md'}
            >
                {modalType === 'view' && selectedActivity && activityDetails && (
                    <div className="space-y-4 p-1">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(selectedActivity.riskLevel)}`}>
                                        {getRiskLevelIcon(selectedActivity.riskLevel)}
                                        {selectedActivity.riskLevel.charAt(0).toUpperCase() + selectedActivity.riskLevel.slice(1)} Risk
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedActivity.status)}`}>
                                        {getStatusIcon(selectedActivity.status)}
                                        {selectedActivity.status === 'under_review'
                                            ? 'Under Review'
                                            : selectedActivity.status === 'false_positive'
                                                ? 'False Positive'
                                                : selectedActivity.status.charAt(0).toUpperCase() + selectedActivity.status.slice(1)}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">ID: {selectedActivity.id}</div>
                            </div>

                            <h3 className="text-md font-medium text-gray-800">{formatActivityType(selectedActivity.activityType)}</h3>
                            <p className="text-sm text-gray-700 mt-1">{selectedActivity.description}</p>

                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                <div>
                                    <div className="text-gray-500">User:</div>
                                    <div className="font-medium text-gray-800">{selectedActivity.userName}</div>
                                    <div className="text-gray-600 text-xs">ID: {selectedActivity.userId}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Detected:</div>
                                    <div className="font-medium text-gray-800">{formatDate(selectedActivity.detectedAt)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Device Information</h3>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <div className="text-gray-500">Device:</div>
                                        <div className="text-gray-800">{activityDetails.deviceType}</div>

                                        <div className="text-gray-500">Browser:</div>
                                        <div className="text-gray-800">{activityDetails.browser}</div>

                                        <div className="text-gray-500">OS:</div>
                                        <div className="text-gray-800">{activityDetails.operatingSystem}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">IP Address Details</h3>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <div className="text-gray-500">IP:</div>
                                        <div className="text-gray-800">{activityDetails.ipAddressDetails.ip}</div>

                                        <div className="text-gray-500">Location:</div>
                                        <div className="text-gray-800">{activityDetails.ipAddressDetails.city}, {activityDetails.ipAddressDetails.country}</div>

                                        <div className="text-gray-500">ISP:</div>
                                        <div className="text-gray-800">{activityDetails.ipAddressDetails.isp}</div>

                                        <div className="text-gray-500">Proxy/VPN:</div>
                                        <div className="text-gray-800">
                                            {activityDetails.ipAddressDetails.proxy || activityDetails.ipAddressDetails.vpn || activityDetails.ipAddressDetails.tor ?
                                                <span className="text-orange-600 font-medium">Detected</span> :
                                                <span className="text-green-600">None</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedActivity.transactionIds && selectedActivity.transactionIds.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Related Transactions</h3>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <div className="overflow-x-auto max-h-40">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {activityDetails.transactionDetails?.map((tx) => (
                                                    <tr key={tx.id} className="hover:bg-gray-50">
                                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-primary-600 font-medium">{tx.id}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 capitalize">{tx.type}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 text-right font-medium">
                                                            {formatCurrency(tx.amount, tx.currency)}
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{formatDate(tx.timestamp)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
                                        <button
                                            onClick={() => openTransactionsModal(selectedActivity)}
                                            className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                                        >
                                            View All Transactions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedActivity.relatedUsers && selectedActivity.relatedUsers.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Related Users</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedActivity.relatedUsers.map((userId) => (
                                        <div
                                            key={userId}
                                            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-1.5"
                                        >
                                            <User size={14} className="text-gray-500" />
                                            {userId}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Timeline</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="p-1.5 bg-primary-100 rounded-full">
                                        <AlertTriangle size={14} className="text-primary-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-800">Activity Detected</div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {formatDate(selectedActivity.detectedAt)}
                                        </div>
                                    </div>
                                </div>

                                {selectedActivity.assignedTo && selectedActivity.reviewedAt && (
                                    <div className="flex items-start gap-2">
                                        <div className="p-1.5 bg-yellow-100 rounded-full">
                                            <Eye size={14} className="text-yellow-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-800">Under Review</div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {formatDate(selectedActivity.reviewedAt)} by {selectedActivity.assignedTo}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedActivity.status === 'escalated' && (
                                    <div className="flex items-start gap-2">
                                        <div className="p-1.5 bg-orange-100 rounded-full">
                                            <Flag size={14} className="text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-800">Escalated</div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {selectedActivity.reviewedAt ? formatDate(selectedActivity.reviewedAt) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedActivity.resolvedAt && (
                                    <div className="flex items-start gap-2">
                                        <div className="p-1.5 bg-green-100 rounded-full">
                                            {selectedActivity.status === 'false_positive' ? (
                                                <XCircle size={14} className="text-green-600" />
                                            ) : (
                                                <CheckCircle2 size={14} className="text-green-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-800">
                                                {selectedActivity.status === 'false_positive' ? 'Marked as False Positive' : 'Resolved'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {formatDate(selectedActivity.resolvedAt)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedActivity.resolution && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Resolution</h3>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                    {selectedActivity.resolution}
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

                            {(selectedActivity.status === 'detected' || selectedActivity.status === 'under_review') && (
                                <button
                                    onClick={() => openUpdateStatusModal(selectedActivity)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700"
                                >
                                    Update Status
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {modalType === 'update' && selectedActivity && (
                    <div className="space-y-4 p-1">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        You are updating the status of a suspicious activity for <strong>{selectedActivity.userName}</strong>.
                                        This action will be logged for audit purposes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
                            <div className="p-3 bg-gray-50 rounded-lg mb-3">
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedActivity.status)}`}>
                                        {getStatusIcon(selectedActivity.status)}
                                        {selectedActivity.status === 'under_review'
                                            ? 'Under Review'
                                            : selectedActivity.status === 'false_positive'
                                                ? 'False Positive'
                                                : selectedActivity.status.charAt(0).toUpperCase() + selectedActivity.status.slice(1)}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(selectedActivity.riskLevel)}`}>
                                        {getRiskLevelIcon(selectedActivity.riskLevel)}
                                        {selectedActivity.riskLevel.charAt(0).toUpperCase() + selectedActivity.riskLevel.slice(1)} Risk
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                    <strong>Activity Type:</strong> {formatActivityType(selectedActivity.activityType)}
                                </div>
                                <div className="mt-1 text-sm text-gray-700">
                                    <strong>Description:</strong> {selectedActivity.description}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Update Status To:</label>
                            <div className="space-y-2">
                                {selectedActivity.status === 'detected' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedActivity.id, 'under_review')}
                                        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center">
                                            <div className="p-2 bg-yellow-100 rounded-full mr-3">
                                                <Eye size={16} className="text-yellow-600" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-medium text-gray-900">Mark as Under Review</div>
                                                <div className="text-xs text-gray-500">Begin investigating this activity</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={16} className="text-gray-400" />
                                    </button>
                                )}

                                {(selectedActivity.status === 'detected' || selectedActivity.status === 'under_review') && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedActivity.id, 'escalated')}
                                        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center">
                                            <div className="p-2 bg-orange-100 rounded-full mr-3">
                                                <Flag size={16} className="text-orange-600" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-medium text-gray-900">Escalate</div>
                                                <div className="text-xs text-gray-500">Escalate to senior compliance team</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={16} className="text-gray-400" />
                                    </button>
                                )}

                                {(selectedActivity.status === 'detected' || selectedActivity.status === 'under_review' || selectedActivity.status === 'escalated') && (
                                    <>
                                        <button
                                            onClick={() => {
                                                const note = window.prompt('Please provide a resolution note:');
                                                if (note) {
                                                    handleStatusUpdate(selectedActivity.id, 'resolved', note);
                                                }
                                            }}
                                            className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 bg-green-100 rounded-full mr-3">
                                                    <CheckCircle2 size={16} className="text-green-600" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-medium text-gray-900">Mark as Resolved</div>
                                                    <div className="text-xs text-gray-500">Activity has been addressed and resolved</div>
                                                </div>
                                            </div>
                                            <ArrowUpRight size={16} className="text-gray-400" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                const note = window.prompt('Please provide a reason for false positive:');
                                                if (note) {
                                                    handleStatusUpdate(selectedActivity.id, 'false_positive', note);
                                                }
                                            }}
                                            className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 bg-gray-100 rounded-full mr-3">
                                                    <XCircle size={16} className="text-gray-600" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-medium text-gray-900">Mark as False Positive</div>
                                                    <div className="text-xs text-gray-500">Activity was flagged incorrectly</div>
                                                </div>
                                            </div>
                                            <ArrowUpRight size={16} className="text-gray-400" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'transactions' && selectedActivity && activityDetails && (
                    <div className="space-y-4 p-1">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-md font-medium text-gray-800">{formatActivityType(selectedActivity.activityType)} - Transactions</h3>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(selectedActivity.riskLevel)}`}>
                                    {getRiskLevelIcon(selectedActivity.riskLevel)}
                                    {selectedActivity.riskLevel.charAt(0).toUpperCase() + selectedActivity.riskLevel.slice(1)} Risk
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{selectedActivity.description}</p>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {activityDetails.transactionDetails?.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-primary-600">{tx.id}</td>
                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {tx.type === 'transfer' ? (
                                                            <ArrowUpRight className="w-4 h-4 text-primary-600 mr-1.5" />
                                                        ) : tx.type === 'credit' ? (
                                                            <ArrowDownLeft className="w-4 h-4 text-green-600 mr-1.5" />
                                                        ) : (
                                                            <ArrowUpRight className="w-4 h-4 text-orange-600 mr-1.5" />
                                                        )}
                                                        <span className="text-sm text-gray-700 capitalize">{tx.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                                    {formatCurrency(tx.amount, tx.currency)}
                                                </td>
                                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                                                    {tx.receiverInfo || 'N/A'}
                                                </td>
                                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(tx.timestamp)}
                                                </td>
                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 mt-5 border-t border-gray-200">
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm"
                            >
                                <Download size={16} />
                                <span>Export Transactions</span>
                            </button>

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

export default SuspiciousActivityMonitor;