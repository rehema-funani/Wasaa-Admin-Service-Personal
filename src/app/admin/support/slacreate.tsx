import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Clock,
  Tag,
  AlertTriangle,
  Shield,
  ChevronDown,
  Info,
  Check,
  X,
  Search,
  HelpCircle,
  Users,
  Bell,
  FileCheck,
  ChevronRight,
  Activity,
  Zap,
  Calendar,
  CheckCircle2,
  Filter,
  BarChart3,
} from "lucide-react";
import supportService from "../../../api/services/support";

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  color: string;
  icon: string;
  isActive: boolean;
}

interface SLAFormData {
  name: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  categoryIds: string[];
  businessHours: boolean;
  responseTime: number;
  resolutionTime: number;
  isActive: boolean;
}

interface PriorityInfo {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  icon: React.ReactNode;
}

export default function SLACreatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SLAFormData>({
    name: "",
    description: "",
    priority: "MEDIUM",
    categoryIds: [],
    businessHours: false,
    responseTime: 60,
    resolutionTime: 240,
    isActive: true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [slaTemplates] = useState([
    {
      name: "Standard Support",
      responseTime: 120,
      resolutionTime: 480,
      priority: "MEDIUM",
    },
    {
      name: "Premium Support",
      responseTime: 30,
      resolutionTime: 240,
      priority: "HIGH",
    },
    {
      name: "Enterprise Support",
      responseTime: 15,
      resolutionTime: 120,
      priority: "CRITICAL",
    },
  ]);
  const [showTemplateSuggestions, setShowTemplateSuggestions] = useState(false);

  const priorityInfo: Record<string, PriorityInfo> = {
    LOW: {
      label: "Low",
      color: "text-slate-700",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "For non-urgent issues with minimal business impact",
      icon: <Shield size={16} className="text-slate-500" />,
    },
    MEDIUM: {
      label: "Medium",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "For standard issues that affect specific functionality",
      icon: <Shield size={16} className="text-blue-500" />,
    },
    HIGH: {
      label: "High",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "For urgent issues affecting core business operations",
      icon: <Shield size={16} className="text-amber-500" />,
    },
    CRITICAL: {
      label: "Critical",
      color: "text-rose-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      description: "For severe issues causing system outage or data loss",
      icon: <Shield size={16} className="text-rose-500" />,
    },
  };

  const recommendedTimes: Record<
    string,
    { response: number; resolution: number }
  > = {
    LOW: { response: 240, resolution: 1440 },
    MEDIUM: { response: 120, resolution: 480 },
    HIGH: { response: 60, resolution: 240 },
    CRITICAL: { response: 30, resolution: 120 },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await supportService.getCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!touched.responseTime && !touched.resolutionTime) {
      const recommended = recommendedTimes[formData.priority];
      if (recommended) {
        setFormData((prev) => ({
          ...prev,
          responseTime: recommended.response,
          resolutionTime: recommended.resolution,
        }));
      }
    }
  }, [formData.priority, touched.responseTime, touched.resolutionTime]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle number values
    if (name === "responseTime" || name === "resolutionTime") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Mark field as touched
    setTouched({ ...touched, [name]: true });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    setTouched({ ...touched, [name]: true });
  };

  // Toggle category selection
  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => {
      const newCategoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId];

      return { ...prev, categoryIds: newCategoryIds };
    });

    setTouched({ ...touched, categoryIds: true });
  };

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
        category.description
          .toLowerCase()
          .includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  // Get selected categories as objects
  const selectedCategoryObjects = useMemo(() => {
    return categories.filter((cat) => formData.categoryIds.includes(cat.id));
  }, [categories, formData.categoryIds]);

  // Apply template
  const applyTemplate = (template: (typeof slaTemplates)[0]) => {
    setFormData((prev) => ({
      ...prev,
      responseTime: template.responseTime,
      resolutionTime: template.resolutionTime,
      priority: template.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    }));

    // Mark these fields as touched
    setTouched((prev) => ({
      ...prev,
      responseTime: true,
      resolutionTime: true,
      priority: true,
    }));

    setShowTemplateSuggestions(false);
  };

  // Form validation
  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name) errors.name = "Name is required";
    if (!formData.description) errors.description = "Description is required";
    if (formData.responseTime <= 0)
      errors.responseTime = "Response time must be greater than 0";
    if (formData.resolutionTime <= 0)
      errors.resolutionTime = "Resolution time must be greater than 0";
    if (formData.resolutionTime <= formData.responseTime) {
      errors.resolutionTime =
        "Resolution time must be greater than response time";
    }
    if (formData.categoryIds.length === 0)
      errors.categoryIds = "At least one category must be selected";

    return errors;
  };

  // Get validation error for a field
  const getError = (field: string) => {
    if (!touched[field]) return null;

    const errors = validate();
    return errors[field] || null;
  };

  // Format time in hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} minutes`;
    } else if (mins === 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return `${hours} hour${hours > 1 ? "s" : ""} ${mins} minute${
        mins > 1 ? "s" : ""
      }`;
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      // Mark all fields as touched to show errors
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await supportService.createSLARule(formData);
      navigate(-1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create SLA rule");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Progress indicator calculation
  const calculateProgress = () => {
    const fields = [
      "name",
      "description",
      "priority",
      "responseTime",
      "resolutionTime",
      "categoryIds",
    ];

    const completedFields = fields.filter((field) => {
      if (field === "categoryIds") return formData.categoryIds.length > 0;
      return !!formData[field as keyof SLAFormData];
    });

    return Math.round((completedFields.length / fields.length) * 100);
  };

  // Navigation buttons based on section
  const renderSectionNav = () => {
    const sections = [
      { id: "basic", label: "Basic Info", icon: <FileCheck size={16} /> },
      { id: "timing", label: "Time Settings", icon: <Clock size={16} /> },
      { id: "categories", label: "Categories", icon: <Tag size={16} /> },
    ];

    return (
      <div className="flex items-center space-x-2 mb-6 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeSection === section.id
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {section.icon}
            <span className="ml-2">{section.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
            whileHover={{ x: -3 }}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to SLA Rules
          </motion.button>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-slate-500 flex items-center bg-white py-1.5 px-3 rounded-lg border border-slate-200 shadow-sm">
              <Activity size={16} className="text-indigo-500 mr-2" />
              Completion:
              <div className="ml-2 w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <span className="ml-2 font-medium text-slate-700">
                {calculateProgress()}%
              </span>
            </div>

            <button
              onClick={() =>
                setShowTemplateSuggestions(!showTemplateSuggestions)
              }
              className="inline-flex items-center text-sm bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors relative"
            >
              <Zap size={16} className="mr-1.5 text-amber-500" />
              Templates
              {showTemplateSuggestions && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 p-2 z-10">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-2">
                    Suggested Templates
                  </div>
                  {slaTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        applyTemplate(template);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors flex items-center justify-between"
                    >
                      <span>{template.name}</span>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200/80"
        >
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50/50 to-white flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 flex items-center">
                <Shield size={20} className="text-indigo-500 mr-2" />
                Create New SLA Rule
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Define service level agreements for support tickets
              </p>
            </div>

            <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-indigo-100 flex items-center">
              <Bell size={14} className="mr-1.5" />
              Support Configuration
            </div>
          </div>

          {renderSectionNav()}

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-rose-50 border border-rose-200 p-4 rounded-lg shadow-sm"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-rose-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-rose-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className={activeSection === "basic" ? "block" : "hidden"}>
                <div className="flex items-center mb-4">
                  <FileCheck size={18} className="text-indigo-500 mr-2" />
                  <h2 className="text-lg font-medium text-slate-900">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700"
                    >
                      SLA Rule Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 sm:text-sm rounded-lg shadow-sm transition-colors duration-200 ${
                          getError("name")
                            ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/50"
                            : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                        placeholder="e.g. Premium Support SLA"
                      />
                      {getError("name") ? (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertTriangle size={18} className="text-rose-500" />
                        </div>
                      ) : (
                        touched.name && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500"
                            />
                          </div>
                        )
                      )}
                    </div>
                    {getError("name") && (
                      <p className="mt-1 text-sm text-rose-600 flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        {getError("name")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Priority Level <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                      >
                        {Object.keys(priorityInfo).map((key) => (
                          <option key={key} value={key}>
                            {priorityInfo[key].label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown size={18} className="text-slate-400" />
                      </div>
                    </div>
                    <div
                      className={`mt-2 p-3 rounded-lg ${
                        priorityInfo[formData.priority].bgColor
                      } ${
                        priorityInfo[formData.priority].borderColor
                      } border flex items-start`}
                    >
                      {priorityInfo[formData.priority].icon}
                      <span
                        className={`text-xs ml-2 ${
                          priorityInfo[formData.priority].color
                        }`}
                      >
                        {priorityInfo[formData.priority].description}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 sm:text-sm rounded-lg shadow-sm transition-colors duration-200 ${
                          getError("description")
                            ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/50"
                            : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                        placeholder="Describe the purpose of this SLA rule and when it should be applied..."
                      ></textarea>
                      {getError("description") ? (
                        <div className="absolute top-3 right-3 pointer-events-none">
                          <AlertTriangle size={18} className="text-rose-500" />
                        </div>
                      ) : (
                        touched.description && (
                          <div className="absolute top-3 right-3 pointer-events-none">
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500"
                            />
                          </div>
                        )
                      )}
                    </div>
                    {getError("description") && (
                      <p className="mt-1 text-sm text-rose-600 flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        {getError("description")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Settings Section */}
              <div className={activeSection === "timing" ? "block" : "hidden"}>
                <div className="flex items-center mb-4">
                  <Clock size={18} className="text-indigo-500 mr-2" />
                  <h2 className="text-lg font-medium text-slate-900">
                    Time Settings
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="responseTime"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Response Time (minutes){" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        id="responseTime"
                        name="responseTime"
                        min="1"
                        value={formData.responseTime}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-12 py-3 sm:text-sm rounded-lg transition-colors duration-200 ${
                          getError("responseTime")
                            ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/50"
                            : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span
                          className="text-slate-500 sm:text-sm"
                          id="price-currency"
                        >
                          min
                        </span>
                      </div>
                    </div>
                    {getError("responseTime") ? (
                      <p className="mt-1 text-sm text-rose-600 flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        {getError("responseTime")}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-500 flex items-center">
                        <Info size={12} className="mr-1.5" />
                        Maximum time to first response (
                        {formatTime(formData.responseTime)})
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="resolutionTime"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Resolution Time (minutes){" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        id="resolutionTime"
                        name="resolutionTime"
                        min="1"
                        value={formData.resolutionTime}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-12 py-3 sm:text-sm rounded-lg transition-colors duration-200 ${
                          getError("resolutionTime")
                            ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/50"
                            : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-slate-500 sm:text-sm">min</span>
                      </div>
                    </div>
                    {getError("resolutionTime") ? (
                      <p className="mt-1 text-sm text-rose-600 flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        {getError("resolutionTime")}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-500 flex items-center">
                        <Info size={12} className="mr-1.5" />
                        Maximum time to resolve the ticket (
                        {formatTime(formData.resolutionTime)})
                      </p>
                    )}
                  </div>

                  {/* Timeline visualization */}
                  <div className="sm:col-span-2 my-2">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                        <BarChart3
                          size={16}
                          className="mr-1.5 text-indigo-500"
                        />
                        SLA Timeline Visualization
                      </h3>

                      <div className="relative h-14">
                        {/* Timeline bar */}
                        <div className="absolute top-8 left-0 right-0 h-2 bg-slate-200 rounded-full"></div>

                        {/* Ticket created marker */}
                        <div className="absolute top-6 left-0 flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></div>
                          <div className="text-xs font-medium text-slate-700 mt-1">
                            Created
                          </div>
                        </div>

                        {/* Response marker */}
                        <div
                          className="absolute top-6 flex flex-col items-center"
                          style={{
                            left: `${Math.min(
                              30,
                              (formData.responseTime /
                                (formData.resolutionTime * 1.2)) *
                                100
                            )}%`,
                          }}
                        >
                          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm"></div>
                          <div className="text-xs font-medium text-amber-700 mt-1">
                            Response
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {formatTime(formData.responseTime)}
                          </div>
                        </div>

                        {/* Resolution marker */}
                        <div
                          className="absolute top-6 flex flex-col items-center"
                          style={{
                            left: `${Math.min(
                              90,
                              (formData.resolutionTime /
                                (formData.resolutionTime * 1.2)) *
                                100
                            )}%`,
                          }}
                        >
                          <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                          <div className="text-xs font-medium text-emerald-700 mt-1">
                            Resolution
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {formatTime(formData.resolutionTime)}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div
                          className="absolute top-8 left-0 h-2 bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              90,
                              (formData.resolutionTime /
                                (formData.resolutionTime * 1.2)) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-start bg-white rounded-lg p-4 border border-slate-200 transition-colors duration-200 hover:bg-indigo-50/30 hover:border-indigo-200/50">
                      <div className="flex items-center h-5 mt-0.5">
                        <input
                          id="businessHours"
                          name="businessHours"
                          type="checkbox"
                          checked={formData.businessHours}
                          onChange={handleCheckboxChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <label
                          htmlFor="businessHours"
                          className="font-medium text-slate-700 flex items-center text-sm"
                        >
                          <Calendar
                            size={16}
                            className="mr-1.5 text-indigo-500"
                          />
                          Business Hours Only
                        </label>
                        <p className="text-slate-500 text-sm mt-1">
                          When enabled, SLA timers only run during configured
                          business hours. This prevents SLA violations during
                          off-hours.
                        </p>
                      </div>

                      {/* Help tooltip button */}
                      <div
                        className="text-slate-400 hover:text-indigo-500 cursor-help transition-colors"
                        onMouseEnter={() => setShowTooltip("businessHours")}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <HelpCircle size={16} />
                      </div>

                      {/* Tooltip */}
                      {showTooltip === "businessHours" && (
                        <div className="absolute right-10 top-4 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                          <p>
                            Business hours are configured in your system
                            settings. Current hours are Monday-Friday, 9:00 AM -
                            5:00 PM in your local timezone.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Section */}
              <div
                className={activeSection === "categories" ? "block" : "hidden"}
              >
                <div className="flex items-center mb-4">
                  <Tag size={18} className="text-indigo-500 mr-2" />
                  <h2 className="text-lg font-medium text-slate-900">
                    Categories
                  </h2>
                </div>

                <div>
                  <label
                    htmlFor="categoryIds"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Apply to Categories <span className="text-rose-500">*</span>
                  </label>

                  <div className="mt-1">
                    {categoriesLoading ? (
                      <div className="border border-slate-300 rounded-lg px-4 py-3 bg-slate-50">
                        <div className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-3 py-1">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`border rounded-lg transition-colors duration-200 ${
                          getError("categoryIds")
                            ? "border-rose-300 bg-rose-50/50"
                            : "border-slate-300"
                        }`}
                      >
                        {/* Selected categories display */}
                        <div className="p-3 flex flex-wrap gap-2">
                          {selectedCategoryObjects.length > 0 ? (
                            selectedCategoryObjects.map((category) => (
                              <div
                                key={category.id}
                                className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm group"
                              >
                                <Tag
                                  size={14}
                                  className="mr-1.5 text-indigo-500"
                                />
                                {category.name}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCategoryToggle(category.id)
                                  }
                                  className="ml-1.5 text-indigo-400 hover:text-indigo-700 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="text-slate-500 text-sm">
                              No categories selected
                            </div>
                          )}
                        </div>

                        {/* Category selector button */}
                        <div className="border-t border-slate-200 p-3 flex justify-between items-center">
                          <div className="text-sm text-slate-600">
                            {formData.categoryIds.length}{" "}
                            {formData.categoryIds.length === 1
                              ? "category"
                              : "categories"}{" "}
                            selected
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setShowCategorySelector(!showCategorySelector)
                            }
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                          >
                            {showCategorySelector
                              ? "Done"
                              : "Select Categories"}
                            <ChevronDown
                              size={16}
                              className={`ml-1 transition-transform duration-200 ${
                                showCategorySelector ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Category selector dropdown */}
                        <AnimatePresence>
                          {showCategorySelector && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-slate-200 overflow-hidden"
                            >
                              <div className="p-3">
                                <div className="relative mb-3">
                                  <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={categorySearch}
                                    onChange={(e) =>
                                      setCategorySearch(e.target.value)
                                    }
                                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search
                                      size={16}
                                      className="text-slate-400"
                                    />
                                  </div>
                                  {categorySearch && (
                                    <button
                                      type="button"
                                      onClick={() => setCategorySearch("")}
                                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                      <X
                                        size={16}
                                        className="text-slate-400 hover:text-slate-600"
                                      />
                                    </button>
                                  )}
                                </div>

                                <div className="max-h-60 overflow-y-auto pr-1 space-y-1">
                                  {filteredCategories.length === 0 ? (
                                    <div className="text-center py-4 text-slate-500">
                                      No categories match your search
                                    </div>
                                  ) : (
                                    filteredCategories.map((category) => (
                                      <div
                                        key={category.id}
                                        onClick={() =>
                                          handleCategoryToggle(category.id)
                                        }
                                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                                          formData.categoryIds.includes(
                                            category.id
                                          )
                                            ? "bg-indigo-50 border border-indigo-100"
                                            : "hover:bg-slate-50 border border-transparent"
                                        }`}
                                      >
                                        <div
                                          className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                                            formData.categoryIds.includes(
                                              category.id
                                            )
                                              ? "bg-indigo-500 border-indigo-500 text-white"
                                              : "border-slate-300"
                                          }`}
                                        >
                                          {formData.categoryIds.includes(
                                            category.id
                                          ) && <Check size={12} />}
                                        </div>
                                        <div className="flex-1">
                                          <div
                                            className={`text-sm font-medium ${
                                              formData.categoryIds.includes(
                                                category.id
                                              )
                                                ? "text-indigo-700"
                                                : "text-slate-700"
                                            }`}
                                          >
                                            {category.name}
                                          </div>
                                          {category.description && (
                                            <div className="text-xs text-slate-500 mt-0.5">
                                              {category.description}
                                            </div>
                                          )}
                                        </div>

                                        {/* Icon based on category icon field */}
                                        <div
                                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            formData.categoryIds.includes(
                                              category.id
                                            )
                                              ? "bg-indigo-100 text-indigo-600"
                                              : "bg-slate-100 text-slate-500"
                                          }`}
                                        >
                                          <Tag size={14} />
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  {getError("categoryIds") && (
                    <p className="mt-1 text-sm text-rose-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {getError("categoryIds")}
                    </p>
                  )}
                </div>

                {/* Status setting */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">
                    Rule Status
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-slate-200 transition-colors duration-200 hover:bg-indigo-50/30 hover:border-indigo-200/50">
                    <div className="flex items-start">
                      <div className="flex items-center h-5 mt-0.5">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={handleCheckboxChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <label
                          htmlFor="isActive"
                          className="font-medium text-slate-700 flex items-center text-sm"
                        >
                          <Zap size={16} className="mr-1.5 text-emerald-500" />
                          Active
                        </label>
                        <p className="text-slate-500 text-sm mt-1">
                          When enabled, this SLA rule will be applied to new
                          tickets that match the selected categories.
                        </p>
                      </div>

                      {/* Status badge */}
                      <div
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          formData.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {formData.isActive ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 mt-8 border-t border-slate-200 flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate("/sla")}
                  className="inline-flex items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>

                <div className="flex space-x-3">
                  {activeSection !== "basic" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeSection === "timing")
                          setActiveSection("basic");
                        if (activeSection === "categories")
                          setActiveSection("timing");
                      }}
                      className="inline-flex items-center px-4 py-2.5 border border-indigo-200 shadow-sm text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Previous
                    </button>
                  )}

                  {activeSection !== "categories" ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeSection === "basic")
                          setActiveSection("timing");
                        if (activeSection === "timing")
                          setActiveSection("categories");
                      }}
                      className="inline-flex items-center px-4 py-2.5 border border-indigo-600 shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Next
                      <ChevronRight size={16} className="ml-2" />
                    </button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-2.5 shadow-lg shadow-indigo-200/50 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Create SLA Rule
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </motion.div>

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
                About SLA Rules
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Service Level Agreement (SLA) rules define the expected response
                and resolution times for support tickets. These rules help your
                team prioritize tickets and ensure timely responses to customer
                inquiries.
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <HelpCircle size={14} className="mr-1" />
                  SLA Documentation
                </a>
                <a
                  href="#"
                  className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <Users size={14} className="mr-1" />
                  Best Practices
                </a>
                <a
                  href="#"
                  className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <BarChart3 size={14} className="mr-1" />
                  SLA Performance
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
