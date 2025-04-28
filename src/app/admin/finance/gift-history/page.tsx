import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Calendar,
  Gift,
  Video,
  Clock,
  Heart,
  DollarSign,
  Award,
  Zap,
  Sparkles,
  Crown,
  Diamond,
  Eye
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
  const [filteredGifts, setFilteredGifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'diamond', 'high value', 'emma johnson'
  ]);

  // Gifts data
  const giftsData = [
    {
      id: 'GIFT-7001',
      sender: {
        id: '1',
        name: 'Emma Johnson',
        username: '@emmaj',
        avatar: 'https://example.com/avatars/emma.jpg'
      },
      recipient: {
        id: '7',
        name: 'Isabella Brown',
        username: '@isabella',
        avatar: 'https://example.com/avatars/isabella.jpg'
      },
      stream: {
        id: 'STREAM-3421',
        title: 'Music & Chill - Friday Night Session',
        startTime: 'Apr 25, 2025 19:00'
      },
      gift: {
        id: 'GIFTTYPE-42',
        name: 'Diamond Crown',
        category: 'premium',
        icon: 'crown',
        animation: 'sparkle_rotating',
        value: 1000
      },
      quantity: 5,
      totalValue: 5000,
      currency: 'coins',
      timestamp: 'Apr 25, 2025 20:32:15',
      message: 'Amazing performance! You rock! 🎵',
      reactionCount: 52,
      status: 'completed'
    },
    {
      id: 'GIFT-7002',
      sender: {
        id: '3',
        name: 'Olivia Davis',
        username: '@oliviad',
        avatar: 'https://example.com/avatars/olivia.jpg'
      },
      recipient: {
        id: '10',
        name: 'Mason Rodriguez',
        username: '@masonr',
        avatar: 'https://example.com/avatars/mason.jpg'
      },
      stream: {
        id: 'STREAM-3426',
        title: 'Gaming Tournament Finals - Watch Now!',
        startTime: 'Apr 26, 2025 15:00'
      },
      gift: {
        id: 'GIFTTYPE-31',
        name: 'Trophy',
        category: 'standard',
        icon: 'trophy',
        animation: 'rising_shine',
        value: 200
      },
      quantity: 2,
      totalValue: 400,
      currency: 'coins',
      timestamp: 'Apr 26, 2025 16:45:22',
      message: 'Great moves!',
      reactionCount: 18,
      status: 'completed'
    },
    {
      id: 'GIFT-7003',
      sender: {
        id: '5',
        name: 'Ava Thompson',
        username: '@avat',
        avatar: 'https://example.com/avatars/ava.jpg'
      },
      recipient: {
        id: '13',
        name: 'Amelia Lopez',
        username: '@amelial',
        avatar: 'https://example.com/avatars/amelia.jpg'
      },
      stream: {
        id: 'STREAM-3428',
        title: 'Cooking Class - Italian Pasta from Scratch',
        startTime: 'Apr 26, 2025 12:00'
      },
      gift: {
        id: 'GIFTTYPE-25',
        name: 'Chef Hat',
        category: 'themed',
        icon: 'chef_hat',
        animation: 'bounce',
        value: 150
      },
      quantity: 3,
      totalValue: 450,
      currency: 'coins',
      timestamp: 'Apr 26, 2025 12:37:41',
      message: 'That carbonara looks amazing!',
      reactionCount: 27,
      status: 'completed'
    },
    {
      id: 'GIFT-7004',
      sender: {
        id: '10',
        name: 'Mason Rodriguez',
        username: '@masonr',
        avatar: 'https://example.com/avatars/mason.jpg'
      },
      recipient: {
        id: '15',
        name: 'Mia Hernandez',
        username: '@miah',
        avatar: 'https://example.com/avatars/mia.jpg'
      },
      stream: {
        id: 'STREAM-3430',
        title: 'Art & Drawing - Portrait Techniques',
        startTime: 'Apr 25, 2025 14:00'
      },
      gift: {
        id: 'GIFTTYPE-38',
        name: 'Palette',
        category: 'themed',
        icon: 'palette',
        animation: 'color_burst',
        value: 100
      },
      quantity: 5,
      totalValue: 500,
      currency: 'coins',
      timestamp: 'Apr 25, 2025 15:22:03',
      message: 'Your shading technique is incredible!',
      reactionCount: 32,
      status: 'completed'
    },
    {
      id: 'GIFT-7005',
      sender: {
        id: '8',
        name: 'Ethan Miller',
        username: '@ethanm',
        avatar: 'https://example.com/avatars/ethan.jpg'
      },
      recipient: {
        id: '3',
        name: 'Olivia Davis',
        username: '@oliviad',
        avatar: 'https://example.com/avatars/olivia.jpg'
      },
      stream: {
        id: 'STREAM-3435',
        title: 'Morning Yoga Flow - Start Your Day Right',
        startTime: 'Apr 26, 2025 08:00'
      },
      gift: {
        id: 'GIFTTYPE-29',
        name: 'Namaste Hands',
        category: 'themed',
        icon: 'namaste',
        animation: 'gentle_glow',
        value: 75
      },
      quantity: 4,
      totalValue: 300,
      currency: 'coins',
      timestamp: 'Apr 26, 2025 08:47:12',
      message: 'That flow was so peaceful!',
      reactionCount: 16,
      status: 'completed'
    },
    {
      id: 'GIFT-7006',
      sender: {
        id: '13',
        name: 'Amelia Lopez',
        username: '@amelial',
        avatar: 'https://example.com/avatars/amelia.jpg'
      },
      recipient: {
        id: '1',
        name: 'Emma Johnson',
        username: '@emmaj',
        avatar: 'https://example.com/avatars/emma.jpg'
      },
      stream: {
        id: 'STREAM-3437',
        title: 'Piano Covers - Your Song Requests',
        startTime: 'Apr 24, 2025 19:30'
      },
      gift: {
        id: 'GIFTTYPE-46',
        name: 'Grand Piano',
        category: 'premium',
        icon: 'piano',
        animation: 'music_notes',
        value: 500
      },
      quantity: 2,
      totalValue: 1000,
      currency: 'coins',
      timestamp: 'Apr 24, 2025 20:14:37',
      message: 'Beautiful rendition of Moonlight Sonata!',
      reactionCount: 45,
      status: 'completed'
    },
    {
      id: 'GIFT-7007',
      sender: {
        id: '11',
        name: 'Charlotte Lee',
        username: '@charlottel',
        avatar: 'https://example.com/avatars/charlotte.jpg'
      },
      recipient: {
        id: '7',
        name: 'Isabella Brown',
        username: '@isabella',
        avatar: 'https://example.com/avatars/isabella.jpg'
      },
      stream: {
        id: 'STREAM-3421',
        title: 'Music & Chill - Friday Night Session',
        startTime: 'Apr 25, 2025 19:00'
      },
      gift: {
        id: 'GIFTTYPE-51',
        name: 'Diamond Heart',
        category: 'premium',
        icon: 'diamond_heart',
        animation: 'sparkle_explosion',
        value: 2000
      },
      quantity: 1,
      totalValue: 2000,
      currency: 'coins',
      timestamp: 'Apr 25, 2025 21:02:53',
      message: 'Your voice is incredible! ❤️',
      reactionCount: 87,
      status: 'completed'
    },
    {
      id: 'GIFT-7008',
      sender: {
        id: '4',
        name: 'Noah Martinez',
        username: '@noahm',
        avatar: 'https://example.com/avatars/noah.jpg'
      },
      recipient: {
        id: '10',
        name: 'Mason Rodriguez',
        username: '@masonr',
        avatar: 'https://example.com/avatars/mason.jpg'
      },
      stream: {
        id: 'STREAM-3426',
        title: 'Gaming Tournament Finals - Watch Now!',
        startTime: 'Apr 26, 2025 15:00'
      },
      gift: {
        id: 'GIFTTYPE-35',
        name: 'Power-Up',
        category: 'themed',
        icon: 'power_up',
        animation: 'energy_burst',
        value: 50
      },
      quantity: 10,
      totalValue: 500,
      currency: 'coins',
      timestamp: 'Apr 26, 2025 17:15:42',
      message: 'Clutch play!',
      reactionCount: 23,
      status: 'completed'
    },
    {
      id: 'GIFT-7009',
      sender: {
        id: '2',
        name: 'Liam Wilson',
        username: '@liamw',
        avatar: 'https://example.com/avatars/liam.jpg'
      },
      recipient: {
        id: '15',
        name: 'Mia Hernandez',
        username: '@miah',
        avatar: 'https://example.com/avatars/mia.jpg'
      },
      stream: {
        id: 'STREAM-3430',
        title: 'Art & Drawing - Portrait Techniques',
        startTime: 'Apr 25, 2025 14:00'
      },
      gift: {
        id: 'GIFTTYPE-40',
        name: 'Gold Paintbrush',
        category: 'premium',
        icon: 'paintbrush',
        animation: 'rainbow_stroke',
        value: 300
      },
      quantity: 3,
      totalValue: 900,
      currency: 'coins',
      timestamp: 'Apr 25, 2025 15:54:12',
      message: 'Your art style is so unique!',
      reactionCount: 41,
      status: 'completed'
    },
    {
      id: 'GIFT-7010',
      sender: {
        id: '9',
        name: 'Sophia Garcia',
        username: '@sophiag',
        avatar: 'https://example.com/avatars/sophia.jpg'
      },
      recipient: {
        id: '5',
        name: 'Ava Thompson',
        username: '@avat',
        avatar: 'https://example.com/avatars/ava.jpg'
      },
      stream: {
        id: 'STREAM-3440',
        title: 'Dance Choreography - Learn the Latest Moves',
        startTime: 'Apr 26, 2025 18:00'
      },
      gift: {
        id: 'GIFTTYPE-33',
        name: 'Disco Ball',
        category: 'themed',
        icon: 'disco_ball',
        animation: 'spin_glitter',
        value: 150
      },
      quantity: 4,
      totalValue: 600,
      currency: 'coins',
      timestamp: 'Apr 26, 2025 19:23:46',
      message: 'Those moves are fire! 🔥',
      reactionCount: 36,
      status: 'completed'
    },
    {
      id: 'GIFT-7011',
      sender: {
        id: '6',
        name: 'James Taylor',
        username: '@jamest',
        avatar: 'https://example.com/avatars/james.jpg'
      },
      recipient: {
        id: '13',
        name: 'Amelia Lopez',
        username: '@amelial',
        avatar: 'https://example.com/avatars/amelia.jpg'
      },
      stream: {
        id: 'STREAM-3428',
        title: 'Cooking Class - Italian Pasta from Scratch',
        startTime: 'Apr 26, 2025 12:00'
      },
      gift: {
        id: 'GIFTTYPE-27',
        name: 'Golden Spatula',
        category: 'premium',
        icon: 'spatula',
        animation: 'golden_shimmer',
        value: 250
      },
      quantity: 2,
      totalValue: 500,
      currency: 'coins',
      timestamp: 'Apr 26, 2025 13:05:21',
      message: 'Taking notes for dinner tonight!',
      reactionCount: 19,
      status: 'completed'
    },
    {
      id: 'GIFT-7012',
      sender: {
        id: '15',
        name: 'Mia Hernandez',
        username: '@miah',
        avatar: 'https://example.com/avatars/mia.jpg'
      },
      recipient: {
        id: '7',
        name: 'Isabella Brown',
        username: '@isabella',
        avatar: 'https://example.com/avatars/isabella.jpg'
      },
      stream: {
        id: 'STREAM-3421',
        title: 'Music & Chill - Friday Night Session',
        startTime: 'Apr 25, 2025 19:00'
      },
      gift: {
        id: 'GIFTTYPE-44',
        name: 'Virtual Concert',
        category: 'premium',
        icon: 'microphone_stage',
        animation: 'audience_cheers',
        value: 1500
      },
      quantity: 1,
      totalValue: 1500,
      currency: 'coins',
      timestamp: 'Apr 25, 2025 21:47:32',
      message: 'Your original songs are the best! ⭐',
      reactionCount: 73,
      status: 'completed'
    },
    {
      id: 'GIFT-7013',
      sender: {
        id: '1',
        name: 'Emma Johnson',
        username: '@emmaj',
        avatar: 'https://example.com/avatars/emma.jpg'
      },
      recipient: {
        id: '14',
        name: 'Benjamin Young',
        username: '@benjaminy',
        avatar: 'https://example.com/avatars/benjamin.jpg'
      },
      stream: {
        id: 'STREAM-3445',
        title: 'Travel Vlog - Exploring Tokyo Streets',
        startTime: 'Apr 27, 2025 09:00'
      },
      gift: {
        id: 'GIFTTYPE-37',
        name: 'Airplane',
        category: 'themed',
        icon: 'airplane',
        animation: 'flying_loop',
        value: 100
      },
      quantity: 5,
      totalValue: 500,
      currency: 'coins',
      timestamp: 'Apr 27, 2025 09:32:17',
      message: 'This tour is amazing! Making me want to visit!',
      reactionCount: 29,
      status: 'processing'
    },
    {
      id: 'GIFT-7014',
      sender: {
        id: '12',
        name: 'Lucas Wright',
        username: '@lucasw',
        avatar: 'https://example.com/avatars/lucas.jpg'
      },
      recipient: {
        id: '3',
        name: 'Olivia Davis',
        username: '@oliviad',
        avatar: 'https://example.com/avatars/olivia.jpg'
      },
      stream: {
        id: 'STREAM-3435',
        title: 'Morning Yoga Flow - Start Your Day Right',
        startTime: 'Apr 26, 2025 08:00'
      },
      gift: {
        id: 'GIFTTYPE-30',
        name: 'Zen Garden',
        category: 'premium',
        icon: 'zen_garden',
        animation: 'peaceful_ripple',
        value: 400
      },
      quantity: 1,
      totalValue: 400,
      currency: 'coins',
      timestamp: 'Apr 26, 2025 08:52:39',
      message: 'Thanks for the calming start to my day!',
      reactionCount: 25,
      status: 'completed'
    },
    {
      id: 'GIFT-7015',
      sender: {
        id: '3',
        name: 'Olivia Davis',
        username: '@oliviad',
        avatar: 'https://example.com/avatars/olivia.jpg'
      },
      recipient: {
        id: '8',
        name: 'Ethan Miller',
        username: '@ethanm',
        avatar: 'https://example.com/avatars/ethan.jpg'
      },
      stream: {
        id: 'STREAM-3447',
        title: 'Tech Talk - The Future of AI',
        startTime: 'Apr 27, 2025 14:00'
      },
      gift: {
        id: 'GIFTTYPE-39',
        name: 'Robot Friend',
        category: 'themed',
        icon: 'robot',
        animation: 'blinking_lights',
        value: 200
      },
      quantity: 2,
      totalValue: 400,
      currency: 'coins',
      timestamp: 'Apr 27, 2025 14:30:51',
      message: 'Great insights on machine learning!',
      reactionCount: 31,
      status: 'processing'
    }
  ];

  // const filterOptions = [
  //   {
  //     id: 'giftCategory',
  //     label: 'Gift Category',
  //     type: 'multiselect' as const,
  //     options: [
  //       { value: 'premium', label: 'Premium' },
  //       { value: 'standard', label: 'Standard' },
  //       { value: 'themed', label: 'Themed' }
  //     ]
  //   },
  //   {
  //     id: 'giftValue',
  //     label: 'Gift Value',
  //     type: 'range' as const,
  //     min: 0,
  //     max: 2000,
  //     step: 100
  //   },
  //   {
  //     id: 'dateRange',
  //     label: 'Date',
  //     type: 'daterange' as const
  //   },
  //   {
  //     id: 'totalValue',
  //     label: 'Total Value',
  //     type: 'range' as const,
  //     min: 0,
  //     max: 5000,
  //     step: 500
  //   },
  //   {
  //     id: 'reactionCount',
  //     label: 'Reaction Count',
  //     type: 'range' as const,
  //     min: 0,
  //     max: 100,
  //     step: 10
  //   },
  //   {
  //     id: 'status',
  //     label: 'Status',
  //     type: 'select' as const,
  //     options: [
  //       { value: 'completed', label: 'Completed' },
  //       { value: 'processing', label: 'Processing' },
  //       { value: 'failed', label: 'Failed' },
  //       { value: 'refunded', label: 'Refunded' }
  //     ]
  //   }
  // ];

  const getGiftIcon = (icon: string) => {
    switch (icon) {
      case 'crown':
        return <Crown size={16} className="text-yellow-500" strokeWidth={1.8} />;
      case 'trophy':
        return <Award size={16} className="text-yellow-500" strokeWidth={1.8} />;
      case 'chef_hat':
        return <Gift size={16} className="text-blue-500" strokeWidth={1.8} />;
      case 'palette':
        return <Sparkles size={16} className="text-purple-500" strokeWidth={1.8} />;
      case 'namaste':
        return <Heart size={16} className="text-pink-500" strokeWidth={1.8} />;
      case 'piano':
        return <Gift size={16} className="text-indigo-500" strokeWidth={1.8} />;
      case 'diamond_heart':
        return <Diamond size={16} className="text-red-500" strokeWidth={1.8} />;
      case 'power_up':
        return <Zap size={16} className="text-yellow-500" strokeWidth={1.8} />;
      case 'paintbrush':
        return <Gift size={16} className="text-green-500" strokeWidth={1.8} />;
      case 'disco_ball':
        return <Sparkles size={16} className="text-purple-500" strokeWidth={1.8} />;
      case 'spatula':
        return <Gift size={16} className="text-orange-500" strokeWidth={1.8} />;
      case 'microphone_stage':
        return <Gift size={16} className="text-blue-500" strokeWidth={1.8} />;
      case 'airplane':
        return <Gift size={16} className="text-blue-500" strokeWidth={1.8} />;
      case 'zen_garden':
        return <Gift size={16} className="text-green-500" strokeWidth={1.8} />;
      case 'robot':
        return <Gift size={16} className="text-gray-500" strokeWidth={1.8} />;
      default:
        return <Gift size={16} className="text-gray-500" strokeWidth={1.8} />;
    }
  };

  // Category colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'premium':
        return 'bg-purple-100 text-purple-700';
      case 'standard':
        return 'bg-blue-100 text-blue-700';
      case 'themed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const columns = [
    {
      id: 'id',
      header: 'Gift ID',
      accessor: (row: any) => row.id,
      sortable: true,
      width: '120px',
      cell: (value: string) => (
        <span className="font-medium text-gray-800">{value}</span>
      )
    },
    {
      id: 'gift',
      header: 'Gift',
      accessor: (row: any) => row.gift.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center mr-3">
            {getGiftIcon(row.gift.icon)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <div className="flex items-center mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-md capitalize ${getCategoryColor(row.gift.category)}`}>
                {row.gift.category}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                x{row.quantity}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'users',
      header: 'Users',
      accessor: (row: any) => `${row.sender.name}-${row.recipient.name}`,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-medium text-xs mr-2">
              {row.sender.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-gray-800">{row.sender.name}</p>
              <p className="text-xs text-gray-500">{row.sender.username}</p>
            </div>
          </div>
          <div className="flex items-center mt-1 ml-3">
            <Heart size={12} className="text-pink-500 mr-1" />
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-medium text-xs mr-2">
              {row.recipient.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-gray-800">{row.recipient.name}</p>
              <p className="text-xs text-gray-500">{row.recipient.username}</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'stream',
      header: 'Stream',
      accessor: (row: any) => row.stream.title,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <Video size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <p className="text-sm font-medium text-gray-800 line-clamp-1">{value}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-5">{row.stream.startTime}</p>
        </div>
      )
    },
    {
      id: 'value',
      header: 'Value',
      accessor: (row: any) => row.totalValue,
      sortable: true,
      width: '120px',
      cell: (value: number, row: any) => (
        <div className="flex flex-col">
          <div className="font-medium text-gray-800">
            {value} <span className="text-xs text-gray-500">{row.currency}</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {row.gift.value} per gift
          </div>
        </div>
      )
    },
    {
      id: 'reactions',
      header: 'Reactions',
      accessor: (row: any) => row.reactionCount,
      sortable: true,
      width: '100px',
      cell: (value: number) => (
        <div className="flex items-center">
          <Heart size={14} className="text-pink-500 mr-1.5" strokeWidth={1.8} />
          <span className={`
            px-2 py-1 rounded-md text-xs font-medium
            ${value > 50
              ? 'bg-pink-100 text-pink-700'
              : value > 20
                ? 'bg-blue-50 text-blue-700'
                : 'bg-gray-100 text-gray-700'}
          `}>
            {value}
          </span>
        </div>
      )
    },
    {
      id: 'timestamp',
      header: 'Timestamp',
      accessor: (row: any) => row.timestamp,
      sortable: true,
      width: '150px',
      cell: (value: string) => (
        <div className="flex items-center">
          <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span className="text-sm text-gray-600">{value}</span>
        </div>
      )
    },
    {
      id: 'message',
      header: 'Message',
      accessor: (row: any) => row.message,
      sortable: true,
      cell: (value: string) => (
        <div className="flex items-start max-w-xs">
          <span className="text-sm text-gray-600 line-clamp-2">{value}</span>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: any) => row.status,
      sortable: true,
      width: '120px',
      cell: (value: string) => {
        const statusConfig: Record<string, any> = {
          'completed': { color: 'green', label: 'Completed' },
          'processing': { color: 'blue', label: 'Processing' },
          'failed': { color: 'red', label: 'Failed' },
          'refunded': { color: 'yellow', label: 'Refunded' }
        };

        return (
          <StatusBadge
            status={value as any}
            size="sm"
            withIcon
            withDot={value === 'completed'}
            className={`text-${statusConfig[value]?.color}-500`}              
          />
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => row.id,
      sortable: false,
      width: '80px',
      cell: (value: string) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View gift details"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
        </div>
      )
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredGifts(giftsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredGifts(giftsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = giftsData.filter(gift =>
      gift.id.toLowerCase().includes(lowercasedQuery) ||
      gift.sender.name.toLowerCase().includes(lowercasedQuery) ||
      gift.sender.username.toLowerCase().includes(lowercasedQuery) ||
      gift.recipient.name.toLowerCase().includes(lowercasedQuery) ||
      gift.recipient.username.toLowerCase().includes(lowercasedQuery) ||
      gift.stream.title.toLowerCase().includes(lowercasedQuery) ||
      gift.gift.name.toLowerCase().includes(lowercasedQuery) ||
      gift.message.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredGifts(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...giftsData];

    if (filters.giftCategory && filters.giftCategory.length > 0) {
      filtered = filtered.filter(gift => filters.giftCategory.includes(gift.gift.category));
    }

    if (filters.status) {
      filtered = filtered.filter(gift => gift.status === filters.status);
    }

    if (filters.giftValue && (filters.giftValue.from !== undefined || filters.giftValue.to !== undefined)) {
      if (filters.giftValue.from !== undefined) {
        filtered = filtered.filter(gift => gift.gift.value >= filters.giftValue.from);
      }
      if (filters.giftValue.to !== undefined) {
        filtered = filtered.filter(gift => gift.gift.value <= filters.giftValue.to);
      }
    }

    if (filters.totalValue && (filters.totalValue.from !== undefined || filters.totalValue.to !== undefined)) {
      if (filters.totalValue.from !== undefined) {
        filtered = filtered.filter(gift => gift.totalValue >= filters.totalValue.from);
      }
      if (filters.totalValue.to !== undefined) {
        filtered = filtered.filter(gift => gift.totalValue <= filters.totalValue.to);
      }
    }

    if (filters.reactionCount && (filters.reactionCount.from !== undefined || filters.reactionCount.to !== undefined)) {
      if (filters.reactionCount.from !== undefined) {
        filtered = filtered.filter(gift => gift.reactionCount >= filters.reactionCount.from);
      }
      if (filters.reactionCount.to !== undefined) {
        filtered = filtered.filter(gift => gift.reactionCount <= filters.reactionCount.to);
      }
    }

    if (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) {
      // Simple date comparison - in a real app would use proper date objects
      if (filters.dateRange.from) {
        filtered = filtered.filter(gift => {
          const month = gift.timestamp.split(' ')[0];
          const fromMonth = filters.dateRange.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.dateRange.to) {
        filtered = filtered.filter(gift => {
          const month = gift.timestamp.split(' ')[0];
          const toMonth = filters.dateRange.to.split('-')[1];
          return parseInt(getMonthNumber(month)) <= parseInt(toMonth);
        });
      }
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(gift =>
        gift.id.toLowerCase().includes(lowercasedQuery) ||
        gift.sender.name.toLowerCase().includes(lowercasedQuery) ||
        gift.sender.username.toLowerCase().includes(lowercasedQuery) ||
        gift.recipient.name.toLowerCase().includes(lowercasedQuery) ||
        gift.recipient.username.toLowerCase().includes(lowercasedQuery) ||
        gift.stream.title.toLowerCase().includes(lowercasedQuery) ||
        gift.gift.name.toLowerCase().includes(lowercasedQuery) ||
        gift.message.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredGifts(filtered);
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
    setFilteredGifts(giftsData);
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

  // Gift Stats
  const giftStats = [
    {
      title: 'Total Gifts',
      value: '15,723',
      change: '+12.5%',
      icon: <Gift size={20} className="text-purple-500" strokeWidth={1.8} />
    },
    {
      title: 'Total Value',
      value: '1.2M coins',
      change: '+18.3%',
      icon: <DollarSign size={20} className="text-green-500" strokeWidth={1.8} />
    },
    {
      title: 'Top Gift',
      value: 'Diamond Crown',
      change: '5,000 coins',
      icon: <Crown size={20} className="text-yellow-500" strokeWidth={1.8} />
    },
    {
      title: 'Avg. Reaction Rate',
      value: '32.4',
      change: '+5.2%',
      icon: <Heart size={20} className="text-pink-500" strokeWidth={1.8} />
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
          <h1 className="text-2xl font-semibold text-gray-800">Gift History</h1>
          <p className="text-gray-500 mt-1">Track and manage livestream gifts and donations</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
          >
            <Calendar size={16} className="mr-2" strokeWidth={1.8} />
            April 2025
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
        {giftStats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center"
            whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="mr-4 p-2 bg-gray-50 rounded-lg">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs">{stat.title}</p>
              <h3 className="text-lg font-semibold text-gray-800">{stat.value}</h3>
              <p className="text-green-600 text-xs">{stat.change}</p>
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
            placeholder="Search by gift, user, stream or message..."
            onSearch={handleSearch}
            suggestions={[
              'Diamond Crown',
              'Emma Johnson',
              'Music & Chill',
              'premium'
            ]}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Gift Filters"
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
          data={filteredGifts}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No gift transactions found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredGifts.length}
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