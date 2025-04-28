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
  Users,
  Flag,
  MessageSquare,
  Clock,
  FileText,
  UserX,
  UserCheck,
  Bell,
  Lock,
  UsersIcon,
  Globe,
  UserPlus,
  AlertCircle,
  User
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
    'inappropriate content', 'pending', 'high priority'
  ]);

  // Report data
  const reportedGroupsData = [
    {
      id: 'REP-G1001',
      reportedGroup: {
        id: 'GRP-501',
        name: 'Cryptocurrency Enthusiasts',
        memberCount: 1243,
        privacy: 'public',
        createdDate: 'Jun 15, 2023',
        previousViolations: 1,
        adminCount: 2,
        primaryAdmin: {
          id: '5',
          name: 'Ava Thompson',
          username: '@avat'
        }
      },
      reportedBy: {
        id: '8',
        name: 'Ethan Miller',
        username: '@ethanm',
        email: 'ethan.miller@example.com'
      },
      reportType: 'misinformation',
      reportReason: 'Group spreading false investment advice and scam promotions',
      priority: 'high',
      status: 'pending',
      dateReported: 'Apr 26, 2025 11:20',
      lastUpdated: 'Apr 26, 2025 11:20',
      notes: 'Multiple members reporting similar concerns about scam promotions',
      evidence: [
        { type: 'post', id: 'POST-63421', timestamp: 'Apr 25, 2025 16:30' },
        { type: 'post', id: 'POST-63445', timestamp: 'Apr 26, 2025 09:15' },
        { type: 'screenshot', id: 'SCR-78560', timestamp: 'Apr 26, 2025 10:40' }
      ],
      additionalReports: 7,
      assignedTo: null
    },
    {
      id: 'REP-G1002',
      reportedGroup: {
        id: 'GRP-345',
        name: 'Gaming Tournaments',
        memberCount: 4562,
        privacy: 'public',
        createdDate: 'Nov 12, 2023',
        previousViolations: 0,
        adminCount: 5,
        primaryAdmin: {
          id: '10',
          name: 'Mason Rodriguez',
          username: '@masonr'
        }
      },
      reportedBy: {
        id: '2',
        name: 'Liam Wilson',
        username: '@liamw',
        email: 'liam.wilson@example.com'
      },
      reportType: 'harassment',
      reportReason: 'Group members organizing targeted harassment of female gamers',
      priority: 'high',
      status: 'under_review',
      dateReported: 'Apr 25, 2025 14:50',
      lastUpdated: 'Apr 26, 2025 13:35',
      notes: 'Reviewing chat history and coordinated behavior patterns',
      evidence: [
        { type: 'chat_log', id: 'CHAT-52341', timestamp: 'Apr 24, 2025 20:15' },
        { type: 'screenshot', id: 'SCR-78320', timestamp: 'Apr 25, 2025 13:45' }
      ],
      additionalReports: 4,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    },
    {
      id: 'REP-G1003',
      reportedGroup: {
        id: 'GRP-782',
        name: 'Photography Club',
        memberCount: 2156,
        privacy: 'public',
        createdDate: 'Aug 5, 2023',
        previousViolations: 0,
        adminCount: 3,
        primaryAdmin: {
          id: '7',
          name: 'Isabella Brown',
          username: '@isabella'
        }
      },
      reportedBy: {
        id: '12',
        name: 'Lucas Wright',
        username: '@lucasw',
        email: 'lucas.wright@example.com'
      },
      reportType: 'copyright_violation',
      reportReason: 'Group sharing copyrighted photography tutorials and paid content',
      priority: 'medium',
      status: 'resolved',
      resolution: 'content_removed',
      dateReported: 'Apr 23, 2025 09:15',
      lastUpdated: 'Apr 24, 2025 14:30',
      notes: 'Admin cooperated and removed all copyrighted materials',
      evidence: [
        { type: 'file', id: 'FILE-34562', timestamp: 'Apr 23, 2025 08:45' },
        { type: 'post', id: 'POST-61234', timestamp: 'Apr 22, 2025 19:20' }
      ],
      additionalReports: 2,
      assignedTo: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      }
    },
    {
      id: 'REP-G1004',
      reportedGroup: {
        id: 'GRP-625',
        name: 'Weight Loss Support',
        memberCount: 3245,
        privacy: 'private',
        createdDate: 'Jan 10, 2024',
        previousViolations: 2,
        adminCount: 4,
        primaryAdmin: {
          id: '3',
          name: 'Olivia Davis',
          username: '@oliviad'
        }
      },
      reportedBy: {
        id: '15',
        name: 'Mia Hernandez',
        username: '@miah',
        email: 'mia.hernandez@example.com'
      },
      reportType: 'harmful_content',
      reportReason: 'Group promoting dangerous fasting practices and unhealthy diet advice',
      priority: 'high',
      status: 'resolved',
      resolution: 'group_warned',
      dateReported: 'Apr 22, 2025 16:45',
      lastUpdated: 'Apr 24, 2025 11:20',
      notes: 'Group admins warned and provided with community guidelines. Content moderation increased.',
      evidence: [
        { type: 'post', id: 'POST-60871', timestamp: 'Apr 22, 2025 10:30' },
        { type: 'comment', id: 'COM-87452', timestamp: 'Apr 22, 2025 15:15' },
        { type: 'message', id: 'MSG-43256', timestamp: 'Apr 22, 2025 16:00' }
      ],
      additionalReports: 6,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    },
    {
      id: 'REP-G1005',
      reportedGroup: {
        id: 'GRP-903',
        name: 'Stock Market Predictions',
        memberCount: 1876,
        privacy: 'public',
        createdDate: 'Mar 5, 2024',
        previousViolations: 1,
        adminCount: 2,
        primaryAdmin: {
          id: '6',
          name: 'James Taylor',
          username: '@jamest'
        }
      },
      reportedBy: {
        id: '9',
        name: 'Sophia Garcia',
        username: '@sophiag',
        email: 'sophia.garcia@example.com'
      },
      reportType: 'scam',
      reportReason: 'Admin selling fake "guaranteed" investment packages and insider information',
      priority: 'high',
      status: 'resolved',
      resolution: 'group_banned',
      dateReported: 'Apr 20, 2025 13:20',
      lastUpdated: 'Apr 22, 2025 14:40',
      notes: 'Evidence of systematic scam operation, multiple victims identified. Group has been banned.',
      evidence: [
        { type: 'post', id: 'POST-60132', timestamp: 'Apr 19, 2025 11:30' },
        { type: 'message', id: 'MSG-42987', timestamp: 'Apr 20, 2025 09:45' },
        { type: 'payment_record', id: 'PAY-56234', timestamp: 'Apr 20, 2025 10:15' }
      ],
      additionalReports: 12,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    },
    {
      id: 'REP-G1006',
      reportedGroup: {
        id: 'GRP-427',
        name: 'Anime Fans Club',
        memberCount: 5698,
        privacy: 'public',
        createdDate: 'Oct 18, 2023',
        previousViolations: 0,
        adminCount: 6,
        primaryAdmin: {
          id: '14',
          name: 'Benjamin Young',
          username: '@benjaminy'
        }
      },
      reportedBy: {
        id: '4',
        name: 'Noah Martinez',
        username: '@noahm',
        email: 'noah.martinez@example.com'
      },
      reportType: 'inappropriate_content',
      reportReason: 'Group sharing inappropriate anime content accessible to minors',
      priority: 'medium',
      status: 'under_review',
      dateReported: 'Apr 25, 2025 10:15',
      lastUpdated: 'Apr 26, 2025 09:30',
      notes: 'Reviewing content moderation policies and age verification measures',
      evidence: [
        { type: 'post', id: 'POST-62345', timestamp: 'Apr 24, 2025 21:15' },
        { type: 'screenshot', id: 'SCR-78245', timestamp: 'Apr 25, 2025 09:30' }
      ],
      additionalReports: 3,
      assignedTo: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      }
    },
    {
      id: 'REP-G1007',
      reportedGroup: {
        id: 'GRP-156',
        name: 'Fitness Motivation',
        memberCount: 4321,
        privacy: 'public',
        createdDate: 'Feb 2, 2023',
        previousViolations: 1,
        adminCount: 3,
        primaryAdmin: {
          id: '13',
          name: 'Amelia Lopez',
          username: '@amelial'
        }
      },
      reportedBy: {
        id: '11',
        name: 'Charlotte Lee',
        username: '@charlottel',
        email: 'charlotte.lee@example.com'
      },
      reportType: 'unauthorized_promotion',
      reportReason: 'Group being used primarily for selling unauthorized supplements',
      priority: 'medium',
      status: 'resolved',
      resolution: 'admins_removed',
      dateReported: 'Apr 21, 2025 15:30',
      lastUpdated: 'Apr 23, 2025 16:15',
      notes: 'Two admins removed for policy violations, new moderation team established',
      evidence: [
        { type: 'post', id: 'POST-60456', timestamp: 'Apr 20, 2025 14:20' },
        { type: 'post', id: 'POST-60532', timestamp: 'Apr 21, 2025 10:45' },
        { type: 'message', id: 'MSG-43021', timestamp: 'Apr 21, 2025 12:30' }
      ],
      additionalReports: 5,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    },
    {
      id: 'REP-G1008',
      reportedGroup: {
        id: 'GRP-879',
        name: 'Local Events & Meetups',
        memberCount: 2765,
        privacy: 'public',
        createdDate: 'Sep 7, 2023',
        previousViolations: 0,
        adminCount: 4,
        primaryAdmin: {
          id: '8',
          name: 'Ethan Miller',
          username: '@ethanm'
        }
      },
      reportedBy: {
        id: '1',
        name: 'Emma Johnson',
        username: '@emmaj',
        email: 'emma.johnson@example.com'
      },
      reportType: 'misinformation',
      reportReason: 'Group spreading false safety alerts about local area',
      priority: 'high',
      status: 'pending',
      dateReported: 'Apr 26, 2025 09:10',
      lastUpdated: 'Apr 26, 2025 09:10',
      notes: 'Potential for public panic and safety concerns, requires urgent review',
      evidence: [
        { type: 'post', id: 'POST-63376', timestamp: 'Apr 26, 2025 08:15' },
        { type: 'comment', id: 'COM-89532', timestamp: 'Apr 26, 2025 08:45' }
      ],
      additionalReports: 8,
      assignedTo: null
    },
    {
      id: 'REP-G1009',
      reportedGroup: {
        id: 'GRP-542',
        name: 'Political Discussion Forum',
        memberCount: 6723,
        privacy: 'public',
        createdDate: 'Apr 15, 2023',
        previousViolations: 3,
        adminCount: 7,
        primaryAdmin: {
          id: '2',
          name: 'Liam Wilson',
          username: '@liamw'
        }
      },
      reportedBy: {
        id: '7',
        name: 'Isabella Brown',
        username: '@isabella',
        email: 'isabella.brown@example.com'
      },
      reportType: 'hate_speech',
      reportReason: 'Increasing hostile and discriminatory language against minority groups',
      priority: 'high',
      status: 'under_review',
      dateReported: 'Apr 24, 2025 18:20',
      lastUpdated: 'Apr 25, 2025 14:30',
      notes: 'Group has previous violations, reviewing moderation effectiveness',
      evidence: [
        { type: 'post', id: 'POST-61987', timestamp: 'Apr 24, 2025 14:30' },
        { type: 'comment', id: 'COM-88763', timestamp: 'Apr 24, 2025 15:20' },
        { type: 'comment', id: 'COM-88790', timestamp: 'Apr 24, 2025 17:45' }
      ],
      additionalReports: 11,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    },
    {
      id: 'REP-G1010',
      reportedGroup: {
        id: 'GRP-651',
        name: 'Parenting Support Network',
        memberCount: 4532,
        privacy: 'private',
        createdDate: 'Jul 23, 2023',
        previousViolations: 0,
        adminCount: 5,
        primaryAdmin: {
          id: '9',
          name: 'Sophia Garcia',
          username: '@sophiag'
        }
      },
      reportedBy: {
        id: '5',
        name: 'Ava Thompson',
        username: '@avat',
        email: 'ava.thompson@example.com'
      },
      reportType: 'privacy_violation',
      reportReason: 'Group sharing private information and photos of children without consent',
      priority: 'high',
      status: 'resolved',
      resolution: 'group_warned',
      dateReported: 'Apr 22, 2025 11:40',
      lastUpdated: 'Apr 23, 2025 15:20',
      notes: 'Group admins educated on privacy policies, content removed, new guidelines established',
      evidence: [
        { type: 'post', id: 'POST-60678', timestamp: 'Apr 22, 2025 09:15' },
        { type: 'screenshot', id: 'SCR-77982', timestamp: 'Apr 22, 2025 10:30' }
      ],
      additionalReports: 2,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    },
    {
      id: 'REP-G1011',
      reportedGroup: {
        id: 'GRP-724',
        name: 'Tech Deals & Coupons',
        memberCount: 3245,
        privacy: 'public',
        createdDate: 'Dec 5, 2023',
        previousViolations: 1,
        adminCount: 2,
        primaryAdmin: {
          id: '12',
          name: 'Lucas Wright',
          username: '@lucasw'
        }
      },
      reportedBy: {
        id: '10',
        name: 'Mason Rodriguez',
        username: '@masonr',
        email: 'mason.rodriguez@example.com'
      },
      reportType: 'spam',
      reportReason: 'Group flooded with affiliate links and fake deals',
      priority: 'medium',
      status: 'resolved',
      resolution: 'content_filtered',
      dateReported: 'Apr 21, 2025 10:15',
      lastUpdated: 'Apr 22, 2025 16:40',
      notes: 'Implemented automatic filtering for affiliate links, admin warned',
      evidence: [
        { type: 'post', id: 'POST-60321', timestamp: 'Apr 21, 2025 08:45' },
        { type: 'post', id: 'POST-60345', timestamp: 'Apr 21, 2025 09:20' },
        { type: 'post', id: 'POST-60352', timestamp: 'Apr 21, 2025 09:30' }
      ],
      additionalReports: 3,
      assignedTo: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      }
    },
    {
      id: 'REP-G1012',
      reportedGroup: {
        id: 'GRP-318',
        name: 'Mental Health Support',
        memberCount: 5123,
        privacy: 'private',
        createdDate: 'Nov 18, 2023',
        previousViolations: 0,
        adminCount: 6,
        primaryAdmin: {
          id: '15',
          name: 'Mia Hernandez',
          username: '@miah'
        }
      },
      reportedBy: {
        id: '6',
        name: 'James Taylor',
        username: '@jamest',
        email: 'james.taylor@example.com'
      },
      reportType: 'impersonation',
      reportReason: 'Group admin claiming to be a licensed therapist without credentials',
      priority: 'high',
      status: 'dismissed',
      dateReported: 'Apr 19, 2025 14:30',
      lastUpdated: 'Apr 20, 2025 11:15',
      notes: 'Investigation confirmed admin has proper credentials and license',
      evidence: [
        { type: 'profile', id: 'PROF-15', timestamp: 'Apr 19, 2025 14:25' },
        { type: 'post', id: 'POST-60098', timestamp: 'Apr 19, 2025 13:45' }
      ],
      additionalReports: 1,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    }
  ];

  const filterOptions = [
    {
      id: 'reportType',
      label: 'Report Type',
      type: 'multiselect' as const,
      options: [
        { value: 'misinformation', label: 'Misinformation' },
        { value: 'harassment', label: 'Harassment' },
        { value: 'copyright_violation', label: 'Copyright Violation' },
        { value: 'harmful_content', label: 'Harmful Content' },
        { value: 'scam', label: 'Scam' },
        { value: 'inappropriate_content', label: 'Inappropriate Content' },
        { value: 'unauthorized_promotion', label: 'Unauthorized Promotion' },
        { value: 'hate_speech', label: 'Hate Speech' },
        { value: 'privacy_violation', label: 'Privacy Violation' },
        { value: 'spam', label: 'Spam' },
        { value: 'impersonation', label: 'Impersonation' }
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
        { value: 'content_removed', label: 'Content Removed' },
        { value: 'group_warned', label: 'Group Warned' },
        { value: 'group_banned', label: 'Group Banned' },
        { value: 'admins_removed', label: 'Admins Removed' },
        { value: 'content_filtered', label: 'Content Filtered' },
        { value: 'no_action', label: 'No Action Taken' }
      ]
    },
    {
      id: 'dateReported',
      label: 'Date Reported',
      type: 'daterange' as const
    },
    {
      id: 'memberCount',
      label: 'Member Count',
      type: 'range' as const,
      min: 0,
      max: 10000,
      step: 500
    },
    {
      id: 'privacy',
      label: 'Group Type',
      type: 'select' as const,
      options: [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' }
      ]
    }
  ];

  // Get the appropriate color for a report type
  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'misinformation':
        return 'bg-purple-100 text-purple-700';
      case 'harassment':
        return 'bg-red-100 text-red-700';
      case 'copyright_violation':
        return 'bg-indigo-100 text-indigo-700';
      case 'harmful_content':
        return 'bg-red-100 text-red-700';
      case 'scam':
        return 'bg-orange-100 text-orange-700';
      case 'inappropriate_content':
        return 'bg-yellow-100 text-yellow-700';
      case 'unauthorized_promotion':
        return 'bg-blue-100 text-blue-700';
      case 'hate_speech':
        return 'bg-red-100 text-red-700';
      case 'privacy_violation':
        return 'bg-teal-100 text-teal-700';
      case 'spam':
        return 'bg-blue-100 text-blue-700';
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
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get the appropriate icon for resolution types
  const getResolutionIcon = (resolution: string | null) => {
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
        return <Filter size={14} className="text-blue-500 mr-1" strokeWidth={1.8} />;
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
      id: 'reportedGroup',
      header: 'Reported Group',
      accessor: (row: any) => row.reportedGroup.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-medium text-sm mr-3">
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
      id: 'admin',
      header: 'Primary Admin',
      accessor: (row: any) => row.reportedGroup.primaryAdmin.name,
      sortable: true,
      width: '150px',
      cell: (value: string, row: any) => (
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
      setFilteredReports(reportedGroupsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredReports(reportedGroupsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = reportedGroupsData.filter(report =>
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

    let filtered = [...reportedGroupsData];

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
    setFilteredReports(reportedGroupsData);
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
      change: '+2 today',
      icon: <Clock size={20} className="text-yellow-500" strokeWidth={1.8} />,
      color: 'yellow'
    },
    {
      title: 'High Priority',
      value: '7',
      change: '58% of total',
      icon: <AlertTriangle size={20} className="text-red-500" strokeWidth={1.8} />,
      color: 'red'
    },
    {
      title: 'Large Groups',
      value: '5',
      change: '2,500+ members',
      icon: <Users size={20} className="text-blue-500" strokeWidth={1.8} />,
      color: 'blue'
    },
    {
      title: 'Resolved',
      value: '6',
      change: '50% action rate',
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