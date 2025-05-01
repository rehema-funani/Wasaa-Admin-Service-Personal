import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  Gift,
  Zap,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  Clock,
  Tag,
  DollarSign,
  Star,
  Users,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatPhoneNumber } from '../../../../utils/formatting';
import SearchBox from '../../../../components/common/SearchBox';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

interface GiftStats {
  totalSent: number;
  totalRevenue: number;
  uniqueSenders: number;
  popularityScore: number;
}

interface LimitedTimeInfo {
  startDate: string;
  endDate: string;
}

interface Gift {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  animationUrl: string;
  cost: number;
  monetaryValue: number;
  category: string;
  tags: string[];
  isActive: boolean;
  isLimited: boolean;
  limitedTimeOnly?: LimitedTimeInfo;
  createdAt: string;
  updatedAt: string;
  stats: GiftStats;
  [key: string]: any; // Allow any additional properties
}

interface Category {
  id: string;
  name: string;
}

interface FilterState {
  categories: string[];
  status: string[];
  priceRange: { min: number; max: number };
  dateRange: { from: string | null; to: string | null };
  isLimited: boolean | null;
  [key: string]: any; // Allow any additional properties
}

// This would come from the API in production
const mockGiftData: Gift[] = [
  {
    id: 'GIFT001',
    name: 'Super Heart',
    description: 'A pulsating heart that shows your love for the creator',
    imageUrl: '/gifts/heart.png',
    animationUrl: '/gifts/animations/heart.mp4',
    cost: 100, // In platform coins
    monetaryValue: 1.0, // USD
    category: 'Basic',
    tags: ['love', 'popular', 'starter'],
    isActive: true,
    isLimited: false,
    createdAt: '2024-12-10T14:32:10Z',
    updatedAt: '2025-03-15T09:14:22Z',
    stats: {
      totalSent: 145280,
      totalRevenue: 145280,
      uniqueSenders: 32450,
      popularityScore: 9.2
    }
  },
  {
    id: 'GIFT002',
    name: 'Galaxy',
    description: 'An animated galaxy that fills the screen with stars',
    imageUrl: '/gifts/galaxy.png',
    animationUrl: '/gifts/animations/galaxy.mp4',
    cost: 1000,
    monetaryValue: 10.0,
    category: 'Premium',
    tags: ['spectacular', 'premium', 'universe'],
    isActive: true,
    isLimited: false,
    createdAt: '2024-12-15T11:22:40Z',
    updatedAt: '2025-04-01T16:07:33Z',
    stats: {
      totalSent: 25630,
      totalRevenue: 256300,
      uniqueSenders: 8720,
      popularityScore: 8.7
    }
  },
  {
    id: 'GIFT003',
    name: 'Spring Festival Dragon',
    description: 'A traditional dragon dance animation for Lunar New Year',
    imageUrl: '/gifts/dragon.png',
    animationUrl: '/gifts/animations/dragon.mp4',
    cost: 2000,
    monetaryValue: 20.0,
    category: 'Seasonal',
    tags: ['lunar new year', 'festival', 'limited'],
    isActive: true,
    isLimited: true,
    limitedTimeOnly: {
      startDate: '2025-01-15T00:00:00Z',
      endDate: '2025-02-20T23:59:59Z'
    },
    createdAt: '2024-12-20T09:10:30Z',
    updatedAt: '2025-01-10T10:15:00Z',
    stats: {
      totalSent: 18450,
      totalRevenue: 369000,
      uniqueSenders: 6230,
      popularityScore: 9.5
    }
  },
  {
    id: 'GIFT004',
    name: 'Diamond Rain',
    description: 'A shower of diamonds that rains down on the stream',
    imageUrl: '/gifts/diamond-rain.png',
    animationUrl: '/gifts/animations/diamond-rain.mp4',
    cost: 5000,
    monetaryValue: 50.0,
    category: 'Premium',
    tags: ['luxury', 'premium', 'spectacular'],
    isActive: true,
    isLimited: false,
    createdAt: '2025-01-05T15:45:20Z',
    updatedAt: '2025-03-20T11:30:15Z',
    stats: {
      totalSent: 7820,
      totalRevenue: 391000,
      uniqueSenders: 1520,
      popularityScore: 8.8
    }
  },
  {
    id: 'GIFT005',
    name: 'Summer Vibes',
    description: 'A beach scene with moving waves and palm trees',
    imageUrl: '/gifts/summer.png',
    animationUrl: '/gifts/animations/summer.mp4',
    cost: 500,
    monetaryValue: 5.0,
    category: 'Seasonal',
    tags: ['summer', 'beach', 'vacation'],
    isActive: true,
    isLimited: true,
    limitedTimeOnly: {
      startDate: '2025-06-01T00:00:00Z',
      endDate: '2025-08-31T23:59:59Z'
    },
    createdAt: '2025-02-10T13:25:40Z',
    updatedAt: '2025-04-05T08:12:30Z',
    stats: {
      totalSent: 12540,
      totalRevenue: 62700,
      uniqueSenders: 9870,
      popularityScore: 7.9
    }
  },
  {
    id: 'GIFT006',
    name: 'Birthday Cake',
    description: 'A celebratory cake with animated candles and confetti',
    imageUrl: '/gifts/cake.png',
    animationUrl: '/gifts/animations/cake.mp4',
    cost: 300,
    monetaryValue: 3.0,
    category: 'Celebration',
    tags: ['birthday', 'celebration', 'party'],
    isActive: true,
    isLimited: false,
    createdAt: '2025-02-15T10:18:30Z',
    updatedAt: '2025-03-25T14:22:10Z',
    stats: {
      totalSent: 28760,
      totalRevenue: 86280,
      uniqueSenders: 22930,
      popularityScore: 8.5
    }
  },
  {
    id: 'GIFT007',
    name: 'Rocket Ship',
    description: 'A rocket that launches across the screen with smoke trails',
    imageUrl: '/gifts/rocket.png',
    animationUrl: '/gifts/animations/rocket.mp4',
    cost: 800,
    monetaryValue: 8.0,
    category: 'Premium',
    tags: ['space', 'adventure', 'fun'],
    isActive: true,
    isLimited: false,
    createdAt: '2025-02-20T08:40:15Z',
    updatedAt: '2025-04-10T16:35:25Z',
    stats: {
      totalSent: 15320,
      totalRevenue: 122560,
      uniqueSenders: 7620,
      popularityScore: 8.1
    }
  },
  {
    id: 'GIFT008',
    name: 'Valentine Rose',
    description: 'A beautiful rose that blooms with heart particles',
    imageUrl: '/gifts/rose.png',
    animationUrl: '/gifts/animations/rose.mp4',
    cost: 200,
    monetaryValue: 2.0,
    category: 'Seasonal',
    tags: ['valentine', 'love', 'flower'],
    isActive: false,
    isLimited: true,
    limitedTimeOnly: {
      startDate: '2025-02-01T00:00:00Z',
      endDate: '2025-02-15T23:59:59Z'
    },
    createdAt: '2025-01-10T14:30:20Z',
    updatedAt: '2025-02-16T10:20:30Z',
    stats: {
      totalSent: 87640,
      totalRevenue: 175280,
      uniqueSenders: 45230,
      popularityScore: 9.4
    }
  },
  {
    id: 'GIFT009',
    name: 'Football Trophy',
    description: 'A golden trophy for sports fans and championship events',
    imageUrl: '/gifts/trophy.png',
    animationUrl: '/gifts/animations/trophy.mp4',
    cost: 600,
    monetaryValue: 6.0,
    category: 'Sports',
    tags: ['sports', 'championship', 'victory'],
    isActive: true,
    isLimited: false,
    createdAt: '2025-03-01T11:15:40Z',
    updatedAt: '2025-04-15T13:45:20Z',
    stats: {
      totalSent: 21340,
      totalRevenue: 128040,
      uniqueSenders: 9860,
      popularityScore: 8.3
    }
  },
  {
    id: 'GIFT010',
    name: 'Super Fan',
    description: 'A spinning super fan banner with confetti explosion',
    imageUrl: '/gifts/superfan.png',
    animationUrl: '/gifts/animations/superfan.mp4',
    cost: 1500,
    monetaryValue: 15.0,
    category: 'Premium',
    tags: ['fan', 'support', 'premium'],
    isActive: true,
    isLimited: false,
    createdAt: '2025-03-10T09:50:20Z',
    updatedAt: '2025-04-20T15:30:10Z',
    stats: {
      totalSent: 12680,
      totalRevenue: 190200,
      uniqueSenders: 5370,
      popularityScore: 8.9
    }
  },
  {
    id: 'GIFT011',
    name: 'Game Controller',
    description: 'An animated game controller for gaming streams',
    imageUrl: '/gifts/controller.png',
    animationUrl: '/gifts/animations/controller.mp4',
    cost: 250,
    monetaryValue: 2.5,
    category: 'Gaming',
    tags: ['gamer', 'gaming', 'controller'],
    isActive: true,
    isLimited: false,
    createdAt: '2025-03-15T12:30:45Z',
    updatedAt: '2025-04-22T10:15:30Z',
    stats: {
      totalSent: 42560,
      totalRevenue: 106400,
      uniqueSenders: 18920,
      popularityScore: 8.6
    }
  },
  {
    id: 'GIFT012',
    name: 'Concert Lights',
    description: 'Stage lights that pulse to the beat for music streamers',
    imageUrl: '/gifts/concert.png',
    animationUrl: '/gifts/animations/concert.mp4',
    cost: 400,
    monetaryValue: 4.0,
    category: 'Music',
    tags: ['music', 'concert', 'lights'],
    isActive: true,
    isLimited: false,
    createdAt: '2025-03-20T14:20:30Z',
    updatedAt: '2025-04-25T09:40:15Z',
    stats: {
      totalSent: 31240,
      totalRevenue: 124960,
      uniqueSenders: 15780,
      popularityScore: 8.4
    }
  }
];

// Mock categories for filtering
const giftCategories: Category[] = [
  { id: 'basic', name: 'Basic' },
  { id: 'premium', name: 'Premium' },
  { id: 'seasonal', name: 'Seasonal' },
  { id: 'celebration', name: 'Celebration' },
  { id: 'sports', name: 'Sports' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'music', name: 'Music' }
];

const page: React.FC = () => {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['heart', 'premium', 'seasonal']);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('view'); // 'view', 'delete'
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<string>('asc');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    status: [],
    priceRange: { min: 0, max: 5000 },
    dateRange: { from: null, to: null },
    isLimited: null
  });

  // Fetch gifts data from API
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await giftService.getAllGifts();
        // const giftData = response.data;

        // Simulate API delay
        setTimeout(() => {
          setGifts(mockGiftData);
          setFilteredGifts(mockGiftData);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching gifts:', err);
        setError('Failed to load gifts. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchGifts();
  }, []);

  // Apply sorting
  const handleSort = (field: string) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sortedGifts = [...filteredGifts].sort((a, b) => {
      let aValue: any, bValue: any;

      // Handle nested fields like stats.totalSent
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        aValue = a[parent][child];
        bValue = b[parent][child];
      } else {
        aValue = a[field];
        bValue = b[field];
      }

      // Handle string comparison
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return newDirection === 'asc' ? comparison : -comparison;
      }

      // Handle number comparison
      return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredGifts(sortedGifts);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredGifts(gifts);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const filtered = gifts.filter(gift =>
      gift.name.toLowerCase().includes(lowercasedQuery) ||
      gift.description.toLowerCase().includes(lowercasedQuery) ||
      gift.id.toLowerCase().includes(lowercasedQuery) ||
      gift.category.toLowerCase().includes(lowercasedQuery) ||
      gift.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );

    setFilteredGifts(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);

    let filtered = [...gifts];

    // Apply category filter
    if (newFilters.categories && newFilters.categories.length > 0) {
      filtered = filtered.filter(gift =>
        newFilters.categories.includes(gift.category.toLowerCase())
      );
    }

    // Apply status filter
    if (newFilters.status && newFilters.status.length > 0) {
      filtered = filtered.filter(gift => {
        if (newFilters.status.includes('active') && gift.isActive) return true;
        if (newFilters.status.includes('inactive') && !gift.isActive) return true;
        return false;
      });
    }

    // Apply price range filter
    if (newFilters.priceRange) {
      filtered = filtered.filter(gift =>
        gift.cost >= newFilters.priceRange.min &&
        gift.cost <= newFilters.priceRange.max
      );
    }

    // Apply date range filter
    if (newFilters.dateRange && (newFilters.dateRange.from || newFilters.dateRange.to)) {
      filtered = filtered.filter(gift => {
        const createdDate = new Date(gift.createdAt);

        if (newFilters.dateRange.from && newFilters.dateRange.to) {
          return createdDate >= new Date(newFilters.dateRange.from) &&
            createdDate <= new Date(newFilters.dateRange.to);
        } else if (newFilters.dateRange.from) {
          return createdDate >= new Date(newFilters.dateRange.from);
        } else if (newFilters.dateRange.to) {
          return createdDate <= new Date(newFilters.dateRange.to);
        }

        return true;
      });
    }

    // Apply limited time filter
    if (newFilters.isLimited !== null) {
      filtered = filtered.filter(gift => gift.isLimited === newFilters.isLimited);
    }

    // Apply search query if present
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(gift =>
        gift.name.toLowerCase().includes(lowercasedQuery) ||
        gift.description.toLowerCase().includes(lowercasedQuery) ||
        gift.id.toLowerCase().includes(lowercasedQuery) ||
        gift.category.toLowerCase().includes(lowercasedQuery) ||
        gift.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      );
    }

    setFilteredGifts(filtered);
    setCurrentPage(1);
  };

  // Handle gift status toggle
  const handleToggleStatus = async (giftId: string, currentStatus: boolean) => {
    try {
      // In a real app, this would be an API call
      // await giftService.updateGiftStatus(giftId, !currentStatus);

      // Update local state
      const updatedGifts = gifts.map(gift =>
        gift.id === giftId ? { ...gift, isActive: !currentStatus } : gift
      );

      setGifts(updatedGifts);
      setFilteredGifts(prevFiltered =>
        prevFiltered.map(gift =>
          gift.id === giftId ? { ...gift, isActive: !currentStatus } : gift
        )
      );

      // Show success message
      alert(`Gift ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error('Error updating gift status:', err);
      alert('Failed to update gift status. Please try again.');
    }
  };

  // Handle gift view
  const handleViewGift = (gift: Gift) => {
    setSelectedGift(gift);
    setModalType('view');
    setShowModal(true);
  };

  // Handle gift edit navigation
  const handleEditGift = (gift: Gift) => {
    navigate(`/gifts/edit/${gift.id}`);
  };

  // Handle gift deletion modal
  const handleDeleteGift = (gift: Gift) => {
    setSelectedGift(gift);
    setModalType('delete');
    setShowModal(true);
  };

  // Handle actual gift deletion after confirmation
  const confirmDeleteGift = async () => {
    if (!selectedGift) return;

    try {
      // In a real app, this would be an API call
      // await giftService.deleteGift(selectedGift.id);

      // Update local state
      const updatedGifts = gifts.filter(gift => gift.id !== selectedGift.id);
      setGifts(updatedGifts);
      setFilteredGifts(prevFiltered =>
        prevFiltered.filter(gift => gift.id !== selectedGift.id)
      );

      setShowModal(false);
      setSelectedGift(null);

      // Show success message
      alert('Gift deleted successfully');
    } catch (err) {
      console.error('Error deleting gift:', err);
      alert('Failed to delete gift. Please try again.');
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGift(null);
  };

  // Navigate to create gift page
  const handleCreateGift = () => {
    navigate('/admin/Gi/add-gift');
  };

  // Calculate total stats
  const totalStats = gifts.reduce((acc: any, gift) => {
    acc.totalRevenue += gift.stats.totalRevenue;
    acc.totalSent += gift.stats.totalSent;
    acc.activeGifts += gift.isActive ? 1 : 0;
    acc.limitedGifts += gift.isLimited ? 1 : 0;
    return acc;
  }, { totalRevenue: 0, totalSent: 0, activeGifts: 0, limitedGifts: 0 });

  // Define table columns
  const columns = [
    {
      id: 'preview',
      header: 'Preview',
      accessor: (row: Gift) => row.imageUrl,
      sortable: false,
      width: '80px',
      cell: () => (
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
            {/* In a real app, this would be an actual image */}
            <Gift size={20} className="text-indigo-500" />
          </div>
        </div>
      )
    },
    {
      id: 'name',
      header: 'Gift Name',
      accessor: (row: Gift) => row.name,
      sortable: true,
      cell: (value: string, row: Gift) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{value}</span>
          <span className="text-xs text-gray-500">{row.id}</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {row.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
            {row.tags.length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                +{row.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'category',
      header: 'Category',
      accessor: (row: Gift) => row.category,
      sortable: true,
      width: '120px',
      cell: (value: string, row: Gift) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{value}</span>
          {row.isLimited && (
            <span className="text-xs text-amber-600 flex items-center mt-1">
              <Clock size={12} className="mr-1" strokeWidth={1.8} />
              Limited Time
            </span>
          )}
        </div>
      )
    },
    {
      id: 'cost',
      header: 'Price',
      accessor: (row: Gift) => row.cost,
      sortable: true,
      width: '100px',
      cell: (value: number, row: Gift) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{value} coins</span>
          <span className="text-xs text-gray-500">${row.monetaryValue.toFixed(2)}</span>
        </div>
      )
    },
    {
      id: 'stats',
      header: 'Performance',
      accessor: (row: Gift) => row.stats.totalSent,
      sortable: true,
      cell: (row: Gift) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <Zap size={14} className="text-amber-500 mr-1" strokeWidth={1.8} />
            <span className="font-medium">{row?.stats?.totalSent} sent</span>
          </div>
          <div className="flex items-center mt-1">
            <DollarSign size={14} className="text-green-500 mr-1" strokeWidth={1.8} />
            <span className="text-gray-600">{(row?.stats?.totalRevenue / 100)}</span>
          </div>
          <div className="flex items-center mt-1">
            <Star size={14} className="text-indigo-500 mr-1" strokeWidth={1.8} />
            <span className="text-gray-600">Popularity: {row?.stats?.popularityScore?.toFixed(1)}/10</span>
          </div>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Gift) => row.isActive,
      sortable: true,
      width: '120px',
      cell: (value: boolean) => (
        <div className="flex flex-col items-start">
          <div className="mb-2">
            {value ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle size={12} className="mr-1" strokeWidth={1.8} />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <X size={12} className="mr-1" strokeWidth={1.8} />
                Inactive
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Gift) => row.id,
      sortable: false,
      width: '120px',
      cell: (row: Gift) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View gift details"
            onClick={() => handleViewGift(row)}
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-100 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit gift"
            onClick={() => handleEditGift(row)}
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete gift"
            onClick={() => handleDeleteGift(row)}
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </motion.button>
        </div>
      )
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
          <h1 className="text-2xl font-semibold text-gray-800">Gift Management</h1>
          <p className="text-gray-500 mt-1">Create, edit and manage virtual gifts for live streams</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}
            whileTap={{ y: 0 }}
            onClick={handleCreateGift}
          >
            <PlusCircle size={16} className="mr-2" strokeWidth={1.8} />
            Create New Gift
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
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
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center"
          whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="mr-4 p-2 bg-indigo-50 rounded-lg">
            <Gift size={20} className="text-indigo-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Gifts</p>
            <h3 className="text-lg font-semibold text-gray-800">{gifts.length}</h3>
            <p className="text-gray-600 text-xs">{totalStats.activeGifts} active, {totalStats.limitedGifts} limited</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center"
          whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="mr-4 p-2 bg-amber-50 rounded-lg">
            <Zap size={20} className="text-amber-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Gifts Sent</p>
            <h3 className="text-lg font-semibold text-gray-800">{(totalStats.totalSent)}</h3>
            <p className="text-gray-600 text-xs">Across all active gifts</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center"
          whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="mr-4 p-2 bg-green-50 rounded-lg">
            <DollarSign size={20} className="text-green-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Revenue</p>
            <h3 className="text-lg font-semibold text-gray-800">{formatCurrency(totalStats.totalRevenue / 100)}</h3>
            <p className="text-gray-600 text-xs">From all gifts</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center"
          whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="mr-4 p-2 bg-purple-50 rounded-lg">
            <TrendingUp size={20} className="text-purple-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-gray-500 text-xs">Top Performing</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {gifts.length > 0 ? gifts.reduce((prev, current) =>
                (prev.stats.totalRevenue > current.stats.totalRevenue) ? prev : current
              ).name : 'N/A'}
            </h3>
            <p className="text-gray-600 text-xs">By revenue generated</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SearchBox
          placeholder="Search gifts by name, ID, category or tags..."
          onSearch={handleSearch}
          suggestions={[
            'heart',
            'premium',
            'limited',
            'seasonal'
          ]}
          recentSearches={recentSearches}
          showRecentByDefault={true}
        />
      </motion.div>

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="text-sm text-gray-600 mr-1">Quick Filters:</div>

        <button
          className={`px-3 py-1 rounded-full text-xs ${filters.status.includes('active')
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          onClick={() => {
            const newStatus = filters.status.includes('active')
              ? filters.status.filter(s => s !== 'active')
              : [...filters.status, 'active'];

            handleFilterChange({ ...filters, status: newStatus });
          }}
        >
          <CheckCircle size={12} className="inline mr-1" strokeWidth={1.8} />
          Active
        </button>

        <button
          className={`px-3 py-1 rounded-full text-xs ${filters.status.includes('inactive')
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          onClick={() => {
            const newStatus = filters.status.includes('inactive')
              ? filters.status.filter(s => s !== 'inactive')
              : [...filters.status, 'inactive'];

            handleFilterChange({ ...filters, status: newStatus });
          }}
        >
          <X size={12} className="inline mr-1" strokeWidth={1.8} />
          Inactive
        </button>

        <button
          className={`px-3 py-1 rounded-full text-xs ${filters.isLimited === true
            ? 'bg-amber-100 text-amber-800'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          onClick={() => {
            const newValue = filters.isLimited === true ? null : true;
            handleFilterChange({ ...filters, isLimited: newValue });
          }}
        >
          <Clock size={12} className="inline mr-1" strokeWidth={1.8} />
          Limited Time
        </button>

        {giftCategories.map(category => (
          <button
            key={category.id}
            className={`px-3 py-1 rounded-full text-xs ${filters.categories.includes(category.id)
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            onClick={() => {
              const newCategories = filters.categories.includes(category.id)
                ? filters.categories.filter(c => c !== category.id)
                : [...filters.categories, category.id];

              handleFilterChange({ ...filters, categories: newCategories });
            }}
          >
            <Tag size={12} className="inline mr-1" strokeWidth={1.8} />
            {category.name}
          </button>
        ))}

        {(filters.categories.length > 0 || filters.status.length > 0 || filters.isLimited !== null) && (
          <button
            className="px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => handleFilterChange({
              categories: [],
              status: [],
              priceRange: { min: 0, max: 5000 },
              dateRange: { from: null, to: null },
              isLimited: null
            })}
          >
            <RefreshCw size={12} className="inline mr-1" strokeWidth={1.8} />
            Reset Filters
          </button>
        )}
      </div>

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
            data={filteredGifts}
            selectable={true}
            isLoading={isLoading}
            emptyMessage="No gifts found. Try adjusting your filters or search terms."
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

      {/* Modal for View/Delete */}
      <AnimatePresence>
        {showModal && selectedGift && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">
                  {modalType === 'view' && 'Gift Details'}
                  {modalType === 'delete' && 'Delete Gift'}
                </h3>
                <button
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                  onClick={handleCloseModal}
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 overflow-y-auto">
                {modalType === 'delete' && (
                  <div className="text-center p-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                      <AlertCircle size={24} className="text-red-600" strokeWidth={1.8} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Gift</h3>
                    <p className="text-gray-500 mb-6">
                      Are you sure you want to delete <span className="font-semibold">{selectedGift.name}</span>? This action cannot be undone.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        onClick={confirmDeleteGift}
                      >
                        Delete Gift
                      </button>
                    </div>
                  </div>
                )}

                {modalType === 'view' && selectedGift && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Gift Preview</h4>
                        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                          <div className="w-24 h-24 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                            <Sparkles size={40} className="text-indigo-500" strokeWidth={1.8} />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">{selectedGift.name}</h3>
                          <p className="text-gray-500 text-sm text-center mt-1">{selectedGift.description}</p>
                          <div className="flex flex-wrap justify-center gap-1 mt-3">
                            {selectedGift.tags.map((tag, index) => (
                              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Gift Information</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Gift ID:</span>
                            <span className="font-medium text-gray-800">{selectedGift.id}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium text-gray-800">{selectedGift.category}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Price:</span>
                            <div className="text-right">
                              <span className="font-medium text-gray-800">{selectedGift.cost} coins</span>
                              <div className="text-xs text-gray-500">${selectedGift.monetaryValue.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${selectedGift.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                              {selectedGift.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Time Limited:</span>
                            <span className={`font-medium ${selectedGift.isLimited ? 'text-amber-600' : 'text-gray-500'}`}>
                              {selectedGift.isLimited ? 'Yes' : 'No'}
                            </span>
                          </div>
                          {selectedGift.isLimited && selectedGift.limitedTimeOnly && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Available Period:</span>
                              <div className="text-right">
                                <div className="text-sm text-gray-800">
                                  {new Date(selectedGift.limitedTimeOnly.startDate).toLocaleDateString()} -
                                  {new Date(selectedGift.limitedTimeOnly.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Created:</span>
                            <span className="text-gray-800">
                              {new Date(selectedGift.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="text-gray-800">
                              {new Date(selectedGift.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Performance Metrics</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="text-xs text-gray-500 mb-1">Total Sent</div>
                              <div className="flex items-center">
                                <Zap size={16} className="text-amber-500 mr-1.5" strokeWidth={1.8} />
                                <span className="text-lg font-semibold text-gray-800">
                                  {(selectedGift.stats.totalSent)}
                                </span>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
                              <div className="flex items-center">
                                <DollarSign size={16} className="text-green-500 mr-1.5" strokeWidth={1.8} />
                                <span className="text-lg font-semibold text-gray-800">
                                  {formatCurrency(selectedGift.stats.totalRevenue / 100)}
                                </span>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="text-xs text-gray-500 mb-1">Unique Senders</div>
                              <div className="flex items-center">
                                <Users size={16} className="text-blue-500 mr-1.5" strokeWidth={1.8} />
                                <span className="text-lg font-semibold text-gray-800">
                                  {(selectedGift.stats.uniqueSenders)}
                                </span>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="text-xs text-gray-500 mb-1">Popularity Score</div>
                              <div className="flex items-center">
                                <Star size={16} className="text-indigo-500 mr-1.5" strokeWidth={1.8} />
                                <span className="text-lg font-semibold text-gray-800">
                                  {selectedGift.stats.popularityScore.toFixed(1)}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                        <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-2">
                          <button
                            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                            onClick={() => {
                              handleCloseModal();
                              handleEditGift(selectedGift);
                            }}
                          >
                            <Edit size={16} className="mr-2" strokeWidth={1.8} />
                            Edit Gift
                          </button>

                          <button
                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                            onClick={() => {
                              setModalType('delete');
                            }}
                          >
                            <Trash2 size={16} className="mr-2" strokeWidth={1.8} />
                            Delete Gift
                          </button>

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
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default page;