import { useState, useEffect, useMemo, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  AlertTriangle,
  Smartphone,
  Folder,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  X,
  Shield,
  HelpCircle,
  Info,
  Tag,
  BookOpen,
  Settings,
  BarChart3,
  MousePointer,
  Zap,
} from "lucide-react";
import supportService from "../../../api/services/support";
import toast from "react-hot-toast";
import EditCategory from "./EditCategory";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../constants/paths";

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
  defaultPriority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  children?: Category[];
}

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    firstResponseSla: 0,
    resolutionSla: 0,
    defaultPriority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    isActive: true,
  });
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState({
    totalCategories: 0,
    activeCategories: 0,
    avgResponseTime: 0,
    avgResolutionTime: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length) {
      const active = categories.filter((cat) => cat.isActive).length;
      const totalResponseTime = categories.reduce(
        (sum, cat) => sum + cat.firstResponseSla,
        0
      );
      const totalResolutionTime = categories.reduce(
        (sum, cat) => sum + cat.resolutionSla,
        0
      );

      setAnalytics({
        totalCategories: categories.length,
        activeCategories: active,
        avgResponseTime: Math.round(totalResponseTime / categories.length),
        avgResolutionTime: Math.round(totalResolutionTime / categories.length),
      });
    }
  }, [categories]);

  const fetchCategories = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      const response = await supportService.getCategories();
      setCategories(response.data.categories || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch categories. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setShowInactive(false);
    setSortField("name");
    setSortDirection("asc");
    const newExpanded: Record<string, boolean> = {};
    organizedCategories.forEach((cat) => {
      newExpanded[cat.id] = true;
    });
    setExpandedCategories(newExpanded);
  };

  const organizedCategories = useMemo(() => {
    const categoryMap = new Map<string, Category>();

    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    const rootCategories: Category[] = [];

    categoryMap.forEach((category) => {
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
    const sortCategories = (cats: Category[]) => {
      cats.sort((a, b) => {
        let aValue: any = a[sortField as keyof Category];
        let bValue: any = b[sortField as keyof Category];

        // Handle special cases
        if (sortField === "defaultPriority") {
          const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          aValue = priorityOrder[aValue] ?? 999;
          bValue = priorityOrder[bValue] ?? 999;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

      cats.forEach((cat) => {
        if (cat.children && cat.children.length > 0) {
          sortCategories(cat.children);
        }
      });

      return cats;
    };

    return sortCategories([...rootCategories]);
  }, [categories, sortField, sortDirection]);

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

    return organizedCategories.filter(
      (category) => matchesSearch(category) && matchesActiveFilter(category)
    );
  }, [organizedCategories, searchTerm, showInactive]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await supportService.deleteCategory(id);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
      setActiveMenu(null);

      toast.success("Category deleted successfully", {
        style: {
          background: "#10B981",
          color: "white",
          borderRadius: "12px",
        },
      });
    } catch (err) {
      toast.error("Failed to delete category", {
        style: {
          background: "#EF4444",
          color: "white",
          borderRadius: "12px",
        },
      });
      console.error("Failed to delete category", err);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      description: category.description,
      firstResponseSla: category.firstResponseSla,
      resolutionSla: category.resolutionSla,
      defaultPriority: category.defaultPriority,
      isActive: category.isActive,
    });
    setEditFormErrors({});
    setTouched({});
    setShowEditModal(true);
    setActiveMenu(null);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const updatedValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : name === "firstResponseSla" || name === "resolutionSla"
      ? parseInt(value) || 0
      : value;

    setEditFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on change
    validateField(name, updatedValue);
  };

  // Validate a single field
  const validateField = (name: string, value: any) => {
    let errors = { ...editFormErrors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          errors.name = "Name is required";
        } else if (value.length > 50) {
          errors.name = "Name cannot exceed 50 characters";
        } else {
          delete errors.name;
        }
        break;
      case "description":
        if (!value.trim()) {
          errors.description = "Description is required";
        } else {
          delete errors.description;
        }
        break;
      case "firstResponseSla":
        if (value <= 0) {
          errors.firstResponseSla = "Response time must be greater than 0";
        } else {
          delete errors.firstResponseSla;
        }
        break;
      case "resolutionSla":
        if (value <= 0) {
          errors.resolutionSla = "Resolution time must be greater than 0";
        } else if (value <= editFormData.firstResponseSla) {
          errors.resolutionSla =
            "Resolution time must be greater than response time";
        } else {
          delete errors.resolutionSla;
        }
        break;
      default:
        break;
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors: Record<string, string> = {};
    let allTouched: Record<string, boolean> = {};

    if (!editFormData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (editFormData.name.length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
      isValid = false;
    }

    if (!editFormData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (editFormData.firstResponseSla <= 0) {
      newErrors.firstResponseSla = "Response time must be greater than 0";
      isValid = false;
    }

    if (editFormData.resolutionSla <= 0) {
      newErrors.resolutionSla = "Resolution time must be greater than 0";
      isValid = false;
    } else if (editFormData.resolutionSla <= editFormData.firstResponseSla) {
      newErrors.resolutionSla =
        "Resolution time must be greater than response time";
      isValid = false;
    }

    Object.keys(editFormData).forEach((key) => {
      allTouched[key] = true;
    });

    setEditFormErrors(newErrors);
    setTouched(allTouched);

    return isValid;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!editingCategory) {
      return;
    }

    setIsSubmitting(true);

    try {
      await supportService.updateCategory(editingCategory.id, editFormData);

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...editFormData } : cat
        )
      );

      setShowEditModal(false);
      setEditingCategory(null);

      toast.success("Category updated successfully", {
        style: {
          background: "#10B981",
          color: "white",
          borderRadius: "12px",
        },
      });
    } catch (err) {
      toast.error("Failed to update category", {
        style: {
          background: "#EF4444",
          color: "white",
          borderRadius: "12px",
        },
      });
      console.error("Failed to update category", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time in hours and minutes
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    }
  };

  // Get human-readable time
  const getHumanReadableTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
      } else {
        return `${hours} hour${
          hours !== 1 ? "s" : ""
        } ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
      }
    }
  };

  // Get priority badge with appropriate styling
  const getPriorityBadge = (priority: string) => {
    const classes = {
      LOW: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      MEDIUM: "bg-blue-50 text-blue-700 border border-blue-200",
      HIGH: "bg-amber-50 text-amber-700 border border-amber-200",
      CRITICAL: "bg-rose-50 text-rose-700 border border-rose-200",
      default: "bg-slate-50 text-slate-700 border border-slate-200",
    };

    const icons = {
      LOW: <Shield size={12} className="mr-1 text-emerald-500" />,
      MEDIUM: <Shield size={12} className="mr-1 text-blue-500" />,
      HIGH: <Shield size={12} className="mr-1 text-amber-500" />,
      CRITICAL: <Shield size={12} className="mr-1 text-rose-500" />,
      default: <Shield size={12} className="mr-1 text-slate-500" />,
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          classes[priority] || classes.default
        }`}
      >
        {icons[priority] || icons.default}
        {priority.charAt(0) + priority.slice(1).toLowerCase()}
      </span>
    );
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "smartphone":
        return <Smartphone className="h-4 w-4" />;
      case "settings":
        return <Settings className="h-4 w-4" />;
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "chart":
        return <BarChart3 className="h-4 w-4" />;
      case "mouse":
        return <MousePointer className="h-4 w-4" />;
      default:
        return <Folder className="h-4 w-4" />;
    }
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const expandAll = () => {
    const expanded: Record<string, boolean> = {};

    const addCategory = (category: Category) => {
      expanded[category.id] = true;
      if (category.children) {
        category.children.forEach(addCategory);
      }
    };

    filteredCategories.forEach(addCategory);
    setExpandedCategories(expanded);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  const renderCategoryRow = (category: Category, depth = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories[category.id];
    const isHovered = hoveredCategory === category.id;

    return (
      <div key={category.id}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`
            border-b border-slate-100 transition-all duration-200
            ${depth === 0 ? "hover:bg-slate-50" : "hover:bg-slate-50/50"}
            ${isHovered ? "bg-slate-50" : ""}
            relative overflow-hidden
          `}
          style={{ paddingLeft: `${depth * 1.5}rem` }}
          onMouseEnter={() => setHoveredCategory(category.id)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className="flex items-center py-3 px-4">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="mr-2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-200 shadow-sm"
              style={{
                backgroundColor: `${category.color}15`,
                borderColor: `${category.color}30`,
                borderWidth: "1px",
              }}
            >
              <div style={{ color: category.color }}>
                {getCategoryIcon(category.icon)}
              </div>
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-slate-900 mr-2 truncate">
                  {category.name}
                </h3>
                {!category.isActive && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {category.description}
              </p>
            </div>

            <div className="hidden md:flex items-center space-x-6 text-sm mr-4">
              <div className="text-right">
                <p className="text-slate-500 text-xs">Response</p>
                <div className="font-medium text-slate-700 flex items-center justify-end">
                  <Clock className="w-3 h-3 mr-1 text-indigo-400" />
                  {formatTime(category.firstResponseSla)}
                </div>
              </div>

              <div className="text-right">
                <p className="text-slate-500 text-xs">Resolution</p>
                <div className="font-medium text-slate-700 flex items-center justify-end">
                  <Clock className="w-3 h-3 mr-1 text-indigo-400" />
                  {formatTime(category.resolutionSla)}
                </div>
              </div>

              <div className="w-24 text-right">
                <p className="text-slate-500 text-xs">Priority</p>
                <div className="flex justify-end mt-1">
                  {getPriorityBadge(category.defaultPriority)}
                </div>
              </div>
            </div>

            <div className="relative ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMenuPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.right - 150 + window.scrollX,
                  });
                  setActiveMenu(
                    activeMenu === category.id ? null : category.id
                  );
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {activeMenu === category.id && (
                <div
                  className="fixed inset-0 z-[100]"
                  onClick={() => setActiveMenu(null)}
                >
                  <div
                    className="absolute rounded-lg shadow-lg bg-white ring-1 ring-slate-200 z-[100] w-48"
                    style={{
                      position: "fixed",
                      top: `${menuPosition.top}px`,
                      left: `${menuPosition.left}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <Edit className="mr-3 h-4 w-4 text-slate-500" />
                        Edit Category
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="mr-3 h-4 w-4 text-rose-500" />
                        Delete Category
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isHovered && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/20 to-transparent -translate-x-full animate-shimmer-slow"></div>
            </div>
          )}
        </motion.div>

        {hasChildren && isExpanded && (
          <div>
            {category.children?.map((child) =>
              renderCategoryRow(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-50/80 border border-indigo-100/80 rounded-lg text-indigo-600 text-xs font-medium mb-2 backdrop-blur-sm">
              <div className="flex items-center">
                <Tag size={12} className="text-indigo-500 mr-1.5" />
                <span>Support Configuration</span>
              </div>
            </div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center">
              <Folder size={22} className="text-indigo-500 mr-2" />
              Ticket Categories
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage support ticket categories and classification
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(PATHS.ADMIN.SUPPORT.CATEGORY_CREATE)}
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-indigo-100/50"></div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Total Categories
            </h3>
            <div className="text-2xl font-bold text-slate-900">
              {analytics.totalCategories}
            </div>
            <div className="mt-2 text-xs text-slate-600 flex items-center">
              <Tag size={14} className="mr-1.5 text-indigo-500" />
              <span>
                {analytics.activeCategories} active,{" "}
                {analytics.totalCategories - analytics.activeCategories}{" "}
                inactive
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-amber-100/50"></div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Avg. Response Time
            </h3>
            <div className="text-2xl font-bold text-slate-900">
              {formatTime(analytics.avgResponseTime)}
            </div>
            <div className="mt-2 text-xs text-slate-600 flex items-center">
              <Clock size={14} className="mr-1.5 text-amber-500" />
              <span>{getHumanReadableTime(analytics.avgResponseTime)}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-emerald-100/50"></div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Avg. Resolution Time
            </h3>
            <div className="text-2xl font-bold text-slate-900">
              {formatTime(analytics.avgResolutionTime)}
            </div>
            <div className="mt-2 text-xs text-slate-600 flex items-center">
              <Clock size={14} className="mr-1.5 text-emerald-500" />
              <span>{getHumanReadableTime(analytics.avgResolutionTime)}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-violet-100/50"></div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Priority Distribution
            </h3>
            <div className="flex items-center space-x-2 mt-2">
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((priority) => {
                const count = categories.filter(
                  (cat) => cat.defaultPriority === priority
                ).length;
                const percentage = categories.length
                  ? Math.round((count / categories.length) * 100)
                  : 0;

                return (
                  <div
                    key={priority}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          priority === "LOW"
                            ? "bg-emerald-500"
                            : priority === "MEDIUM"
                            ? "bg-blue-500"
                            : priority === "HIGH"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 font-medium">
                      {percentage}%
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {priority.charAt(0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-2 items-center">
          <div className="w-full md:w-1/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex space-x-2 ml-auto">
            <div className="flex space-x-2">
              <button
                onClick={expandAll}
                className="inline-flex items-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-colors"
              >
                <ChevronDown className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Expand All
              </button>

              <button
                onClick={collapseAll}
                className="inline-flex items-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Collapse All
              </button>
            </div>

            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-lg shadow-sm transition-colors ${
                showInactive
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              {showInactive ? "Showing Inactive" : "Show Inactive"}
            </button>

            <button
              onClick={() => {
                resetFilters();
                fetchCategories();
              }}
              className="inline-flex items-center px-3 py-1.5 border border-slate-200 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${
                  isRefreshing ? "animate-spin text-indigo-500" : ""
                }`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Categories List */}
        {loading && !isRefreshing ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-sm p-8 border border-slate-200/80">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin opacity-70"
                style={{ animationDuration: "1.5s" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Folder size={24} className="text-indigo-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Loading categories
            </h3>
            <p className="text-slate-500 text-center max-w-sm">
              Please wait while we fetch the category data...
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-rose-700">{error}</p>
                <div className="mt-2">
                  <button
                    onClick={fetchCategories}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-rose-700 bg-rose-100 hover:bg-rose-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-slate-200/80">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Folder className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No categories found
            </h3>
            <p className="text-slate-500 text-center max-w-sm mx-auto mb-6">
              {searchTerm || showInactive
                ? "No categories match your current filters. Try adjusting your search criteria."
                : "Get started by creating your first support ticket category."}
            </p>

            {searchTerm || showInactive ? (
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <X className="w-4 h-4 mr-1.5" />
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => console.log("Create new category")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                New Category
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200/80">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center text-xs font-medium text-slate-500 uppercase tracking-wider">
              <div className="flex-grow flex items-center">
                <button
                  className="flex items-center text-left focus:outline-none group"
                  onClick={() => handleSort("name")}
                >
                  <span>Category</span>
                  <span
                    className={`ml-1 transition-colors ${
                      sortField === "name"
                        ? "text-indigo-500"
                        : "text-slate-400 group-hover:text-slate-500"
                    }`}
                  >
                    {sortField === "name" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    ) : (
                      <ArrowDown className="h-3 w-3 opacity-30" />
                    )}
                  </span>
                </button>
              </div>

              <div className="hidden md:flex items-center space-x-12 mr-12">
                <div className="w-20 text-center">
                  <button
                    className="flex items-center text-left focus:outline-none group"
                    onClick={() => handleSort("firstResponseSla")}
                  >
                    <span>Response</span>
                    <span
                      className={`ml-1 transition-colors ${
                        sortField === "firstResponseSla"
                          ? "text-indigo-500"
                          : "text-slate-400 group-hover:text-slate-500"
                      }`}
                    >
                      {sortField === "firstResponseSla" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowDown className="h-3 w-3 opacity-30" />
                      )}
                    </span>
                  </button>
                </div>

                <div className="w-20 text-center">
                  <button
                    className="flex items-center text-left focus:outline-none group"
                    onClick={() => handleSort("resolutionSla")}
                  >
                    <span>Resolution</span>
                    <span
                      className={`ml-1 transition-colors ${
                        sortField === "resolutionSla"
                          ? "text-indigo-500"
                          : "text-slate-400 group-hover:text-slate-500"
                      }`}
                    >
                      {sortField === "resolutionSla" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowDown className="h-3 w-3 opacity-30" />
                      )}
                    </span>
                  </button>
                </div>

                <div className="w-20 text-center">
                  <button
                    className="flex items-center text-left focus:outline-none group"
                    onClick={() => handleSort("defaultPriority")}
                  >
                    <span>Priority</span>
                    <span
                      className={`ml-1 transition-colors ${
                        sortField === "defaultPriority"
                          ? "text-indigo-500"
                          : "text-slate-400 group-hover:text-slate-500"
                      }`}
                    >
                      {sortField === "defaultPriority" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowDown className="h-3 w-3 opacity-30" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              <div className="w-10">
                <span className="sr-only">Actions</span>
              </div>
            </div>

            <div>
              {filteredCategories.map((category) =>
                renderCategoryRow(category)
              )}
            </div>

            {/* Bottom info */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 flex items-center justify-between">
              <div className="flex items-center">
                <Info size={14} className="mr-1.5 text-indigo-400" />
                <span>
                  Showing {filteredCategories.length} of {categories.length}{" "}
                  categories
                </span>
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1.5 text-slate-400" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Information Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 bg-gradient-to-r from-indigo-50/80 to-white backdrop-blur-sm rounded-xl p-5 border border-indigo-100/50 shadow-md"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-indigo-100 rounded-lg p-2 text-indigo-600">
              <Info size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                About Ticket Categories
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Categories help organize support tickets and automatically apply
                the right SLA rules. Each category can have its own response
                time, resolution time, and default priority.
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <HelpCircle size={14} className="mr-1" />
                  Category Documentation
                </a>
                <a
                  href="#"
                  className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <Users size={14} className="mr-1" />
                  Support Best Practices
                </a>
                <a
                  href="#"
                  className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <BarChart3 size={14} className="mr-1" />
                  Category Analytics
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showEditModal && editingCategory && (
          <EditCategory
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            editFormErrors={editFormErrors}
            handleEditFormChange={handleEditFormChange}
            handleEditSubmit={handleEditSubmit}
            isSubmitting={isSubmitting}
            setShowEditModal={setShowEditModal}
            touched={touched}
            getHumanReadableTime={getHumanReadableTime}
            formatTime={formatTime}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const keyframes = `
@keyframes shimmer-slow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

const style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(keyframes));
document.head.appendChild(style);
