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
} from "lucide-react";
import { Badge } from "../../../components/common/Badge";
import { Button } from "../../../components/common/Button";
import { Card } from "../../../components/common/Card";
import { logsService } from "../../../api/services/logs";

interface AuditLog {
  _id: string;
  user_id: string;
  username: string;
  ip_address: string;
  service_name: string;
  status_code: number;
  session_id?: string;
  user_email?: string;
  event_type: string;
  event_description: string;
  entity_affected: string;
  entity_id: string;
  http_method: string;
  request_url: string;
  query_params: string;
  request_body: any;
  response_body: any;
  execution_time: number;
  location: string;
  user_agent: string;
  device_type: string;
  device_model: string;
  os: string;
  browser: string;
  auth_method: string;
  roles: string;
  permissions: string;
  is_successful: boolean;
  timestamp?: string;
  __v: number;
}

const JsonViewer: React.FC<{ data: any }> = ({ data }) => {
  if (
    !data ||
    (typeof data === "object" && Object.keys(data).length === 0) ||
    data === ""
  ) {
    return <div className="text-gray-500 dark:text-gray-400 italic">Empty</div>;
  }

  let jsonData = data;
  if (typeof data === "string" && data.trim() !== "") {
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      return (
        <div className="text-sm text-gray-900 dark:text-gray-200">{data}</div>
      );
    }
  }

  return (
    <pre className="bg-gray-800/10 dark:bg-gray-700/30 backdrop-blur-sm p-3 rounded-lg text-xs text-gray-900 dark:text-gray-200 overflow-auto max-h-60 border border-gray-200 dark:border-gray-600">
      {JSON.stringify(jsonData, null, 2)}
    </pre>
  );
};

