import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Shield,
    AlertCircle,
    Search,
    RefreshCw,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    Sliders,
    UserX,
    UserCheck,
    Globe,
    FileCheck,
    Calendar,
    BarChart3,
    PieChart,
    ChevronDown,
    Eye,
    FileText,
    Flag,
    ArrowRight,
    Settings,
    Bell
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
import BlacklistWhitelistManager from './blacklistwhitelistmanager';
import SuspiciousActivityMonitor from './suspiciousactivitymonitor';
import AMLRulesConfiguration from './amlrulesconfiguration';

// Types for AML alerts
interface AMLAlert {
    id: string;
    userId: string;
    userName: string;
    alertType: 'high_volume' | 'unusual_pattern' | 'restricted_country' | 'multiple_accounts' | 'structured_transactions' | 'watchlist_match';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    status: 'new' | 'under_review' | 'escalated' | 'resolved' | 'false_positive';
    description: string;
    createdAt: string;
    assignedTo?: string;
    reviewedAt?: string;
    resolvedAt?: string;
    resolution?: string;
    transactionIds?: string[];
}

// Types for risk metrics
interface RiskMetrics {
    totalAlerts: number;
    newAlerts: number;
    resolvedAlerts: number;
    falsePositives: number;
    highRiskUsers: number;
    highRiskTransactions: number;
    alertsByType: {
        name: string;
        value: number;
    }[];
    alertsByRisk: {
        name: string;
        value: number;
    }[];
}

