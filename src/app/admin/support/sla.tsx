import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import supportService from "../../../api/services/support";

// Interface for SLA rule
interface SLARule {
  id: string;
  name: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  categoryIds: string[];
  businessHours: boolean;
  responseTime: number;
  resolutionTime: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categories?: {
    id: string;
    name: string;
  }[];
}

export default function SLAListPage() {
  const navigate = useNavigate();

  // State
  const [slaRules, setSLARules] = useState<SLARule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const fetchSLARules = async () => {
      setLoading(true);
      try {
        const response = await supportService.getSLARules({
          includeInactive: showInactive,
        });
        setSLARules(response.data.rules || []);
      } catch (err) {
        setError("Failed to fetch SLA rules");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSLARules();
  }, [showInactive]);

  const filteredSLARules = slaRules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is already handled by the filter above
  };

  const toggleRuleActive = async (id: string, currentStatus: boolean) => {
    try {
      await supportService.updateSLARule(id, { isActive: !currentStatus });

      setSLARules((prevRules) =>
        prevRules.map((rule) =>
          rule.id === id ? { ...rule, isActive: !currentStatus } : rule
        )
      );

      setActionMenuOpen(null);
    } catch (err) {
      console.error("Failed to update SLA rule status", err);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this SLA rule? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await supportService.deleteSLARule(id);

      setSLARules((prevRules) => prevRules.filter((rule) => rule.id !== id));
      setActionMenuOpen(null);
    } catch (err) {
      console.error("Failed to delete SLA rule", err);
    }
  };

  // Process expired tickets
  const handleProcessExpired = async () => {
    try {
      await supportService.processExpiredTickets();
      alert("Expired tickets processed successfully");
    } catch (err) {
      console.error("Failed to process expired tickets", err);
      alert("Failed to process expired tickets");
    }
  };

  // Format time in minutes to hours and minutes
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "LOW":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
            Low
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
            Medium
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400">
            High
          </span>
        );
      case "CRITICAL":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
            Critical
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            {priority}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SLA Rules
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage service level agreements for support tickets
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleProcessExpired}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Process Expired
            </button>
            <button
              onClick={() => navigate("/admin/support/sla/create")}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New SLA Rule
            </button>
          </div>
        </div>

        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search SLA rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </form>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`inline-flex items-center px-4 py-2 border ${
                  showInactive
                    ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                } rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showInactive ? "Showing Inactive" : "Show Inactive"}
              </button>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setShowInactive(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* SLA Rules List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : filteredSLARules.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
            <Clock className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No SLA rules found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new SLA rule.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/support/sla/create")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New SLA Rule
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Priority
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Response Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Resolution Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Business Hours
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSLARules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {rule.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {rule.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(rule.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {formatTime(rule.responseTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {formatTime(rule.resolutionTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rule.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {rule.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {rule.businessHours ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActionMenuOpen(
                              actionMenuOpen === rule.id ? null : rule.id
                            )
                          }
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none transition-colors"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {actionMenuOpen === rule.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-20 z-10 border border-gray-200 dark:border-gray-700">
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                            >
                              <button
                                onClick={() =>
                                  navigate(`/admin/support/sla/${rule.id}`)
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                role="menuitem"
                              >
                                <div className="flex items-center">
                                  <Eye className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  View Details
                                </div>
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/admin/support/sla/${rule.id}/edit`)
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                role="menuitem"
                              >
                                <div className="flex items-center">
                                  <Edit className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  Edit
                                </div>
                              </button>
                              <button
                                onClick={() =>
                                  toggleRuleActive(rule.id, rule.isActive)
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                role="menuitem"
                              >
                                <div className="flex items-center">
                                  {rule.isActive ? (
                                    <>
                                      <ToggleRight className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                      Activate
                                    </>
                                  )}
                                </div>
                              </button>
                              <button
                                onClick={() => handleDeleteRule(rule.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                role="menuitem"
                              >
                                <div className="flex items-center">
                                  <Trash2 className="mr-3 h-4 w-4 text-red-500 dark:text-red-400" />
                                  Delete
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Key for Business Hours */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <span className="mr-1">Note:</span>
          <span>
            Business hours setting affects when SLA countdown is active.
          </span>
        </div>
      </div>
    </div>
  );
}
