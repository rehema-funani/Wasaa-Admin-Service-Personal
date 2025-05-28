import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    User,
    ChevronRight,
    FileText,
    RefreshCw,
    Download,
    ClipboardList,
    Shield,
    Info,
    Calendar,
    Clock,
    AlertCircle,
    FileCheck,
    ChevronLeft,
    ChevronDown,
    ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { logsService } from '../../../api/services/logs';

interface AuditLog {
    _id: string;
    user_id: string;
    username: string;
    ip_address: string;
    service_name: string;
    status_code: number;
    session_id?: string;
    user_email?: string;
    event_type: string;
    event_description: string;
    entity_affected: string;
    entity_id: string;
    http_method: string;
    request_url: string;
    query_params: string;
    request_body: any;
    response_body: any;
    execution_time: number;
    location: string;
    user_agent: string;
    device_type: string;
    device_model: string;
    os: string;
    browser: string;
    auth_method: string;
    roles: string;
    permissions: string;
    is_successful: boolean;
    __v: number;
    timestamp?: string;
}

const AuditLogsPage: React.FC = () => {
    const navigate = useNavigate();
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [eventFilter, setEventFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [dateFilter, setDateFilter] = useState('all');

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    useEffect(() => {
        let filtered = [...auditLogs];

        if (searchQuery) {
            filtered = filtered.filter(log =>
                (getUsernameDisplay(log).toLowerCase().includes(searchQuery.toLowerCase())) ||
                log.event_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.entity_affected.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (eventFilter !== 'all') {
            filtered = filtered.filter(log => log.event_type === eventFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(log => {
                if (statusFilter === 'success') return log.is_successful;
                return !log.is_successful;
            });
        }

        // Apply date filter if needed
        if (dateFilter !== 'all' && filtered.length > 0) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(log => {
                const logDate = new Date(log.timestamp || '');

                if (dateFilter === 'today') {
                    return logDate >= today;
                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return logDate >= weekAgo;
                } else if (dateFilter === 'month') {
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return logDate >= monthAgo;
                }
                return true;
            });
        }

        setFilteredLogs(filtered);
    }, [searchQuery, eventFilter, statusFilter, dateFilter, auditLogs]);

    const fetchAuditLogs = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await logsService.getAuditLogs();
            setAuditLogs(response.results || []);
            setFilteredLogs(response.results || []);
        } catch (err) {
            setError('Failed to fetch audit logs. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getUsernameDisplay = (log: AuditLog) => {
        if (log.username && log.username !== 'undefined undefined') {
            return log.username;
        }

        if (log.response_body && typeof log.response_body === 'object' && log.response_body.users) {
            for (const user of log.response_body.users) {
                if (user.id === log.user_id) {
                    return `${user.first_name} ${user.last_name}`;
                }
            }
        }

        return 'Unknown user';
    };

    const getUserEmailDisplay = (log: AuditLog) => {
        if (log.user_email) {
            return log.user_email;
        }

        if (log.response_body && typeof log.response_body === 'object' && log.response_body.users) {
            for (const user of log.response_body.users) {
                if (user.id === log.user_id) {
                    return user.email;
                }
            }
        }

        return '';
    };

    const handleViewDetails = (logId: string) => {
        navigate(`/admin/audit-logs/${logId}`);
    };

    const handleRefresh = () => {
        fetchAuditLogs();
    };

    const handleExport = () => {
        alert('Export functionality would be implemented here');
    };

    const eventTypes = ['all', ...new Set(auditLogs.map(log => log.event_type))];

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const getEventTypeBadge = (eventType: string) => {
        if (eventType.includes('create')) {
            return <Badge variant="success" size="sm" className="bg-success-50 text-success-700 border border-success-200">{eventType}</Badge>;
        } else if (eventType.includes('update')) {
            return <Badge variant="primary" size="sm" className="bg-primary-50 text-primary-700 border border-primary-200">{eventType}</Badge>;
        } else if (eventType.includes('delete')) {
            return <Badge variant="danger" size="sm" className="bg-danger-50 text-danger-700 border border-danger-200">{eventType}</Badge>;
        } else if (eventType.includes('login')) {
            return <Badge variant="info" size="sm" className="bg-secondary-50 text-secondary-700 border border-secondary-200">{eventType}</Badge>;
        } else if (eventType.includes('fetch')) {
            return <Badge variant="default" size="sm" className="bg-neutral-100 text-neutral-700 border border-neutral-200">{eventType}</Badge>;
        } else {
            return <Badge variant="default" size="sm" className="bg-neutral-100 text-neutral-700 border border-neutral-200">{eventType}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-transparent">
            <div className="w-full mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="inline-block px-3 py-1 bg-primary-50 border border-primary-100 rounded-lg text-primary-600 text-xs font-medium mb-2">
                            System Security
                        </div>
                        <h1 className="text-2xl font-semibold text-neutral-900 flex items-center">
                            <FileCheck size={24} className="text-primary-600 mr-2" />
                            Audit Log Registry
                        </h1>
                        <p className="text-neutral-500 text-sm mt-1">Track and monitor all system activities and security events</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            leftIcon={<RefreshCw size={16} />}
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="border-neutral-200 bg-white hover:bg-neutral-50"
                        >
                            Refresh Data
                        </Button>
                        <Button
                            leftIcon={<Download size={16} />}
                            onClick={handleExport}
                            disabled={isLoading || filteredLogs.length === 0}
                            className="bg-primary-600 hover:bg-primary-700 text-white shadow-button"
                        >
                            Export Report
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                        <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <Card className="mb-6 bg-white border border-neutral-200 shadow-card">
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="relative md:col-span-5">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-neutral-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by username, description, entity..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-300 transition-all duration-200 shadow-sm"
                                />
                            </div>

                            <div className="relative md:col-span-2">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Calendar size={18} className="text-neutral-400" />
                                </div>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => {
                                        setDateFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-neutral-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-300 transition-all duration-200 shadow-sm"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronDown size={16} className="text-neutral-400" />
                                </div>
                            </div>

                            <div className="relative md:col-span-3">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <FileText size={18} className="text-neutral-400" />
                                </div>
                                <select
                                    value={eventFilter}
                                    onChange={(e) => {
                                        setEventFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-neutral-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-300 transition-all duration-200 shadow-sm"
                                >
                                    <option value="all">All Event Types</option>
                                    {eventTypes.filter(type => type !== 'all').map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronDown size={16} className="text-neutral-400" />
                                </div>
                            </div>

                            <div className="relative md:col-span-2">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Shield size={18} className="text-neutral-400" />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-neutral-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-300 transition-all duration-200 shadow-sm"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="success">Success</option>
                                    <option value="failed">Failed</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronDown size={16} className="text-neutral-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden bg-white border border-neutral-200 shadow-card">
                    <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                        <h2 className="text-sm font-medium text-neutral-800 flex items-center">
                            <ClipboardList size={16} className="text-primary-600 mr-2" />
                            Audit Event Registry
                        </h2>

                        <div className="flex items-center text-xs text-neutral-500">
                            <Clock size={14} className="mr-1" />
                            <span>Last updated: {new Date().toLocaleString()}</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-8 flex flex-col items-center justify-center">
                            <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full mb-4"></div>
                            <p className="text-neutral-500">Loading audit data...</p>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="p-8 flex flex-col items-center justify-center">
                            <div className="bg-neutral-100 p-4 rounded-full mb-4">
                                <FileText size={32} className="text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 mb-1">No audit records found</h3>
                            <p className="text-neutral-500 mb-4">
                                {searchQuery || eventFilter !== 'all' || statusFilter !== 'all'
                                    ? 'Try adjusting your search criteria or filters'
                                    : 'There are no audit events recorded in the system yet'}
                            </p>
                            {(searchQuery || eventFilter !== 'all' || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setEventFilter('all');
                                        setStatusFilter('all');
                                        setDateFilter('all');
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-neutral-50 border-b border-neutral-200">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Event Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Entity</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Service</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {paginatedLogs.map((log) => (
                                            <motion.tr
                                                key={log._id}
                                                className="hover:bg-primary-50/30 transition-colors cursor-pointer"
                                                whileHover={{ backgroundColor: 'rgba(237, 246, 255, 0.3)' }}
                                                onClick={() => handleViewDetails(log._id)}
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {getEventTypeBadge(log.event_type)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center mr-2 text-neutral-500">
                                                            <User size={14} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-neutral-900">{getUsernameDisplay(log)}</div>
                                                            <div className="text-xs text-neutral-500">{getUserEmailDisplay(log)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-neutral-700 max-w-xs truncate">
                                                        {log.event_description}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="text-sm text-neutral-700">{log.entity_affected}</div>
                                                    <div className="text-xs text-neutral-500 font-mono truncate max-w-[150px]">{log.entity_id}</div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                                                        {log.service_name}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                                    <button
                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewDetails(log._id);
                                                        }}
                                                    >
                                                        <ExternalLink size={12} className="mr-1" />
                                                        View Details
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="px-6 py-4 flex items-center justify-between border-t border-neutral-200 bg-neutral-50/70">
                                    <div>
                                        <p className="text-sm text-neutral-600">
                                            Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min(page * itemsPerPage, filteredLogs.length)}
                                            </span>{' '}
                                            of <span className="font-medium">{filteredLogs.length}</span> records
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            disabled={page === 1}
                                            className={`p-2 rounded-lg border ${page === 1 ? 'border-neutral-200 text-neutral-300 cursor-not-allowed' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                                        >
                                            <ChevronLeft size={16} />
                                            <span className="sr-only">First</span>
                                        </button>

                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className={`p-2 rounded-lg border ${page === 1 ? 'border-neutral-200 text-neutral-300 cursor-not-allowed' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                                        >
                                            <ChevronLeft size={16} />
                                            <span className="sr-only">Previous</span>
                                        </button>

                                        <div className="flex items-center">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else {
                                                    const middlePage = Math.min(Math.max(page, 3), totalPages - 2);
                                                    pageNum = middlePage - 2 + i;
                                                    if (pageNum < 1) pageNum = 1;
                                                    if (pageNum > totalPages) pageNum = totalPages;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium 
                                                            ${pageNum === page
                                                                ? 'bg-primary-600 text-white border border-primary-600'
                                                                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                            className={`p-2 rounded-lg border ${page === totalPages ? 'border-neutral-200 text-neutral-300 cursor-not-allowed' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                                        >
                                            <ChevronRight size={16} />
                                            <span className="sr-only">Next</span>
                                        </button>

                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={page === totalPages}
                                            className={`p-2 rounded-lg border ${page === totalPages ? 'border-neutral-200 text-neutral-300 cursor-not-allowed' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                                        >
                                            <ChevronRight size={16} />
                                            <span className="sr-only">Last</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </Card>

                <div className="mt-4 text-xs text-neutral-500 flex items-center justify-between">
                    <div className="flex items-center">
                        <Info size={14} className="mr-1" />
                        <span>This log contains confidential system information intended for administrative use only</span>
                    </div>
                    <div className="flex items-center">
                        <Shield size={14} className="mr-1 text-primary-600" />
                        <span>Security and Compliance Registry</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogsPage;