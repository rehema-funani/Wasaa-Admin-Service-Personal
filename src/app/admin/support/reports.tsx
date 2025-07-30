import React, { useState, useEffect } from "react";
import {
  BarChart,
  Download,
  FileText,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader,
  RefreshCw,
  X,
  ChevronDown,
  FileBarChart,
  FilePlus,
  FileMinus,
  PieChart,
  ChevronLeft,
} from "lucide-react";
import supportService from "../../../api/services/support";

const ReportsDashboard = () => {
  const [quickStats, setQuickStats] = useState({
    ticketsCreated: 0,
    ticketsClosed: 0,
    avgResponseTime: 0,
    customerSatisfaction: 0,
    loading: true,
    error: null,
  });

  const [availableReports, setAvailableReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState(null);

  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(null);
  const [reportError, setReportError] = useState(null);¸

  const [reportFilters, setReportFilters] = useState({
    type: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const [reportForm, setReportForm] = useState({
    type: "TICKET_SUMMARY",
    format: "PDF",
    dateRange: {
      start: new Date(new Date().setDate(new Date().getDate() - 7))
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    },
  });

  const [reportTypes] = useState([
    {
      id: "TICKET_SUMMARY",
      name: "Ticket Summary",
      description: "Overview of all tickets in the specified time period",
      icon: FileBarChart,
    },
    {
      id: "AGENT_PERFORMANCE",
      name: "Agent Performance",
      description: "Performance metrics for support agents",
      icon: PieChart,
    },
    {
      id: "CUSTOMER_SATISFACTION",
      name: "Customer Satisfaction",
      description: "Customer satisfaction scores and feedback",
      icon: FilePlus,
    },
    {
      id: "RESPONSE_TIMES",
      name: "Response Times",
      description: "Analysis of response and resolution times",
      icon: FileMinus,
    },
  ]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchQuickStats();
  }, []);

  useEffect(() => {
    fetchAvailableReports();
  }, [reportFilters]);

  const fetchQuickStats = async () => {
    try {
      const response = await supportService.getQuickStats();

      if (response.success && response.data && response.data.stats) {
        const { stats } = response.data;

        const resolvedTickets =
          stats.tickets.byStatus.find((item) => item.status === "RESOLVED")
            ?._count || 0;

        setQuickStats({
          ticketsCreated: stats.tickets.total || 0,
          ticketsClosed: resolvedTickets,
          avgResponseTime: stats.sla.avgResponseTime || 0,
          customerSatisfaction: stats.sla.complianceRate || 0,
          loading: false,
          error: null,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setQuickStats((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch quick stats",
      }));
      console.error(err);
    }
  };

  const fetchAvailableReports = async () => {
    setReportsLoading(true);

    try {
      const response = await supportService.getAvailableReports({
        page: reportFilters.page,
        limit: reportFilters.limit,
        type: reportFilters.type,
        status: reportFilters.status,
      });

      if (response.success && response.data) {
        setAvailableReports(response.data.reports || []);
        setPagination({
          page: reportFilters.page,
          limit: reportFilters.limit,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.pages || 0,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setReportsError("Failed to fetch available reports");
      console.error(err);
    } finally {
      setReportsLoading(false);
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    setReportSuccess(null);
    setReportError(null);

    const formattedData = {
      ...reportForm,
      dateRange: {
        start: new Date(reportForm.dateRange.start).toISOString(),
        end: new Date(
          reportForm.dateRange.end + "T23:59:59.999Z"
        ).toISOString(),
      },
    };

    try {
      await supportService.generateReports(formattedData);

      setReportSuccess(
        "Report generation started. It will appear in the list when ready."
      );

      setTimeout(() => {
        fetchAvailableReports();
      }, 2000);

      setReportForm({
        type: "TICKET_SUMMARY",
        format: "PDF",
        dateRange: {
          start: new Date(new Date().setDate(new Date().getDate() - 7))
            .toISOString()
            .split("T")[0],
          end: new Date().toISOString().split("T")[0],
        },
      });
    } catch (err) {
      setReportError("Failed to generate report. Please try again.");
      console.error(err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const blob = await supportService.downloadReport(reportId);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to download report. Please try again.");
      console.error(err);
    }
  };

  const handleFilterChange = (name, value) => {
    setReportFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name !== "page" ? 1 : value,
    }));
  };

  const handleReportFormChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setReportForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setReportForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} mins`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  const getReportTypeDetails = (typeId) => {
    return (
      reportTypes.find((type) => type.id === typeId) || {
        name: typeId,
        description: "Report type description unavailable",
        icon: FileText,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Reports Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate and view reports for your support activities
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Quick Stats
          </h2>

          {quickStats.loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center">
              <Loader className="h-6 w-6 text-teal-500 dark:text-teal-400 animate-spin" />
              <span className="ml-2 text-gray-500 dark:text-gray-400">
                Loading stats...
              </span>
            </div>
          ) : quickStats.error ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center text-red-500 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>{quickStats.error}</p>
              </div>
              <button
                onClick={fetchQuickStats}
                className="mt-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tickets Created */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <FilePlus className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tickets Created
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {quickStats.ticketsCreated}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last 7 days
                    </p>
                  </div>
                </div>
              </div>

              {/* Tickets Closed */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <FileMinus className="h-6 w-6 text-green-500 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tickets Closed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {quickStats.ticketsClosed}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last 7 days
                    </p>
                  </div>
                </div>
              </div>

              {/* Average Response Time */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Avg. Response Time
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatDuration(quickStats.avgResponseTime)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      All tickets
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                    <svg
                      className="h-6 w-6 text-amber-500 dark:text-amber-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      SLA Compliance
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {quickStats.customerSatisfaction}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      All tickets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Generate New Report
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center">
                <BarChart className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                  Create Custom Report
                </h3>
              </div>
            </div>

            {/* Alert messages */}
            {reportError && (
              <div className="mx-5 mt-5">
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {reportError}
                  </p>
                  <button
                    onClick={() => setReportError(null)}
                    className="ml-auto"
                  >
                    <X className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              </div>
            )}

            {reportSuccess && (
              <div className="mx-5 mt-5">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {reportSuccess}
                  </p>
                  <button
                    onClick={() => setReportSuccess(null)}
                    className="ml-auto"
                  >
                    <X className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </button>
                </div>
              </div>
            )}

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Report Type */}
                <div>
                  <label
                    htmlFor="reportType"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Report Type
                  </label>
                  <select
                    id="reportType"
                    value={reportForm.type}
                    onChange={(e) =>
                      handleReportFormChange("type", e.target.value)
                    }
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {reportTypes.map((type) => (
                      <option
                        key={type.id}
                        value={type.id}
                        className="text-gray-900 dark:text-gray-100"
                      >
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {getReportTypeDetails(reportForm.type).description}
                  </p>
                </div>

                {/* Report Format */}
                <div>
                  <label
                    htmlFor="reportFormat"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Format
                  </label>
                  <select
                    id="reportFormat"
                    value={reportForm.format}
                    onChange={(e) =>
                      handleReportFormChange("format", e.target.value)
                    }
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option
                      value="PDF"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      PDF
                    </option>
                    <option
                      value="CSV"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      CSV
                    </option>
                    <option
                      value="EXCEL"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      Excel
                    </option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="startDate" className="sr-only">
                        Start Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="date"
                          id="startDate"
                          value={reportForm.dateRange.start}
                          onChange={(e) =>
                            handleReportFormChange(
                              "dateRange.start",
                              e.target.value
                            )
                          }
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="endDate" className="sr-only">
                        End Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="date"
                          id="endDate"
                          value={reportForm.dateRange.end}
                          min={reportForm.dateRange.start}
                          onChange={(e) =>
                            handleReportFormChange(
                              "dateRange.end",
                              e.target.value
                            )
                          }
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={generateReport}
                  disabled={generatingReport}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {generatingReport ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <BarChart className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Reports */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Available Reports
            </h2>

            <div className="flex items-center space-x-2">
              <select
                value={reportFilters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="" className="text-gray-900 dark:text-gray-100">
                  All Types
                </option>
                {reportTypes.map((type) => (
                  <option
                    key={type.id}
                    value={type.id}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {type.name}
                  </option>
                ))}
              </select>

              <select
                value={reportFilters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="" className="text-gray-900 dark:text-gray-100">
                  All Status
                </option>
                <option
                  value="COMPLETED"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Completed
                </option>
                <option
                  value="PROCESSING"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Processing
                </option>
                <option
                  value="FAILED"
                  className="text-gray-900 dark:text-gray-100"
                >
                  Failed
                </option>
              </select>

              <button
                onClick={() => {
                  setReportFilters({
                    type: "",
                    status: "",
                    page: 1,
                    limit: 10,
                  });
                }}
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {reportsLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 text-teal-500 dark:text-teal-400 animate-spin" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  Loading reports...
                </span>
              </div>
            ) : reportsError ? (
              <div className="p-6 flex flex-col items-center justify-center h-64">
                <div className="flex items-center text-red-500 dark:text-red-400 mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <p>{reportsError}</p>
                </div>
                <button
                  onClick={fetchAvailableReports}
                  className="mt-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </button>
              </div>
            ) : availableReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No reports found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  {reportFilters.type || reportFilters.status
                    ? "Try adjusting your filters to find what you're looking for."
                    : "Generate your first report to get insights into your support operations."}
                </p>

                {(reportFilters.type || reportFilters.status) && (
                  <button
                    onClick={() => {
                      setReportFilters({
                        type: "",
                        status: "",
                        page: 1,
                        limit: 10,
                      });
                    }}
                    className="mt-4 px-4 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center"
                  >
                    <Filter className="h-4 w-4 mr-1.5" />
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Report
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Date Range
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Format
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
                          Created
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {availableReports.map((report) => {
                        const reportType = getReportTypeDetails(report.type);
                        const ReportIcon = reportType.icon;

                        return (
                          <tr
                            key={report.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700">
                                  <ReportIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {reportType.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    ID: {report.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {reportType.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {formatDate(report.dateRange.start)} -{" "}
                                {formatDate(report.dateRange.end)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {report.format}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  report.status === "COMPLETED"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                    : report.status === "PROCESSING"
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                    : report.status === "FAILED"
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                }`}
                              >
                                {report.status === "PROCESSING" && (
                                  <svg
                                    className="mr-1.5 h-2 w-2 text-blue-400 dark:text-blue-300 animate-pulse"
                                    fill="currentColor"
                                    viewBox="0 0 8 8"
                                  >
                                    <circle cx="4" cy="4" r="3" />
                                  </svg>
                                )}
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(report.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {report.status === "COMPLETED" ? (
                                <button
                                  onClick={() =>
                                    handleDownloadReport(report.id)
                                  }
                                  className="text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 flex items-center"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </button>
                              ) : report.status === "FAILED" ? (
                                <button
                                  onClick={() => {
                                    // Re-generate the failed report
                                    setReportForm({
                                      type: report.type,
                                      format: report.format,
                                      dateRange: {
                                        start: new Date(report.dateRange.start)
                                          .toISOString()
                                          .split("T")[0],
                                        end: new Date(report.dateRange.end)
                                          .toISOString()
                                          .split("T")[0],
                                      },
                                    });

                                    // Scroll to report generation form
                                    document
                                      .querySelector("#reportType")
                                      .scrollIntoView({ behavior: "smooth" });
                                  }}
                                  className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 flex items-center"
                                >
                                  <RefreshCw className="h-4 w-4 mr-1" />
                                  Retry
                                </button>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500 flex items-center">
                                  <Loader className="animate-spin h-4 w-4 mr-1" />
                                  Processing
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() =>
                          handleFilterChange("page", pagination.page - 1)
                        }
                        disabled={pagination.page === 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                          pagination.page === 1
                            ? "text-gray-300 dark:text-gray-500 bg-white dark:bg-gray-800 cursor-not-allowed"
                            : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          handleFilterChange("page", pagination.page + 1)
                        }
                        disabled={pagination.page === pagination.totalPages}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                          pagination.page === pagination.totalPages
                            ? "text-gray-300 dark:text-gray-500 bg-white dark:bg-gray-800 cursor-not-allowed"
                            : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Showing{" "}
                          <span className="font-medium">
                            {(pagination.page - 1) * pagination.limit + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(
                              pagination.page * pagination.limit,
                              pagination.total
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {pagination.total}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() =>
                              handleFilterChange("page", pagination.page - 1)
                            }
                            disabled={pagination.page === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                              pagination.page === 1
                                ? "text-gray-300 dark:text-gray-500 cursor-not-allowed"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          {Array.from(
                            { length: pagination.totalPages },
                            (_, i) => i + 1
                          )
                            .filter((page) => {
                              return (
                                page === 1 ||
                                page === pagination.totalPages ||
                                Math.abs(page - pagination.page) <= 1
                              );
                            })
                            .map((page, index, array) => {
                              // Add ellipsis
                              const showEllipsisBefore =
                                index > 0 && array[index - 1] !== page - 1;
                              const showEllipsisAfter =
                                index < array.length - 1 &&
                                array[index + 1] !== page + 1;

                              return (
                                <React.Fragment key={page}>
                                  {showEllipsisBefore && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                                      ...
                                    </span>
                                  )}

                                  <button
                                    onClick={() =>
                                      handleFilterChange("page", page)
                                    }
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                      pagination.page === page
                                        ? "z-10 bg-teal-50 dark:bg-teal-900/30 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400"
                                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                                  >
                                    {page}
                                  </button>

                                  {showEllipsisAfter && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                                      ...
                                    </span>
                                  )}
                                </React.Fragment>
                              );
                            })}

                          <button
                            onClick={() =>
                              handleFilterChange("page", pagination.page + 1)
                            }
                            disabled={pagination.page === pagination.totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                              pagination.page === pagination.totalPages
                                ? "text-gray-300 dark:text-gray-500 cursor-not-allowed"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <span className="sr-only">Next</span>
                            <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