const InfoItem: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ label, value, icon, className = "" }) => (
  <div className={`${className}`}>
    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </div>
    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
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
        console.log("Fetched audit log details:", response);
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

  const getUsernameDisplay = (log: AuditLog) => {
    if (log.username && log.username !== "undefined undefined") {
      return log.username;
    }

    if (
      log.response_body &&
      typeof log.response_body === "object" &&
      log.response_body.users
    ) {
      for (const user of log.response_body.users) {
        if (user.id === log.user_id) {
          return `${user.first_name} ${user.last_name}`;
        }
      }
    }

    return "Unknown user";
  };

  const getUserEmailDisplay = (log: AuditLog) => {
    if (log.user_email) {
      return log.user_email;
    }

    if (
      log.response_body &&
      typeof log.response_body === "object" &&
      log.response_body.users
    ) {
      for (const user of log.response_body.users) {
        if (user.id === log.user_id) {
          return user.email;
        }
      }
    }

    return "";
  };

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
    a.download = `audit-log-${log._id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (isSuccessful: boolean) => {
    return isSuccessful ? (
      <Badge variant="success" size="md" className="flex items-center gap-1">
        <CheckCircle size={14} />
        Success
      </Badge>
    ) : (
      <Badge variant="danger" size="md" className="flex items-center gap-1">
        <XCircle size={14} />
        Failed
      </Badge>
    );
  };

  const getEventTypeBadge = (eventType: string) => {
    return (
      <Badge
        variant={
          eventType.includes("create")
            ? "success"
            : eventType.includes("update")
            ? "primary"
            : eventType.includes("delete")
            ? "danger"
            : eventType.includes("login")
            ? "info"
            : eventType.includes("fetch")
            ? "default"
            : "default"
        }
        size="md"
      >
        {eventType}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[70vh] bg-white dark:bg-gray-900">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 dark:border-primary-400 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">
          Loading audit log details...
        </p>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={16} />}
            onClick={handleGoBack}
            className="mr-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back to Audit Logs
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
            Audit Log Details
          </h1>
        </div>

        <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-6 flex items-start">
          <AlertTriangle size={24} className="mr-4 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-medium mb-2">
              Error Loading Audit Log
            </h2>
            <p>
              {error ||
                "Something went wrong while loading the audit log details."}
            </p>
            <Button
              variant="outline"
              className="mt-4 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
              onClick={handleGoBack}
            >
              Return to Audit Logs
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "request", label: "Request & Response" },
    { id: "user", label: "User Information" },
    { id: "device", label: "Device & Location" },
  ];

  return (
    <div className="w-full py-6 mx-auto bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={16} />}
            onClick={handleGoBack}
            className="mr-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
            Audit Log Details
          </h1>
        </div>

        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
          onClick={handleExportJson}
          className="border-gray-200/80 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-gray-50/90 dark:hover:bg-gray-700/90 text-gray-700 dark:text-gray-300"
        >
          Export as JSON
        </Button>
      </div>

      <div className="px-6">
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50 overflow-hidden">
          <div className="border-b border-gray-100 dark:border-gray-700 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-2 h-8 rounded-full ${
                  log.is_successful ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  {log.event_description}
                </h2>
                <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-sm">
                  <Clock size={14} className="mr-1" />
                  <span>{log.timestamp || "Unknown time"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {getEventTypeBadge(log.event_type)}
              {getStatusBadge(log.is_successful)}
              <Badge variant="default" size="md">
                {log.service_name}
              </Badge>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <User
                size={18}
                className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {getUsernameDisplay(log)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getUserEmailDisplay(log)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  User ID: {log.user_id}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Database
                size={18}
                className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {log.entity_affected}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[250px]">
                  {log.entity_id || "No entity ID"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Method: {log.http_method}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Globe
                size={18}
                className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {log.ip_address.replace("::ffff:", "")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {log.location || "Unknown location"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Execution: {log.execution_time}ms
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              <Card className="p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                  Event Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    label="Event Type"
                    value={getEventTypeBadge(log.event_type)}
                    icon={<FileText size={12} />}
                  />
                  <InfoItem
                    label="Status"
                    value={getStatusBadge(log.is_successful)}
                    icon={<CheckCircle size={12} />}
                  />
                  <InfoItem
                    label="Service"
                    value={log.service_name}
                    icon={<Server size={12} />}
                    className="md:col-span-2"
                  />
                  <InfoItem
                    label="Status Code"
                    value={log.status_code}
                    icon={<AlertTriangle size={12} />}
                  />
                  <InfoItem
                    label="Execution Time"
                    value={`${log.execution_time}ms`}
                    icon={<Clock size={12} />}
                  />
                  <InfoItem
                    label="Description"
                    value={log.event_description}
                    icon={<FileText size={12} />}
                    className="md:col-span-2"
                  />
                </div>
              </Card>

              <Card className="p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                  Entity Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    label="Entity Type"
                    value={log.entity_affected}
                    icon={<Database size={12} />}
                  />
                  <InfoItem
                    label="HTTP Method"
                    value={log.http_method}
                    icon={<FileText size={12} />}
                  />
                  <InfoItem
                    label="Entity ID"
                    value={
                      <div className="truncate max-w-full">
                        {log.entity_id || "No entity ID"}
                      </div>
                    }
                    icon={<Database size={12} />}
                    className="md:col-span-2"
                  />
                  <InfoItem
                    label="Request URL"
                    value={
                      <div className="truncate max-w-full">
                        {log.request_url}
                      </div>
                    }
                    icon={<Globe size={12} />}
                    className="md:col-span-2"
                  />
                  <InfoItem
                    label="Query Parameters"
                    value={
                      <div className="truncate max-w-full">
                        {log.query_params || "No query parameters"}
                      </div>
                    }
                    icon={<FileText size={12} />}
                    className="md:col-span-2"
                  />
                </div>
              </Card>
            </>
          )}

          {activeTab === "request" && (
            <>
              <Card className="p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                  Request Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <InfoItem
                    label="HTTP Method"
                    value={log.http_method}
                    icon={<FileText size={12} />}
                  />
                  <InfoItem
                    label="Status Code"
                    value={log.status_code}
                    icon={<AlertTriangle size={12} />}
                  />
                  <InfoItem
                    label="URL"
                    value={<div className="break-all">{log.request_url}</div>}
                    icon={<Globe size={12} />}
                    className="md:col-span-2"
                  />
                  <InfoItem
                    label="Query Parameters"
                    value={
                      <div className="break-all">
                        {log.query_params || "No query parameters"}
                      </div>
                    }
                    icon={<FileText size={12} />}
                    className="md:col-span-2"
                  />
                </div>

                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Request Body
                </h4>
                <JsonViewer data={log.request_body} />
              </Card>

              <Card className="p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                  Response Information
                </h3>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status:
                    </h4>
                    {getStatusBadge(log.is_successful)}
                    <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                      Status Code:{" "}
                      <span className="font-medium">{log.status_code}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Response Body
                  </h4>
                  <JsonViewer data={log.response_body} />
                </div>
              </Card>
            </>
          )}

          {activeTab === "user" && (
            <Card className="p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                User Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="Username"
                  value={getUsernameDisplay(log)}
                  icon={<User size={12} />}
                />
                <InfoItem
                  label="Email"
                  value={getUserEmailDisplay(log) || "Not available"}
                  icon={
                    <Mail
                      size={12}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  }
                />
                <InfoItem
                  label="User ID"
                  value={
                    <div className="truncate max-w-full">{log.user_id}</div>
                  }
                  icon={<Database size={12} />}
                  className="md:col-span-2"
                />
                <InfoItem
                  label="Session ID"
                  value={
                    <div className="truncate max-w-full">
                      {log.session_id || "No session ID"}
                    </div>
                  }
                  icon={<Database size={12} />}
                  className="md:col-span-2"
                />
                <InfoItem
                  label="Authentication Method"
                  value={log.auth_method || "Not available"}
                  icon={<Shield size={12} />}
                />
                <InfoItem
                  label="IP Address"
                  value={log.ip_address.replace("::ffff:", "")}
                  icon={<Globe size={12} />}
                />
                <InfoItem
                  label="Roles"
                  value={log.roles || "No roles"}
                  icon={<Shield size={12} />}
                  className="md:col-span-2"
                />
                <InfoItem
                  label="Permissions"
                  value={
                    <div className="truncate max-w-full">
                      {log.permissions || "No permissions"}
                    </div>
                  }
                  icon={<Shield size={12} />}
                  className="md:col-span-2"
                />
              </div>
            </Card>
          )}

          {activeTab === "device" && (
            <Card className="p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                Device & Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="IP Address"
                  value={log.ip_address.replace("::ffff:", "")}
                  icon={<Globe size={12} />}
                />
                <InfoItem
                  label="Location"
                  value={log.location || "Unknown location"}
                  icon={
                    <MapPin
                      size={12}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  }
                />
                <InfoItem
                  label="Device Type"
                  value={log.device_type || "Unknown device"}
                  icon={<Smartphone size={12} />}
                />
                <InfoItem
                  label="Device Model"
                  value={log.device_model || "Unknown model"}
                  icon={<Smartphone size={12} />}
                />
                <InfoItem
                  label="Operating System"
                  value={log.os || "Unknown OS"}
                  icon={
                    <Monitor
                      size={12}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  }
                />
                <InfoItem
                  label="Browser"
                  value={log.browser || "Unknown browser"}
                  icon={<Globe size={12} />}
                />
                <InfoItem
                  label="User Agent"
                  value={
                    <div className="truncate max-w-full">
                      {log.user_agent || "Not available"}
                    </div>
                  }
                  icon={
                    <Monitor
                      size={12}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  }
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
            `}</style>
    </div>
  );
};

const Mail = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const MapPin = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Monitor = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

export default AuditLogDetailsPage;
