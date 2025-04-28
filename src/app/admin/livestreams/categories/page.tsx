import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Grid,
  List,
  TrendingUp,
  Users,
  Clock,
  Filter,
  ChevronDown,
  Eye,
  Star,
  ArrowUpRight
} from 'lucide-react';

const page = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  interface Category {
    id: string;
    name: string;
    description: string;
    activeStreams: number;
    viewers: number;
    totalStreamers: number;
    featured: boolean;
    followed: boolean;
    isDefault: boolean;
    createdAt: string;
    gradientStart: string;
    gradientEnd: string;
    icon: JSX.Element;
  }
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    // Simulating loading categories from an API
    setIsLoading(true);
    setTimeout(() => {
      setCategories(sampleCategories);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort categories based on selected option
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.activeStreams - a.activeStreams;
      case 'viewers':
        return b.viewers - a.viewers;
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const toggleAddCategoryModal = () => {
    setShowAddCategoryModal(!showAddCategoryModal);
  };

  const CategoryGridItem = ({ category }: { category: Category }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div
        className="h-32 bg-gradient-to-r relative"
        style={{
          backgroundImage: `linear-gradient(to right, ${category.gradientStart}, ${category.gradientEnd})`
        }}
      >
        {category.featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-xs text-yellow-800 font-medium px-2 py-0.5 rounded-full flex items-center">
            <Star size={10} className="mr-1" />
            Featured
          </div>
        )}
        {category.icon && (
          <div className="absolute bottom-0 right-0 p-3 text-white opacity-50">
            {category.icon}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">{category.name}</h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{category.description}</p>
          </div>
          <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Star size={16} className={category.followed ? "text-yellow-400 fill-yellow-400" : ""} />
          </button>
        </div>

        <div className="mt-4 flex items-center text-xs text-gray-500">
          <div className="flex items-center mr-3">
            <Users size={12} className="mr-1" />
            {category.activeStreams} live
          </div>
          <div className="flex items-center">
            <Eye size={12} className="mr-1" />
            {category.viewers.toLocaleString()} watching
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-3 flex justify-between">
        <button className="text-xs text-indigo-600 font-medium flex items-center hover:text-indigo-800">
          Browse category
          <ArrowUpRight size={12} className="ml-1" />
        </button>

        <div className="flex items-center space-x-1">
          <button className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Edit size={14} />
          </button>
          {!category.isDefault && (
            <button className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const CategoryListItem = ({ category }: { category: Category }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center hover:shadow-md transition-shadow duration-200">
      <div
        className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(to right, ${category.gradientStart}, ${category.gradientEnd})`
        }}
      >
        {category.icon && (
          <div className="text-white">{category.icon}</div>
        )}
      </div>

      <div className="ml-4 flex-grow">
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-800">{category.name}</h3>
          {category.featured && (
            <div className="ml-2 bg-yellow-100 text-xs text-yellow-800 font-medium px-2 py-0.5 rounded-full flex items-center">
              <Star size={10} className="mr-1" />
              Featured
            </div>
          )}
          {category.isDefault && (
            <div className="ml-2 bg-blue-100 text-xs text-blue-800 font-medium px-2 py-0.5 rounded-full">
              Default
            </div>
          )}
        </div>
        <p className="text-gray-500 text-sm line-clamp-1">{category.description}</p>
      </div>

      <div className="flex items-center space-x-4 ml-2">
        <div className="text-sm text-gray-500 flex flex-col items-center mx-4">
          <div className="font-semibold">{category.activeStreams}</div>
          <div className="text-xs">Live</div>
        </div>

        <div className="text-sm text-gray-500 flex flex-col items-center mx-4">
          <div className="font-semibold">{category.viewers.toLocaleString()}</div>
          <div className="text-xs">Viewers</div>
        </div>

        <div className="text-sm text-gray-500 flex flex-col items-center mx-4">
          <div className="font-semibold">{category.totalStreamers}</div>
          <div className="text-xs">Streamers</div>
        </div>
      </div>

      <div className="flex items-center ml-2 space-x-1">
        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Star size={16} className={category.followed ? "text-yellow-400 fill-yellow-400" : ""} />
        </button>
        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Edit size={16} />
        </button>
        {!category.isDefault && (
          <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Stream Categories</h1>
          <p className="text-gray-500 mt-1">Manage and organize content categories for your streaming platform</p>
        </div>
        <div>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm hover:bg-indigo-700 flex items-center"
            onClick={toggleAddCategoryModal}
          >
            <Plus size={16} className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Total Categories</p>
            <h3 className="text-lg font-semibold text-gray-800">23</h3>
          </div>
          <Grid size={20} className="text-indigo-500" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Active Streams</p>
            <h3 className="text-lg font-semibold text-gray-800">147</h3>
          </div>
          <TrendingUp size={20} className="text-green-500" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Total Viewers</p>
            <h3 className="text-lg font-semibold text-gray-800">38,291</h3>
          </div>
          <Users size={20} className="text-blue-500" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Most Popular</p>
            <h3 className="text-lg font-semibold text-gray-800">Gaming</h3>
          </div>
          <Star size={20} className="text-yellow-500" />
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm">
              <Filter size={16} className="mr-2" />
              Sort by:
              <span className="ml-1 font-medium">{sortBy === 'popular' ? 'Popular' :
                sortBy === 'viewers' ? 'Viewers' :
                  sortBy === 'alphabetical' ? 'A-Z' : 'Newest'}</span>
              <ChevronDown size={16} className="ml-1" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 hidden">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => setSortBy('popular')}>Popular</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => setSortBy('viewers')}>Viewers</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => setSortBy('alphabetical')}>Alphabetical (A-Z)</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => setSortBy('newest')}>Newest</button>
            </div>
          </div>

          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-500'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-500'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-500">Loading categories...</p>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-4'
        }>
          {sortedCategories.map((category) => (
            viewMode === 'grid'
              ? <CategoryGridItem key={category.id} category={category} />
              : <CategoryListItem key={category.id} category={category} />
          ))}
        </div>
      )}

      {/* Add Category Modal would go here */}
    </div>
  );
};

// Sample categories data
const sampleCategories = [
  {
    id: 'cat-001',
    name: 'Gaming',
    description: 'Video games and gaming culture streams including walkthroughs, competitive play, and discussions',
    activeStreams: 42,
    viewers: 12850,
    totalStreamers: 387,
    featured: true,
    followed: true,
    isDefault: true,
    createdAt: '2023-01-15',
    gradientStart: '#6366f1',
    gradientEnd: '#8b5cf6',
    icon: <span>🎮</span>
  },
  {
    id: 'cat-002',
    name: 'Music',
    description: 'Live music performances, instrument tutorials, music production, and industry discussions',
    activeStreams: 28,
    viewers: 8320,
    totalStreamers: 245,
    featured: true,
    followed: false,
    isDefault: true,
    createdAt: '2023-01-15',
    gradientStart: '#f43f5e',
    gradientEnd: '#ec4899',
    icon: <span>🎵</span>
  },
  {
    id: 'cat-003',
    name: 'Just Chatting',
    description: 'Casual conversations, Q&As, and lifestyle content from streamers engaging with their audience',
    activeStreams: 35,
    viewers: 9470,
    totalStreamers: 412,
    featured: false,
    followed: true,
    isDefault: true,
    createdAt: '2023-01-15',
    gradientStart: '#14b8a6',
    gradientEnd: '#0ea5e9',
    icon: <span>💬</span>
  },
  {
    id: 'cat-004',
    name: 'Art',
    description: 'Creative streams featuring digital art, painting, drawing, sculpting, and other artistic pursuits',
    activeStreams: 17,
    viewers: 2930,
    totalStreamers: 156,
    featured: false,
    followed: false,
    isDefault: true,
    createdAt: '2023-01-15',
    gradientStart: '#f97316',
    gradientEnd: '#f59e0b',
    icon: <span>🎨</span>
  },
  {
    id: 'cat-005',
    name: 'Sports',
    description: 'Sports-related content, including live commentary, training sessions, and sporting events',
    activeStreams: 12,
    viewers: 3150,
    totalStreamers: 89,
    featured: false,
    followed: false,
    isDefault: true,
    createdAt: '2023-05-10',
    gradientStart: '#22c55e',
    gradientEnd: '#10b981',
    icon: <span>⚽</span>
  },
  {
    id: 'cat-006',
    name: 'Technology',
    description: 'Tech enthusiasts streaming about coding, hardware reviews, software tutorials, and tech news',
    activeStreams: 9,
    viewers: 1580,
    totalStreamers: 112,
    featured: false,
    followed: false,
    isDefault: false,
    createdAt: '2023-08-22',
    gradientStart: '#0ea5e9',
    gradientEnd: '#3b82f6',
    icon: <span>💻</span>
  }
];

export default page;