import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Calendar,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Shield,
  User,
  Flag,
  Clock,
  FileText,
  Bell,
  Video,
  Users,
  Play,
  BarChart3,
  Slash,
  ShieldAlert,
  ShieldCheck,
  MessageCircle,
  Music,
  Star,
  DollarSign
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
    'explicit content', 'pending', 'gaming'
  ]);

  // Report data
  const reportedLivestreamsData = [
    {
      id: 'REP-L1001',
      reportedStream: {
        id: 'STREAM-3421',
        title: 'Music & Chill - Friday Night Session',
        category: 'music',
        streamer: {
          id: '7',
          name: 'Isabella Brown',
          username: '@isabella',
          avatar: 'https://example.com/avatars/isabella.jpg',
          verified: true
        },
        startTime: 'Apr 25, 2025 19:00',
        duration: '3h 45m',
        viewerCount: 1542,
        likes: 876,
        comments: 642,
        status: 'live',
        tags: ['music', 'acoustic', 'live performance'],
        monetized: true,
        previousViolations: 0
      },
      reportedBy: {
        id: '12',
        name: 'Lucas Wright',
        username: '@lucasw',
        email: 'lucas.wright@example.com'
      },
      reportType: 'copyright_violation',
      reportReason: 'Playing copyrighted music without license',
      priority: 'high',
      status: 'pending',
      dateReported: 'Apr 26, 2025 20:15',
      lastUpdated: 'Apr 26, 2025 20:15',
      notes: 'Multiple DMCA-protected songs being performed',
      evidence: [
        { type: 'timestamp', id: 'TIME-45621', timepoint: '01:15:32', description: 'Performing copyrighted song' },
        { type: 'screenshot', id: 'SCR-78952', timestamp: 'Apr 26, 2025 20:10' }
      ],
      additionalReports: 3,
      assignedTo: null
    },
    {
      id: 'REP-L1002',
      reportedStream: {
        id: 'STREAM-3426',
        title: 'Gaming Tournament Finals - Watch Now!',
        category: 'gaming',
        streamer: {
          id: '10',
          name: 'Mason Rodriguez',
          username: '@masonr',
          avatar: 'https://example.com/avatars/mason.jpg',
          verified: true
        },
        startTime: 'Apr 26, 2025 15:00',
        duration: '4h 20m',
        viewerCount: 8742,
        likes: 3254,
        comments: 1876,
        status: 'live',
        tags: ['gaming', 'esports', 'tournament', 'competitive'],
        monetized: true,
        previousViolations: 1
      },
      reportedBy: {
        id: '3',
        name: 'Olivia Davis',
        username: '@oliviad',
        email: 'olivia.davis@example.com'
      },
      reportType: 'inappropriate_language',
      reportReason: 'Excessive profanity and inappropriate comments',
      priority: 'medium',
      status: 'under_review',
      dateReported: 'Apr 26, 2025 17:25',
      lastUpdated: 'Apr 26, 2025 18:15',
      notes: 'Review of complete stream behavior in progress, multiple instances noted',
      evidence: [
        { type: 'timestamp', id: 'TIME-45630', timepoint: '01:45:22', description: 'Inappropriate language' },
        { type: 'timestamp', id: 'TIME-45635', timepoint: '02:12:08', description: 'Aggressive comments' }
      ],
      additionalReports: 7,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    },
    {
      id: 'REP-L1003',
      reportedStream: {
        id: 'STREAM-3428',
        title: 'Cooking Class - Italian Pasta from Scratch',
        category: 'food',
        streamer: {
          id: '13',
          name: 'Amelia Lopez',
          username: '@amelial',
          avatar: 'https://example.com/avatars/amelia.jpg',
          verified: false
        },
        startTime: 'Apr 26, 2025 12:00',
        duration: '1h 30m',
        viewerCount: 756,
        likes: 324,
        comments: 218,
        status: 'ended',
        tags: ['cooking', 'food', 'tutorial', 'italian cuisine'],
        monetized: true,
        previousViolations: 0
      },
      reportedBy: {
        id: '5',
        name: 'Ava Thompson',
        username: '@avat',
        email: 'ava.thompson@example.com'
      },
      reportType: 'misinformation',
      reportReason: 'Promoting unsafe food handling practices',
      priority: 'medium',
      status: 'resolved',
      resolution: 'warning_issued',
      dateReported: 'Apr 26, 2025 13:45',
      lastUpdated: 'Apr 26, 2025 15:20',
      notes: 'Streamer advised about food safety guidelines, acknowledged issues and committed to correcting in future streams',
      evidence: [
        { type: 'timestamp', id: 'TIME-45641', timepoint: '00:45:12', description: 'Unsafe raw chicken handling' },
        { type: 'timestamp', id: 'TIME-45648', timepoint: '01:02:25', description: 'Cross-contamination of utensils' }
      ],
      additionalReports: 2,
      assignedTo: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      }
    },
    {
      id: 'REP-L1004',
      reportedStream: {
        id: 'STREAM-3430',
        title: 'Art & Drawing - Portrait Techniques',
        category: 'art',
        streamer: {
          id: '15',
          name: 'Mia Hernandez',
          username: '@miah',
          avatar: 'https://example.com/avatars/mia.jpg',
          verified: true
        },
        startTime: 'Apr 25, 2025 14:00',
        duration: '2h 15m',
        viewerCount: 532,
        likes: 278,
        comments: 164,
        status: 'ended',
        tags: ['art', 'drawing', 'tutorial', 'portraits'],
        monetized: true,
        previousViolations: 0
      },
      reportedBy: {
        id: '2',
        name: 'Liam Wilson',
        username: '@liamw',
        email: 'liam.wilson@example.com'
      },
      reportType: 'spam',
      reportReason: 'Excessive product promotion and affiliate links',
      priority: 'low',
      status: 'dismissed',
      dateReported: 'Apr 25, 2025 15:40',
      lastUpdated: 'Apr 26, 2025 09:15',
      notes: 'Review found product mentions within platform guidelines for sponsored content',
      evidence: [
        { type: 'timestamp', id: 'TIME-45621', timepoint: '01:05:22', description: 'Product promotion' },
        { type: 'comment', id: 'COM-89432', timestamp: 'Apr 25, 2025 15:20' }
      ],
      additionalReports: 0,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    },
    {
      id: 'REP-L1005',
      reportedStream: {
        id: 'STREAM-3435',
        title: 'Morning Yoga Flow - Start Your Day Right',
        category: 'fitness',
        streamer: {
          id: '3',
          name: 'Olivia Davis',
          username: '@oliviad',
          avatar: 'https://example.com/avatars/olivia.jpg',
          verified: true
        },
        startTime: 'Apr 26, 2025 08:00',
        duration: '1h 00m',
        viewerCount: 423,
        likes: 215,
        comments: 98,
        status: 'ended',
        tags: ['fitness', 'yoga', 'wellness', 'morning routine'],
        monetized: true,
        previousViolations: 0
      },
      reportedBy: {
        id: '8',
        name: 'Ethan Miller',
        username: '@ethanm',
        email: 'ethan.miller@example.com'
      },
      reportType: 'harmful_advice',
      reportReason: 'Promoting potentially harmful stretching techniques',
      priority: 'medium',
      status: 'resolved',
      resolution: 'content_edited',
      dateReported: 'Apr 26, 2025 09:30',
      lastUpdated: 'Apr 26, 2025 14:45',
      notes: 'Specific segments with questionable advice removed from recording, streamer added safety disclaimers',
      evidence: [
        { type: 'timestamp', id: 'TIME-45650', timepoint: '00:32:15', description: 'Potentially harmful neck stretch' },
        { type: 'timestamp', id: 'TIME-45652', timepoint: '00:48:30', description: 'Advanced pose without proper warning' }
      ],
      additionalReports: 2,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    },
    {
      id: 'REP-L1006',
      reportedStream: {
        id: 'STREAM-3437',
        title: 'Piano Covers - Your Song Requests',
        category: 'music',
        streamer: {
          id: '1',
          name: 'Emma Johnson',
          username: '@emmaj',
          avatar: 'https://example.com/avatars/emma.jpg',
          verified: true
        },
        startTime: 'Apr 24, 2025 19:30',
        duration: '2h 45m',
        viewerCount: 1245,
        likes: 652,
        comments: 487,
        status: 'ended',
        tags: ['music', 'piano', 'covers', 'requests'],
        monetized: true,
        previousViolations: 0
      },
      reportedBy: {
        id: '9',
        name: 'Sophia Garcia',
        username: '@sophiag',
        email: 'sophia.garcia@example.com'
      },
      reportType: 'copyright_violation',
      reportReason: 'Playing copyrighted music without license',
      priority: 'medium',
      status: 'resolved',
      resolution: 'content_muted',
      dateReported: 'Apr 25, 2025 10:15',
      lastUpdated: 'Apr 25, 2025 16:30',
      notes: 'Copyrighted sections muted in recording, creator notified of content policy',
      evidence: [
        { type: 'timestamp', id: 'TIME-45625', timepoint: '01:15:40', description: 'Copyrighted song performance' },
        { type: 'timestamp', id: 'TIME-45628', timepoint: '01:45:22', description: 'Another copyrighted song' }
      ],
      additionalReports: 1,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    },
    {
      id: 'REP-L1007',
      reportedStream: {
        id: 'STREAM-3440',
        title: 'Dance Choreography - Learn the Latest Moves',
        category: 'dance',
        streamer: {
          id: '5',
          name: 'Ava Thompson',
          username: '@avat',
          avatar: 'https://example.com/avatars/ava.jpg',
          verified: false
        },
        startTime: 'Apr 26, 2025 18:00',
        duration: '1h 45m',
        viewerCount: 876,
        likes: 426,
        comments: 312,
        status: 'live',
        tags: ['dance', 'choreography', 'tutorial', 'fitness'],
        monetized: true,
        previousViolations: 0
      },
      reportedBy: {
        id: '4',
        name: 'Noah Martinez',
        username: '@noahm',
        email: 'noah.martinez@example.com'
      },
      reportType: 'inappropriate_content',
      reportReason: 'Suggestive dancing inappropriate for all audiences',
      priority: 'high',
      status: 'under_review',
      dateReported: 'Apr 26, 2025 19:10',
      lastUpdated: 'Apr 26, 2025 19:35',
      notes: 'Evaluating age-restriction requirement for this content',
      evidence: [
        { type: 'timestamp', id: 'TIME-45660', timepoint: '00:45:12', description: 'Suggestive choreography' },
        { type: 'timestamp', id: 'TIME-45662', timepoint: '01:05:30', description: 'More suggestive content' }
      ],
      additionalReports: 5,
      assignedTo: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      }
    },
    {
      id: 'REP-L1008',
      reportedStream: {
        id: 'STREAM-3445',
        title: 'Travel Vlog - Exploring Tokyo Streets',
        category: 'travel',
        streamer: {
          id: '14',
          name: 'Benjamin Young',
          username: '@benjaminy',
          avatar: 'https://example.com/avatars/benjamin.jpg',
          verified: false
        },
        startTime: 'Apr 27, 2025 09:00',
        duration: '3h 15m',
        viewerCount: 965,
        likes: 487,
        comments: 354,
        status: 'live',
        tags: ['travel', 'japan', 'tokyo', 'exploration'],
        monetized: true,
        previousViolations: 1
      },
      reportedBy: {
        id: '6',
        name: 'James Taylor',
        username: '@jamest',
        email: 'james.taylor@example.com'
      },
      reportType: 'privacy_violation',
      reportReason: 'Filming strangers without consent, including children',
      priority: 'high',
      status: 'pending',
      dateReported: 'Apr 27, 2025 10:05',
      lastUpdated: 'Apr 27, 2025 10:05',
      notes: 'Stream currently active, requires immediate review',
      evidence: [
        { type: 'timestamp', id: 'TIME-45670', timepoint: '00:35:42', description: 'Filming children without consent' },
        { type: 'timestamp', id: 'TIME-45672', timepoint: '01:10:15', description: 'Close-up of strangers\' faces' }
      ],
      additionalReports: 4,
      assignedTo: null
    },
    {
      id: 'REP-L1009',
      reportedStream: {
        id: 'STREAM-3447',
        title: 'Tech Talk - The Future of AI',
        category: 'technology',
        streamer: {
          id: '8',
          name: 'Ethan Miller',
          username: '@ethanm',
          avatar: 'https://example.com/avatars/ethan.jpg',
          verified: true
        },
        startTime: 'Apr 27, 2025 14:00',
        duration: '1h 25m',
        viewerCount: 1356,
        likes: 752,
        comments: 546,
        status: 'live',
        tags: ['technology', 'artificial intelligence', 'future tech', 'discussion'],
        monetized: true,
        previousViolations: 0
      },
      reportedBy: {
        id: '11',
        name: 'Charlotte Lee',
        username: '@charlottel',
        email: 'charlotte.lee@example.com'
      },
      reportType: 'misinformation',
      reportReason: 'Spreading false information about AI capabilities and risks',
      priority: 'medium',
      status: 'pending',
      dateReported: 'Apr 27, 2025 14:40',
      lastUpdated: 'Apr 27, 2025 14:40',
      notes: 'Need expert review of technical claims being made',
      evidence: [
        { type: 'timestamp', id: 'TIME-45675', timepoint: '00:25:18', description: 'Questionable AI claims' },
        { type: 'comment', id: 'COM-89562', timestamp: 'Apr 27, 2025 14:35' }
      ],
      additionalReports: 2,
      assignedTo: null
    },
    {
      id: 'REP-L1010',
      reportedStream: {
        id: 'STREAM-3450',
        title: 'Late Night Chat & Music',
        category: 'just chatting',
        streamer: {
          id: '6',
          name: 'James Taylor',
          username: '@jamest',
          avatar: 'https://example.com/avatars/james.jpg',
          verified: false
        },
        startTime: 'Apr 26, 2025 22:00',
        duration: '4h 10m',
        viewerCount: 378,
        likes: 189,
        comments: 245,
        status: 'ended',
        tags: ['chat', 'music', 'conversation', 'late night'],
        monetized: false,
        previousViolations: 2
      },
      reportedBy: {
        id: '15',
        name: 'Mia Hernandez',
        username: '@miah',
        email: 'mia.hernandez@example.com'
      },
      reportType: 'harassment',
      reportReason: 'Making threatening comments about other streamers',
      priority: 'high',
      status: 'resolved',
      resolution: 'stream_terminated',
      dateReported: 'Apr 26, 2025 23:15',
      lastUpdated: 'Apr 27, 2025 01:30',
      notes: 'Stream terminated mid-broadcast due to clear TOS violations, 30-day streaming ban issued',
      evidence: [
        { type: 'timestamp', id: 'TIME-45680', timepoint: '01:45:32', description: 'Threatening comments' },
        { type: 'timestamp', id: 'TIME-45685', timepoint: '02:15:08', description: 'Further harassment' },
        { type: 'screenshot', id: 'SCR-79042', timestamp: 'Apr 26, 2025 23:10' }
      ],
      additionalReports: 8,
      assignedTo: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      }
    },
    {
      id: 'REP-L1011',
      reportedStream: {
        id: 'STREAM-3452',
        title: 'Investment Strategies for 2025',
        category: 'finance',
        streamer: {
          id: '9',
          name: 'Sophia Garcia',
          username: '@sophiag',
          avatar: 'https://example.com/avatars/sophia.jpg',
          verified: true
        },
        startTime: 'Apr 25, 2025 16:00',
        duration: '2h 30m',
        viewerCount: 2134,
        likes: 976,
        comments: 654,
        status: 'ended',
        tags: ['finance', 'investing', 'money', 'stocks'],
        monetized: true,
        previousViolations: 0
      },
      reportedBy: {
        id: '7',
        name: 'Isabella Brown',
        username: '@isabella',
        email: 'isabella.brown@example.com'
      },
      reportType: 'misleading_content',
      reportReason: 'Providing financial advice without proper disclaimers',
      priority: 'medium',
      status: 'resolved',
      resolution: 'warning_issued',
      dateReported: 'Apr 25, 2025 18:45',
      lastUpdated: 'Apr 26, 2025 11:20',
      notes: 'Streamer added proper disclaimers to video and agreed to include them in future streams',
      evidence: [
        { type: 'timestamp', id: 'TIME-45690', timepoint: '00:15:42', description: 'Financial advice without disclaimer' },
        { type: 'timestamp', id: 'TIME-45692', timepoint: '01:05:18', description: 'Stock recommendations' }
      ],
      additionalReports: 3,
      assignedTo: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      }
    },
    {
      id: 'REP-L1012',
      reportedStream: {
        id: 'STREAM-3455',
        title: 'Horror Game Playthrough - Late Night Edition',
        category: 'gaming',
        streamer: {
          id: '12',
          name: 'Lucas Wright',
          username: '@lucasw',
          avatar: 'https://example.com/avatars/lucas.jpg',
          verified: false
        },
        startTime: 'Apr 26, 2025 23:00',
        duration: '3h 45m',
        viewerCount: 1265,
        likes: 687,
        comments: 523,
        status: 'ended',
        tags: ['gaming', 'horror', 'playthrough', 'late night'],
        monetized: true,
        previousViolations: 1
      },
      reportedBy: {
        id: '13',
        name: 'Amelia Lopez',
        username: '@amelial',
        email: 'amelia.lopez@example.com'
      },
      reportType: 'age_restricted_content',
      reportReason: 'Extremely graphic horror content without adequate warnings',
      priority: 'medium',
      status: 'resolved',
      resolution: 'age_restricted',
      dateReported: 'Apr 27, 2025 10:15',
      lastUpdated: 'Apr 27, 2025 13:40',
      notes: 'Stream marked as 18+ with content warnings added to beginning of recording',
      evidence: [
        { type: 'timestamp', id: 'TIME-45695', timepoint: '01:25:18', description: 'Graphic horror scene' },
        { type: 'timestamp', id: 'TIME-45698', timepoint: '02:15:42', description: 'Extreme violence' }
      ],
      additionalReports: 5,
      assignedTo: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      }
    }
  ];

  const filterOptions = [
    {
      id: 'reportType',
      label: 'Report Type',
      type: 'multiselect' as const,
      options: [
        { value: 'copyright_violation', label: 'Copyright Violation' },
        { value: 'inappropriate_language', label: 'Inappropriate Language' },
        { value: 'misinformation', label: 'Misinformation' },
        { value: 'spam', label: 'Spam' },
        { value: 'harmful_advice', label: 'Harmful Advice' },
        { value: 'inappropriate_content', label: 'Inappropriate Content' },
        { value: 'privacy_violation', label: 'Privacy Violation' },
        { value: 'harassment', label: 'Harassment' },
        { value: 'misleading_content', label: 'Misleading Content' },
        { value: 'age_restricted_content', label: 'Age Restricted Content' }
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
      id: 'streamStatus',
      label: 'Stream Status',
      type: 'select' as const,
      options: [
        { value: 'live', label: 'Currently Live' },
        { value: 'ended', label: 'Ended' }
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
        { value: 'content_edited', label: 'Content Edited' },
        { value: 'content_muted', label: 'Content Muted' },
        { value: 'stream_terminated', label: 'Stream Terminated' },
        { value: 'age_restricted', label: 'Age Restricted' },
        { value: 'no_action', label: 'No Action Taken' }
      ]
    },
    {
      id: 'category',
      label: 'Stream Category',
      type: 'multiselect' as const,
      options: [
        { value: 'music', label: 'Music' },
        { value: 'gaming', label: 'Gaming' },
        { value: 'food', label: 'Food' },
        { value: 'art', label: 'Art' },
        { value: 'fitness', label: 'Fitness' },
        { value: 'dance', label: 'Dance' },
        { value: 'travel', label: 'Travel' },
        { value: 'technology', label: 'Technology' },
        { value: 'just chatting', label: 'Just Chatting' },
        { value: 'finance', label: 'Finance' }
      ]
    },
    {
      id: 'viewerCount',
      label: 'Viewer Count',
      type: 'range' as const,
      min: 0,
      max: 10000,
      step: 500
    },
    {
      id: 'dateReported',
      label: 'Date Reported',
      type: 'daterange' as const
    }
  ];

  // Get the appropriate color for a report type
  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'copyright_violation':
        return 'bg-primary-100 text-primary-700';
      case 'inappropriate_language':
        return 'bg-orange-100 text-orange-700';
      case 'misinformation':
        return 'bg-purple-100 text-purple-700';
      case 'spam':
        return 'bg-primary-100 text-primary-700';
      case 'harmful_advice':
        return 'bg-red-100 text-red-700';
      case 'inappropriate_content':
        return 'bg-yellow-100 text-yellow-700';
      case 'privacy_violation':
        return 'bg-teal-100 text-teal-700';
      case 'harassment':
        return 'bg-red-100 text-red-700';
      case 'misleading_content':
        return 'bg-amber-100 text-amber-700';
      case 'age_restricted_content':
        return 'bg-pink-100 text-pink-700';
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
  const getResolutionIcon = (resolution: string | null) => {
    if (!resolution) return null;

    switch (resolution) {
      case 'warning_issued':
        return <AlertTriangle size={14} className="text-yellow-500 mr-1" strokeWidth={1.8} />;
      case 'content_edited':
        return <Edit size={14} className="text-primary-500 mr-1" strokeWidth={1.8} />;
      case 'content_muted':
        return <Slash size={14} className="text-orange-500 mr-1" strokeWidth={1.8} />;
      case 'stream_terminated':
        return <Ban size={14} className="text-red-700 mr-1" strokeWidth={1.8} />;
      case 'age_restricted':
        return <ShieldAlert size={14} className="text-pink-500 mr-1" strokeWidth={1.8} />;
      case 'no_action':
        return <CheckCircle size={14} className="text-gray-500 mr-1" strokeWidth={1.8} />;
      default:
        return null;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'music':
        return <Music size={14} className="text-purple-500 mr-1" strokeWidth={1.8} />;
      case 'gaming':
        return <Play size={14} className="text-red-500 mr-1" strokeWidth={1.8} />;
      case 'food':
        return <Coffee size={14} className="text-amber-500 mr-1" strokeWidth={1.8} />;
      case 'art':
        return <Palette size={14} className="text-primary-500 mr-1" strokeWidth={1.8} />;
      case 'fitness':
        return <Activity size={14} className="text-green-500 mr-1" strokeWidth={1.8} />;
      case 'dance':
        return <Music size={14} className="text-pink-500 mr-1" strokeWidth={1.8} />;
      case 'travel':
        return <Globe size={14} className="text-cyan-500 mr-1" strokeWidth={1.8} />;
      case 'technology':
        return <Cpu size={14} className="text-primary-500 mr-1" strokeWidth={1.8} />;
      case 'just chatting':
        return <MessageCircle size={14} className="text-gray-500 mr-1" strokeWidth={1.8} />;
      case 'finance':
        return <DollarSign size={14} className="text-green-500 mr-1" strokeWidth={1.8} />;
      default:
        return <Video size={14} className="text-gray-500 mr-1" strokeWidth={1.8} />;
    }
  };

  // These are referenced above but need to be defined
  const Coffee = (props: any) => <MessageCircle {...props} />;
  const Palette = (props: any) => <Star {...props} />;
  const Activity = (props: any) => <BarChart3 {...props} />;
  const Cpu = (props: any) => <Star {...props} />;
  const Globe = (props: any) => <MessageCircle {...props} />;
  const Edit = (props: any) => <MessageCircle {...props} />;

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
      id: 'stream',
      header: 'Stream',
      accessor: (row: any) => row.reportedStream.title,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white flex items-center justify-center font-medium text-sm mr-3">
              <Video size={16} strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center">
                <p className="font-medium text-gray-800 line-clamp-1">{value}</p>
                {row.reportedStream.status === 'live' && (
                  <span className="ml-2 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-md flex items-center">
                    <Play size={10} className="mr-1" strokeWidth={2} /> LIVE
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                {getCategoryIcon(row.reportedStream.category)}
                <span className="capitalize">{row.reportedStream.category}</span>
                <span className="mx-1">•</span>
                <Users size={12} className="mr-1" strokeWidth={1.8} />
                {row.reportedStream.viewerCount.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center mt-1 ml-11 text-xs text-gray-500">
            <Clock size={12} className="mr-1" strokeWidth={1.8} />
            <span>Started {row.reportedStream.startTime.split(' ')[0]}</span>
            <span className="mx-1">•</span>
            <span>Duration: {row.reportedStream.duration}</span>
          </div>
        </div>
      )
    },
    {
      id: 'streamer',
      header: 'Streamer',
      accessor: (row: any) => row.reportedStream.streamer.name,
      sortable: true,
      width: '180px',
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-500 text-white flex items-center justify-center font-medium text-xs mr-2">
            {value.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center">
              <p className="font-medium text-gray-800">{value}</p>
              {row.reportedStream.streamer.verified && (
                <ShieldCheck size={12} className="ml-1 text-primary-500" strokeWidth={2} />
              )}
            </div>
            <div className="flex items-center">
              <p className="text-xs text-gray-500">{row.reportedStream.streamer.username}</p>
              {row.reportedStream.previousViolations > 0 && (
                <span className="ml-2 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-md">
                  {row.reportedStream.previousViolations} prev.
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
      id: 'evidence',
      header: 'Evidence',
      accessor: (row: any) => row.evidence.length,
      sortable: true,
      width: '120px',
      cell: (value: number, row: any) => (
        <div className="flex flex-col">
          <div className="flex flex-col">
            {row.evidence.map((item: any, index: number) => (
              <div key={index} className="flex items-center text-xs text-gray-600 mb-1">
                {item.type === 'timestamp' ? (
                  <>
                    <Clock size={12} className="text-red-500 mr-1" strokeWidth={1.8} />
                    <span>Timestamp: {item.timepoint}</span>
                  </>
                ) : (
                  <>
                    <FileText size={12} className="text-gray-500 mr-1" strokeWidth={1.8} />
                    <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                  </>
                )}
              </div>
            ))}
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
      header: 'Reported',
      accessor: (row: any) => row.dateReported,
      sortable: true,
      width: '120px',
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
      width: '140px',
      cell: (value: string, row: any) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View stream details"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>

          {row.status === 'pending' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-primary-100 hover:text-primary-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Review this report"
            >
              <Shield size={16} strokeWidth={1.8} />
            </motion.button>
          )}

          {row.reportedStream.status === 'live' && (row.status === 'pending' || row.status === 'under_review') && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Terminate stream"
            >
              <Ban size={16} strokeWidth={1.8} />
            </motion.button>
          )}

          {(row.status === 'pending' || row.status === 'under_review') && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-green-100 hover:text-green-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Mark as reviewed"
            >
              <CheckCircle size={16} strokeWidth={1.8} />
            </motion.button>
          )}
        </div>
      )
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredReports(reportedLivestreamsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredReports(reportedLivestreamsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = reportedLivestreamsData.filter(report =>
      report.id.toLowerCase().includes(lowercasedQuery) ||
      report.reportedStream.title.toLowerCase().includes(lowercasedQuery) ||
      report.reportedStream.streamer.name.toLowerCase().includes(lowercasedQuery) ||
      report.reportedStream.streamer.username.toLowerCase().includes(lowercasedQuery) ||
      report.reportedStream.category.toLowerCase().includes(lowercasedQuery) ||
      report.reportedBy.name.toLowerCase().includes(lowercasedQuery) ||
      report.reportType.toLowerCase().includes(lowercasedQuery) ||
      report.reportReason.toLowerCase().includes(lowercasedQuery) ||
      (report.reportedStream.tags && report.reportedStream.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)))
    );

    setFilteredReports(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...reportedLivestreamsData];

    if (filters.reportType && filters.reportType.length > 0) {
      filtered = filtered.filter(report => filters.reportType.includes(report.reportType));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(report => filters.status.includes(report.status));
    }

    if (filters.streamStatus) {
      filtered = filtered.filter(report => report.reportedStream.status === filters.streamStatus);
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(report => filters.priority.includes(report.priority));
    }

    if (filters.resolution) {
      filtered = filtered.filter(report => report.resolution === filters.resolution);
    }

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(report => filters.category.includes(report.reportedStream.category));
    }

    if (filters.viewerCount && (filters.viewerCount.from !== undefined || filters.viewerCount.to !== undefined)) {
      if (filters.viewerCount.from !== undefined) {
        filtered = filtered.filter(report => report.reportedStream.viewerCount >= filters.viewerCount.from);
      }
      if (filters.viewerCount.to !== undefined) {
        filtered = filtered.filter(report => report.reportedStream.viewerCount <= filters.viewerCount.to);
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
        report.reportedStream.title.toLowerCase().includes(lowercasedQuery) ||
        report.reportedStream.streamer.name.toLowerCase().includes(lowercasedQuery) ||
        report.reportedStream.streamer.username.toLowerCase().includes(lowercasedQuery) ||
        report.reportedStream.category.toLowerCase().includes(lowercasedQuery) ||
        report.reportedBy.name.toLowerCase().includes(lowercasedQuery) ||
        report.reportType.toLowerCase().includes(lowercasedQuery) ||
        report.reportReason.toLowerCase().includes(lowercasedQuery) ||
        (report.reportedStream.tags && report.reportedStream.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)))
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
    setFilteredReports(reportedLivestreamsData);
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
      title: 'Live Streams',
      value: '4',
      change: 'Require immediate review',
      icon: <Play size={20} className="text-red-500" strokeWidth={1.8} />,
      color: 'red'
    },
    {
      title: 'High Priority',
      value: '5',
      change: '42% of total',
      icon: <AlertTriangle size={20} className="text-orange-500" strokeWidth={1.8} />,
      color: 'orange'
    },
    {
      title: 'Pending',
      value: '5',
      change: 'Waiting for review',
      icon: <Clock size={20} className="text-yellow-500" strokeWidth={1.8} />,
      color: 'yellow'
    },
    {
      title: 'Resolved',
      value: '7',
      change: '58% action rate',
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
          <h1 className="text-2xl font-semibold text-gray-800">Reported Livestreams</h1>
          <p className="text-gray-500 mt-1">Monitor and moderate livestream content</p>
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
            placeholder="Search by stream title, streamer, category or report reason..."
            onSearch={handleSearch}
            suggestions={[
              'music',
              'Isabella Brown',
              'copyright',
              'gaming'
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