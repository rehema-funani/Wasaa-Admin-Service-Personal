import React, { useState, useEffect } from 'react';
import {
    Search,
    User,
    ChevronRight,
    CheckCircle,
    XCircle,
    FileText,
    RefreshCw,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Modal } from '../../../components/common/Modal';
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
}

const JsonViewer: React.FC<{ data: any }> = ({ data }) => {
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0) || data === '') {
        return <div className="text-gray-500 italic">Empty</div>;
    }

    let jsonData = data;
    if (typeof data === 'string' && data.trim() !== '') {
        try {
            jsonData = JSON.parse(data);
        } catch (e) {
            return <div className="text-sm text-gray-900">{data}</div>;
        }
    }

    return (
        <pre className="bg-gray-800/10 backdrop-blur-sm p-3 rounded-lg text-xs text-gray-900 overflow-auto max-h-60">
            {JSON.stringify(jsonData, null, 2)}
        </pre>
    );
};

const page: React.FC = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [eventFilter, setEventFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);

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

        setFilteredLogs(filtered);
    }, [searchQuery, eventFilter, statusFilter, auditLogs]);

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

    const handleViewDetails = (log: AuditLog) => {
        setSelectedLog(log);
        setShowDetailModal(true);
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

    const getStatusBadge = (isSuccessful: boolean) => {
        return isSuccessful
            ? <Badge variant="success" size="sm" className="flex items-center gap-1">
                <CheckCircle size={12} />
                Success
            </Badge>
            : <Badge variant="danger" size="sm" className="flex items-center gap-1">
                <XCircle size={12} />
                Failed
            </Badge>;
    };

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            leftIcon={<RefreshCw size={16} />}
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="border-gray-200/80 bg-white/70 backdrop-blur-sm hover:bg-gray-50/90"
                        >
                            Refresh
                        </Button>
                        <Button
                            leftIcon={<Download size={16} />}
                            onClick={handleExport}
                            disabled={isLoading || filteredLogs.length === 0}
                            className="bg-blue-500/90 hover:bg-blue-600/90 text-white"
                        >
                            Export
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <Card className="mb-6 bg-white/60 backdrop-blur-md border border-white/30">
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by username, description..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <FileText size={18} className="text-gray-400" />
                                </div>
                                <select
                                    value={eventFilter}
                                    onChange={(e) => {
                                        setEventFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full pl-10 pr-10 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="all">All Event Types</option>
                                    {eventTypes.filter(type => type !== 'all').map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <CheckCircle size={18} className="text-gray-400" />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full pl-10 pr-10 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="success">Success</option>
                                    <option value="failed">Failed</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden bg-white/60 backdrop-blur-md border border-white/30">
                    {isLoading ? (
                        <div className="p-8 flex flex-col items-center justify-center">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                            <p className="text-gray-500">Loading audit logs...</p>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="p-8 flex flex-col items-center justify-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <FileText size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No audit logs found</h3>
                            <p className="text-gray-500 mb-4">
                                {searchQuery || eventFilter !== 'all' || statusFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'There are no audit logs recorded yet'}
                            </p>
                            {(searchQuery || eventFilter !== 'all' || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setEventFilter('all');
                                        setStatusFilter('all');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedLogs.map((log) => (
                                            <motion.tr
                                                key={log._id}
                                                className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                                                whileHover={{ backgroundColor: 'rgba(239, 246, 255, 0.6)' }}
                                                onClick={() => handleViewDetails(log)}
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <Badge
                                                        variant={
                                                            log.event_type.includes('create') ? 'success' :
                                                                log.event_type.includes('update') ? 'primary' :
                                                                    log.event_type.includes('delete') ? 'danger' :
                                                                        log.event_type.includes('login') ? 'info' :
                                                                            log.event_type.includes('fetch') ? 'default' :
                                                                                'default'
                                                        }
                                                        size="sm"
                                                    >
                                                        {log.event_type}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <User size={16} className="text-gray-400 mr-2" />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{getUsernameDisplay(log)}</div>
                                                            <div className="text-xs text-gray-500">{getUserEmailDisplay(log)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {log.event_description}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{log.entity_affected}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{log.entity_id}</div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {getStatusBadge(log.is_successful)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {log.service_name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        rightIcon={<ChevronRight size={14} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewDetails(log);
                                                        }}
                                                    >
                                                        Details
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                                                <span className="font-medium">
                                                    {Math.min(page * itemsPerPage, filteredLogs.length)}
                                                </span>{' '}
                                                of <span className="font-medium">{filteredLogs.length}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(page - 1)}
                                                    disabled={page === 1}
                                                    className="mr-2"
                                                >
                                                    Previous
                                                </Button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${pageNum === page
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                                            } border border-gray-200 mx-1 rounded-md`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(page + 1)}
                                                    disabled={page === totalPages}
                                                    className="ml-2"
                                                >
                                                    Next
                                                </Button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </Card>

                <Modal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title="Audit Log Details"
                    size="lg"
                >
                    {selectedLog && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Event Information</h3>
                                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/80">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-xs text-gray-500">Event Type</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.event_type}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Status</div>
                                                    <div>{getStatusBadge(selectedLog.is_successful)}</div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-xs text-gray-500">Description</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.event_description}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Entity</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.entity_affected}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Entity ID</div>
                                                    <div className="text-sm font-medium text-gray-900 truncate">{selectedLog.entity_id || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Execution Time</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.execution_time}ms</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">HTTP Method</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.http_method}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">User Information</h3>
                                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/80">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-xs text-gray-500">Username</div>
                                                    <div className="text-sm font-medium text-gray-900">{getUsernameDisplay(selectedLog)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Email</div>
                                                    <div className="text-sm font-medium text-gray-900">{getUserEmailDisplay(selectedLog)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">User ID</div>
                                                    <div className="text-sm font-medium text-gray-900 truncate">{selectedLog.user_id}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">IP Address</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.ip_address.replace('::ffff:', '')}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Role</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.roles}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Permissions</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.permissions}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Authentication Method</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.auth_method}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Device Information</h3>
                                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/80">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-xs text-gray-500">Device Type</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.device_type || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Device Model</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.device_model || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Operating System</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.os || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Browser</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.browser || 'N/A'}</div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-xs text-gray-500">User Agent</div>
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-full">
                                                        {selectedLog.user_agent || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Request Information</h3>
                                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/80">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <div className="text-xs text-gray-500">URL</div>
                                                    <div className="text-sm font-medium text-gray-900 break-words">{selectedLog.request_url}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Query Parameters</div>
                                                    <div className="text-sm font-medium text-gray-900 break-words">{selectedLog.query_params || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Service</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.service_name}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Status Code</div>
                                                    <div className="text-sm font-medium text-gray-900">{selectedLog.status_code}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Request Body</h3>
                                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/80">
                                        <JsonViewer data={selectedLog.request_body} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Response Body</h3>
                                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/80">
                                        <JsonViewer data={selectedLog.response_body} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDetailModal(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </>
    );
};

export default page;