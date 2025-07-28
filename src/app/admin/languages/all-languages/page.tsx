import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Globe,
  Eye,
  X,
  Edit,
  Trash,
  AlertTriangle,
  RefreshCw,
  Command,
  CheckCircle,
  XCircle,
  Filter,
  ArrowUpDown,
  ArrowRight,
} from "lucide-react";
import { languageService } from "../../../../api/services/language";
import { useNavigate } from "react-router-dom";

const LanguageManager = () => {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await languageService.getLanguages();
        setLanguages(response);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editLanguage, setEditLanguage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formError, setFormError] = useState(null);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      setIsLoading(true);
      setRefreshing(true);

      await languageService.getLanguages();
    } catch (error) {
      console.error("Failed to fetch languages:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleAddNew = () => {
    setEditLanguage(null);
    setShowForm(true);
    setFormError(null);
  };

  const handleEdit = (language) => {
    setEditLanguage(language);
    setShowForm(true);
    setFormError(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditLanguage(null);
    setFormError(null);
  };

  const handleSave = async (language) => {
    console.log("Saving language:", language);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    console.log("Deleting language:", id);
    setDeleteConfirm(null);

    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const handleToggleStatus = async (id, isActive) => {
    console.log("Toggling status for language:", id);

    setLanguages(
      languages.map((lang) =>
        lang.id === id ? { ...lang, is_active: !isActive } : lang
      )
    );
  };

  const handleSetDefault = async (id) => {
    console.log("Setting default language:", id);

    setLanguages(
      languages.map((lang) =>
        lang.id === id
          ? { ...lang, is_default: true }
          : { ...lang, is_default: false }
      )
    );
  };

  const handleViewTranslations = (id) => {
    navigate(`/admin/languages/${id}/translations`);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  let filteredLanguages = languages?.filter(
    (language) =>
      (searchQuery === "" ||
        language.name.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        language.code.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        language.country.toLowerCase()?.includes(searchQuery?.toLowerCase())) &&
      (activeFilter === "all" ||
        (activeFilter === "active" && language.is_active) ||
        (activeFilter === "inactive" && !language.is_active))
  );

  // Apply sorting
  filteredLanguages = [...filteredLanguages].sort((a, b) => {
    let valueA, valueB;

    switch (sortColumn) {
      case "name":
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case "code":
        valueA = a.code.toLowerCase();
        valueB = b.code.toLowerCase();
        break;
      case "country":
        valueA = a.country.toLowerCase();
        valueB = b.country.toLowerCase();
        break;
      case "rtl":
        valueA = a.is_rtl ? 1 : 0;
        valueB = b.is_rtl ? 1 : 0;
        break;
      case "default":
        valueA = a.is_default ? 1 : 0;
        valueB = b.is_default ? 1 : 0;
        break;
      case "status":
        valueA = a.is_active ? 1 : 0;
        valueB = b.is_active ? 1 : 0;
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const LanguageForm = ({ initialData, onSubmit, onCancel }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(initialData || {});
      }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-300 mb-1.5">
            Language Name
          </label>
          <input
            type="text"
            defaultValue={initialData?.name || ""}
            className="w-full bg-inherit dark:text-slate-300 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            placeholder="Enter language name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-300 mb-1.5">
              Language Code
            </label>
            <input
              type="text"
              defaultValue={initialData?.code || ""}
              className="w-full bg-inherit dark:text-slate-300 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="e.g., en-US"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-300 mb-1.5">
              Country
            </label>
            <input
              type="text"
              defaultValue={initialData?.country || ""}
              className="w-full bg-inherit dark:text-slate-300 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="e.g., United States"
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_rtl"
              defaultChecked={initialData?.is_rtl || false}
              className="w-4 h-4 text-primary-600 dark:border-slate-700 border-slate-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_rtl" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
              RTL (Right to Left)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              defaultChecked={initialData?.is_active || true}
              className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
              Active
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
        >
          {initialData ? "Update Language" : "Add Language"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-white dark:bg-slate-800 min-h-screen font-sans">
      <div className="bg-gradient-to-r from-slate-50 to-primary-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-medium text-slate-800 dark:text-slate-200">Languages</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              <Plus size={16} className="mr-1.5" />
              Add Language
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Languages
                </p>
                <p className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {languages.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900 flex items-center justify-center text-primary-500 dark:text-primary-300">
                <Globe size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary-500 h-full rounded-full"
                  style={{
                    width: `${
                      (languages.filter((l) => l.is_active).length /
                        languages.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-slate-600 font-medium">
                {languages.filter((l) => l.is_active).length} active
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Default Language
                </p>
                <p className="text-lg font-semibold text-slate-800 mt-1">
                  {languages.find((l) => l.is_default)?.name || "Not set"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              <span className="font-medium">Code: </span>
              <span className="ml-1">
                {languages.find((l) => l.is_default)?.code || "N/A"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  RTL Languages
                </p>
                <p className="text-2xl font-semibold text-slate-800 mt-1">
                  {languages.filter((l) => l.is_rtl).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <ArrowRight size={24} />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-600 font-medium">
              {languages.filter((l) => l.is_rtl).length === 0 ? (
                <span className="text-slate-500">
                  No RTL languages configured
                </span>
              ) : (
                <div className="flex items-center space-x-1 flex-wrap">
                  {languages
                    .filter((l) => l.is_rtl)
                    .map((lang) => (
                      <span
                        key={lang.id}
                        className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md"
                      >
                        {lang.code}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-grow max-w-md w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 text-sm w-full sm:w-auto">
              <span className="text-slate-500 flex items-center whitespace-nowrap">
                <Filter size={14} className="mr-1.5" />
                Filter:
              </span>
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg flex items-center transition-colors ${
                  activeFilter === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("active")}
                className={`px-3 py-1.5 rounded-lg flex items-center transition-colors ${
                  activeFilter === "active"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeFilter === "active" ? "bg-white" : "bg-emerald-500"
                  } mr-1.5`}
                ></span>
                Active
              </button>
              <button
                onClick={() => setActiveFilter("inactive")}
                className={`px-3 py-1.5 rounded-lg flex items-center transition-colors ${
                  activeFilter === "inactive"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeFilter === "inactive" ? "bg-white" : "bg-slate-400"
                  } mr-1.5`}
                ></span>
                Inactive
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-slate-500 dark:text-slate-400">
              <div
                className={`mr-3 animate-spin ${
                  refreshing ? "opacity-100" : "opacity-0"
                } transition-opacity duration-150`}
              >
                <RefreshCw size={20} className="text-primary-500" />
              </div>
              <span>Loading languages...</span>
            </div>
          ) : filteredLanguages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-slate-700 flex items-center justify-center rounded-full mb-4">
                <Globe size={24} className="text-slate-400" />
              </div>
              <h3 className="text-slate-800 dark:text-slate-200 font-medium mb-1">
                No languages found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Get started by adding your first language."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors mx-auto"
                >
                  Clear Filters
                </button>
              )}
              {!searchQuery && (
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-primary-600 text-white dark:text-slate-200 dark:bg-primary-700 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm mx-auto"
                >
                  <Plus size={16} className="inline mr-1.5" />
                  Add Language
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th
                      className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Language
                        {sortColumn === "name" && (
                          <ArrowUpDown
                            size={14}
                            className={`ml-1 text-primary-500 dark:text-primary-400 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("code")}
                    >
                      <div className="flex items-center">
                        Code
                        {sortColumn === "code" && (
                          <ArrowUpDown
                            size={14}
                            className={`ml-1 text-primary-500 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("country")}
                    >
                      <div className="flex items-center">
                        Country
                        {sortColumn === "country" && (
                          <ArrowUpDown
                            size={14}
                            className={`ml-1 text-primary-500 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("rtl")}
                    >
                      <div className="flex items-center justify-center">
                        RTL
                        {sortColumn === "rtl" && (
                          <ArrowUpDown
                            size={14}
                            className={`ml-1 text-primary-500 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("default")}
                    >
                      <div className="flex items-center justify-center">
                        Default
                        {sortColumn === "default" && (
                          <ArrowUpDown
                            size={14}
                            className={`ml-1 text-primary-500 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center justify-center">
                        Status
                        {sortColumn === "status" && (
                          <ArrowUpDown
                            size={14}
                            className={`ml-1 text-primary-500 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLanguages.map((language, index) => (
                    <tr
                      key={language.id}
                      className="border-b border-slate-50 hover:bg-primary-50/30 dark:border-slate-700 dark:hover:bg-primary-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-medium shadow-sm">
                            {language.code.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                              {language.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400 text-xs rounded-md font-medium">
                          {language.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-400">
                        {language.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {language.is_rtl ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-purple-100 text-purple-600">
                            <CheckCircle size={14} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-400">
                            <XCircle size={14} />
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {language.is_default ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefault(language.id)}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-primary-100 hover:text-primary-700 transition-colors"
                          >
                            Set
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            handleToggleStatus(language.id, language.is_active)
                          }
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                            language.is_active
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                              language.is_active
                                ? "translate-x-5"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleViewTranslations(language.id)}
                            className="text-primary-600 hover:text-primary-800 transition-colors"
                            title="View Translations"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(language)}
                            className="text-slate-600 hover:text-slate-800 transition-colors"
                            title="Edit Language"
                          >
                            <Edit size={18} />
                          </button>
                          {!language.is_default && (
                            <button
                              onClick={() => setDeleteConfirm(language.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Language"
                            >
                              <Trash size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center">
            <Command size={14} className="text-primary-500 mr-2" />
            <span>
              Showing {filteredLanguages.length} of {languages.length} languages
            </span>
          </div>
          <button
            onClick={fetchLanguages}
            className="flex items-center text-slate-500 hover:text-primary-600 transition-colors"
          >
            <RefreshCw
              size={14}
              className={`mr-1.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-300">
                {editLanguage ? "Edit Language" : "Add New Language"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400 p-1 rounded-full hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 text-sm flex items-center">
                <AlertTriangle size={16} className="mr-1.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="p-5">
              <LanguageForm
                initialData={editLanguage}
                onSubmit={handleSave}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                Delete Language
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Are you sure you want to delete this language? This action
                cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageManager;
