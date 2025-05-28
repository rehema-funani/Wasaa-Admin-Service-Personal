import { AlertCircle, AlertTriangle, ChevronDown, ChevronRight, Clock, Eye, FileCheck, FileText, Filter, RefreshCw, Search, Shield, User, UserCheck, X } from 'lucide-react';

interface RenderDashboardProps {
    metrics: any;
    alerts: any[];
    isLoading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterOpen: boolean;
    setFilterOpen: (open: boolean) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
    riskFilter: string;
    setRiskFilter: (filter: string) => void;
    timeframeFilter: string;
    setTimeframeFilter: (filter: string) => void;
    filteredAlerts: any[];
    fetchAMLData: () => void;
    openAlertViewModal: (alert: any) => void;
    openUpdateStatusModal: (alert: any) => void;
    getAlertTypeIcon: (type: string) => JSX.Element;
    getRiskLevelColor: (level: string) => string;
    getRiskLevelIcon: (level: string) => JSX.Element;
    getStatusColor: (status: string) => string;
    getStatusIcon: (status: string) => JSX.Element;
    formatAlertType: (type: string) => string;
}

const renderDashboard = ({
    metrics,
    alerts,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterOpen,
    setFilterOpen,
    statusFilter,
    setStatusFilter,
    riskFilter,
    setRiskFilter,
    timeframeFilter,
    setTimeframeFilter,
    filteredAlerts,
    fetchAMLData,
    openAlertViewModal,
    openUpdateStatusModal,
    getAlertTypeIcon,
    getRiskLevelColor,
    getRiskLevelIcon,
    getStatusColor,
    getStatusIcon,
    formatAlertType
}: RenderDashboardProps) => {

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffDay > 0) {
            return `${diffDay}d ago`;
        } else if (diffHour > 0) {
            return `${diffHour}h ago`;
        } else if (diffMin > 0) {
            return `${diffMin}m ago`;
        } else {
            return 'Just now';
        }
    };

    return (
        <>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/5 rounded-full"></div>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/5 rounded-full"></div>

                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                            <AlertCircle size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-600">Active Alerts</h3>
                            <p className="text-2xl font-semibold text-gray-900">{metrics?.totalAlerts || 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-blue-50">
                            <span className="text-xs text-gray-500">New</span>
                            <p className="text-lg font-medium text-blue-600">{metrics?.newAlerts || 0}</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-yellow-50">
                            <span className="text-xs text-gray-500">Under Review</span>
                            <p className="text-lg font-medium text-yellow-600">{metrics?.underReviewAlerts || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-sm border border-red-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-red-500/5 rounded-full"></div>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-500/5 rounded-full"></div>

                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-red-100">
                            <AlertTriangle size={20} className="text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-600">Risk Summary</h3>
                            <p className="text-2xl font-semibold text-gray-900">{metrics ? metrics.highRiskAlerts + metrics.mediumRiskAlerts + metrics.lowRiskAlerts : 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-red-50">
                            <span className="text-xs text-gray-500">High</span>
                            <p className="text-lg font-medium text-red-600">{metrics?.highRiskAlerts || 0}</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-yellow-50">
                            <span className="text-xs text-gray-500">Medium</span>
                            <p className="text-lg font-medium text-yellow-600">{metrics?.mediumRiskAlerts || 0}</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-green-50">
                            <span className="text-xs text-gray-500">Low</span>
                            <p className="text-lg font-medium text-green-600">{metrics?.lowRiskAlerts || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-500/5 rounded-full"></div>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/5 rounded-full"></div>

                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-green-100">
                            <FileCheck size={20} className="text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-600">Resolution Stats</h3>
                            <p className="text-2xl font-semibold text-gray-900">{metrics?.resolvedAlerts || 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-green-50">
                            <span className="text-xs text-gray-500">Resolved</span>
                            <p className="text-lg font-medium text-green-600">{metrics?.resolvedAlerts || 0}</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">False Positives</span>
                            <p className="text-lg font-medium text-gray-600">{metrics?.falsePositives || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AML Alerts Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-800">AML Alerts</h2>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search alerts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm w-60 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border transition-all 
                            ${filterOpen
                                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            <Filter size={16} />
                            <span>Filters</span>
                            <ChevronDown size={16} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <button
                            onClick={fetchAMLData}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Filter panel */}
                {filterOpen && (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full text-sm bg-white border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                            >
                                <option value="all">All Statuses</option>
                                <option value="new">New</option>
                                <option value="under_review">Under Review</option>
                                <option value="escalated">Escalated</option>
                                <option value="resolved">Resolved</option>
                                <option value="false_positive">False Positive</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Risk Level</label>
                            <select
                                value={riskFilter}
                                onChange={(e) => setRiskFilter(e.target.value as any)}
                                className="w-full text-sm bg-white border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                            >
                                <option value="all">All Risk Levels</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Time Period</label>
                            <select
                                value={timeframeFilter}
                                onChange={(e) => setTimeframeFilter(e.target.value as any)}
                                className="w-full text-sm bg-white border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                            >
                                <option value="all">All Time</option>
                                <option value="24h">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                            </select>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="p-12">
                        <div className="flex flex-col items-center justify-center">
                            <RefreshCw size={32} className="text-blue-400 animate-spin mb-4" />
                            <p className="text-gray-500 mb-1">Loading AML alerts...</p>
                            <p className="text-xs text-gray-400">This may take a moment</p>
                        </div>
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100">
                            <Shield size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No alerts found</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('all');
                                setRiskFilter('all');
                                setTimeframeFilter('all');
                            }}
                            className="mt-4 px-4 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredAlerts.map((alert) => (
                            <div key={alert.id} className="p-5 hover:bg-gray-50 transition-all duration-200">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                            {getAlertTypeIcon(alert.AlertType.name)}
                                        </div>
                                    </div>

                                    <div className="flex-grow min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="text-sm font-medium text-gray-900">{formatAlertType(alert.AlertType.name)}</h3>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(alert.RiskLevel.name)}`}>
                                                {getRiskLevelIcon(alert.RiskLevel.name)}
                                                {alert.RiskLevel.name.charAt(0).toUpperCase() + alert.RiskLevel.name.slice(1)}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                                                {getStatusIcon(alert.status)}
                                                {alert.status === 'under_review'
                                                    ? 'Under Review'
                                                    : alert.status === 'false_positive'
                                                        ? 'False Positive'
                                                        : alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-1 line-clamp-1">{alert.description}</p>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <User size={14} />
                                                {alert.userName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {timeAgo(alert.createdAt)}
                                            </span>
                                            {alert.assignedTo && (
                                                <span className="flex items-center gap-1">
                                                    <UserCheck size={14} />
                                                    {alert.assignedTo}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-center">
                                        <button
                                            onClick={() => openAlertViewModal(alert)}
                                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>

                                        {(alert.status === 'new' || alert.status === 'under_review') && (
                                            <button
                                                onClick={() => openUpdateStatusModal(alert)}
                                                className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                                                title="Update Status"
                                            >
                                                <FileText size={18} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => window.open(`/admin/users/${alert.userUuid}`, '_blank')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                                        >
                                            View User
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="text-sm text-gray-500">
                        Showing {filteredAlerts.length} of {alerts.length} alerts
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm disabled:opacity-50"
                            disabled
                        >
                            Previous
                        </button>
                        <button
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm disabled:opacity-50"
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

export default renderDashboard;