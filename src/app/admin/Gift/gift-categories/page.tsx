import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  Edit,
  Trash2,
  Tag,
  Save,
  X,
  ArrowLeft,
  CheckCircle,
  Gift,
  AlertCircle,
  Download,
  ChevronDown,
  Settings,
  Palette,
  Hash,
  FileText,
  Eye
} from 'lucide-react';
import SearchBox from '../../../../components/common/SearchBox';
import Pagination from '../../../../components/common/Pagination';
import DataTable from '../../../../components/common/DataTable';

// This would come from your API
const mockCategories = [
  {
    id: '1',
    name: 'Basic',
    description: 'Simple, affordable gifts for everyone',
    giftsCount: 8,
    color: '#3B82F6', // blue
    isActive: true,
    createdAt: '2024-12-01T08:30:00Z',
    updatedAt: '2025-01-15T14:45:20Z'
  },
  {
    id: '2',
    name: 'Premium',
    description: 'Exclusive, high-value gifts with spectacular effects',
    giftsCount: 12,
    color: '#8B5CF6', // purple
    isActive: true,
    createdAt: '2024-12-05T10:15:30Z',
    updatedAt: '2025-02-10T09:20:15Z'
  },
  {
    id: '3',
    name: 'Celebration',
    description: 'Perfect for birthdays, anniversaries, and special occasions',
    giftsCount: 6,
    color: '#EC4899', // pink
    isActive: true,
    createdAt: '2024-12-10T11:45:20Z',
    updatedAt: '2025-03-05T16:30:45Z'
  },
  {
    id: '4',
    name: 'Sports',
    description: 'Show support for your favorite teams and athletes',
    giftsCount: 4,
    color: '#10B981', // green
    isActive: true,
    createdAt: '2025-01-07T09:30:10Z',
    updatedAt: '2025-03-12T13:25:30Z'
  },
  {
    id: '5',
    name: 'Gaming',
    description: 'Fun gifts themed around gaming culture',
    giftsCount: 5,
    color: '#F59E0B', // amber
    isActive: true,
    createdAt: '2025-01-15T14:20:30Z',
    updatedAt: '2025-02-28T11:10:45Z'
  },
  {
    id: '6',
    name: 'Music',
    description: 'Musical gifts for live performances and music lovers',
    giftsCount: 3,
    color: '#EF4444', // red
    isActive: true,
    createdAt: '2025-02-01T16:45:20Z',
    updatedAt: '2025-03-18T10:50:15Z'
  },
  {
    id: '7',
    name: 'Holidays',
    description: 'Festive gifts for various holiday celebrations',
    giftsCount: 0,
    color: '#06B6D4', // cyan
    isActive: false,
    createdAt: '2025-02-10T08:15:40Z',
    updatedAt: '2025-02-10T08:15:40Z'
  }
];

