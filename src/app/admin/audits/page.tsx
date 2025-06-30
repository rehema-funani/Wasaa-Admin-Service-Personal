import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  ChevronRight,
  RefreshCw,
  Download,
  ClipboardList,
  Shield,
  Info,
  Clock,
  AlertCircle,
  FileCheck,
  ChevronLeft,
  ChevronDown,
  ExternalLink,
  List
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
  createdAt: string;
  timestamp?: string;
}

interface AuditLogsResponse {
  results: AuditLog[];
  stats: {
    totalAudits: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

const AuditLogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Audit log data state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam) : 1;
  });

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const limitParam = searchParams.get('pageSize');
    return limitParam ? parseInt(limitParam) : 10;
  });

  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAuditLogs();
  }, [page, itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set('page', page.toString());
    if (itemsPerPage !== 10) params.set('pageSize', itemsPerPage.toString());

    setSearchParams(params);
  }, [page, itemsPerPage, setSearchParams]);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, any> = {
        page: page,
        pageSize: itemsPerPage
      };

      const response = await logsService.getAuditLogs(params);

      setAuditLogs(response.results || []);
      setTotalLogs(response.stats.totalAudits || 0);
      setTotalPages(response.stats.totalPages || 0);
    } catch (err) {
      setError('Failed to fetch audit logs. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setPage(1);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    fetchAuditLogs();
  };

  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  const handleViewDetails = (logId: string) => {
    navigate(`/admin/audit-logs/${logId}`);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
              disabled={isLoading || auditLogs.length === 0}
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

        <Card className="overflow-hidden bg-white border border-neutral-200 shadow-card">
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200">
            <h2 className="text-sm font-medium text-neutral-800 flex items-center">
              <ClipboardList size={16} className="text-primary-600 mr-2" />
              Audit Event Registry
            </h2>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-neutral-600 mr-2">Rows per page:</span>
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="pl-3 pr-8 py-1.5 bg-white border border-neutral-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-300 text-sm"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={14} className="text-neutral-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs text-neutral-500">
                <Clock size={14} className="mr-1" />
                <span>Last updated: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full mb-4"></div>
              <p className="text-neutral-500">Loading audit data...</p>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="bg-neutral-100 p-4 rounded-full mb-4">
                <List size={32} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-1">No audit records found</h3>
              <p className="text-neutral-500 mb-4">
                There are no audit events recorded in the system yet
              </p>
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {auditLogs.map((log) => (
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
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-neutral-500">
                            {formatDate(log.createdAt)}
                          </div>
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
                        {Math.min(page * itemsPerPage, totalLogs)}
                      </span>{' '}
                      of <span className="font-medium">{totalLogs}</span> records
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
                      {(() => {
                        const pageButtons = [];
                        let startPage = Math.max(1, page - 2);
                        let endPage = Math.min(totalPages, startPage + 4);

                        if (endPage - startPage < 4) {
                          startPage = Math.max(1, endPage - 4);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pageButtons.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium
                                ${i === page
                                  ? 'bg-primary-600 text-white border border-primary-600'
                                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                                }`}
                            >
                              {i}
                            </button>
                          );
                        }
                        return pageButtons;
                      })()}
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
