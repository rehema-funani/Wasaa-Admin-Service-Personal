import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Users
} from 'lucide-react';
import supportService from '../../../api/services/support';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  color: string;
  icon: string;
  isActive: boolean;
  firstResponseSla: number;
  resolutionSla: number;
  defaultPriority: string;
  autoAssignToRole: string | null;
  requiredSkills: string[];
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export default function CategoriesListPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

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
    const categoryMap = new Map<string, Category>();

    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    const rootCategories: Category[] = [];

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

    return rootCategories;
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const matchesSearch = (category: Category): boolean => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        category.name.toLowerCase().includes(lowerSearchTerm) ||
        category.description.toLowerCase().includes(lowerSearchTerm) ||
        (category.children && category.children.some(matchesSearch))
      );
    };

    const matchesActiveFilter = (category: Category): boolean => {
      return showInactive ? true : category.isActive;
    };

    return organizedCategories.filter(category =>
      matchesSearch(category) && matchesActiveFilter(category)
    );
  }, [organizedCategories, searchTerm, showInactive]);

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is already handled by the filter above
  };

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await supportService.deleteCategory(id);

      // Update local state
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      setActionMenuOpen(null);
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  // Format time in minutes to hours and minutes
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Low
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Medium
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            High
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Critical
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {priority}
          </span>
        );
    }
  };

  // Get icon for category
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'smartphone':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Folder className="h-5 w-5" />;
    }
  };

  // Render a category card
  const renderCategoryCard = (category: Category, depth: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id} className="mb-4" style={{ marginLeft: `${depth * 1.5}rem` }}>
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden border-l-4`} style={{ borderLeftColor: category.color || '#d1d5db' }}>
          <div className="px-6 py-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div
                  className="p-2 rounded-lg mr-4 flex-shrink-0"
                  style={{ backgroundColor: `${category.color}20` || '#f3f4f6' }}
                >
                  {getCategoryIcon(category.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {category.name}
                    {!category.isActive && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Response SLA</p>
                      <div className="font-medium flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {formatTime(category.firstResponseSla)}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Resolution SLA</p>
                      <div className="font-medium flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {formatTime(category.resolutionSla)}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Default Priority</p>
                      <div className="font-medium mt-1">
                        {getPriorityBadge(category.defaultPriority)}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Auto-assign Role</p>
                      <div className="font-medium flex items-center mt-1">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {category.autoAssignToRole || 'None'}
                      </div>
                    </div>
                  </div>

                  {category.requiredSkills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {category.requiredSkills.map(skill => (
                          <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setActionMenuOpen(actionMenuOpen === category.id ? null : category.id)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>

                {actionMenuOpen === category.id && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        onClick={() => navigate(`/categories/${category.id}`)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <Eye className="mr-3 h-4 w-4 text-gray-500" />
                          View Details
                        </div>
                      </button>
                      <button
                        onClick={() => navigate(`/categories/${category.id}/edit`)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <Edit className="mr-3 h-4 w-4 text-gray-500" />
                          Edit
                        </div>
                      </button>
                      <button
                        onClick={() => navigate(`/categories/create?parentId=${category.id}`)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <FolderPlus className="mr-3 h-4 w-4 text-gray-500" />
                          Add Subcategory
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <Trash2 className="mr-3 h-4 w-4 text-red-500" />
                          Delete
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Render children recursively */}
        {hasChildren && (
          <div className="mt-2">
            {category.children!.map(child => renderCategoryCard(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ticket Categories</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage support ticket categories and classification
            </p>
          </div>
          <button
            onClick={() => navigate('/categories/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </form>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`inline-flex items-center px-4 py-2 border ${showInactive
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700'
                  } rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showInactive ? 'Showing Inactive' : 'Show Inactive'}
              </button>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowInactive(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new category.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/categories/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Category
              </button>
            </div>
          </div>
        ) : (
          <div>
            {filteredCategories.map(category => renderCategoryCard(category))}
          </div>
        )}
      </div>
    </div>
  );
}
