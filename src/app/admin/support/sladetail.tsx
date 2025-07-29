import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Folder,
  Calendar,
  BarChart2,
} from "lucide-react";
import supportService from "../../../api/services/support";

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

interface SLAMetrics {
  slaId: string;
  totalTickets: number;
  inSlaTickets: number;
  breachedTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  responseCompliance: number;
  resolutionCompliance: number;
  period: string;
}

export default function SLADetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [slaRule, setSLARule] = useState<SLARule | null>(null);
  const [metrics, setMetrics] = useState<SLAMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchSLARule = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await supportService.getSLARuleById(id);
        setSLARule(response.data.rule);
      } catch (err) {
        setError("Failed to fetch SLA rule");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSLARule();
  }, [id]);

  useEffect(() => {
    const fetchSLAMetrics = async () => {
      if (!id) return;

      setMetricsLoading(true);
      try {
        const response = await supportService.getSLAMetrics({
          period: "month",
        });

        const slaMetrics = response.data.find(
          (m: SLAMetrics) => m.slaId === id
        );

        if (slaMetrics) {
          setMetrics(slaMetrics);
        } else {
          setMetrics({
            slaId: id,
            totalTickets: 0,
            inSlaTickets: 0,
            breachedTickets: 0,
            avgResponseTime: 0,
            avgResolutionTime: 0,
            responseCompliance: 0,
            resolutionCompliance: 0,
            period: "month",
          });
        }
      } catch (err) {
        setMetricsError("Failed to fetch SLA metrics");
        console.error(err);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchSLAMetrics();
  }, [id]);

  // Delete SLA rule
  const handleDelete = async () => {
    if (!id) return;

    try {
      await supportService.deleteSLARule(id);
      navigate(-1);
    } catch (err) {
      setError("Failed to delete SLA rule");
      console.error(err);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-indigo-600 dark:text-indigo-400 rounded-full"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Loading SLA details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !slaRule) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to SLA Rules
            </button>
          </div>

          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error || "SLA rule not found"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to SLA Rules
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* SLA Details */}
          <div className="md:w-2/3">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {slaRule.name}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    SLA Rule Details
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/admin/support/sla/${id}/edit`)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="px-6 py-5">
                {/* Basic Information */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Basic Information
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Description
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {slaRule.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Priority
                        </p>
                        <div className="mt-1">
                          {getPriorityBadge(slaRule.priority)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Status
                        </p>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              slaRule.isActive
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {slaRule.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Business Hours Only
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {slaRule.businessHours ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Settings */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Time Settings
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Response Time
                        </p>
                        <div className="mt-1 flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatTime(slaRule.responseTime)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Resolution Time
                        </p>
                        <div className="mt-1 flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatTime(slaRule.resolutionTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Applied Categories
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    {slaRule.categories && slaRule.categories.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {slaRule.categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center py-1"
                          >
                            <Folder className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {category.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No categories selected
                      </div>
                    )}
                  </div>
                </div>

                {/* Creation Info */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Audit Information
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created At
                        </p>
                        <div className="mt-1 flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(slaRule.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last Updated
                        </p>
                        <div className="mt-1 flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(slaRule.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLA Metrics */}
          <div className="md:w-1/3">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                  <BarChart2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    SLA Performance
                  </h2>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Last 30 days
                </p>
              </div>

              <div className="px-6 py-5">
                {metricsLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                  </div>
                ) : metricsError ? (
                  <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {metricsError}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : metrics && metrics.totalTickets > 0 ? (
                  <div className="space-y-6">
                    {/* Ticket Counts */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Total Tickets</span>
                        <span>{metrics.totalTickets}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-600 rounded-md p-3">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-1.5" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Within SLA
                            </span>
                          </div>
                          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {metrics.inSlaTickets}
                          </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-600 rounded-md p-3">
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1.5" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Breached
                            </span>
                          </div>
                          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {metrics.breachedTickets}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Response Compliance */}
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Response Compliance
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {metrics.responseCompliance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            metrics.responseCompliance >= 90
                              ? "bg-green-500"
                              : metrics.responseCompliance >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${metrics.responseCompliance}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Average: {formatTime(metrics.avgResponseTime)}
                      </p>
                    </div>

                    {/* Resolution Compliance */}
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Resolution Compliance
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {metrics.resolutionCompliance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            metrics.resolutionCompliance >= 90
                              ? "bg-green-500"
                              : metrics.resolutionCompliance >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${metrics.resolutionCompliance}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Average: {formatTime(metrics.avgResolutionTime)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Info className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      No data available
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      There is no performance data for this SLA rule yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 dark:bg-black bg-opacity-75 dark:bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Delete SLA Rule
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete the SLA rule "{slaRule.name}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
