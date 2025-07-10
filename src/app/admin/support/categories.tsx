import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  AlertTriangle,
  Smartphone,
  Folder,
  FolderPlus,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import supportService from '../../../api/services/support';

export default function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await supportService.getCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const organizedCategories = useMemo(() => {
    const categoryMap = new Map();

    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    const rootCategories = [];

    categoryMap.forEach(category => {
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId);
        if (parent && parent.children) {
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    // Sort categories
    const sortCategories = (cats) => {
      cats.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle special cases
        if (sortField === 'defaultPriority') {
          const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          aValue = priorityOrder[aValue] ?? 999;
          bValue = priorityOrder[bValue] ?? 999;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      // Recursively sort children
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          sortCategories(cat.children);
        }
      });

      return cats;
    };

    return sortCategories([...rootCategories]);
  }, [categories, sortField, sortDirection]);

  // Filter categories based on search and active status
  const filteredCategories = useMemo(() => {
    const matchesSearch = (category) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        category.name.toLowerCase().includes(lowerSearchTerm) ||
        category.description.toLowerCase().includes(lowerSearchTerm) ||
        (category.children && category.children.some(matchesSearch))
      );
    };

    const matchesActiveFilter = (category: any) => {
      return showInactive ? true : category.isActive;
    };

    return organizedCategories.filter(category =>
      matchesSearch(category) && matchesActiveFilter(category)
    );
  }, [organizedCategories, searchTerm, showInactive]);

  const handleSort = (field: any) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await supportService.deleteCategory(id);
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      setActiveMenu(null);
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  const formatTime = (minutes: any) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const classes = {
      LOW: "bg-green-100 text-green-800",
      MEDIUM: "bg-blue-100 text-blue-800",
      HIGH: "bg-orange-100 text-orange-800",
      CRITICAL: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800"
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${classes[priority] || classes.default}`}>
        {priority.charAt(0) + priority.slice(1).toLowerCase()}
      </span>
    );
  };

  // Get category icon
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'smartphone':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Folder className="h-4 w-4" />;
    }
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategoryRow = (category, depth = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories[category.id];

    return (
      <div key={category.id}>
        <div
          className={`
            border-b border-gray-100 transition-colors duration-150
            ${depth === 0 ? 'hover:bg-gray-50' : 'hover:bg-gray-50/50'}
          `}
          style={{ paddingLeft: `${depth * 1.5}rem` }}
        >
          <div className="flex items-center py-3 px-4">
            {/* Expand/Collapse for parent categories */}
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="mr-2 text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Icon with color indicator */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
              style={{ backgroundColor: `${category.color}15` }}
            >
              <div style={{ color: category.color }}>
                {getCategoryIcon(category.icon)}
              </div>
            </div>

            {/* Category details */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-900 mr-2 truncate">
                  {category.name}
                </h3>
                {!category.isActive && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{category.description}</p>
            </div>

            {/* SLA Info */}
            <div className="hidden md:flex items-center space-x-6 text-sm mr-4">
              <div className="text-right">
                <p className="text-gray-500">Response</p>
                <div className="font-medium text-gray-700 flex items-center justify-end">
                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                  {formatTime(category.firstResponseSla)}
                </div>
              </div>

              <div className="text-right">
                <p className="text-gray-500">Resolution</p>
                <div className="font-medium text-gray-700 flex items-center justify-end">
                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                  {formatTime(category.resolutionSla)}
                </div>
              </div>

              <div className="w-20 text-right">
                <p className="text-gray-500">Priority</p>
                <div className="flex justify-end mt-1">
                  {getPriorityBadge(category.defaultPriority)}
                </div>
              </div>
            </div>

            {/* Actions menu */}
            <div className="relative ml-2">
              <button
                onClick={() => setActiveMenu(activeMenu === category.id ? null : category.id)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {activeMenu === category.id && (
                <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => console.log('View', category.id)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="mr-3 h-4 w-4 text-gray-500" />
                      View Details
                    </button>
                    <button
                      onClick={() => console.log('Edit', category.id)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="mr-3 h-4 w-4 text-gray-500" />
                      Edit
                    </button>
                    <button
                      onClick={() => console.log('Add Subcategory', category.id)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FolderPlus className="mr-3 h-4 w-4 text-gray-500" />
                      Add Subcategory
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <Trash2 className="mr-3 h-4 w-4 text-red-500" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Render children recursively */}
        {hasChildren && isExpanded && (
          <div>
            {category.children.map(child => renderCategoryRow(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Ticket Categories</h1>
            <p className="text-sm text-gray-500">
              Manage support ticket categories and classification
            </p>
          </div>
          <button
            onClick={() => console.log('Create new category')}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Category
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 flex flex-col md:flex-row gap-2 items-center">
          <div className="w-full md:w-1/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex space-x-2 ml-auto">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${showInactive
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700'
                }`}
            >
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              {showInactive ? 'Showing Inactive' : 'Show Inactive'}
            </button>

            <button
              onClick={() => {
                setSearchTerm('');
                setShowInactive(false);
                setSortField('name');
                setSortDirection('asc');
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Folder className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new category.
            </p>
            <div className="mt-6">
              <button
                onClick={() => console.log('Create new category')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                New Category
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex-grow flex items-center">
                <button
                  className="flex items-center text-left focus:outline-none"
                  onClick={() => handleSort('name')}
                >
                  Category
                  {sortField === 'name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </button>
              </div>

              <div className="hidden md:flex items-center space-x-6 mr-12">
                <div className="w-20 text-center">
                  <button
                    className="flex items-center text-left focus:outline-none"
                    onClick={() => handleSort('firstResponseSla')}
                  >
                    Response
                    {sortField === 'firstResponseSla' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      </span>
                    )}
                  </button>
                </div>

                <div className="w-20 text-center">
                  <button
                    className="flex items-center text-left focus:outline-none"
                    onClick={() => handleSort('resolutionSla')}
                  >
                    Resolution
                    {sortField === 'resolutionSla' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      </span>
                    )}
                  </button>
                </div>

                <div className="w-20 text-center">
                  <button
                    className="flex items-center text-left focus:outline-none"
                    onClick={() => handleSort('defaultPriority')}
                  >
                    Priority
                    {sortField === 'defaultPriority' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="w-10">
                <span className="sr-only">Actions</span>
              </div>
            </div>

            {/* Table Body */}
            <div>
              {filteredCategories.map(category => renderCategoryRow(category))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
