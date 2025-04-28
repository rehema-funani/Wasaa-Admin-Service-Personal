import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  Filter,
  Play,
  Pause,
  Clock,
  Eye,
  Users,
  Heart,
  MessageSquare,
  Star,
  MoreHorizontal,
  ChevronRight,
  Video,
  Edit,
  Trash2,
  ShieldAlert,
  ThumbsUp,
  Tag,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

import StatusBadge from '../../../../components/common/StatusBadge';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

const AllLivestreamsPage = () => {
  // States for the page
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredStreams, setFilteredStreams] = useState<any[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'gaming', 'music', 'high viewership'
  ]);

  // Mock data for livestreams
  const allStreamsData = [
    {
      id: 'STREAM-3421',
      title: 'Music & Chill - Friday Night Session',
      thumbnail: 'https://example.com/thumbnails/stream3421.jpg',
      streamer: {
        id: '7',
        name: 'Isabella Brown',
        username: '@isabella',
        avatar: 'https://example.com/avatars/isabella.jpg',
        verified: true,
        followers: 12500
      },
      category: 'music',
      tags: ['music', 'acoustic', 'live performance'],
      status: 'live',
      startTime: 'Apr 25, 2025 19:00',
      endTime: null,
      duration: '3h 45m',
      viewerCount: 1542,
      peakViewers: 1842,
      likes: 876,
      comments: 642,
      shares: 124,
      monetized: true,
      featured: true,
      restricted: false,
      reported: false,
      description: 'Join me for some relaxing acoustic covers and original music!',
      visibility: 'public',
      streamKey: 'sk_1a2b3c4d5e6f7g',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 3
      }
    },
    {
      id: 'STREAM-3426',
      title: 'Gaming Tournament Finals - Watch Now!',
      thumbnail: 'https://example.com/thumbnails/stream3426.jpg',
      streamer: {
        id: '10',
        name: 'Mason Rodriguez',
        username: '@masonr',
        avatar: 'https://example.com/avatars/mason.jpg',
        verified: true,
        followers: 45200
      },
      category: 'gaming',
      tags: ['gaming', 'esports', 'tournament', 'competitive'],
      status: 'live',
      startTime: 'Apr 26, 2025 15:00',
      endTime: null,
      duration: '4h 20m',
      viewerCount: 8742,
      peakViewers: 9156,
      likes: 3254,
      comments: 1876,
      shares: 453,
      monetized: true,
      featured: true,
      restricted: false,
      reported: true,
      description: 'Championship finals! Who will take home the $10,000 prize?',
      visibility: 'public',
      streamKey: 'sk_2b3c4d5e6f7g8h',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 8
      }
    },
    {
      id: 'STREAM-3428',
      title: 'Cooking Class - Italian Pasta from Scratch',
      thumbnail: 'https://example.com/thumbnails/stream3428.jpg',
      streamer: {
        id: '13',
        name: 'Amelia Lopez',
        username: '@amelial',
        avatar: 'https://example.com/avatars/amelia.jpg',
        verified: false,
        followers: 7800
      },
      category: 'food',
      tags: ['cooking', 'food', 'tutorial', 'italian cuisine'],
      status: 'ended',
      startTime: 'Apr 26, 2025 12:00',
      endTime: 'Apr 26, 2025 13:30',
      duration: '1h 30m',
      viewerCount: 0,
      peakViewers: 756,
      likes: 324,
      comments: 218,
      shares: 87,
      monetized: true,
      featured: false,
      restricted: false,
      reported: false,
      description: 'Learn how to make authentic Italian pasta from scratch with simple ingredients!',
      visibility: 'public',
      streamKey: 'sk_3c4d5e6f7g8h9i',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 2
      }
    },
    {
      id: 'STREAM-3430',
      title: 'Art & Drawing - Portrait Techniques',
      thumbnail: 'https://example.com/thumbnails/stream3430.jpg',
      streamer: {
        id: '15',
        name: 'Mia Hernandez',
        username: '@miah',
        avatar: 'https://example.com/avatars/mia.jpg',
        verified: true,
        followers: 18900
      },
      category: 'art',
      tags: ['art', 'drawing', 'tutorial', 'portraits'],
      status: 'ended',
      startTime: 'Apr 25, 2025 14:00',
      endTime: 'Apr 25, 2025 16:15',
      duration: '2h 15m',
      viewerCount: 0,
      peakViewers: 532,
      likes: 278,
      comments: 164,
      shares: 59,
      monetized: true,
      featured: false,
      restricted: false,
      reported: true,
      description: 'Learn my favorite techniques for drawing realistic portraits!',
      visibility: 'public',
      streamKey: 'sk_4d5e6f7g8h9i0j',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 1
      }
    },
    {
      id: 'STREAM-3435',
      title: 'Morning Yoga Flow - Start Your Day Right',
      thumbnail: 'https://example.com/thumbnails/stream3435.jpg',
      streamer: {
        id: '3',
        name: 'Olivia Davis',
        username: '@oliviad',
        avatar: 'https://example.com/avatars/olivia.jpg',
        verified: true,
        followers: 25600
      },
      category: 'fitness',
      tags: ['fitness', 'yoga', 'wellness', 'morning routine'],
      status: 'ended',
      startTime: 'Apr 26, 2025 08:00',
      endTime: 'Apr 26, 2025 09:00',
      duration: '1h 00m',
      viewerCount: 0,
      peakViewers: 423,
      likes: 215,
      comments: 98,
      shares: 43,
      monetized: true,
      featured: false,
      restricted: false,
      reported: true,
      description: 'Start your day with this energizing morning yoga routine suitable for all levels!',
      visibility: 'public',
      streamKey: 'sk_5e6f7g8h9i0j1k',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 1
      }
    },
    {
      id: 'STREAM-3437',
      title: 'Piano Covers - Your Song Requests',
      thumbnail: 'https://example.com/thumbnails/stream3437.jpg',
      streamer: {
        id: '1',
        name: 'Emma Johnson',
        username: '@emmaj',
        avatar: 'https://example.com/avatars/emma.jpg',
        verified: true,
        followers: 32100
      },
      category: 'music',
      tags: ['music', 'piano', 'covers', 'requests'],
      status: 'ended',
      startTime: 'Apr 24, 2025 19:30',
      endTime: 'Apr 24, 2025 22:15',
      duration: '2h 45m',
      viewerCount: 0,
      peakViewers: 1245,
      likes: 652,
      comments: 487,
      shares: 126,
      monetized: true,
      featured: false,
      restricted: false,
      reported: true,
      description: 'Taking your song requests and playing them on piano! Drop your favorites in the chat.',
      visibility: 'public',
      streamKey: 'sk_6f7g8h9i0j1k2l',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 2
      }
    },
    {
      id: 'STREAM-3440',
      title: 'Dance Choreography - Learn the Latest Moves',
      thumbnail: 'https://example.com/thumbnails/stream3440.jpg',
      streamer: {
        id: '5',
        name: 'Ava Thompson',
        username: '@avat',
        avatar: 'https://example.com/avatars/ava.jpg',
        verified: false,
        followers: 9500
      },
      category: 'dance',
      tags: ['dance', 'choreography', 'tutorial', 'fitness'],
      status: 'live',
      startTime: 'Apr 26, 2025 18:00',
      endTime: null,
      duration: '1h 45m',
      viewerCount: 876,
      peakViewers: 876,
      likes: 426,
      comments: 312,
      shares: 98,
      monetized: true,
      featured: false,
      restricted: false,
      reported: true,
      description: 'Learn this week\'s viral dance routine step by step!',
      visibility: 'public',
      streamKey: 'sk_7g8h9i0j1k2l3m',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 2
      }
    },
    {
      id: 'STREAM-3445',
      title: 'Travel Vlog - Exploring Tokyo Streets',
      thumbnail: 'https://example.com/thumbnails/stream3445.jpg',
      streamer: {
        id: '14',
        name: 'Benjamin Young',
        username: '@benjaminy',
        avatar: 'https://example.com/avatars/benjamin.jpg',
        verified: false,
        followers: 15400
      },
      category: 'travel',
      tags: ['travel', 'japan', 'tokyo', 'exploration'],
      status: 'live',
      startTime: 'Apr 27, 2025 09:00',
      endTime: null,
      duration: '3h 15m',
      viewerCount: 965,
      peakViewers: 965,
      likes: 487,
      comments: 354,
      shares: 112,
      monetized: true,
      featured: false,
      restricted: false,
      reported: true,
      description: 'Walking through the streets of Tokyo and exploring hidden gems!',
      visibility: 'public',
      streamKey: 'sk_8h9i0j1k2l3m4n',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 1
      }
    },
    {
      id: 'STREAM-3447',
      title: 'Tech Talk - The Future of AI',
      thumbnail: 'https://example.com/thumbnails/stream3447.jpg',
      streamer: {
        id: '8',
        name: 'Ethan Miller',
        username: '@ethanm',
        avatar: 'https://example.com/avatars/ethan.jpg',
        verified: true,
        followers: 28700
      },
      category: 'technology',
      tags: ['technology', 'artificial intelligence', 'future tech', 'discussion'],
      status: 'live',
      startTime: 'Apr 27, 2025 14:00',
      endTime: null,
      duration: '1h 25m',
      viewerCount: 1356,
      peakViewers: 1356,
      likes: 752,
      comments: 546,
      shares: 231,
      monetized: true,
      featured: true,
      restricted: false,
      reported: false,
      description: 'Discussing the latest advancements in AI and what the future holds for this technology.',
      visibility: 'public',
      streamKey: 'sk_9i0j1k2l3m4n5o',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 3
      }
    },
    {
      id: 'STREAM-3450',
      title: 'Late Night Chat & Music',
      thumbnail: 'https://example.com/thumbnails/stream3450.jpg',
      streamer: {
        id: '6',
        name: 'James Taylor',
        username: '@jamest',
        avatar: 'https://example.com/avatars/james.jpg',
        verified: false,
        followers: 7200
      },
      category: 'just chatting',
      tags: ['chat', 'music', 'conversation', 'late night'],
      status: 'ended',
      startTime: 'Apr 26, 2025 22:00',
      endTime: 'Apr 27, 2025 02:10',
      duration: '4h 10m',
      viewerCount: 0,
      peakViewers: 378,
      likes: 189,
      comments: 245,
      shares: 42,
      monetized: false,
      featured: false,
      restricted: true,
      reported: false,
      description: 'Hanging out, playing some tunes, and chatting with viewers. Come join the conversation!',
      visibility: 'public',
      streamKey: 'sk_0j1k2l3m4n5o6p',
      settings: {
        chat: true,
        donations: true,
        subscriptions: false,
        recordAutomatically: false,
        lowLatencyMode: false,
        moderators: 1
      }
    },
    {
      id: 'STREAM-3452',
      title: 'Investment Strategies for 2025',
      thumbnail: 'https://example.com/thumbnails/stream3452.jpg',
      streamer: {
        id: '9',
        name: 'Sophia Garcia',
        username: '@sophiag',
        avatar: 'https://example.com/avatars/sophia.jpg',
        verified: true,
        followers: 19800
      },
      category: 'finance',
      tags: ['finance', 'investing', 'money', 'stocks'],
      status: 'ended',
      startTime: 'Apr 25, 2025 16:00',
      endTime: 'Apr 25, 2025 18:30',
      duration: '2h 30m',
      viewerCount: 0,
      peakViewers: 2134,
      likes: 976,
      comments: 654,
      shares: 318,
      monetized: true,
      featured: false,
      restricted: false,
      reported: true,
      description: 'Discussing smart investment strategies for the current economy and market trends.',
      visibility: 'public',
      streamKey: 'sk_1k2l3m4n5o6p7q',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 2
      }
    },
    {
      id: 'STREAM-3455',
      title: 'Horror Game Playthrough - Late Night Edition',
      thumbnail: 'https://example.com/thumbnails/stream3455.jpg',
      streamer: {
        id: '12',
        name: 'Lucas Wright',
        username: '@lucasw',
        avatar: 'https://example.com/avatars/lucas.jpg',
        verified: false,
        followers: 11200
      },
      category: 'gaming',
      tags: ['gaming', 'horror', 'playthrough', 'late night'],
      status: 'ended',
      startTime: 'Apr 26, 2025 23:00',
      endTime: 'Apr 27, 2025 02:45',
      duration: '3h 45m',
      viewerCount: 0,
      peakViewers: 1265,
      likes: 687,
      comments: 523,
      shares: 154,
      monetized: true,
      featured: false,
      restricted: true,
      reported: false,
      description: 'Playing through the newest survival horror game with all lights off! Not for the faint of heart.',
      visibility: 'public',
      streamKey: 'sk_2l3m4n5o6p7q8r',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 2
      }
    },
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
      startTime: 'Apr 28, 2025 18:00',
      endTime: null,
      duration: '0m',
      viewerCount: 0,
      peakViewers: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      monetized: true,
      featured: false,
      restricted: false,
      reported: false,
      description: 'Join me for our weekly tech news roundup where we discuss the biggest stories in technology.',
      visibility: 'public',
      streamKey: 'sk_3m4n5o6p7q8r9s',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 2
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
      startTime: 'Apr 29, 2025 10:00',
      endTime: null,
      duration: '0m',
      viewerCount: 0,
      peakViewers: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      monetized: true,
      featured: false,
      restricted: false,
      reported: false,
      description: 'I\'ll be sharing my favorite gardening tips for spring planting success!',
      visibility: 'public',
      streamKey: 'sk_4n5o6p7q8r9s0t',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: false,
        moderators: 1
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
      startTime: 'Apr 28, 2025 15:30',
      endTime: null,
      duration: '0m',
      viewerCount: 0,
      peakViewers: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      monetized: true,
      featured: false,
      restricted: false,
      reported: false,
      description: 'Live MMA training session with tips and techniques for beginners and advanced practitioners.',
      visibility: 'public',
      streamKey: 'sk_5o6p7q8r9s0t1u',
      settings: {
        chat: true,
        donations: true,
        subscriptions: true,
        recordAutomatically: true,
        lowLatencyMode: true,
        moderators: 2
      }
    }
  ];

  // Define filter options
  const filterOptions = [
    {
      id: 'status',
      label: 'Stream Status',
      type: 'multiselect' as const,
      options: [
        { value: 'live', label: 'Live Now' },
        { value: 'ended', label: 'Ended' },
        { value: 'scheduled', label: 'Scheduled' }
      ]
    },
    {
      id: 'category',
      label: 'Category',
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
        { value: 'finance', label: 'Finance' },
        { value: 'sports', label: 'Sports' },
        { value: 'lifestyle', label: 'Lifestyle' }
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
      id: 'featured',
      label: 'Featured',
      type: 'boolean' as const
    },
    {
      id: 'reported',
      label: 'Reported',
      type: 'boolean' as const
    },
    {
      id: 'restricted',
      label: 'Age Restricted',
      type: 'boolean' as const
    },
    {
      id: 'monetized',
      label: 'Monetized',
      type: 'boolean' as const
    },
    {
      id: 'streamDate',
      label: 'Stream Date',
      type: 'daterange' as const
    }
  ];

  // DataTable columns configuration
  const columns = [
    {
      id: 'status',
      header: 'Status',
      accessor: (row: any) => row.status,
      sortable: true,
      width: '100px',
      cell: (value: string) => {
        const statusConfig = {
          'live': { color: 'red', label: 'Live Now', icon: <Play size={12} className="mr-1" /> },
          'ended': { color: 'gray', label: 'Ended', icon: <CheckCircle size={12} className="mr-1" /> },
          'scheduled': { color: 'blue', label: 'Scheduled', icon: <Calendar size={12} className="mr-1" /> }
        };

        const config = statusConfig[value as keyof typeof statusConfig];

        return (
          <div className={`
            flex items-center px-2 py-1 text-xs font-medium rounded-full
            ${value === 'live' ? 'bg-red-100 text-red-700' :
              value === 'ended' ? 'bg-gray-100 text-gray-700' :
                'bg-blue-100 text-blue-700'}
          `}>
            {config.icon}
            {config.label}
          </div>
        );
      }
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
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
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
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-medium text-xs mr-2">
            {value.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center">
              <p className="font-medium text-gray-800">{value}</p>
              {row.streamer.verified && (
                <CheckCircle size={12} className="ml-1 text-blue-500" strokeWidth={2} />
              )}
            </div>
            <p className="text-xs text-gray-500">{row.streamer.username}</p>
          </div>
        </div>
      )
    },
    {
      id: 'viewership',
      header: 'Viewership',
      accessor: (row: any) => row.viewerCount || row.peakViewers,
      sortable: true,
      width: '140px',
      cell: (value: number, row: any) => (
        <div className="flex flex-col">
          {row.status === 'live' ? (
            <div className="flex items-center text-red-600 font-medium">
              <Users size={14} className="mr-1.5" strokeWidth={1.8} />
              {row.viewerCount.toLocaleString()} watching
            </div>
          ) : (
            <div className="flex items-center text-gray-700">
              <Eye size={14} className="mr-1.5" strokeWidth={1.8} />
              {row.peakViewers.toLocaleString()} peak viewers
            </div>
          )}
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Heart size={12} className="mr-1" strokeWidth={1.8} />
            {row.likes.toLocaleString()} likes
          </div>
        </div>
      )
    },
    {
      id: 'engagement',
      header: 'Engagement',
      accessor: (row: any) => row.comments,
      sortable: true,
      width: '160px',
      cell: (value: number, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <MessageSquare size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span>{value.toLocaleString()} comments</span>
          </div>
          <div className="flex items-center mt-1">
            <ChevronRight size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span className="text-sm text-gray-600">{row.shares.toLocaleString()} shares</span>
          </div>
        </div>
      )
    },
    {
      id: 'time',
      header: 'Time',
      accessor: (row: any) => row.startTime,
      sortable: true,
      width: '200px',
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <Calendar size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span>{value.split(' ')[0]}</span>
          </div>
          <div className="flex items-center mt-1">
            <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span className="text-sm text-gray-600">{value.split(' ')[1]}</span>
            {row.status !== 'scheduled' && (
              <span className="ml-1 text-sm text-gray-600">• {row.duration}</span>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'flags',
      header: 'Flags',
      accessor: (row: any) => row.featured,
      sortable: true,
      width: '120px',
      cell: (value: boolean, row: any) => (
        <div className="flex flex-col space-y-1">
          {row.featured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
              <Star size={10} className="mr-1" strokeWidth={2} />
              Featured
            </span>
          )}
          {row.reported && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              <AlertTriangle size={10} className="mr-1" strokeWidth={2} />
              Reported
            </span>
          )}
          {row.restricted && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
              <ShieldAlert size={10} className="mr-1" strokeWidth={2} />
              Restricted
            </span>
          )}
          {row.monetized && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              <ThumbsUp size={10} className="mr-1" strokeWidth={2} />
              Monetized
            </span>
          )}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => row.id,
      sortable: false,
      width: '120px',
      cell: (value: string, row: any) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View stream details"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>

          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit stream"
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>

          {row.status === 'live' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="End stream"
            >
              <Pause size={16} strokeWidth={1.8} />
            </motion.button>
          )}

          {row.status !== 'live' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Delete stream"
            >
              <Trash2 size={16} strokeWidth={1.8} />
            </motion.button>
          )}

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
      setFilteredStreams(allStreamsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredStreams(allStreamsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = allStreamsData.filter(stream =>
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

    let filtered = [...allStreamsData];

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(stream => filters.status.includes(stream.status));
    }

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(stream => filters.category.includes(stream.category));
    }

    if (filters.viewerCount && (filters.viewerCount.from !== undefined || filters.viewerCount.to !== undefined)) {
      if (filters.viewerCount.from !== undefined) {
        filtered = filtered.filter(stream =>
          (stream.status === 'live' ? stream.viewerCount : stream.peakViewers) >= filters.viewerCount.from
        );
      }
      if (filters.viewerCount.to !== undefined) {
        filtered = filtered.filter(stream =>
          (stream.status === 'live' ? stream.viewerCount : stream.peakViewers) <= filters.viewerCount.to
        );
      }
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(stream => stream.featured === filters.featured);
    }

    if (filters.reported !== undefined) {
      filtered = filtered.filter(stream => stream.reported === filters.reported);
    }

    if (filters.restricted !== undefined) {
      filtered = filtered.filter(stream => stream.restricted === filters.restricted);
    }

    if (filters.monetized !== undefined) {
      filtered = filtered.filter(stream => stream.monetized === filters.monetized);
    }

    if (filters.streamDate && (filters.streamDate.from || filters.streamDate.to)) {
      // Simple date comparison - in a real app would use proper date objects
      if (filters.streamDate.from) {
        filtered = filtered.filter(stream => {
          const month = stream.startTime.split(' ')[0];
          const fromMonth = filters.streamDate.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.streamDate.to) {
        filtered = filtered.filter(stream => {
          const month = stream.startTime.split(' ')[0];
          const toMonth = filters.streamDate.to.split('-')[1];
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
    setFilteredStreams(allStreamsData);
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
      title: 'Live Now',
      value: '5',
      change: '+2 from yesterday',
      icon: <Play size={20} className="text-red-500" strokeWidth={1.8} />,
      color: 'red'
    },
    {
      title: 'Total Viewers',
      value: '13,481',
      change: '+5,623 watching now',
      icon: <Users size={20} className="text-blue-500" strokeWidth={1.8} />,
      color: 'blue'
    },
    {
      title: 'Scheduled',
      value: '3',
      change: 'Next: 6h 23m',
      icon: <Calendar size={20} className="text-indigo-500" strokeWidth={1.8} />,
      color: 'indigo'
    },
    {
      title: 'Engagement',
      value: '87.3%',
      change: '+4.2% from last week',
      icon: <BarChart3 size={20} className="text-green-500" strokeWidth={1.8} />,
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
          <h1 className="text-2xl font-semibold text-gray-800">All Livestreams</h1>
          <p className="text-gray-500 mt-1">View and manage all livestreams on the platform</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
          >
            <Filter size={16} className="mr-2" strokeWidth={1.8} />
            Advanced Filters
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
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ y: 0 }}
          >
            <Play size={16} className="mr-2" strokeWidth={1.8} />
            New Livestream
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
              'gaming',
              'music',
              '@emmaj',
              'cooking'
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
          emptyMessage="No streams found. Try adjusting your filters or search terms."
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

export default AllLivestreamsPage;