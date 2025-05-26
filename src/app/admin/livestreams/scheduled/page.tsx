import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  Filter,
  Play,
  Clock,
  Eye,
  Edit,
  Trash2,
  Video,
  Tag,
  CheckCircle,
  Bell,
  MoreHorizontal,
  MessageSquare,

  ThumbsUp,
  Calendar as CalendarIcon,
  Plus,
  Star
} from 'lucide-react';

import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

const page = () => {
  // States for the page
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredStreams, setFilteredStreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'tech podcast', 'gardening', 'martial arts'
  ]);

  const scheduledStreamsData = [
    {
      id: 'STREAM-3458',
      title: 'Weekly Podcast - Tech News Roundup',
      thumbnail: 'https://example.com/thumbnails/stream3458.jpg',
      streamer: {
        id: '2',
        name: 'Liam Wilson',
        username: '@liamw',
        avatar: 'https://example.com/avatars/liam.jpg',
        verified: true,
        followers: 23400
      },
      category: 'technology',
      tags: ['technology', 'news', 'podcast', 'weekly'],
      status: 'scheduled',
      scheduledAt: 'Apr 28, 2025 18:00',
      estimatedDuration: '1h 30m',
      remindersSent: 1254,
      interestedCount: 876,
      monetized: true,
      featured: true,
      visibility: 'public',
      description: 'Join me for our weekly tech news roundup where we discuss the biggest stories in technology.',
      streamKey: 'sk_3m4n5o6p7q8r9s',
      recurring: {
        isRecurring: true,
        frequency: 'weekly',
        days: ['Monday'],
        time: '18:00'
      },
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 2,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'Apr 28, 2025 17:00',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'Apr 28, 2025 17:30',
          status: 'pending'
        }]
      }
    },
    {
      id: 'STREAM-3460',
      title: 'Gardening Tips for Spring Planting',
      thumbnail: 'https://example.com/thumbnails/stream3460.jpg',
      streamer: {
        id: '4',
        name: 'Noah Martinez',
        username: '@noahm',
        avatar: 'https://example.com/avatars/noah.jpg',
        verified: false,
        followers: 8700
      },
      category: 'lifestyle',
      tags: ['gardening', 'plants', 'spring', 'outdoors'],
      status: 'scheduled',
      scheduledAt: 'Apr 29, 2025 10:00',
      estimatedDuration: '1h 00m',
      remindersSent: 420,
      interestedCount: 327,
      monetized: true,
      featured: false,
      visibility: 'public',
      description: 'I\'ll be sharing my favorite gardening tips for spring planting success!',
      streamKey: 'sk_4n5o6p7q8r9s0t',
      recurring: {
        isRecurring: false
      },
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 1,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'Apr 29, 2025 09:00',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'Apr 29, 2025 09:45',
          status: 'pending'
        }]
      }
    },
    {
      id: 'STREAM-3462',
      title: 'Mixed Martial Arts Training Session',
      thumbnail: 'https://example.com/thumbnails/stream3462.jpg',
      streamer: {
        id: '11',
        name: 'Charlotte Lee',
        username: '@charlottel',
        avatar: 'https://example.com/avatars/charlotte.jpg',
        verified: true,
        followers: 14500
      },
      category: 'sports',
      tags: ['martial arts', 'fitness', 'training', 'MMA'],
      status: 'scheduled',
      scheduledAt: 'Apr 28, 2025 15:30',
      estimatedDuration: '1h 15m',
      remindersSent: 873,
      interestedCount: 645,
      monetized: true,
      featured: false,
      visibility: 'public',
      description: 'Live MMA training session with tips and techniques for beginners and advanced practitioners.',
      streamKey: 'sk_5o6p7q8r9s0t1u',
      recurring: {
        isRecurring: true,
        frequency: 'weekly',
        days: ['Tuesday', 'Thursday'],
        time: '15:30'
      },
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 2,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'Apr 28, 2025 14:30',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'Apr 28, 2025 15:15',
          status: 'pending'
        }]
      }
    },
    {
      id: 'STREAM-3465',
      title: 'Book Club Discussion - Monthly Meeting',
      thumbnail: 'https://example.com/thumbnails/stream3465.jpg',
      streamer: {
        id: '9',
        name: 'Sophia Garcia',
        username: '@sophiag',
        avatar: 'https://example.com/avatars/sophia.jpg',
        verified: true,
        followers: 19800
      },
      category: 'education',
      tags: ['books', 'reading', 'discussion', 'literature'],
      status: 'scheduled',
      scheduledAt: 'Apr 30, 2025 19:30',
      estimatedDuration: '2h 00m',
      remindersSent: 562,
      interestedCount: 489,
      monetized: true,
      featured: false,
      visibility: 'public',
      description: 'Join our monthly book club discussion! This month we\'re reading "The Midnight Library" by Matt Haig.',
      streamKey: 'sk_6p7q8r9s0t1u2v',
      recurring: {
        isRecurring: true,
        frequency: 'monthly',
        days: ['last Wednesday'],
        time: '19:30'
      },
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 3,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'Apr 30, 2025 18:30',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'Apr 30, 2025 19:15',
          status: 'pending'
        }]
      }
    },
    {
      id: 'STREAM-3467',
      title: 'Modern Jazz Piano Improvisation',
      thumbnail: 'https://example.com/thumbnails/stream3467.jpg',
      streamer: {
        id: '1',
        name: 'Emma Johnson',
        username: '@emmaj',
        avatar: 'https://example.com/avatars/emma.jpg',
        verified: true,
        followers: 32100
      },
      category: 'music',
      tags: ['jazz', 'piano', 'improvisation', 'music theory'],
      status: 'scheduled',
      scheduledAt: 'Apr 29, 2025 20:00',
      estimatedDuration: '1h 45m',
      remindersSent: 1108,
      interestedCount: 873,
      monetized: true,
      featured: true,
      visibility: 'public',
      description: 'Exploring modern jazz piano techniques and improvisation methods. Bring your questions!',
      streamKey: 'sk_7q8r9s0t1u2v3w',
      recurring: {
        isRecurring: false
      },
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 2,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'Apr 29, 2025 19:00',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'Apr 29, 2025 19:45',
          status: 'pending'
        }]
      }
    },
    {
      id: 'STREAM-3470',
      title: 'Frontend Development Workshop - React Hooks',
      thumbnail: 'https://example.com/thumbnails/stream3470.jpg',
      streamer: {
        id: '8',
        name: 'Ethan Miller',
        username: '@ethanm',
        avatar: 'https://example.com/avatars/ethan.jpg',
        verified: true,
        followers: 28700
      },
      category: 'technology',
      tags: ['coding', 'programming', 'react', 'javascript', 'web development'],
      status: 'scheduled',
      scheduledAt: 'May 1, 2025 16:00',
      estimatedDuration: '2h 30m',
      remindersSent: 982,
      interestedCount: 845,
      monetized: true,
      featured: true,
      visibility: 'public',
      description: 'Comprehensive workshop on React Hooks - from basics to advanced patterns. Coding along is encouraged!',
      streamKey: 'sk_8r9s0t1u2v3w4x',
      recurring: {
        isRecurring: false
      },
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 3,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'May 1, 2025 15:00',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'May 1, 2025 15:45',
          status: 'pending'
        }]
      }
    },
    {
      id: 'STREAM-3472',
      title: 'Makeup Tutorial - Summer Looks',
      thumbnail: 'https://example.com/thumbnails/stream3472.jpg',
      streamer: {
        id: '15',
        name: 'Mia Hernandez',
        username: '@miah',
        avatar: 'https://example.com/avatars/mia.jpg',
        verified: true,
        followers: 18900
      },
      category: 'beauty',
      tags: ['makeup', 'beauty', 'tutorial', 'summer', 'cosmetics'],
      status: 'scheduled',
      scheduledAt: 'May 2, 2025 14:00',
      estimatedDuration: '1h 30m',
      remindersSent: 743,
      interestedCount: 615,
      monetized: true,
      featured: false,
      visibility: 'public',
      description: 'Learn how to create fresh, vibrant summer makeup looks perfect for day or night!',
      streamKey: 'sk_9s0t1u2v3w4x5y',
      recurring: {
        isRecurring: false
      },
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 2,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'May 2, 2025 13:00',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'May 2, 2025 13:45',
          status: 'pending'
        }]
      }
    },
    {
      id: 'STREAM-3475',
      title: 'Beginner Guitar Lessons - First Chords',
      thumbnail: 'https://example.com/thumbnails/stream3475.jpg',
      streamer: {
        id: '6',
        name: 'James Taylor',
        username: '@jamest',
        avatar: 'https://example.com/avatars/james.jpg',
        verified: false,
        followers: 7200
      },
      category: 'music',
      tags: ['guitar', 'music', 'lessons', 'beginner', 'musical instruments'],
      status: 'scheduled',
      scheduledAt: 'May 3, 2025 11:00',
      estimatedDuration: '1h 00m',
      remindersSent: 215,
      interestedCount: 183,
      monetized: true,
      featured: false,
      visibility: 'public',
      description: 'Perfect for absolute beginners! Learn your first guitar chords and start playing songs right away.',
      streamKey: 'sk_0t1u2v3w4x5y6z',
      recurring: {
        isRecurring: true,
        frequency: 'weekly',
        days: ['Saturday'],
        time: '11:00'
      },
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 1,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'May 3, 2025 10:00',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'May 3, 2025 10:45',
          status: 'pending'
        }]
      }
    },
    {
      id: 'STREAM-3477',
      title: 'Casual Gaming - Trying New Indie Games',
      thumbnail: 'https://example.com/thumbnails/stream3477.jpg',
      streamer: {
        id: '12',
        name: 'Lucas Wright',
        username: '@lucasw',
        avatar: 'https://example.com/avatars/lucas.jpg',
        verified: false,
        followers: 11200
      },
      category: 'gaming',
      tags: ['gaming', 'indie games', 'gameplay', 'casual', 'review'],
      status: 'scheduled',
      scheduledAt: 'May 3, 2025 19:00',
      estimatedDuration: '3h 00m',
      remindersSent: 456,
      interestedCount: 378,
      monetized: true,
      featured: false,
      visibility: 'public',
      description: 'Trying out some new indie game releases! Come hang out and chat while we explore these hidden gems.',
      streamKey: 'sk_1u2v3w4x5y6z7a',
      recurring: {
        isRecurring: false
      },
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 2,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'May 3, 2025 18:00',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'May 3, 2025 18:45',
          status: 'pending'
        }]
      }
    },
    {
      id: 'STREAM-3480',
      title: 'Guided Meditation for Stress Relief',
      thumbnail: 'https://example.com/thumbnails/stream3480.jpg',
      streamer: {
        id: '3',
        name: 'Olivia Davis',
        username: '@oliviad',
        avatar: 'https://example.com/avatars/olivia.jpg',
        verified: true,
        followers: 25600
      },
      category: 'wellness',
      tags: ['meditation', 'mindfulness', 'stress relief', 'wellness', 'mental health'],
      status: 'scheduled',
      scheduledAt: 'Apr 28, 2025 07:30',
      estimatedDuration: '45m',
      remindersSent: 891,
      interestedCount: 742,
      monetized: true,
      featured: false,
      visibility: 'public',
      description: 'Start your week with a calming guided meditation session designed to reduce stress and anxiety.',
      streamKey: 'sk_2v3w4x5y6z7a8b',
      recurring: {
        isRecurring: true,
        frequency: 'weekly',
        days: ['Monday', 'Wednesday', 'Friday'],
        time: '07:30'
      },
      settings: {
        chat: false,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 1,
        autoPublishVOD: true
      },
      reminders: {
        scheduled: [{
          type: 'email',
          sendAt: 'Apr 28, 2025 06:30',
          status: 'pending'
        }, {
          type: 'push',
          sendAt: 'Apr 28, 2025 07:15',
          status: 'pending'
        }]
      }
    }
  ];

  const columns = [
    {
      id: 'schedule',
      header: 'Date & Time',
      accessor: (row: any) => row.scheduledAt,
      sortable: true,
      width: '170px',
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center font-medium text-gray-800">
            <Calendar size={14} className="text-primary-500 mr-1.5" strokeWidth={1.8} />
            {value.split(' ')[0]}
          </div>
          <div className="flex items-center mt-1">
            <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span className="text-sm text-gray-600">{value.split(' ')[1]}</span>
            <span className="ml-2 text-xs text-gray-500">({row.estimatedDuration})</span>
          </div>
          {row.recurring.isRecurring && (
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                <CalendarIcon size={10} className="mr-1" strokeWidth={2} />
                {row.recurring.frequency === 'weekly'
                  ? `Weekly on ${row.recurring.days.join(', ')}`
                  : row.recurring.frequency === 'monthly'
                    ? `Monthly on ${row.recurring.days.join(', ')}`
                    : 'Recurring'}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'stream',
      header: 'Stream',
      accessor: (row: any) => row.title,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-12 h-8 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
            {/* Thumbnail would be here in a real implementation */}
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <Video size={14} className="text-white" />
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-800 line-clamp-1">{value}</p>
            <div className="flex items-center text-xs text-gray-500 mt-0.5">
              <Tag size={10} className="mr-1" />
              <span>{row.category}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'streamer',
      header: 'Streamer',
      accessor: (row: any) => row.streamer.name,
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
              {row.streamer.verified && (
                <CheckCircle size={12} className="ml-1 text-primary-500" strokeWidth={2} />
              )}
            </div>
            <p className="text-xs text-gray-500">{row.streamer.username}</p>
          </div>
        </div>
      )
    },
    {
      id: 'interest',
      header: 'Interest',
      accessor: (row: any) => row.interestedCount,
      sortable: true,
      width: '140px',
      cell: (value: number, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <Bell size={14} className="text-primary-400 mr-1.5" strokeWidth={1.8} />
            <span className="font-medium">{value.toLocaleString()} interested</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MessageSquare size={12} className="mr-1" strokeWidth={1.8} />
            <span>{row.remindersSent.toLocaleString()} reminders sent</span>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      header: 'Settings',
      accessor: (row: any) => row.settings,
      sortable: false,
      width: '100px',
      cell: (value: any, row: any) => (
        <div className="flex flex-col space-y-1">
          {row.monetized && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              <ThumbsUp size={10} className="mr-1" strokeWidth={2} />
              Monetized
            </span>
          )}
          {row.featured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
              <Star size={10} className="mr-1" strokeWidth={2} />
              Featured
            </span>
          )}
          {value.recordAutomatically && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
              <Video size={10} className="mr-1" strokeWidth={2} />
              Auto Record
            </span>
          )}
        </div>
      )
    },
    {
      id: 'reminder',
      header: 'Next Reminder',
      accessor: (row: any) => row.reminders.scheduled[0].sendAt,
      sortable: true,
      width: '170px',
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <Clock size={14} className="text-amber-500 mr-1.5" strokeWidth={1.8} />
            <span className="text-sm">{value.split(' ')[1]}</span>
            <span className="text-sm text-gray-600 ml-1">{value.split(' ')[0]}</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {row.reminders.scheduled[0].type === 'email' ? 'Email' : 'Push Notification'}
            </span>
          </div>
          {row.reminders.scheduled.length > 1 && (
            <div className="text-xs text-gray-500 mt-1">
              +{row.reminders.scheduled.length - 1} more scheduled
            </div>
          )}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => row.id,
      sortable: false,
      width: '160px',
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

          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit stream"
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>

          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Start stream now"
          >
            <Play size={16} strokeWidth={1.8} />
          </motion.button>

          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete stream"
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </motion.button>

          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="More options"
          >
            <MoreHorizontal size={16} strokeWidth={1.8} />
          </motion.button>
        </div>
      )
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredStreams(scheduledStreamsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredStreams(scheduledStreamsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = scheduledStreamsData.filter(stream =>
      stream.title.toLowerCase().includes(lowercasedQuery) ||
      stream.streamer.name.toLowerCase().includes(lowercasedQuery) ||
      stream.streamer.username.toLowerCase().includes(lowercasedQuery) ||
      stream.category.toLowerCase().includes(lowercasedQuery) ||
      (stream.tags && stream.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))) ||
      stream.description.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredStreams(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...scheduledStreamsData];

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(stream => filters.category.includes(stream.category));
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(stream => stream.featured === filters.featured);
    }

    if (filters.monetized !== undefined) {
      filtered = filtered.filter(stream => stream.monetized === filters.monetized);
    }

    if (filters.recurring !== undefined) {
      filtered = filtered.filter(stream => stream.recurring.isRecurring === filters.recurring);
    }

    if (filters.interestedCount && (filters.interestedCount.from !== undefined || filters.interestedCount.to !== undefined)) {
      if (filters.interestedCount.from !== undefined) {
        filtered = filtered.filter(stream => stream.interestedCount >= filters.interestedCount.from);
      }
      if (filters.interestedCount.to !== undefined) {
        filtered = filtered.filter(stream => stream.interestedCount <= filters.interestedCount.to);
      }
    }

    if (filters.scheduledDate && (filters.scheduledDate.from || filters.scheduledDate.to)) {
      // Simple date comparison - in a real app would use proper date objects
      if (filters.scheduledDate.from) {
        filtered = filtered.filter(stream => {
          const month = stream.scheduledAt.split(' ')[0];
          const fromMonth = filters.scheduledDate.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.scheduledDate.to) {
        filtered = filtered.filter(stream => {
          const month = stream.scheduledAt.split(' ')[0];
          const toMonth = filters.scheduledDate.to.split('-')[1];
          return parseInt(getMonthNumber(month)) <= parseInt(toMonth);
        });
      }
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(stream =>
        stream.title.toLowerCase().includes(lowercasedQuery) ||
        stream.streamer.name.toLowerCase().includes(lowercasedQuery) ||
        stream.streamer.username.toLowerCase().includes(lowercasedQuery) ||
        stream.category.toLowerCase().includes(lowercasedQuery) ||
        (stream.tags && stream.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))) ||
        stream.description.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredStreams(filtered);
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
    setFilteredStreams(scheduledStreamsData);
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

  // Stream Stats
  const streamStats = [
    {
      title: 'Total Scheduled',
      value: '10',
      change: '3 today, 7 future dates',
      icon: <Calendar size={20} className="text-primary-500" strokeWidth={1.8} />,
      color: 'primary'
    },
    {
      title: 'Upcoming Next',
      value: 'In 5h 12m',
      change: 'Guided Meditation',
      icon: <Clock size={20} className="text-amber-500" strokeWidth={1.8} />,
      color: 'amber'
    },
    {
      title: 'Recurring Streams',
      value: '5',
      change: '50% of total',
      icon: <CalendarIcon size={20} className="text-primary-500" strokeWidth={1.8} />,
      color: 'primary'
    },
    {
      title: 'Subscriber Reminders',
      value: '6,321',
      change: '+8.2% from last week',
      icon: <Bell size={20} className="text-green-500" strokeWidth={1.8} />,
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
          <h1 className="text-2xl font-semibold text-gray-800">Scheduled Livestreams</h1>
          <p className="text-gray-500 mt-1">Manage upcoming streams and broadcast schedules</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
          >
            <Filter size={16} className="mr-2" strokeWidth={1.8} />
            Calendar View
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
          <motion.button
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ y: 0 }}
          >
            <Plus size={16} className="mr-2" strokeWidth={1.8} />
            Schedule Stream
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
        {streamStats.map((stat, index) => (
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
            placeholder="Search by title, streamer, category or tags..."
            onSearch={handleSearch}
            suggestions={[
              'tech podcast',
              'music',
              '@emmaj',
              'gardening'
            ]}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Stream Filters"
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
          data={filteredStreams}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No scheduled streams found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredStreams.length}
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