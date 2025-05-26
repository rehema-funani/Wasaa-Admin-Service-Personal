import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Filter,
  Calendar,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Users,
  Flag,
  Clock,
  FileText,
  UserX,
  Bell,
  Lock,
  UsersIcon,
  Globe,
  UserPlus,
  AlertCircle,
  User,
  X
} from 'lucide-react';
import StatusBadge from '../../../../components/common/StatusBadge';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';
import groupService from '../../../../api/services/groups';

interface ReportedGroup {
  id: string;
  reportedGroup: {
    id: string;
    name: string;
    memberCount: number;
    privacy: 'public' | 'private';
    createdDate: string;
    previousViolations: number;
    adminCount: number;
    primaryAdmin: {
      id: string;
      name: string;
      username: string;
    }
  };
  reportedBy: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  reportType: string;
  reportReason: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  resolution?: string;
  dateReported: string;
  lastUpdated: string;
  notes?: string;
  evidence?: any[];
  additionalReports: number;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const ReportedGroupsPage = () => {
  // States for the page
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reportedGroups, setReportedGroups] = useState<ReportedGroup[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportedGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'inappropriate content', 'pending', 'high priority'
  ]);
  const [selectedReport, setSelectedReport] = useState<ReportedGroup | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportedGroups = async () => {
      try {
        setIsLoading(true);
        const response = await groupService.getReportedGroups();
        const reportedGroupsData = response?.data?.reportedGroups || [];

        setReportedGroups(reportedGroupsData);
        setFilteredReports(reportedGroupsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching reported groups:', err);
        setError('Failed to load reported groups. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedGroups();
  }, []);

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'misinformation':
        return 'bg-purple-100 text-purple-700';
      case 'harassment':
        return 'bg-red-100 text-red-700';
      case 'copyright_violation':
        return 'bg-primary-100 text-primary-700';
      case 'harmful_content':
        return 'bg-red-100 text-red-700';
      case 'scam':
        return 'bg-orange-100 text-orange-700';
      case 'inappropriate_content':
        return 'bg-yellow-100 text-yellow-700';
      case 'unauthorized_promotion':
        return 'bg-primary-100 text-primary-700';
      case 'hate_speech':
        return 'bg-red-100 text-red-700';
      case 'privacy_violation':
        return 'bg-teal-100 text-teal-700';
      case 'spam':
        return 'bg-primary-100 text-primary-700';
      case 'impersonation':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Format the report type for display
  const formatReportType = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get the appropriate color for priority levels
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-primary-100 text-primary-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get the appropriate icon for resolution types
  const getResolutionIcon = (resolution: string | undefined) => {
    if (!resolution) return null;

    switch (resolution) {
      case 'content_removed':
        return <XCircle size={14} className="text-orange-500 mr-1" strokeWidth={1.8} />;
      case 'group_warned':
        return <AlertTriangle size={14} className="text-yellow-500 mr-1" strokeWidth={1.8} />;
      case 'group_banned':
        return <Ban size={14} className="text-red-700 mr-1" strokeWidth={1.8} />;
      case 'admins_removed':
        return <UserX size={14} className="text-red-500 mr-1" strokeWidth={1.8} />;
      case 'content_filtered':
        return <Filter size={14} className="text-primary-500 mr-1" strokeWidth={1.8} />;
      case 'no_action':
        return <CheckCircle size={14} className="text-gray-500 mr-1" strokeWidth={1.8} />;
      default:
        return null;
    }
  };

  const reportStats = React.useMemo(() => {
    const pendingReports = reportedGroups.filter(report => report.status === 'pending').length;
    const highPriorityReports = reportedGroups.filter(report => report.priority === 'high').length;
    const largeGroups = reportedGroups.filter(report => report.reportedGroup.memberCount >= 2500).length;
    const resolvedReports = reportedGroups.filter(report => report.status === 'resolved').length;

    return [
      {
        title: 'Pending Review',
        value: pendingReports.toString(),
        change: `${pendingReports > 0 ? 'Needs attention' : 'All clear'}`,
        icon: <Clock size={20} className="text-yellow-500" strokeWidth={1.8} />,
        color: 'yellow'
      },
      {
        title: 'High Priority',
        value: highPriorityReports.toString(),
        change: `${Math.round((highPriorityReports / (reportedGroups.length || 1)) * 100)}% of total`,
        icon: <AlertTriangle size={20} className="text-red-500" strokeWidth={1.8} />,
        color: 'red'
      },
      {
        title: 'Large Groups',
        value: largeGroups.toString(),
        change: '2,500+ members',
        icon: <Users size={20} className="text-primary-500" strokeWidth={1.8} />,
        color: 'primary'
      },
      {
        title: 'Resolved',
        value: resolvedReports.toString(),
        change: `${Math.round((resolvedReports / (reportedGroups.length || 1)) * 100)}% action rate`,
        icon: <CheckCircle size={20} className="text-green-500" strokeWidth={1.8} />,
        color: 'green'
      }
    ];
  }, [reportedGroups]);

  const columns = [
    {
      id: 'reportId',
      header: 'Report ID',
      accessor: (row: ReportedGroup) => row.id,
      sortable: true,
      width: '120px',
      cell: (value: string) => (
        <span className="font-medium text-gray-800">{value}</span>
      )
    },
    {
      id: 'reportedGroup',
      header: 'Reported Group',
      accessor: (row: ReportedGroup) => row.reportedGroup.name,
      sortable: true,
      cell: (value: string, row: ReportedGroup) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-3">
              <Users size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-medium text-gray-800">{value}</p>
              <div className="flex items-center text-xs">
                <div className="flex items-center text-gray-500 mr-2">
                  <UsersIcon size={12} className="mr-1" strokeWidth={1.8} />
                  {row.reportedGroup.memberCount.toLocaleString()}
                </div>
                {row.reportedGroup.privacy === 'public' ? (
                  <div className="flex items-center text-gray-500">
                    <Globe size={12} className="mr-1" strokeWidth={1.8} />
                    Public
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <Lock size={12} className="mr-1" strokeWidth={1.8} />
                    Private
                  </div>
                )}
                {row.reportedGroup.previousViolations > 0 && (
                  <span className="ml-2 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-md">
                    {row.reportedGroup.previousViolations} prev. violations
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center mt-1 ml-11 text-xs text-gray-500">
            <UserPlus size={12} className="mr-1" strokeWidth={1.8} />
            <span>Created {row.reportedGroup.createdDate}</span>
            <span className="mx-1">•</span>
            <span>{row.reportedGroup.adminCount} admins</span>
          </div>
        </div>
      )
    },
    {
      id: 'reportDetails',
      header: 'Report Details',
      accessor: (row: ReportedGroup) => row.reportType,
      sortable: true,
      cell: (value: string, row: ReportedGroup) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-md ${getReportTypeColor(value)}`}>
              {formatReportType(value)}
            </span>
            <span className={`ml-2 text-xs px-2 py-1 rounded-md ${getPriorityColor(row.priority)}`}>
              {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)} Priority
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{row.reportReason}</p>
          {row.additionalReports > 0 && (
            <div className="mt-1 text-xs text-amber-600 flex items-center">
              <Flag size={12} className="mr-1" strokeWidth={1.8} />
              {row.additionalReports} additional reports
            </div>
          )}
        </div>
      )
    },
    {
      id: 'admin',
      header: 'Primary Admin',
      accessor: (row: ReportedGroup) => row.reportedGroup.primaryAdmin.name,
      sortable: true,
      width: '150px',
      cell: (value: string, row: ReportedGroup) => (
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-medium text-xs mr-2">
            {value.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.reportedGroup.primaryAdmin.username}</p>
          </div>
        </div>
      )
    },
    {
      id: 'evidence',
      header: 'Evidence',
      accessor: (row: ReportedGroup) => row.evidence?.length || 0,
      sortable: true,
      width: '100px',
      cell: (value: number, row: ReportedGroup) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <FileText size={14} className="text-gray-500 mr-1.5" strokeWidth={1.8} />
            <span className="font-medium">{value} items</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {row.additionalReports > 0 ? (
              <div className="flex items-center text-amber-600">
                <Flag size={12} className="mr-1" strokeWidth={1.8} />
                {row.additionalReports} additional reports
              </div>
            ) : (
              <span className="text-gray-400">No other reports</span>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: ReportedGroup) => row.status,
      sortable: true,
      width: '150px',
      cell: (value: string, row: ReportedGroup) => {
        const statusConfig: Record<string, any> = {
          'pending': { color: 'yellow', icon: true, label: 'Pending' },
          'under_review': { color: 'primary', icon: true, label: 'Under Review' },
          'resolved': { color: 'green', icon: true, label: 'Resolved' },
          'dismissed': { color: 'gray', icon: false, label: 'Dismissed' }
        };

        return (
          <div className="flex flex-col">
            <StatusBadge
              status={value as any}
              size="sm"
              withIcon
              withDot={value === 'under_review'}
              className={`bg-${statusConfig[value]?.color}-100 text-${statusConfig[value]?.color}-700`}
            />
            {row.resolution && (
              <div className="flex items-center mt-2 text-xs text-gray-700">
                {getResolutionIcon(row.resolution)}
                <span>{row.resolution.split('_').map((word: string) =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'dates',
      header: 'Date Reported',
      accessor: (row: ReportedGroup) => row.dateReported,
      sortable: true,
      width: '150px',
      cell: (value: string, row: ReportedGroup) => {
        // Format dates appropriately based on API response
        let formattedDate = value;
        let formattedTime = '';
        let formattedLastUpdated = row.lastUpdated;

        try {
          // If date is ISO format, convert it
          if (value.includes('T')) {
            const date = new Date(value);
            formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            formattedTime = date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            });
          } else if (value.includes(' ')) {
            // If date is in format "Apr 26, 2025 14:32"
            const parts = value.split(' ');
            formattedDate = parts.slice(0, 3).join(' ');
            formattedTime = parts[3];
          }

          // Format last updated date
          if (row.lastUpdated.includes('T')) {
            const date = new Date(row.lastUpdated);
            formattedLastUpdated = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          } else if (row.lastUpdated.includes(' ')) {
            formattedLastUpdated = row.lastUpdated.split(' ')[0];
          }
        } catch (error) {
          console.error('Error formatting date:', error);
        }

        return (
          <div className="flex flex-col text-sm">
            <div className="flex items-center">
              <Calendar size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
              <span>{formattedDate}</span>
            </div>
            {formattedTime && (
              <div className="flex items-center mt-1">
                <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
                <span className="text-gray-500">{formattedTime}</span>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              Last updated: {formattedLastUpdated}
            </div>
          </div>
        );
      }
    },
    {
      id: 'assignedTo',
      header: 'Assigned To',
      accessor: (row: ReportedGroup) => row.assignedTo?.name || 'Unassigned',
      sortable: true,
      width: '140px',
      cell: (value: string, row: ReportedGroup) => (
        row.assignedTo ? (
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white flex items-center justify-center font-medium text-xs mr-2">
              {row.assignedTo.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <span className="text-sm">{row.assignedTo.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 flex items-center">
            <User size={14} className="mr-1.5" strokeWidth={1.8} />
            Unassigned
          </span>
        )
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: ReportedGroup) => row.id,
      sortable: false,
      width: '150px',
      cell: (row: ReportedGroup) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View report details"
            onClick={() => handleViewReport(row)}
            disabled={actionInProgress === row.id}
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>

          {row.status === 'pending' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-primary-100 hover:text-primary-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Review this report"
              onClick={() => handleReviewReport(row.id)}
              disabled={actionInProgress === row.id}
            >
              <Shield size={16} strokeWidth={1.8} />
            </motion.button>
          )}

          {(row.status === 'pending' || row.status === 'under_review') && (
            <>
              <motion.button
                className="p-1.5 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Take action"
                onClick={() => handleActionReport(row.id)}
                disabled={actionInProgress === row.id}
              >
                <Ban size={16} strokeWidth={1.8} />
              </motion.button>
              <motion.button
                className="p-1.5 rounded-lg text-gray-500 hover:bg-green-100 hover:text-green-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Dismiss report"
                onClick={() => handleDismissReport(row.id)}
                disabled={actionInProgress === row.id}
              >
                <CheckCircle size={16} strokeWidth={1.8} />
              </motion.button>
            </>
          )}

          {row.status === 'resolved' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-purple-100 hover:text-purple-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Reopen report"
              onClick={() => handleReopenReport(row.id)}
              disabled={actionInProgress === row.id}
            >
              <AlertCircle size={16} strokeWidth={1.8} />
            </motion.button>
          )}
        </div>
      )
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredReports(reportedGroups);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = reportedGroups.filter(report =>
      report.id.toLowerCase().includes(lowercasedQuery) ||
      report.reportedGroup.name.toLowerCase().includes(lowercasedQuery) ||
      report.reportedGroup.primaryAdmin.name.toLowerCase().includes(lowercasedQuery) ||
      report.reportedGroup.primaryAdmin.username.toLowerCase().includes(lowercasedQuery) ||
      report.reportedBy.name.toLowerCase().includes(lowercasedQuery) ||
      report.reportedBy.username.toLowerCase().includes(lowercasedQuery) ||
      report.reportType.toLowerCase().includes(lowercasedQuery) ||
      report.reportReason.toLowerCase().includes(lowercasedQuery) ||
      (report.notes && report.notes.toLowerCase().includes(lowercasedQuery))
    );

    setFilteredReports(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...reportedGroups];

    if (filters.reportType && filters.reportType.length > 0) {
      filtered = filtered.filter(report => filters.reportType.includes(report.reportType));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(report => filters.status.includes(report.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(report => filters.priority.includes(report.priority));
    }

    if (filters.resolution) {
      filtered = filtered.filter(report => report.resolution === filters.resolution);
    }

    if (filters.privacy) {
      filtered = filtered.filter(report => report.reportedGroup.privacy === filters.privacy);
    }

    if (filters.memberCount && (filters.memberCount.from !== undefined || filters.memberCount.to !== undefined)) {
      if (filters.memberCount.from !== undefined) {
        filtered = filtered.filter(report => report.reportedGroup.memberCount >= filters.memberCount.from);
      }
      if (filters.memberCount.to !== undefined) {
        filtered = filtered.filter(report => report.reportedGroup.memberCount <= filters.memberCount.to);
      }
    }

    if (filters.dateReported && (filters.dateReported.from || filters.dateReported.to)) {
      if (filters.dateReported.from) {
        const fromDate = new Date(filters.dateReported.from);
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.dateReported);
          return reportDate >= fromDate;
        });
      }

      if (filters.dateReported.to) {
        const toDate = new Date(filters.dateReported.to);
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.dateReported);
          return reportDate <= toDate;
        });
      }
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(report =>
        report.id.toLowerCase().includes(lowercasedQuery) ||
        report.reportedGroup.name.toLowerCase().includes(lowercasedQuery) ||
        report.reportedGroup.primaryAdmin.name.toLowerCase().includes(lowercasedQuery) ||
        report.reportedGroup.primaryAdmin.username.toLowerCase().includes(lowercasedQuery) ||
        report.reportedBy.name.toLowerCase().includes(lowercasedQuery) ||
        report.reportedBy.username.toLowerCase().includes(lowercasedQuery) ||
        report.reportType.toLowerCase().includes(lowercasedQuery) ||
        report.reportReason.toLowerCase().includes(lowercasedQuery) ||
        (report.notes && report.notes.toLowerCase().includes(lowercasedQuery))
      );
    }

    setFilteredReports(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Reset all filters
  const handleResetFilters = () => {
    setAppliedFilters({});
    setFilteredReports(reportedGroups);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (filteredReports.length === 0) {
      alert('No reports to export');
      return;
    }
    alert('Export functionality would go here');
  };

  // View report details
  const handleViewReport = (report: ReportedGroup) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setShowModal(false);
  };

  // Action handlers
  const handleReviewReport = async (id: string) => {
    try {
      setActionInProgress(id);
      await groupService.updateReportStatus(id, 'under_review');

      const updatedReports = reportedGroups.map(report =>
        report.id === id ? { ...report, status: 'under_review' as 'under_review' } : report
      );

      setReportedGroups(updatedReports);
      setFilteredReports(prevFiltered =>
        prevFiltered.map(report =>
          report.id === id ? { ...report, status: 'under_review' } : report
        )
      );

      alert('Report status updated to Under Review');
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Failed to update report status. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleActionReport = async (id: string) => {
    try {
      setActionInProgress(id);
      await groupService.resolveReport(id);

      const updatedReports = reportedGroups.map(report =>
        report.id === id ? { ...report, status: 'resolved' as 'resolved', resolution: 'group_warned' } : report
      );

      setReportedGroups(updatedReports);
      setFilteredReports(prevFiltered =>
        prevFiltered.map(report =>
          report.id === id ? { ...report, status: 'resolved', resolution: 'group_warned' } : report
        )
      );

      alert('Report resolved with group warning issued');
    } catch (error) {
      console.error('Error resolving report:', error);
      alert('Failed to resolve report. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDismissReport = async (id: string) => {
    try {
      setActionInProgress(id);
      await groupService.dismissReport(id);

      const updatedReports = reportedGroups.map(report =>
        report.id === id ? { ...report, status: 'dismissed' as 'dismissed' } : report
      );

      setReportedGroups(updatedReports);
      setFilteredReports(prevFiltered =>
        prevFiltered.map(report =>
          report.id === id ? { ...report, status: 'dismissed' } : report
        )
      );

      alert('Report dismissed');
    } catch (error) {
      console.error('Error dismissing report:', error);
      alert('Failed to dismiss report. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReopenReport = async (id: string) => {
    try {
      setActionInProgress(id);
      await groupService.reopenReport(id);

      const updatedReports = reportedGroups.map(report =>
        report.id === id ? { ...report, status: 'under_review' as 'under_review', resolution: undefined } : report
      );

      setReportedGroups(updatedReports);
      setFilteredReports(prevFiltered =>
        prevFiltered.map(report =>
          report.id === id ? { ...report, status: 'under_review', resolution: undefined } : report
        )
      );

      alert('Report reopened for review');
    } catch (error) {
      console.error('Error reopening report:', error);
      alert('Failed to reopen report. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Reported Groups</h1>
          <p className="text-gray-500 mt-1">Review and manage group reports</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
          >
            <Bell size={16} className="mr-2" strokeWidth={1.8} />
            Notification Settings
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {reportStats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center"
            whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className={`mr-4 p-2 bg-${stat.color}-50 rounded-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs">{stat.title}</p>
              <h3 className="text-lg font-semibold text-gray-800">{stat.value}</h3>
              <p className="text-gray-600 text-xs">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="md:col-span-2">
          <SearchBox
            placeholder="Search by group name, admin, report ID or reason..."
            onSearch={handleSearch}
            suggestions={[
              'cryptocurrency',
              'inappropriate content',
              'high priority',
              'misinformation'
            ]}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Report Filters"
            filters={[]}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            initialExpanded={false}
          />
        </div>
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {error ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg">
            <p>{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredReports}
            selectable={true}
            isLoading={isLoading}
            emptyMessage="No reports found. Try adjusting your filters or search terms."
            defaultRowsPerPage={itemsPerPage}
          />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredReports.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
          showSummary={true}
        />
      </motion.div>

      <AnimatePresence>
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">Group Report Details</h3>
                <button
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                  onClick={handleCloseModal}
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Report Information</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 text-sm">Report ID:</span>
                          <span className="font-medium text-gray-800">{selectedReport.id}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 text-sm">Type:</span>
                          <span className={`text-xs px-2 py-1 rounded-md ${getReportTypeColor(selectedReport.reportType)}`}>
                            {formatReportType(selectedReport.reportType)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 text-sm">Priority:</span>
                          <span className={`text-xs px-2 py-1 rounded-md ${getPriorityColor(selectedReport.priority)}`}>
                            {selectedReport.priority.charAt(0).toUpperCase() + selectedReport.priority.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 text-sm">Status:</span>
                          <StatusBadge
                            status={selectedReport.status as any}
                            size="sm"
                            withIcon
                            withDot={selectedReport.status === 'under_review'}
                          />
                        </div>
                        {selectedReport.resolution && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 text-sm">Resolution:</span>
                            <div className="flex items-center text-sm">
                              {getResolutionIcon(selectedReport.resolution)}
                              <span>{selectedReport.resolution.split('_').map((word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 text-sm">Date Reported:</span>
                          <span className="text-gray-800 text-sm">{selectedReport.dateReported}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm">Last Updated:</span>
                          <span className="text-gray-800 text-sm">{selectedReport.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Reported Group</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                            <Users size={16} strokeWidth={1.8} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{selectedReport.reportedGroup.name}</p>
                            <div className="flex items-center text-xs">
                              <div className="flex items-center text-gray-500 mr-2">
                                <UsersIcon size={12} className="mr-1" strokeWidth={1.8} />
                                {selectedReport.reportedGroup.memberCount.toLocaleString()}
                              </div>
                              {selectedReport.reportedGroup.privacy === 'public' ? (
                                <div className="flex items-center text-gray-500">
                                  <Globe size={12} className="mr-1" strokeWidth={1.8} />
                                  Public
                                </div>
                              ) : (
                                <div className="flex items-center text-gray-500">
                                  <Lock size={12} className="mr-1" strokeWidth={1.8} />
                                  Private
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Group ID:</span>
                            <span className="text-gray-800">{selectedReport.reportedGroup.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Created:</span>
                            <span className="text-gray-800">{selectedReport.reportedGroup.createdDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Admins:</span>
                            <span className="text-gray-800">{selectedReport.reportedGroup.adminCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Previous Violations:</span>
                            <span className={`font-medium ${selectedReport.reportedGroup.previousViolations > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                              {selectedReport.reportedGroup.previousViolations}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Primary Admin</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                            {selectedReport.reportedGroup.primaryAdmin.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{selectedReport.reportedGroup.primaryAdmin.name}</p>
                            <p className="text-xs text-gray-500">{selectedReport.reportedGroup.primaryAdmin.username}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Reported By</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                            {selectedReport.reportedBy.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{selectedReport.reportedBy.name}</p>
                            <p className="text-xs text-gray-500">{selectedReport.reportedBy.username}</p>
                          </div>
                        </div>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="text-gray-800">{selectedReport.reportedBy.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Report Reason</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{selectedReport.reportReason}</p>
                      </div>
                    </div>

                    {selectedReport.notes && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-800 whitespace-pre-line">{selectedReport.notes}</p>
                        </div>
                      </div>
                    )}

                    {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Evidence</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {selectedReport.evidence.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <div className="p-1 bg-gray-200 rounded mr-2 mt-0.5">
                                  <FileText size={14} className="text-gray-600" strokeWidth={1.8} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700 capitalize">
                                    {item.type} {item.id ? `#${item.id}` : ''}
                                  </p>
                                  {item.timestamp && (
                                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {selectedReport.additionalReports > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Additional Reports</h4>
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                          <div className="flex items-center">
                            <Flag size={16} className="text-amber-500 mr-2" strokeWidth={1.8} />
                            <span className="text-amber-700">This group has been reported {selectedReport.additionalReports} additional time{selectedReport.additionalReports !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                      <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-2">
                        {selectedReport.status === 'pending' && (
                          <button
                            className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg text-sm"
                            onClick={() => {
                              handleReviewReport(selectedReport.id);
                              handleCloseModal();
                            }}
                          >
                            <Shield size={16} className="mr-2" strokeWidth={1.8} />
                            Start Review
                          </button>
                        )}

                        {(selectedReport.status === 'pending' || selectedReport.status === 'under_review') && (
                          <>
                            <button
                              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                              onClick={() => {
                                handleActionReport(selectedReport.id);
                                handleCloseModal();
                              }}
                            >
                              <Ban size={16} className="mr-2" strokeWidth={1.8} />
                              Take Action
                            </button>
                            <button
                              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
                              onClick={() => {
                                handleDismissReport(selectedReport.id);
                                handleCloseModal();
                              }}
                            >
                              <CheckCircle size={16} className="mr-2" strokeWidth={1.8} />
                              Dismiss Report
                            </button>
                          </>
                        )}

                        {selectedReport.status === 'resolved' && (
                          <button
                            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm"
                            onClick={() => {
                              handleReopenReport(selectedReport.id);
                              handleCloseModal();
                            }}
                          >
                            <AlertCircle size={16} className="mr-2" strokeWidth={1.8} />
                            Reopen Report
                          </button>
                        )}

                        <button
                          className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm ml-auto"
                          onClick={handleCloseModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportedGroupsPage;