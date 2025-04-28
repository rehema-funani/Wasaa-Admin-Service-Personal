import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  User,
  Flag,
  MessageSquare,
  Clock,
  FileText,
  UserX,
  ThumbsDown,
  AlertCircle,
  UserCheck,
  Bell
} from 'lucide-react';
import StatusBadge from '../../../../components/common/StatusBadge';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

const page = () => {
  // States for the page
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'harassment', 'pending', 'high priority'
  ]);

  // Report data
  const reportedUsersData = [
    {
      id: 'REP-U1001',
      reportedUser: {
        id: '12',
        name: 'Lucas Wright',
        username: '@lucasw',
        email: 'lucas.wright@example.com',
        joinDate: 'Jan 2, 2024',
        profileImage: 'https://example.com/avatars/lucas.jpg',
        previousViolations: 2
      },
      reportedBy: {
        id: '3',
        name: 'Olivia Davis',
        username: '@oliviad',
        email: 'olivia.davis@example.com'
      },
      reportType: 'harassment',
      reportReason: 'Sending threatening messages and comments',
      priority: 'high',
      status: 'pending',
      dateReported: 'Apr 26, 2025 14:32',
      lastUpdated: 'Apr 26, 2025 15:10',
      notes: 'User has received previous warnings for similar behavior',
      evidence: [
        { type: 'message', id: 'MSG-45621', timestamp: 'Apr 25, 2025 18:45' },
        { type: 'message', id: 'MSG-45782', timestamp: 'Apr 26, 2025 09:20' }
      ],
      additionalReports: 3,
      assignedTo: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      }
    },
    {
      id: 'REP-U1002',
      reportedUser: {
        id: '6',
        name: 'James Taylor',
        username: '@jamest',
        email: 'james.taylor@example.com',
        joinDate: 'Feb 3, 2023',
        profileImage: 'https://example.com/avatars/james.jpg',
        previousViolations: 1
      },
      reportedBy: {
        id: '8',
        name: 'Ethan Miller',
        username: '@ethanm',
        email: 'ethan.miller@example.com'
      },
      reportType: 'impersonation',
      reportReason: 'User pretending to be a staff member',
      priority: 'medium',
      status: 'under_review',
      dateReported: 'Apr 25, 2025 11:45',
      lastUpdated: 'Apr 26, 2025 10:15',
      notes: 'Account created recently, possible secondary account',
      evidence: [
        { type: 'message', id: 'MSG-45526', timestamp: 'Apr 25, 2025 10:30' },
        { type: 'screenshot', id: 'SCR-78952', timestamp: 'Apr 25, 2025 11:20' }
      ],
      additionalReports: 2,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    },
    {
      id: 'REP-U1003',
      reportedUser: {
        id: '9',
        name: 'Sophia Garcia',
        username: '@sophiag',
        email: 'sophia.garcia@example.com',
        joinDate: 'Dec 7, 2023',
        profileImage: 'https://example.com/avatars/sophia.jpg',
        previousViolations: 0
      },
      reportedBy: {
        id: '15',
        name: 'Mia Hernandez',
        username: '@miah',
        email: 'mia.hernandez@example.com'
      },
      reportType: 'inappropriate_content',
      reportReason: 'Profile contains inappropriate imagery',
      priority: 'medium',
      status: 'resolved',
      resolution: 'warning_issued',
      dateReported: 'Apr 24, 2025 09:20',
      lastUpdated: 'Apr 25, 2025 16:40',
      notes: 'User was issued a warning and removed the content',
      evidence: [
        { type: 'screenshot', id: 'SCR-78932', timestamp: 'Apr 24, 2025 09:10' }
      ],
      additionalReports: 0,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    },
    {
      id: 'REP-U1004',
      reportedUser: {
        id: '14',
        name: 'Benjamin Young',
        username: '@benjaminy',
        email: 'benjamin.young@example.com',
        joinDate: 'Oct 11, 2023',
        profileImage: 'https://example.com/avatars/benjamin.jpg',
        previousViolations: 5
      },
      reportedBy: {
        id: '2',
        name: 'Liam Wilson',
        username: '@liamw',
        email: 'liam.wilson@example.com'
      },
      reportType: 'spam',
      reportReason: 'Sending unsolicited commercial messages to multiple users',
      priority: 'high',
      status: 'resolved',
      resolution: 'account_suspended',
      dateReported: 'Apr 23, 2025 16:15',
      lastUpdated: 'Apr 24, 2025 11:30',
      notes: 'Multiple previous violations, account suspended for 30 days',
      evidence: [
        { type: 'message', id: 'MSG-45102', timestamp: 'Apr 23, 2025 14:20' },
        { type: 'message', id: 'MSG-45120', timestamp: 'Apr 23, 2025 15:05' },
        { type: 'message', id: 'MSG-45136', timestamp: 'Apr 23, 2025 15:45' }
      ],
      additionalReports: 8,
      assignedTo: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      }
    },
    {
      id: 'REP-U1005',
      reportedUser: {
        id: '4',
        name: 'Noah Martinez',
        username: '@noahm',
        email: 'noah.martinez@example.com',
        joinDate: 'Apr 1, 2024',
        profileImage: 'https://example.com/avatars/noah.jpg',
        previousViolations: 0
      },
      reportedBy: {
        id: '7',
        name: 'Isabella Brown',
        username: '@isabella',
        email: 'isabella.brown@example.com'
      },
      reportType: 'harmful_misinformation',
      reportReason: 'Spreading false health information',
      priority: 'high',
      status: 'pending',
      dateReported: 'Apr 26, 2025 12:50',
      lastUpdated: 'Apr 26, 2025 12:50',
      notes: 'First-time report, needs urgent review due to potential harm',
      evidence: [
        { type: 'post', id: 'POST-67821', timestamp: 'Apr 26, 2025 11:30' },
        { type: 'comment', id: 'COM-89432', timestamp: 'Apr 26, 2025 12:15' }
      ],
      additionalReports: 5,
      assignedTo: null
    },
    {
      id: 'REP-U1006',
      reportedUser: {
        id: '11',
        name: 'Charlotte Lee',
        username: '@charlottel',
        email: 'charlotte.lee@example.com',
        joinDate: 'May 15, 2024',
        profileImage: 'https://example.com/avatars/charlotte.jpg',
        previousViolations: 0
      },
      reportedBy: {
        id: '13',
        name: 'Amelia Lopez',
        username: '@amelial',
        email: 'amelia.lopez@example.com'
      },
      reportType: 'hate_speech',
      reportReason: 'Discriminatory comments based on ethnicity',
      priority: 'high',
      status: 'under_review',
      dateReported: 'Apr 25, 2025 19:10',
      lastUpdated: 'Apr 26, 2025 13:25',
      notes: 'Multiple users have reported similar incidents',
      evidence: [
        { type: 'comment', id: 'COM-89320', timestamp: 'Apr 25, 2025 18:45' },
        { type: 'comment', id: 'COM-89342', timestamp: 'Apr 25, 2025 19:00' }
      ],
      additionalReports: 4,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    },
    {
      id: 'REP-U1007',
      reportedUser: {
        id: '2',
        name: 'Liam Wilson',
        username: '@liamw',
        email: 'liam.wilson@example.com',
        joinDate: 'Mar 22, 2024',
        profileImage: 'https://example.com/avatars/liam.jpg',
        previousViolations: 0
      },
      reportedBy: {
        id: '9',
        name: 'Sophia Garcia',
        username: '@sophiag',
        email: 'sophia.garcia@example.com'
      },
      reportType: 'scam',
      reportReason: 'Soliciting payments outside platform',
      priority: 'medium',
      status: 'resolved',
      resolution: 'warning_issued',
      dateReported: 'Apr 22, 2025 14:30',
      lastUpdated: 'Apr 23, 2025 11:15',
      notes: 'User claimed it was a misunderstanding, issued warning',
      evidence: [
        { type: 'message', id: 'MSG-44876', timestamp: 'Apr 22, 2025 13:45' }
      ],
      additionalReports: 1,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    },
    {
      id: 'REP-U1008',
      reportedUser: {
        id: '5',
        name: 'Ava Thompson',
        username: '@avat',
        email: 'ava.thompson@example.com',
        joinDate: 'Aug 17, 2023',
        profileImage: 'https://example.com/avatars/ava.jpg',
        previousViolations: 0
      },
      reportedBy: {
        id: '12',
        name: 'Lucas Wright',
        username: '@lucasw',
        email: 'lucas.wright@example.com'
      },
      reportType: 'inappropriate_content',
      reportReason: 'Sharing explicit content in messages',
      priority: 'medium',
      status: 'dismissed',
      dateReported: 'Apr 21, 2025 16:40',
      lastUpdated: 'Apr 22, 2025 09:20',
      notes: 'No evidence found after review, appears to be a false report',
      evidence: [
        { type: 'description', id: null, timestamp: 'Apr 21, 2025 16:40' }
      ],
      additionalReports: 0,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    },
    {
      id: 'REP-U1009',
      reportedUser: {
        id: '15',
        name: 'Mia Hernandez',
        username: '@miah',
        email: 'mia.hernandez@example.com',
        joinDate: 'Feb 28, 2024',
        profileImage: 'https://example.com/avatars/mia.jpg',
        previousViolations: 1
      },
      reportedBy: {
        id: '6',
        name: 'James Taylor',
        username: '@jamest',
        email: 'james.taylor@example.com'
      },
      reportType: 'copyright_violation',
      reportReason: 'Using copyrighted materials without permission',
      priority: 'medium',
      status: 'resolved',
      resolution: 'content_removed',
      dateReported: 'Apr 23, 2025 10:25',
      lastUpdated: 'Apr 24, 2025 15:30',
      notes: 'User agreed to remove content after copyright claim verified',
      evidence: [
        { type: 'post', id: 'POST-67742', timestamp: 'Apr 23, 2025 09:15' },
        { type: 'document', id: 'DOC-32451', timestamp: 'Apr 23, 2025 10:20' }
      ],
      additionalReports: 2,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    },
    {
      id: 'REP-U1010',
      reportedUser: {
        id: '7',
        name: 'Isabella Brown',
        username: '@isabella',
        email: 'isabella.brown@example.com',
        joinDate: 'Jun 12, 2023',
        profileImage: 'https://example.com/avatars/isabella.jpg',
        previousViolations: 0
      },
      reportedBy: {
        id: '4',
        name: 'Noah Martinez',
        username: '@noahm',
        email: 'noah.martinez@example.com'
      },
      reportType: 'impersonation',
      reportReason: 'Pretending to be a celebrity',
      priority: 'low',
      status: 'resolved',
      resolution: 'account_verified',
      dateReported: 'Apr 20, 2025 13:15',
      lastUpdated: 'Apr 21, 2025 14:30',
      notes: 'Verified user identity, no impersonation found',
      evidence: [
        { type: 'profile', id: 'PROF-7', timestamp: 'Apr 20, 2025 13:10' }
      ],
      additionalReports: 0,
      assignedTo: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      }
    },
    {
      id: 'REP-U1011',
      reportedUser: {
        id: '3',
        name: 'Olivia Davis',
        username: '@oliviad',
        email: 'olivia.davis@example.com',
        joinDate: 'Nov 8, 2023',
        profileImage: 'https://example.com/avatars/olivia.jpg',
        previousViolations: 0
      },
      reportedBy: {
        id: '14',
        name: 'Benjamin Young',
        username: '@benjaminy',
        email: 'benjamin.young@example.com'
      },
      reportType: 'harassment',
      reportReason: 'Targeted harassment in comments',
      priority: 'medium',
      status: 'pending',
      dateReported: 'Apr 26, 2025 10:40',
      lastUpdated: 'Apr 26, 2025 10:40',
      notes: 'Newly reported case, awaiting review',
      evidence: [
        { type: 'comment', id: 'COM-89420', timestamp: 'Apr 26, 2025 09:30' },
        { type: 'comment', id: 'COM-89425', timestamp: 'Apr 26, 2025 10:15' }
      ],
      additionalReports: 1,
      assignedTo: null
    },
    {
      id: 'REP-U1012',
      reportedUser: {
        id: '8',
        name: 'Ethan Miller',
        username: '@ethanm',
        email: 'ethan.miller@example.com',
        joinDate: 'Sep 28, 2023',
        profileImage: 'https://example.com/avatars/ethan.jpg',
        previousViolations: 3
      },
      reportedBy: {
        id: '11',
        name: 'Charlotte Lee',
        username: '@charlottel',
        email: 'charlotte.lee@example.com'
      },
      reportType: 'spam',
      reportReason: 'Excessive self-promotion across forums',
      priority: 'low',
      status: 'under_review',
      dateReported: 'Apr 24, 2025 15:20',
      lastUpdated: 'Apr 25, 2025 13:45',
      notes: 'Previous warnings for similar behavior, checking patterns',
      evidence: [
        { type: 'post', id: 'POST-67780', timestamp: 'Apr 24, 2025 13:30' },
        { type: 'post', id: 'POST-67792', timestamp: 'Apr 24, 2025 14:15' },
        { type: 'post', id: 'POST-67805', timestamp: 'Apr 24, 2025 15:00' }
      ],
      additionalReports: 2,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    }
  ];

  const filterOptions = [
    {
      id: 'reportType',
      label: 'Report Type',
      type: 'multiselect' as const,
      options: [
        { value: 'harassment', label: 'Harassment' },
        { value: 'impersonation', label: 'Impersonation' },
        { value: 'inappropriate_content', label: 'Inappropriate Content' },
        { value: 'spam', label: 'Spam' },
        { value: 'harmful_misinformation', label: 'Harmful Misinformation' },
        { value: 'hate_speech', label: 'Hate Speech' },
        { value: 'scam', label: 'Scam' },
        { value: 'copyright_violation', label: 'Copyright Violation' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'multiselect' as const,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'dismissed', label: 'Dismissed' }
      ]
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'multiselect' as const,
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]
    },
    {
      id: 'resolution',
      label: 'Resolution',
      type: 'select' as const,
      options: [
        { value: 'warning_issued', label: 'Warning Issued' },
        { value: 'content_removed', label: 'Content Removed' },
        { value: 'account_suspended', label: 'Account Suspended' },
        { value: 'account_banned', label: 'Account Banned' },
        { value: 'account_verified', label: 'Account Verified' },
        { value: 'no_action', label: 'No Action Taken' }
      ]
    },
    {
      id: 'dateReported',
      label: 'Date Reported',
      type: 'daterange' as const
    },
    {
      id: 'previousViolations',
      label: 'Previous Violations',
      type: 'range' as const,
      min: 0,
      max: 10,
      step: 1
    },
    {
      id: 'assignedTo',
      label: 'Assigned To',
      type: 'select' as const,
      options: [
        { value: '1', label: 'Emma Johnson' },
        { value: '5', label: 'Ava Thompson' },
        { value: '10', label: 'Mason Rodriguez' },
        { value: 'unassigned', label: 'Unassigned' }
      ]
    }
  ];

  // Get the appropriate color for a report type
  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'harassment':
        return 'bg-red-100 text-red-700';
      case 'impersonation':
        return 'bg-orange-100 text-orange-700';
      case 'inappropriate_content':
        return 'bg-yellow-100 text-yellow-700';
      case 'spam':
        return 'bg-blue-100 text-blue-700';
      case 'harmful_misinformation':
        return 'bg-purple-100 text-purple-700';
      case 'hate_speech':
        return 'bg-red-100 text-red-700';
      case 'scam':
        return 'bg-orange-100 text-orange-700';
      case 'copyright_violation':
        return 'bg-indigo-100 text-indigo-700';
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
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get the appropriate icon for resolution types
  const getResolutionIcon = (resolution: string | null) => {
    if (!resolution) return null;

    switch (resolution) {
      case 'warning_issued':
        return <AlertTriangle size={14} className="text-yellow-500 mr-1" strokeWidth={1.8} />;
      case 'content_removed':
        return <XCircle size={14} className="text-orange-500 mr-1" strokeWidth={1.8} />;
      case 'account_suspended':
        return <Ban size={14} className="text-red-500 mr-1" strokeWidth={1.8} />;
      case 'account_banned':
        return <UserX size={14} className="text-red-700 mr-1" strokeWidth={1.8} />;
      case 'account_verified':
        return <UserCheck size={14} className="text-green-500 mr-1" strokeWidth={1.8} />;
      case 'no_action':
        return <CheckCircle size={14} className="text-gray-500 mr-1" strokeWidth={1.8} />;
      default:
        return null;
    }
  };

  const columns = [
    {
      id: 'reportId',
      header: 'Report ID',
      accessor: (row: any) => row.id,
      sortable: true,
      width: '120px',
      cell: (value: string) => (
        <span className="font-medium text-gray-800">{value}</span>
      )
    },
    {
      id: 'reportedUser',
      header: 'Reported User',
      accessor: (row: any) => row.reportedUser.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center font-medium text-sm mr-3">
            {value.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <div className="flex items-center">
              <p className="text-xs text-gray-500">{row.reportedUser.username}</p>
              {row.reportedUser.previousViolations > 0 && (
                <span className="ml-2 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-md">
                  {row.reportedUser.previousViolations} prev. violations
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reportDetails',
      header: 'Report Details',
      accessor: (row: any) => row.reportType,
      sortable: true,
      cell: (value: string, row: any) => (
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
        </div>
      )
    },
    {
      id: 'reportedBy',
      header: 'Reported By',
      accessor: (row: any) => row.reportedBy.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-medium text-xs mr-2">
            {value.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.reportedBy.username}</p>
          </div>
        </div>
      )
    },
    {
      id: 'evidence',
      header: 'Evidence',
      accessor: (row: any) => row.evidence.length,
      sortable: true,
      width: '100px',
      cell: (value: number, row: any) => (
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
      accessor: (row: any) => row.status,
      sortable: true,
      width: '150px',
      cell: (value: string, row: any) => {
        const statusConfig: Record<string, any> = {
          'pending': { color: 'yellow', icon: true, label: 'Pending' },
          'under_review': { color: 'blue', icon: true, label: 'Under Review' },
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
      accessor: (row: any) => row.dateReported,
      sortable: true,
      width: '150px',
      cell: (value: string, row: any) => (
        <div className="flex flex-col text-sm">
          <div className="flex items-center">
            <Calendar size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span>{value.split(' ')[0]}</span>
          </div>
          <div className="flex items-center mt-1">
            <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span className="text-gray-500">{value.split(' ')[1]}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Last updated: {row.lastUpdated.split(' ')[0]}
          </div>
        </div>
      )
    },
    {
      id: 'assignedTo',
      header: 'Assigned To',
      accessor: (row: any) => row.assignedTo?.name || 'Unassigned',
      sortable: true,
      width: '140px',
      cell: (value: string, row: any) => (
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
      accessor: (row: any) => row.id,
      sortable: false,
      width: '150px',
      cell: (value: string, row: any) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View report details"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>

          {row.status === 'pending' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-100 hover:text-blue-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Review this report"
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
              >
                <Ban size={16} strokeWidth={1.8} />
              </motion.button>
              <motion.button
                className="p-1.5 rounded-lg text-gray-500 hover:bg-green-100 hover:text-green-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Dismiss report"
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
            >
              <AlertCircle size={16} strokeWidth={1.8} />
            </motion.button>
          )}
        </div>
      )
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredReports(reportedUsersData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredReports(reportedUsersData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = reportedUsersData.filter(report =>
      report.id.toLowerCase().includes(lowercasedQuery) ||
      report.reportedUser.name.toLowerCase().includes(lowercasedQuery) ||
      report.reportedUser.username.toLowerCase().includes(lowercasedQuery) ||
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

    let filtered = [...reportedUsersData];

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

    if (filters.assignedTo) {
      if (filters.assignedTo === 'unassigned') {
        filtered = filtered.filter(report => report.assignedTo === null);
      } else {
        filtered = filtered.filter(report => report.assignedTo && report.assignedTo.id === filters.assignedTo);
      }
    }

    if (filters.previousViolations && (filters.previousViolations.from !== undefined || filters.previousViolations.to !== undefined)) {
      if (filters.previousViolations.from !== undefined) {
        filtered = filtered.filter(report => report.reportedUser.previousViolations >= filters.previousViolations.from);
      }
      if (filters.previousViolations.to !== undefined) {
        filtered = filtered.filter(report => report.reportedUser.previousViolations <= filters.previousViolations.to);
      }
    }

    if (filters.dateReported && (filters.dateReported.from || filters.dateReported.to)) {
      // Simple date comparison - in a real app would use proper date objects
      if (filters.dateReported.from) {
        filtered = filtered.filter(report => {
          const month = report.dateReported.split(' ')[0].split(',')[0];
          const fromMonth = filters.dateReported.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.dateReported.to) {
        filtered = filtered.filter(report => {
          const month = report.dateReported.split(' ')[0].split(',')[0];
          const toMonth = filters.dateReported.to.split('-')[1];
          return parseInt(getMonthNumber(month)) <= parseInt(toMonth);
        });
      }
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(report =>
        report.id.toLowerCase().includes(lowercasedQuery) ||
        report.reportedUser.name.toLowerCase().includes(lowercasedQuery) ||
        report.reportedUser.username.toLowerCase().includes(lowercasedQuery) ||
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

  // Helper to get month number
  const getMonthNumber = (month: string) => {
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    return months[month] || '01';
  };

  // Reset all filters
  const handleResetFilters = () => {
    setAppliedFilters({});
    setFilteredReports(reportedUsersData);
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
    alert('Export functionality would go here');
  };

  // Report Stats
  const reportStats = [
    {
      title: 'Pending Review',
      value: '3',
      change: '+1 today',
      icon: <Clock size={20} className="text-yellow-500" strokeWidth={1.8} />,
      color: 'yellow'
    },
    {
      title: 'High Priority',
      value: '4',
      change: '+2 this week',
      icon: <AlertTriangle size={20} className="text-red-500" strokeWidth={1.8} />,
      color: 'red'
    },
    {
      title: 'Under Review',
      value: '3',
      change: '⌀ 1.2 days to resolve',
      icon: <Shield size={20} className="text-blue-500" strokeWidth={1.8} />,
      color: 'blue'
    },
    {
      title: 'Resolved',
      value: '5',
      change: '74% action rate',
      icon: <CheckCircle size={20} className="text-green-500" strokeWidth={1.8} />,
      color: 'green'
    }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Reported Users</h1>
          <p className="text-gray-500 mt-1">Review and manage user reports</p>
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
            placeholder="Search by user, report ID, reason or content..."
            onSearch={handleSearch}
            suggestions={[
              'harassment',
              'Lucas Wright',
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
        <DataTable
          columns={columns}
          data={filteredReports}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No reports found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
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
    </div>
  );
};

export default page;