const page = () => {
  const [categories, setCategories] = useState<typeof mockCategories>([]);
  const [filteredCategories, setFilteredCategories] = useState<typeof mockCategories>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'create', 'edit', 'delete'
  const [selectedCategory, setSelectedCategory] = useState<typeof mockCategories[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [recentSearches, setRecentSearches] = useState(['premium', 'holiday', 'basic']);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    isActive: true
  });

  // Fetch categories from API
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setIsLoading(false);
    }, 800);
  }, []);

  // Handle search
  const handleSearch = (query: any) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredCategories(categories);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(lowercasedQuery) ||
      category.description.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredCategories(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  // Handle form input changes
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle view category
  const handleViewCategory = (category: any) => {
    setSelectedCategory(category);
    setModalType('view');
    setShowModal(true);
  };

  // Handle edit category
  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      isActive: category.isActive
    });
    setModalType('edit');
    setShowModal(true);
  };

  // Handle create category
  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      isActive: true
    });
    setModalType('create');
    setShowModal(true);
  };

  // Handle delete category
  const handleDeleteCategory = (category: any) => {
    setSelectedCategory(category);
    setModalType('delete');
    setShowModal(true);
  };

  // Confirm category deletion
  const confirmDeleteCategory = async () => {
    try {
      // In a real app, this would be an API call
      // await categoryService.deleteCategory(selectedCategory.id);

      // Update local state
      setCategories(prev => prev.filter(category => category.id !== selectedCategory?.id));
      setFilteredCategories(prev => prev.filter(category => category.id !== selectedCategory?.id));

      setShowModal(false);
      setSelectedCategory(null);

      // Show success message
      alert('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category. Please try again.');
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // In a real app, this would be an API call
      // const response = await categoryService.saveCategory(formData);

      if (modalType === 'edit' && selectedCategory) {
        // Update existing category
        const updatedCategory = {
          ...selectedCategory,
          ...formData,
          updatedAt: new Date().toISOString()
        };

        setCategories(prev =>
          prev.map(category =>
            category.id === selectedCategory.id ? updatedCategory : category
          )
        );

        setFilteredCategories(prev =>
          prev.map(category =>
            category.id === selectedCategory.id ? updatedCategory : category
          )
        );
      } else {
        // Create new category
        const newCategory = {
          id: `${categories.length + 1}`,
          ...formData,
          giftsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setCategories(prev => [...prev, newCategory]);
        setFilteredCategories(prev => [...prev, newCategory]);
      }

      setShowModal(false);

      // Show success message
      alert(`Category ${modalType === 'edit' ? 'updated' : 'created'} successfully`);
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category. Please try again.');
    }
  };

  // Handle sorting
  const handleSort = (field: any) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sortedCategories = [...filteredCategories].sort((a, b) => {
      let aValue = a[field as keyof typeof a];
      let bValue = b[field as keyof typeof b];

      if (typeof aValue === 'string') {
        const comparison = String(aValue).localeCompare(String(bValue));
        return newDirection === 'asc' ? comparison : -comparison;
      }

      const aNum = typeof aValue === 'number' ? aValue : 0;
      const bNum = typeof bValue === 'number' ? bValue : 0;
      return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });

    setFilteredCategories(sortedCategories);
  };

  // Handle page change
  const handlePageChange = (page:any) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (perPage: any) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  // Define table columns
  interface Category {
    id: string;
    name: string;
    description: string;
    giftsCount: number;
    color: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface Column {
    id: string;
    header: string;
    accessor: (row: Category) => any;
    sortable: boolean;
    width?: string;
    cell: (value: any, row?: Category) => JSX.Element;
  }

  const columns: Column[] = [
    {
      id: 'color',
      header: '',
      accessor: (row) => row.color,
      sortable: false,
      width: '50px',
      cell: (value) => (
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: value }}
        />
      )
    },
    {
      id: 'name',
      header: 'Category Name',
      accessor: (row) => row.name,
      sortable: true,
      cell: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{value}</span>
          <span className="text-xs text-gray-500">{row?.description}</span>
        </div>
      )
    },
    {
      id: 'giftsCount',
      header: 'Gifts',
      accessor: (row) => row.giftsCount,
      sortable: true,
      width: '100px',
      cell: (value) => (
        <div className="flex items-center">
          <Gift size={14} className="text-indigo-500 mr-1.5" strokeWidth={1.8} />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row.isActive,
      sortable: true,
      width: '120px',
      cell: (value) => (
        <div className="flex items-center">
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
      )
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessor: (row) => row.createdAt,
      sortable: true,
      width: '150px',
      cell: (value) => {
        const date = new Date(value);
        return (
          <span className="text-sm text-gray-600">
            {date.toLocaleDateString()}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => row.id,
      sortable: false,
      width: '120px',
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View category details"
            onClick={() => handleViewCategory(row!)}
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-100 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit category"
            onClick={() => handleEditCategory(row!)}
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete category"
            onClick={() => handleDeleteCategory(row!)}
          >
            <Trash2 size={16} strokeWidth={1.8} className={(row?.giftsCount ?? 0) > 0 ? "opacity-50" : ""} />
          </motion.button>
        </div>
      )
    }
  ];

  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.isActive).length;
  const totalGifts = categories.reduce((sum, cat) => sum + cat.giftsCount, 0);
  const categoriesWithGifts = categories.filter(cat => cat.giftsCount > 0).length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Gift Categories</h1>
          <p className="text-gray-500 mt-1">Manage categories for organizing gifts in the live stream</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}
            whileTap={{ y: 0 }}
            onClick={handleCreateCategory}
          >
            <PlusCircle size={16} className="mr-2" strokeWidth={1.8} />
            Create Category
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
            <Tag size={20} className="text-indigo-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Categories</p>
            <h3 className="text-lg font-semibold text-gray-800">{totalCategories}</h3>
            <p className="text-gray-600 text-xs">{activeCategories} active</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center"
          whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="mr-4 p-2 bg-green-50 rounded-lg">
            <Gift size={20} className="text-green-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Gifts</p>
            <h3 className="text-lg font-semibold text-gray-800">{totalGifts}</h3>
            <p className="text-gray-600 text-xs">Across {categoriesWithGifts} categories</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center"
          whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="mr-4 p-2 bg-amber-50 rounded-lg">
            <Palette size={20} className="text-amber-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-gray-500 text-xs">Avg. Gifts per Category</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {categoriesWithGifts > 0 ? (totalGifts / categoriesWithGifts).toFixed(1) : '0.0'}
            </h3>
            <p className="text-gray-600 text-xs">In active categories</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center"
          whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="mr-4 p-2 bg-purple-50 rounded-lg">
            <Settings size={20} className="text-purple-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-gray-500 text-xs">Empty Categories</p>
            <h3 className="text-lg font-semibold text-gray-800">{totalCategories - categoriesWithGifts}</h3>
            <p className="text-gray-600 text-xs">Categories without gifts</p>
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
          placeholder="Search categories by name or description..."
          onSearch={handleSearch}
          suggestions={[
            'basic',
            'premium',
            'seasonal'
          ]}
          recentSearches={recentSearches}
          showRecentByDefault={true}
        />
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <DataTable
          columns={columns}
          data={filteredCategories}
          selectable={false}
          isLoading={isLoading}
          emptyMessage="No categories found. Try adjusting your search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredCategories.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
          showSummary={true}
        />
      </motion.div>

      {/* Modal for View/Create/Edit/Delete */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">
                  {modalType === 'view' && 'Category Details'}
                  {modalType === 'create' && 'Create New Category'}
                  {modalType === 'edit' && 'Edit Category'}
                  {modalType === 'delete' && 'Delete Category'}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Category</h3>
                    <p className="text-gray-500 mb-6">
                      Are you sure you want to delete <span className="font-semibold">{selectedCategory?.name ?? 'this category'}</span>?
                      {selectedCategory && selectedCategory.giftsCount > 0 ? (
                        <span className="block text-red-500 mt-2">
                          This category contains {selectedCategory.giftsCount} gifts.
                          You must reassign or delete these gifts first.
                        </span>
                      ) : (
                        <span> This action cannot be undone.</span>
                      )}
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
                        onClick={confirmDeleteCategory}
                      >
                        Delete Category
                      </button>
                    </div>
                  </div>
                )}

                {modalType === 'view' && selectedCategory && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-lg"
                        style={{ backgroundColor: selectedCategory.color }}
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{selectedCategory.name}</h3>
                        <p className="text-gray-500">{selectedCategory.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Status</div>
                        <div className="font-medium">
                          {selectedCategory.isActive ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle size={16} className="mr-1" strokeWidth={1.8} />
                              Active
                            </span>
                          ) : (
                            <span className="text-gray-600 flex items-center">
                              <X size={16} className="mr-1" strokeWidth={1.8} />
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Gifts</div>
                        <div className="font-medium flex items-center">
                          <Gift size={16} className="text-indigo-500 mr-1" strokeWidth={1.8} />
                          {selectedCategory.giftsCount}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Created</div>
                        <div className="font-medium">
                          {new Date(selectedCategory.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                        <div className="font-medium">
                          {new Date(selectedCategory.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-end space-x-3">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          onClick={() => {
                            setModalType('edit');
                            setFormData({
                              name: selectedCategory.name,
                              description: selectedCategory.description,
                              color: selectedCategory.color,
                              isActive: selectedCategory.isActive
                            });
                          }}
                        >
                          <Edit size={16} className="inline mr-2" strokeWidth={1.8} />
                          Edit Category
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          onClick={handleCloseModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(modalType === 'create' || modalType === 'edit') && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter category name"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Describe this category"
                      />
                    </div>

                    <div>
                      <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                        Color <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-10 h-10 rounded-lg border border-gray-300"
                          style={{ backgroundColor: formData.color }}
                        />
                        <input
                          id="color"
                          name="color"
                          type="color"
                          required
                          value={formData.color}
                          onChange={handleChange}
                          className="p-1 border border-gray-300 rounded"
                        />
                        <span className="text-gray-600 font-mono text-sm">
                          {formData.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Active (visible to users)
                      </label>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          onClick={handleCloseModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Save size={16} className="inline mr-2" strokeWidth={1.8} />
                          {modalType === 'edit' ? 'Update' : 'Create'}
                        </button>
                      </div>
                    </div>
                  </form>
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