const AMLComplianceDashboard: React.FC = () => {
    // State management
    const [alerts, setAlerts] = useState<AMLAlert[]>([]);
    const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'blacklist' | 'activity' | 'rules'>('dashboard');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'under_review' | 'escalated' | 'resolved' | 'false_positive'>('all');
    const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
    const [timeframeFilter, setTimeframeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedAlert, setSelectedAlert] = useState<AMLAlert | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'view' | 'update' | null>(null);

    // Mock data for AML alerts
    const mockAlerts: AMLAlert[] = [
        {
            id: 'alert-001',
            userId: 'user-023',
            userName: 'John Smith',
            alertType: 'high_volume',
            riskLevel: 'high',
            status: 'new',
            description: 'Unusual high-volume transactions detected - 10x above user average in 24 hour period',
            createdAt: '2025-05-19T08:30:00Z',
            transactionIds: ['tx-4567', 'tx-4568', 'tx-4569', 'tx-4570']
        },
        {
            id: 'alert-002',
            userId: 'user-047',
            userName: 'Alice Johnson',
            alertType: 'unusual_pattern',
            riskLevel: 'medium',
            status: 'under_review',
            description: 'Rapid succession of small transactions followed by large withdrawal',
            createdAt: '2025-05-18T14:15:00Z',
            assignedTo: 'Compliance Officer',
            transactionIds: ['tx-3450', 'tx-3451', 'tx-3452', 'tx-3453']
        },
        {
            id: 'alert-003',
            userId: 'user-089',
            userName: 'Robert Williams',
            alertType: 'restricted_country',
            riskLevel: 'critical',
            status: 'escalated',
            description: 'User attempted transaction with counterparty in restricted jurisdiction',
            createdAt: '2025-05-18T10:45:00Z',
            assignedTo: 'Senior Compliance Manager',
            reviewedAt: '2025-05-18T11:30:00Z',
            transactionIds: ['tx-3892']
        },
        {
            id: 'alert-004',
            userId: 'user-034',
            userName: 'Maria Garcia',
            alertType: 'multiple_accounts',
            riskLevel: 'medium',
            status: 'resolved',
            description: 'User linked to 3 different accounts with similar transaction patterns',
            createdAt: '2025-05-17T09:20:00Z',
            assignedTo: 'Compliance Analyst',
            reviewedAt: '2025-05-17T11:45:00Z',
            resolvedAt: '2025-05-17T16:30:00Z',
            resolution: 'Verified legitimate business accounts with proper documentation',
            transactionIds: ['tx-2901', 'tx-2945', 'tx-3011']
        },
        {
            id: 'alert-005',
            userId: 'user-132',
            userName: 'David Brown',
            alertType: 'structured_transactions',
            riskLevel: 'high',
            status: 'false_positive',
            description: 'Potential structured transactions to avoid reporting threshold',
            createdAt: '2025-05-16T13:10:00Z',
            assignedTo: 'Compliance Officer',
            reviewedAt: '2025-05-16T15:20:00Z',
            resolvedAt: '2025-05-16T17:40:00Z',
            resolution: 'Confirmed legitimate business pattern with invoice documentation',
            transactionIds: ['tx-2765', 'tx-2766', 'tx-2767', 'tx-2768', 'tx-2769']
        },
        {
            id: 'alert-006',
            userId: 'user-056',
            userName: 'James Wilson',
            alertType: 'watchlist_match',
            riskLevel: 'critical',
            status: 'new',
            description: 'Potential match with sanctioned individual - 92% name similarity',
            createdAt: '2025-05-19T07:55:00Z',
            transactionIds: ['tx-4571']
        },
        {
            id: 'alert-007',
            userId: 'user-078',
            userName: 'Sarah Davis',
            alertType: 'high_volume',
            riskLevel: 'low',
            status: 'under_review',
            description: 'Transaction volume 3x above user average in 7 day period',
            createdAt: '2025-05-18T16:40:00Z',
            assignedTo: 'Compliance Analyst',
            transactionIds: ['tx-4127', 'tx-4128', 'tx-4135']
        },
        {
            id: 'alert-008',
            userId: 'user-112',
            userName: 'Michael Thompson',
            alertType: 'unusual_pattern',
            riskLevel: 'high',
            status: 'resolved',
            description: 'Circular transaction pattern between 4 related accounts',
            createdAt: '2025-05-15T11:30:00Z',
            assignedTo: 'Senior Compliance Manager',
            reviewedAt: '2025-05-15T13:40:00Z',
            resolvedAt: '2025-05-17T09:15:00Z',
            resolution: 'Accounts frozen and reported to FIU. User accounts terminated.',
            transactionIds: ['tx-3765', 'tx-3766', 'tx-3767', 'tx-3768', 'tx-3770', 'tx-3771']
        }
    ];

    // Mock metrics data
    const mockMetrics: RiskMetrics = {
        totalAlerts: 257,
        newAlerts: 42,
        resolvedAlerts: 183,
        falsePositives: 68,
        highRiskUsers: 17,
        highRiskTransactions: 93,
        alertsByType: [
            { name: 'High Volume', value: 78 },
            { name: 'Unusual Pattern', value: 63 },
            { name: 'Restricted Country', value: 24 },
            { name: 'Multiple Accounts', value: 30 },
            { name: 'Structured Transactions', value: 42 },
            { name: 'Watchlist Match', value: 20 }
        ],
        alertsByRisk: [
            { name: 'Low', value: 42 },
            { name: 'Medium', value: 105 },
            { name: 'High', value: 87 },
            { name: 'Critical', value: 23 }
        ]
    };

    // Load AML alert data
    useEffect(() => {
        // Simulating API call
        const fetchAMLData = async () => {
            setIsLoading(true);
            try {
                // In a real implementation, this would be:
                // const alerts = await amlService.getAlerts();
                // const metrics = await amlService.getMetrics();

                // For now, using mock data with a timeout for loading simulation
                setTimeout(() => {
                    setAlerts(mockAlerts);
                    setMetrics(mockMetrics);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Failed to fetch AML data', error);
                setErrorMessage('Failed to load AML compliance data');
                setIsLoading(false);
            }
        };

        fetchAMLData();
    }, []);

    // Filter alerts based on search, status, risk level and timeframe
    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch =
            alert.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
        const matchesRisk = riskFilter === 'all' || alert.riskLevel === riskFilter;

        if (timeframeFilter === 'all') return matchesSearch && matchesStatus && matchesRisk;

        const alertDate = new Date(alert.createdAt);
        const now = new Date();
        const timeDiff = now.getTime() - alertDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        const matchesTimeframe =
            (timeframeFilter === '24h' && daysDiff <= 1) ||
            (timeframeFilter === '7d' && daysDiff <= 7) ||
            (timeframeFilter === '30d' && daysDiff <= 30);

        return matchesSearch && matchesStatus && matchesRisk && matchesTimeframe;
    });

    // Handle alert status update
    const handleStatusUpdate = (alertId: string, newStatus: AMLAlert['status'], resolution?: string) => {
        // In a real implementation, this would call an API
        const updatedAlerts = alerts.map(alert => {
            if (alert.id === alertId) {
                const updatedAlert = { ...alert, status: newStatus };

                if (newStatus === 'under_review' && alert.status === 'new') {
                    updatedAlert.assignedTo = 'Current Compliance Officer';
                    updatedAlert.reviewedAt = new Date().toISOString();
                } else if (newStatus === 'escalated') {
                    updatedAlert.assignedTo = 'Senior Compliance Manager';
                    updatedAlert.reviewedAt = new Date().toISOString();
                } else if (newStatus === 'resolved' || newStatus === 'false_positive') {
                    updatedAlert.resolvedAt = new Date().toISOString();
                    if (resolution) updatedAlert.resolution = resolution;
                }

                return updatedAlert;
            }
            return alert;
        });

        setAlerts(updatedAlerts);

        const actionText = newStatus === 'under_review'
            ? 'marked for review'
            : newStatus === 'escalated'
                ? 'escalated'
                : newStatus === 'resolved'
                    ? 'resolved'
                    : 'marked as false positive';

        showSuccess(`AML alert successfully ${actionText}`);

        // Reset states
        setIsModalOpen(false);
        setModalType(null);
        setSelectedAlert(null);
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

    // Open alert view modal
    const openAlertViewModal = (alert: AMLAlert) => {
        setSelectedAlert(alert);
        setModalType('view');
        setIsModalOpen(true);
    };

    // Open alert update modal
    const openUpdateStatusModal = (alert: AMLAlert) => {
        setSelectedAlert(alert);
        setModalType('update');
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

    // Format alert type
    const formatAlertType = (type: string) => {
        switch (type) {
            case 'high_volume': return 'High Volume';
            case 'unusual_pattern': return 'Unusual Pattern';
            case 'restricted_country': return 'Restricted Country';
            case 'multiple_accounts': return 'Multiple Accounts';
            case 'structured_transactions': return 'Structured Transactions';
            case 'watchlist_match': return 'Watchlist Match';
            default: return type;
        }
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
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

    // Get risk level icon
    const getRiskLevelIcon = (level: string) => {
        switch (level) {
            case 'low':
                return <AlertCircle className="w-4 h-4" />;
            case 'medium':
                return <AlertCircle className="w-4 h-4" />;
            case 'high':
                return <AlertTriangle className="w-4 h-4" />;
            case 'critical':
                return <AlertTriangle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new':
                return <Clock className="w-4 h-4" />;
            case 'under_review':
                return <Eye className="w-4 h-4" />;
            case 'escalated':
                return <Flag className="w-4 h-4" />;
            case 'resolved':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'false_positive':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // Get alert type icon
    const getAlertTypeIcon = (type: string) => {
        switch (type) {
            case 'high_volume':
                return <BarChart3 className="w-4 h-4 text-primary-600" />;
            case 'unusual_pattern':
                return <PieChart className="w-4 h-4 text-purple-600" />;
            case 'restricted_country':
                return <Globe className="w-4 h-4 text-red-600" />;
            case 'multiple_accounts':
                return <Users className="w-4 h-4 text-orange-600" />;
            case 'structured_transactions':
                return <Layers className="w-4 h-4 text-primary-600" />;
            case 'watchlist_match':
                return <FileCheck className="w-4 h-4 text-green-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    // Get modal title
    const getModalTitle = () => {
        if (!selectedAlert) return '';

        switch (modalType) {
            case 'view':
                return `AML Alert: ${formatAlertType(selectedAlert.alertType)}`;
            case 'update':
                return 'Update Alert Status';
            default:
                return '';
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'blacklist':
                return <BlacklistWhitelistManager />;
            case 'activity':
                return <SuspiciousActivityMonitor />;
            case 'rules':
                return <AMLRulesConfiguration />;
            default:
                return renderDashboard();
        }
    };

    const renderDashboard = () => {
        return (
            <>
                {/* Risk Metrics Summary */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <AlertCircle size={20} className="text-primary-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Active Alerts</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{metrics?.totalAlerts || 0}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                                New: {metrics?.newAlerts || 0}
                            </span>
                            <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                                Under Review: {alerts.filter(a => a.status === 'under_review').length}
                            </span>
                            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                                Escalated: {alerts.filter(a => a.status === 'escalated').length}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle size={20} className="text-red-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">High Risk Entities</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{metrics?.highRiskUsers || 0}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                                Critical: {alerts.filter(a => a.riskLevel === 'critical').length}
                            </span>
                            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                                High: {alerts.filter(a => a.riskLevel === 'high').length}
                            </span>
                            <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                                Medium: {alerts.filter(a => a.riskLevel === 'medium').length}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FileCheck size={20} className="text-green-600" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-800">Resolution Stats</h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{metrics?.resolvedAlerts || 0}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                Resolved: {alerts.filter(a => a.status === 'resolved').length}
                            </span>
                            <span className="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full">
                                False Positives: {metrics?.falsePositives || 0}
                            </span>
                            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                                Resolution Rate: {metrics ? ((metrics.resolvedAlerts / metrics.totalAlerts) * 100).toFixed(1) : 0}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* AML Alerts Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-800">AML Alerts</h2>
                        <div className="flex items-center gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="text-xs bg-white border border-gray-300 rounded-lg py-1.5 px-3"
                            >
                                <option value="all">All Statuses</option>
                                <option value="new">New</option>
                                <option value="under_review">Under Review</option>
                                <option value="escalated">Escalated</option>
                                <option value="resolved">Resolved</option>
                                <option value="false_positive">False Positive</option>
                            </select>

                            <select
                                value={riskFilter}
                                onChange={(e) => setRiskFilter(e.target.value as any)}
                                className="text-xs bg-white border border-gray-300 rounded-lg py-1.5 px-3"
                            >
                                <option value="all">All Risk Levels</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search alerts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 text-xs w-48 bg-white border border-gray-300 rounded-lg"
                                />
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <Search size={14} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-8">
                            <div className="flex justify-center items-center">
                                <RefreshCw size={24} className="text-gray-400 animate-spin" />
                                <span className="ml-2 text-gray-500">Loading AML alerts...</span>
                            </div>
                        </div>
                    ) : filteredAlerts.length === 0 ? (
                        <div className="p-8 text-center">
                            <Shield size={36} className="mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No alerts found</h3>
                            <p className="text-gray-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredAlerts.map((alert) => (
                                        <tr key={alert.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                        {getAlertTypeIcon(alert.alertType)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{formatAlertType(alert.alertType)}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate" title={alert.description}>
                                                            {alert.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{alert.userName}</div>
                                                <div className="text-xs text-gray-500">ID: {alert.userId}</div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(alert.riskLevel)}`}>
                                                    {getRiskLevelIcon(alert.riskLevel)}
                                                    {alert.riskLevel.charAt(0).toUpperCase() + alert.riskLevel.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                                                    {getStatusIcon(alert.status)}
                                                    {alert.status === 'under_review'
                                                        ? 'Under Review'
                                                        : alert.status === 'false_positive'
                                                            ? 'False Positive'
                                                            : alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(alert.createdAt)}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{alert.assignedTo || '-'}</div>
                                                {alert.reviewedAt && (
                                                    <div className="text-xs text-gray-500">
                                                        Reviewed: {formatDate(alert.reviewedAt)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="text-primary-600 hover:text-primary-900 p-1"
                                                        onClick={() => openAlertViewModal(alert)}
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    {(alert.status === 'new' || alert.status === 'under_review') && (
                                                        <button
                                                            className="text-primary-600 hover:text-primary-900 p-1"
                                                            onClick={() => openUpdateStatusModal(alert)}
                                                        >
                                                            <FileText size={18} />
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
                            Showing {filteredAlerts.length} of {alerts.length} alerts
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
            </>
        );
    };

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">AML & Compliance Monitoring</h1>
                            <p className="text-gray-500 text-sm mt-1">Monitor suspicious activities, manage compliance controls, and configure AML rules</p>
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
                                <Download size={16} />
                                <span>Export Report</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200 mb-6">
                        <button
                            className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'dashboard'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <Shield size={16} className="mr-2" />
                            Dashboard
                        </button>
                        <button
                            className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'blacklist'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('blacklist')}
                        >
                            <UserX size={16} className="mr-2" />
                            Blacklist/Whitelist
                        </button>
                        <button
                            className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'activity'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('activity')}
                        >
                            <AlertTriangle size={16} className="mr-2" />
                            Suspicious Activity
                        </button>
                        <button
                            className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'rules'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('rules')}
                        >
                            <Sliders size={16} className="mr-2" />
                            AML Rules
                        </button>
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

                    {/* Tab Content */}
                    {renderTabContent()}
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setSelectedAlert(null);
                }}
                title={getModalTitle()}
                size="md"
            >
                {modalType === 'view' && selectedAlert && (
                    <div className="space-y-4 p-1">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(selectedAlert.riskLevel)}`}>
                                        {getRiskLevelIcon(selectedAlert.riskLevel)}
                                        {selectedAlert.riskLevel.charAt(0).toUpperCase() + selectedAlert.riskLevel.slice(1)} Risk
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAlert.status)}`}>
                                        {getStatusIcon(selectedAlert.status)}
                                        {selectedAlert.status === 'under_review'
                                            ? 'Under Review'
                                            : selectedAlert.status === 'false_positive'
                                                ? 'False Positive'
                                                : selectedAlert.status.charAt(0).toUpperCase() + selectedAlert.status.slice(1)}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">ID: {selectedAlert.id}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500">User:</div>
                                    <div className="font-medium text-gray-800">{selectedAlert.userName}</div>
                                    <div className="text-gray-600 text-xs">ID: {selectedAlert.userId}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Alert Type:</div>
                                    <div className="font-medium text-gray-800">{formatAlertType(selectedAlert.alertType)}</div>
                                    <div className="text-gray-600 text-xs">Created: {formatDate(selectedAlert.createdAt)}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Alert Description</h3>
                            <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                {selectedAlert.description}
                            </div>
                        </div>

                        {selectedAlert.transactionIds && selectedAlert.transactionIds.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Related Transactions</h3>
                                <div className="overflow-hidden border border-gray-200 rounded-lg">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Transaction ID</th>
                                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedAlert.transactionIds.map((txId) => (
                                                    <tr key={txId}>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{txId}</td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                                                            <button className="text-primary-600 hover:text-primary-900 text-xs font-medium">
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Status Timeline</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <div className="p-1.5 bg-primary-100 rounded-full">
                                            <AlertCircle size={14} className="text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-800">Alert Created</div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {formatDate(selectedAlert.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedAlert.assignedTo && selectedAlert.reviewedAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="p-1.5 bg-yellow-100 rounded-full">
                                                <Eye size={14} className="text-yellow-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-gray-800">Under Review</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(selectedAlert.reviewedAt)} by {selectedAlert.assignedTo}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedAlert.resolvedAt && (
                                        <div className="flex items-start gap-2">
                                            <div className="p-1.5 bg-green-100 rounded-full">
                                                <CheckCircle2 size={14} className="text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-gray-800">
                                                    {selectedAlert.status === 'false_positive' ? 'Marked as False Positive' : 'Resolved'}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(selectedAlert.resolvedAt)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedAlert.resolution && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Resolution</h3>
                                    <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                                        {selectedAlert.resolution}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>

                            {(selectedAlert.status === 'new' || selectedAlert.status === 'under_review') && (
                                <button
                                    onClick={() => openUpdateStatusModal(selectedAlert)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700"
                                >
                                    Update Status
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {modalType === 'update' && selectedAlert && (
                    <div className="space-y-4 p-1">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        You are updating the status of an AML alert for <strong>{selectedAlert.userName}</strong>.
                                        This action will be logged for audit purposes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
                            <div className="p-3 bg-gray-50 rounded-lg mb-3">
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAlert.status)}`}>
                                        {getStatusIcon(selectedAlert.status)}
                                        {selectedAlert.status === 'under_review'
                                            ? 'Under Review'
                                            : selectedAlert.status === 'false_positive'
                                                ? 'False Positive'
                                                : selectedAlert.status.charAt(0).toUpperCase() + selectedAlert.status.slice(1)}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(selectedAlert.riskLevel)}`}>
                                        {getRiskLevelIcon(selectedAlert.riskLevel)}
                                        {selectedAlert.riskLevel.charAt(0).toUpperCase() + selectedAlert.riskLevel.slice(1)} Risk
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                    <strong>Alert:</strong> {formatAlertType(selectedAlert.alertType)}
                                </div>
                                <div className="mt-1 text-sm text-gray-700">
                                    <strong>Description:</strong> {selectedAlert.description}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Update Status To:</label>
                            <div className="space-y-2">
                                {selectedAlert.status === 'new' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedAlert.id, 'under_review')}
                                        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center">
                                            <div className="p-2 bg-yellow-100 rounded-full mr-3">
                                                <Eye size={16} className="text-yellow-600" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-medium text-gray-900">Mark as Under Review</div>
                                                <div className="text-xs text-gray-500">Begin investigating this alert</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-400" />
                                    </button>
                                )}

                                {(selectedAlert.status === 'new' || selectedAlert.status === 'under_review') && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedAlert.id, 'escalated')}
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
                                        <ArrowRight size={16} className="text-gray-400" />
                                    </button>
                                )}

                                {(selectedAlert.status === 'new' || selectedAlert.status === 'under_review' || selectedAlert.status === 'escalated') && (
                                    <>
                                        <button
                                            onClick={() => {
                                                const resolution = window.prompt('Please provide a resolution note:');
                                                if (resolution) {
                                                    handleStatusUpdate(selectedAlert.id, 'resolved', resolution);
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
                                                    <div className="text-xs text-gray-500">Alert has been addressed and resolved</div>
                                                </div>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-400" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                const resolution = window.prompt('Please provide a reason for false positive:');
                                                if (resolution) {
                                                    handleStatusUpdate(selectedAlert.id, 'false_positive', resolution);
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
                                                    <div className="text-xs text-gray-500">Alert was triggered incorrectly</div>
                                                </div>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-400" />
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
            </Modal>
        </div>
    );
};

// Required for the component to render correctly
function Layers(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 24}
            height={props.size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className || ""}
        >
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
    );
}

function Users(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 24}
            height={props.size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className || ""}
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    );
}

export default AMLComplianceDashboard;