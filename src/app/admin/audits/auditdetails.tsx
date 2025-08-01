import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Clock,
  FileText,
  Shield,
  Globe,
  Database,
  Server,
  Smartphone,
  AlertTriangle,
  Download,
  Activity,
  Zap,
  Target,
  Eye,
  Code,
  Lock,
  MapPin,
  Monitor,
  Mail,
  Calendar,
  Hash,
  Wifi,
  Layers,
} from "lucide-react";
import { Badge } from "../../../components/common/Badge";
import { Button } from "../../../components/common/Button";
import { Card } from "../../../components/common/Card";
import { logsService } from "../../../api/services/logs";
import moment from "moment";
import {
  safeGetUserEmailDisplay,
  safeGetUsernameDisplay,
} from "../../../utils/audit";
import { AuditLog } from "../../../types";

const InfoItem: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  isEmpty?: boolean;
}> = ({ label, value, icon, className = "", isEmpty = false }) => (
  <div
    className={`group transition-all duration-200 hover:scale-105 ${className}`}
  >
    <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
      {icon && (
        <span className="mr-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-md group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
          {icon}
        </span>
      )}
      {label}
    </div>
    <div
      className={`text-sm font-semibold ${
        isEmpty
          ? "text-gray-400 dark:text-gray-500 italic"
          : "text-gray-900 dark:text-gray-100"
      } break-words`}
    >
      {value}
    </div>
  </div>
);

const AuditLogDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [log, setLog] = useState<AuditLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchLogDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await logsService.getAuditLogById(id);
        setLog(response);
      } catch (err) {
        console.error("Failed to fetch audit log details:", err);
        setError(
          "Failed to load audit log details. The log may not exist or you may not have permission to view it."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleExportJson = () => {
    if (!log) return;

    const jsonString = JSON.stringify(log, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${log._id}-${moment().format("YYYY-MM-DD")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (isSuccessful: boolean) => {
    return isSuccessful ? (
      <Badge
        variant="success"
        size="md"
        className="flex items-center gap-2 px-3 py-1.5 shadow-lg shadow-green-500/20"
      >
        <CheckCircle size={14} />
        <span className="font-semibold">Success</span>
      </Badge>
    ) : (
      <Badge
        variant="danger"
        size="md"
        className="flex items-center gap-2 px-3 py-1.5 shadow-lg shadow-red-500/20"
      >
        <XCircle size={14} />
        <span className="font-semibold">Failed</span>
      </Badge>
    );
  };

  const SafeJsonViewer = ({ data }) => {
    if (
      !data ||
      (typeof data === "object" && Object.keys(data).length === 0) ||
      data === "" ||
      (Array.isArray(data) && data.length === 0)
    ) {
      return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center min-h-[120px]">
          <Code size={32} className="text-gray-400 dark:text-gray-500 mb-3" />
          <div className="text-gray-500 dark:text-gray-400 font-medium">
            No data available
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            This field is empty or null
          </div>
        </div>
      );
    }

    let jsonData = data;
    if (typeof data === "string" && data.trim() !== "") {
      try {
        jsonData = JSON.parse(data);
      } catch (e) {
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-900 dark:text-blue-100 font-mono">
              {data}
            </div>
          </div>
        );
      }
    }

    try {
      const stringified = JSON.stringify(jsonData, null, 2);
      return (
        <div className="relative group">
          <pre className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl text-sm text-green-400 dark:text-green-300 overflow-auto max-h-80 border border-gray-700 dark:border-gray-600 shadow-2xl font-mono leading-relaxed">
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            {stringified}
          </pre>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      );
    } catch (error) {
      return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <div className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
              Unable to parse data
            </div>
            <div className="text-amber-700 dark:text-amber-300 text-sm">
              {error.message}
            </div>
          </div>
        </div>
      );
    }
  };

  const getEventTypeBadge = (eventType: string) => {
    const config = {
      create: {
        variant: "success",
        icon: <Zap size={12} />,
        gradient: "from-green-500 to-emerald-500",
      },
      update: {
        variant: "primary",
        icon: <Target size={12} />,
        gradient: "from-blue-500 to-cyan-500",
      },
      delete: {
        variant: "danger",
        icon: <AlertTriangle size={12} />,
        gradient: "from-red-500 to-pink-500",
      },
      login: {
        variant: "info",
        icon: <Lock size={12} />,
        gradient: "from-purple-500 to-indigo-500",
      },
      fetch: {
        variant: "default",
        icon: <Eye size={12} />,
        gradient: "from-gray-500 to-slate-500",
      },
    };

    const type =
      Object.keys(config).find((key) =>
        eventType.toLowerCase().includes(key)
      ) || "fetch";
    const { variant, icon, gradient } = config[type];

    return (
      <Badge
        variant={variant}
        size="md"
        className="flex items-center gap-2 px-3 py-1.5 shadow-lg"
      >
        <div
          className={`p-0.5 bg-gradient-to-r ${gradient} rounded-full text-white`}
        >
          {icon}
        </div>
        <span className="font-semibold capitalize">{eventType}</span>
      </Badge>
    );
  };

  const safeValue = (value: any, fallback: string = "Not available") => {
    return value && value !== "" && value !== "null" && value !== null
      ? value
      : fallback;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-6">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 border-t-primary-500 dark:border-t-primary-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-primary-300 dark:border-r-primary-700 rounded-full animate-spin animation-delay-75"></div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading Audit Log
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching comprehensive log details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={handleGoBack}
              className="mr-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
            >
              Back to Audit Logs
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Audit Log Details
            </h1>
          </div>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800 p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle
                  size={28}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-3">
                  Unable to Load Audit Log
                </h2>
                <p className="text-red-700 dark:text-red-300 mb-6 leading-relaxed">
                  {error ||
                    "Something went wrong while loading the audit log details. The log may have been deleted or you might not have the necessary permissions."}
                </p>
                <button
                  // variant="outline"
                  className="bg-white/80 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 shadow-lg"
                  onClick={handleGoBack}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Return to Audit Logs
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity size={16} /> },
    { id: "request", label: "Request & Response", icon: <Code size={16} /> },
    { id: "user", label: "User Information", icon: <User size={16} /> },
    {
      id: "device",
      label: "Device & Location",
      icon: <Smartphone size={16} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                leftIcon={<ArrowLeft size={16} />}
                onClick={handleGoBack}
                className="mr-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Audit Log Details
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive view of system activity
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              leftIcon={<Download size={16} />}
              onClick={handleExportJson}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 shadow-lg"
            >
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Card */}
        <Card className="mb-8 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5"></div>

            <div className="relative border-b border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-4 h-16 rounded-full shadow-lg ${
                      log.is_successful
                        ? "bg-gradient-to-b from-green-400 to-green-600"
                        : "bg-gradient-to-b from-red-400 to-red-600"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {safeValue(log.event_description, "System Event")}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span className="font-medium">
                          {safeValue(log.timestamp, "Unknown time")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash size={16} />
                        <span className="font-mono text-sm">{log._id}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {getEventTypeBadge(log.event_type)}
                  {getStatusBadge(log.is_successful)}
                  <Badge
                    variant="default"
                    size="md"
                    className="flex items-center gap-2 px-3 py-1.5 shadow-lg"
                  >
                    <Server size={12} />
                    <span className="font-semibold">
                      {safeValue(log.service_name, "Unknown Service")}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="relative p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <User
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                    {safeValue(safeGetUsernameDisplay(log), "Unknown User")}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {safeValue(
                      safeGetUserEmailDisplay(log),
                      "No email provided"
                    )}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-mono">
                    ID: {safeValue(log.user_id, "N/A")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-800/50">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Database
                    size={20}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-1">
                    {safeValue(log.entity_affected, "Unknown Entity")}
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 break-all">
                    {safeValue(log.entity_id, "No entity ID")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      Method:
                    </span>
                    <Badge
                      variant="default"
                      size="sm"
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                    >
                      {safeValue(log.http_method, "N/A")}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Globe
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-green-900 dark:text-green-100 mb-1">
                    Network Info
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 font-mono">
                    {safeValue(
                      log.ip_address?.replace("::ffff:", ""),
                      "Unknown IP"
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Wifi
                      size={12}
                      className="text-green-600 dark:text-green-400"
                    />
                    <span className="text-xs text-green-600 dark:text-green-400">
                      {safeValue(log.location, "Location unknown")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
            <div className="flex overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              <Card className="p-6 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Activity size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Event Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoItem
                    label="Event Type"
                    value={getEventTypeBadge(log.event_type)}
                    icon={<FileText size={14} />}
                  />
                  <InfoItem
                    label="Status"
                    value={getStatusBadge(log.is_successful)}
                    icon={<CheckCircle size={14} />}
                  />
                  <InfoItem
                    label="Service"
                    value={safeValue(log.service_name)}
                    icon={<Server size={14} />}
                    isEmpty={!log.service_name}
                  />
                  <InfoItem
                    label="Status Code"
                    value={
                      <Badge variant="default" className="font-mono">
                        {safeValue(log.status_code)}
                      </Badge>
                    }
                    icon={<Hash size={14} />}
                    isEmpty={!log.status_code}
                  />
                  <InfoItem
                    label="Execution Time"
                    value={
                      log.execution_time
                        ? moment(log.execution_time).format(
                            "MMM DD, YYYY • HH:mm:ss.SSS"
                          )
                        : "Not recorded"
                    }
                    icon={<Clock size={14} />}
                    isEmpty={!log.execution_time}
                  />
                  <InfoItem
                    label="Description"
                    value={safeValue(log.event_description)}
                    icon={<FileText size={14} />}
                    isEmpty={!log.event_description}
                    className="md:col-span-2 lg:col-span-3"
                  />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                    <Layers size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Entity Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    label="Entity Type"
                    value={safeValue(log.entity_affected)}
                    icon={<Database size={14} />}
                    isEmpty={!log.entity_affected}
                  />
                  <InfoItem
                    label="HTTP Method"
                    value={
                      <Badge variant="primary" className="font-mono">
                        {safeValue(log.http_method)}
                      </Badge>
                    }
                    icon={<Code size={14} />}
                    isEmpty={!log.http_method}
                  />
                  <InfoItem
                    label="Entity ID"
                    value={
                      <span className="font-mono text-xs">
                        {safeValue(log.entity_id)}
                      </span>
                    }
                    icon={<Hash size={14} />}
                    isEmpty={!log.entity_id}
                    className="md:col-span-2"
                  />
                  <InfoItem
                    label="Request URL"
                    value={
                      <span className="font-mono text-xs break-all">
                        {safeValue(log.request_url)}
                      </span>
                    }
                    icon={<Globe size={14} />}
                    isEmpty={!log.request_url}
                    className="md:col-span-2"
                  />
                  <InfoItem
                    label="Query Parameters"
                    value={
                      <span className="font-mono text-xs">
                        {safeValue(log.query_params, "No parameters")}
                      </span>
                    }
                    icon={<FileText size={14} />}
                    isEmpty={!log.query_params}
                    className="md:col-span-2"
                  />
                </div>
              </Card>
            </>
          )}

          {activeTab === "request" && (
            <>
              <Card className="p-6 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                    <Code size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Request Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <InfoItem
                    label="HTTP Method"
                    value={
                      <Badge variant="primary" className="font-mono font-bold">
                        {safeValue(log.http_method)}
                      </Badge>
                    }
                    icon={<Code size={14} />}
                    isEmpty={!log.http_method}
                  />
                  <InfoItem
                    label="Status Code"
                    value={
                      <Badge
                        variant={log.status_code >= 400 ? "danger" : "success"}
                        className="font-mono font-bold"
                      >
                        {safeValue(log.status_code)}
                      </Badge>
                    }
                    icon={<Hash size={14} />}
                    isEmpty={!log.status_code}
                  />
                  <InfoItem
                    label="URL"
                    value={
                      <span className="font-mono text-xs break-all">
                        {safeValue(log.request_url)}
                      </span>
                    }
                    icon={<Globe size={14} />}
                    isEmpty={!log.request_url}
                    className="md:col-span-2"
                  />
                  <InfoItem
                    label="Query Parameters"
                    value={
                      <span className="font-mono text-xs">
                        {safeValue(log.query_params, "No parameters")}
                      </span>
                    }
                    icon={<FileText size={14} />}
                    isEmpty={!log.query_params}
                    className="md:col-span-2"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                      <FileText
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Request Body
                    </h4>
                  </div>
                  <SafeJsonViewer data={log.request_body} />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                    <Activity size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Response Information
                  </h3>
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status:
                      </span>
                      {getStatusBadge(log.is_successful)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Code:
                      </span>
                      <Badge
                        variant={log.status_code >= 400 ? "danger" : "success"}
                        className="font-mono font-bold"
                      >
                        {safeValue(log.status_code)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                        <FileText
                          size={16}
                          className="text-green-600 dark:text-green-400"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Response Body
                      </h4>
                    </div>
                    <SafeJsonViewer data={log.response_body} />
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === "user" && (
            <Card className="p-6 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <User size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  User Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="Username"
                  value={safeValue(safeGetUsernameDisplay(log))}
                  icon={<User size={14} />}
                  isEmpty={!safeGetUsernameDisplay(log)}
                />
                <InfoItem
                  label="Email"
                  value={safeValue(safeGetUserEmailDisplay(log))}
                  icon={<Mail size={14} />}
                  isEmpty={!safeGetUserEmailDisplay(log)}
                />
                <InfoItem
                  label="User ID"
                  value={
                    <span className="font-mono text-xs">
                      {safeValue(log.user_id)}
                    </span>
                  }
                  icon={<Hash size={14} />}
                  isEmpty={!log.user_id}
                  className="md:col-span-2"
                />
                <InfoItem
                  label="Session ID"
                  value={
                    <span className="font-mono text-xs">
                      {safeValue(log.session_id)}
                    </span>
                  }
                  icon={<Database size={14} />}
                  isEmpty={!log.session_id}
                  className="md:col-span-2"
                />
                <InfoItem
                  label="Authentication Method"
                  value={
                    <Badge variant="info">{safeValue(log.auth_method)}</Badge>
                  }
                  icon={<Shield size={14} />}
                  isEmpty={!log.auth_method}
                />
                <InfoItem
                  label="IP Address"
                  value={
                    <span className="font-mono">
                      {safeValue(log.ip_address?.replace("::ffff:", ""))}
                    </span>
                  }
                  icon={<Globe size={14} />}
                  isEmpty={!log.ip_address}
                />
                <InfoItem
                  label="Roles"
                  value={
                    log.roles ? (
                      <Badge variant="success">{log.roles}</Badge>
                    ) : (
                      "No roles assigned"
                    )
                  }
                  icon={<Shield size={14} />}
                  isEmpty={!log.roles}
                  className="md:col-span-2"
                />
                <InfoItem
                  label="Permissions"
                  value={
                    <span className="text-xs">
                      {safeValue(log.permissions, "No specific permissions")}
                    </span>
                  }
                  icon={<Lock size={14} />}
                  isEmpty={!log.permissions}
                  className="md:col-span-2"
                />
              </div>
            </Card>
          )}

          {activeTab === "device" && (
            <Card className="p-6 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Smartphone size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Device & Location Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="IP Address"
                  value={
                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {safeValue(log.ip_address?.replace("::ffff:", ""))}
                    </span>
                  }
                  icon={<Globe size={14} />}
                  isEmpty={!log.ip_address}
                />
                <InfoItem
                  label="Location"
                  value={safeValue(log.location, "Location unknown")}
                  icon={<MapPin size={14} />}
                  isEmpty={!log.location}
                />
                <InfoItem
                  label="Device Type"
                  value={
                    <Badge variant="info">
                      {safeValue(log.device_type, "Unknown device")}
                    </Badge>
                  }
                  icon={<Smartphone size={14} />}
                  isEmpty={!log.device_type}
                />
                <InfoItem
                  label="Device Model"
                  value={safeValue(log.device_model, "Unknown model")}
                  icon={<Smartphone size={14} />}
                  isEmpty={!log.device_model}
                />
                <InfoItem
                  label="Operating System"
                  value={
                    <Badge variant="default">
                      {safeValue(log.os, "Unknown OS")}
                    </Badge>
                  }
                  icon={<Monitor size={14} />}
                  isEmpty={!log.os}
                />
                <InfoItem
                  label="Browser"
                  value={
                    <Badge variant="primary">
                      {safeValue(log.browser, "Unknown browser")}
                    </Badge>
                  }
                  icon={<Globe size={14} />}
                  isEmpty={!log.browser}
                />
                <InfoItem
                  label="User Agent"
                  value={
                    <span className="font-mono text-xs break-all">
                      {safeValue(log.user_agent, "Not available")}
                    </span>
                  }
                  icon={<Monitor size={14} />}
                  isEmpty={!log.user_agent}
                  className="md:col-span-2"
                />
              </div>
            </Card>
          )}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animation-delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </div>
  );
};

export default AuditLogDetailsPage;
