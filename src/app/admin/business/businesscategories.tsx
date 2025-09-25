import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  X,
  Save,
  Filter,
  Download,
  Briefcase,
  Grid,
  List,
  FolderPlus,
  Settings,
  Move,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import businessService from "../../../api/services/businessService";
import { toast } from "react-hot-toast";

const BusinessCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]); 
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [expandedParents, setExpandedParents] = useState({});
  const [isReordering, setIsReordering] = useState(false);
  const [showCategorySettings, setShowCategorySettings] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#6366f1",
    parentId: "",
  });

  const [categorySettings, setCategorySettings] = useState({
    allowCustomColors: true,
    allowSubcategories: true,
    maxNestedLevel: 2,
    requireApproval: false,
    showBusinessCount: true,
    showInSearch: true,
    defaultSortOrder: "alphabetical",
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await businessService.getBusinessCategories();
      // Add default icon and color for UI consistency
      const formattedCategories = response.map((cat, index) => ({
        ...cat,
        icon: "🏷️",
        color: ["#6366f1", "#ef4444", "#10b981", "#a855f7", "#f59e0b"][index % 5],
        businessCount: cat.businessCount || 0, // Assuming API might provide this
      }));
      setCategories(formattedCategories);
      setFilteredCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Could not load categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();

    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(lowercaseSearch) ||
        (category.description && category.description.toLowerCase().includes(lowercaseSearch))
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCategory = () => {
    setNewCategory({
      name: "",
      description: "",
      icon: "",
      color: "#6366f1",
      parentId: "",
    });
    setShowAddModal(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      parentId: category.parentId || "",
    });
    setShowEditModal(true);
  };

  const handleDeleteCategory = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };

  const confirmAddCategory = async () => {
    try {
      await businessService.createBusinessCategory({
        name: newCategory.name,
        description: newCategory.description,
      });
      toast.success("Category created successfully!");
      fetchCategories(); // Refetch to show the new category
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error((error as Error).message || "Failed to create category.");
    } finally {
      setShowAddModal(false);
    }
  };

  const confirmEditCategory = async () => {
    if (!currentCategory) return;
    try {
      await businessService.updateBusinessCategory(currentCategory.id, {
        name: newCategory.name,
        description: newCategory.description,
      });
      toast.success("Category updated successfully!");
      fetchCategories(); // Refetch to show the changes
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error((error as Error).message || "Failed to update category.");
    } finally {
      setShowEditModal(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!currentCategory) return;
    try {
      await businessService.deleteBusinessCategory(currentCategory.id);
      toast.success("Category deleted successfully!");
      fetchCategories(); // Refetch to remove the deleted category
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error((error as Error).message || "Failed to delete category.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const toggleExpandCategory = (categoryId) => {
    setExpandedParents({
      ...expandedParents,
      [categoryId]: !expandedParents[categoryId],
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (
      source.droppableId === "main-categories" &&
      destination.droppableId === "main-categories"
    ) {
      const reordered = Array.from(categories);
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);

      setCategories(reordered);
      return;
    }

    // If dragging between subcategories, this would be more complex
    // For simplicity, we're just handling top-level reordering here
    // In a real app, you'd need to handle subcategory reordering as well
  };
  const renderCategoryItem = (category, index, isSubcategory = false) => {
    if (viewMode === "grid") {
      return (
        <motion.div
          key={category.id}
          className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 ${
            isSubcategory ? "ml-6" : ""
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <span className="text-lg" style={{ color: category.color }}>
                  {category.icon}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {category.name}
                </h3>
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleEditCategory(category)}
              >
                <Edit size={16} />
              </button>
              <button
                className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleDeleteCategory(category)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {category.description}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {category.businessCount} businesses
            </span>
          </div>
        </motion.div>
      );
    } else {
      // List view
      return (
        <motion.div
          key={category.id}
          className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-center justify-between ${
            isSubcategory ? "ml-6" : ""
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <span className="text-lg" style={{ color: category.color }}>
                {category.icon}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                {category.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {category.businessCount} businesses
            </span>

            <div className="flex space-x-1">
              <button
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleEditCategory(category)}
              >
                <Edit size={16} />
              </button>
              <button
                className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleDeleteCategory(category)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                onClick={() => navigate("/admin/business/all-businesses")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-400 bg-clip-text text-transparent">
                  Business Categories
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Manage categories for business listings on WasaaChat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400"
                onClick={() => setShowCategorySettings(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Category Settings"
              >
                <Settings size={18} />
              </motion.button>
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400"
                onClick={() => setIsReordering(!isReordering)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isReordering ? "Save Order" : "Reorder Categories"}
              >
                {isReordering ? <Save size={18} /> : <Move size={18} />}
              </motion.button>
              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                onClick={handleAddCategory}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} />
                Add Category
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-gray-800 w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setViewMode("grid")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Grid View"
            >
              <Grid size={18} />
            </motion.button>
            <motion.button
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setViewMode("list")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="List View"
            >
              <List size={18} />
            </motion.button>

            <motion.button
              className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </motion.button>

            <motion.button
              className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </motion.button>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Categories
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {categories.length}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <Tag className="text-blue-500 dark:text-blue-400" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Top-Level Categories
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {categories.length}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
                <FolderPlus
                  className="text-green-500 dark:text-green-400"
                  size={20}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Subcategories
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  0
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                <Tag className="text-amber-500 dark:text-amber-400" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Businesses
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {categories.reduce((sum, cat) => sum + cat.businessCount, 0)}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                <Briefcase
                  className="text-purple-500 dark:text-purple-400"
                  size={20}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Container */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 animate-pulse"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 mr-3"></div>
                    <div>
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 text-center">
            <Tag className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm
                ? `No categories matching "${searchTerm}"`
                : "There are no categories yet. Create one to get started."}
            </p>
            <motion.button
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
              onClick={handleAddCategory}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={16} />
              Add Category
            </motion.button>
          </div>
        ) : isReordering ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="main-categories">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {filteredCategories.map((category, index) => (
                    <Draggable
                      key={category.id}
                      draggableId={category.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Move className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <span
                                className="text-lg"
                                style={{ color: category.color }}
                              >
                                {category.icon}
                              </span>
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {category.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                              {category.businessCount} businesses
                            </span>
                            {category.subCategories &&
                              category.subCategories.length > 0 && (
                                <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                                  {category.subCategories.length} subcategories
                                </span>
                              )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {filteredCategories.map((category, index) =>
              renderCategoryItem(category, index)
            )}
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Add New Category
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="categoryName"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  placeholder="e.g., Technology, Retail, Food & Beverage"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="categoryDescription"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="categoryDescription"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  placeholder="Brief description of this category"
                  rows={3}
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="categoryIcon"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    id="categoryIcon"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="e.g., 💻, 🍽️, 🛍️"
                    value={newCategory.icon}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, icon: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="categoryColor"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="categoryColor"
                      className="h-9 w-9 p-0 border-0 rounded-lg"
                      value={newCategory.color}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          color: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="flex-1 ml-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      placeholder="#RRGGBB"
                      value={newCategory.color}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          color: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {false && ( // Sub-categories are disabled as per simple API structure
                <div>
                  <label
                    htmlFor="parentCategory"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Parent Category (optional)
                  </label>
                  <select
                    id="parentCategory"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    value={newCategory.parentId}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        parentId: e.target.value,
                      })
                    }
                  >
                    <option value="">None (Top-level category)</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Select a parent category to create a subcategory
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  onClick={confirmAddCategory}
                  disabled={!newCategory.name.trim()}
                >
                  Create Category
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && currentCategory && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Edit Category
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="editCategoryName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="editCategoryName"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="editCategoryDescription"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="editCategoryDescription"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  rows={3}
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="editCategoryIcon"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    id="editCategoryIcon"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    value={newCategory.icon}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, icon: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="editCategoryColor"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="editCategoryColor"
                      className="h-9 w-9 p-0 border-0 rounded-lg"
                      value={newCategory.color}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          color: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="flex-1 ml-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      value={newCategory.color}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          color: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between space-x-3 pt-4">
                <button
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  onClick={() => {
                    setShowEditModal(false);
                    handleDeleteCategory(currentCategory);
                  }}
                >
                  Delete
                </button>

                <div className="flex space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    onClick={confirmEditCategory}
                    disabled={!newCategory.name.trim()}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentCategory && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">Delete Category</h3>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Are you sure you want to delete{" "}
              <strong>{currentCategory.name}</strong>?
            </p>

            {currentCategory.businessCount > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-4">
                <p className="text-amber-800 dark:text-amber-400 text-sm">
                  <strong>Warning:</strong> This category contains{" "}
                  {currentCategory.businessCount} businesses. Deleting it will
                  unassign these businesses from this category.
                </p>
              </div>
            )}

            {currentCategory.subCategories &&
              currentCategory.subCategories.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4">
                  <p className="text-red-800 dark:text-red-400 text-sm">
                    <strong>Caution:</strong> This category has{" "}
                    {currentCategory.subCategories.length} subcategories that
                    will also be deleted.
                  </p>
                </div>
              )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                onClick={confirmDeleteCategory}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Category Settings Modal */}
      {showCategorySettings && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCategorySettings(false)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Category System Settings
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setShowCategorySettings(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Allow Custom Colors
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable businesses to set custom category colors
                  </p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="allowCustomColors"
                    className="hidden"
                    checked={categorySettings.allowCustomColors}
                    onChange={(e) =>
                      setCategorySettings({
                        ...categorySettings,
                        allowCustomColors: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="allowCustomColors"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      categorySettings.allowCustomColors
                        ? "bg-blue-600 dark:bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        categorySettings.allowCustomColors
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    ></span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Allow Subcategories
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable nested category hierarchies
                  </p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="allowSubcategories"
                    className="hidden"
                    checked={categorySettings.allowSubcategories}
                    onChange={(e) =>
                      setCategorySettings({
                        ...categorySettings,
                        allowSubcategories: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="allowSubcategories"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      categorySettings.allowSubcategories
                        ? "bg-blue-600 dark:bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        categorySettings.allowSubcategories
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    ></span>
                  </label>
                </div>
              </div>

              {categorySettings.allowSubcategories && (
                <div className="flex items-center justify-between py-2 pl-6 border-l-2 border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      Maximum Nesting Level
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Maximum depth of category hierarchy
                    </p>
                  </div>
                  <select
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                    value={categorySettings.maxNestedLevel}
                    onChange={(e) =>
                      setCategorySettings({
                        ...categorySettings,
                        maxNestedLevel: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={1}>1 level</option>
                    <option value={2}>2 levels</option>
                    <option value={3}>3 levels</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Require Admin Approval
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Admin must approve business-submitted categories
                  </p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="requireApproval"
                    className="hidden"
                    checked={categorySettings.requireApproval}
                    onChange={(e) =>
                      setCategorySettings({
                        ...categorySettings,
                        requireApproval: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="requireApproval"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      categorySettings.requireApproval
                        ? "bg-blue-600 dark:bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        categorySettings.requireApproval
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    ></span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Show Business Count
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display number of businesses in each category
                  </p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="showBusinessCount"
                    className="hidden"
                    checked={categorySettings.showBusinessCount}
                    onChange={(e) =>
                      setCategorySettings({
                        ...categorySettings,
                        showBusinessCount: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="showBusinessCount"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      categorySettings.showBusinessCount
                        ? "bg-blue-600 dark:bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        categorySettings.showBusinessCount
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    ></span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Show in Search Results
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display categories in public search results
                  </p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="showInSearch"
                    className="hidden"
                    checked={categorySettings.showInSearch}
                    onChange={(e) =>
                      setCategorySettings({
                        ...categorySettings,
                        showInSearch: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="showInSearch"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      categorySettings.showInSearch
                        ? "bg-blue-600 dark:bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                        categorySettings.showInSearch
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    ></span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Default Sort Order
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Default ordering of categories
                  </p>
                </div>
                <select
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  value={categorySettings.defaultSortOrder}
                  onChange={(e) =>
                    setCategorySettings({
                      ...categorySettings,
                      defaultSortOrder: e.target.value,
                    })
                  }
                >
                  <option value="alphabetical">Alphabetical</option>
                  <option value="businessCount">Business Count</option>
                  <option value="custom">Custom Order</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setShowCategorySettings(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  onClick={() => setShowCategorySettings(false)}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BusinessCategoriesPage;