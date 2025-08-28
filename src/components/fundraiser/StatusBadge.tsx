import React from "react";
import {
  CheckCircle,
    XCircle,
    Zap,
    AlertTriangle,
    Clock } from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_approval: {
      color:
        "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      icon: <Clock size={10} className="mr-1" />,
      label: "Pending Approval",
    },
    approved: {
      color:
        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
      icon: <CheckCircle size={10} className="mr-1" />,
      label: "Approved",
    },
    active: {
      color:
        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
      icon: <Zap size={10} className="mr-1" />,
      label: "Active",
    },
    rejected: {
      color: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      icon: <XCircle size={10} className="mr-1" />,
      label: "Rejected",
    },
    completed: {
      color: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      icon: <CheckCircle size={10} className="mr-1" />,
      label: "Completed",
    },
    paused: {
      color:
        "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
      icon: <AlertTriangle size={10} className="mr-1" />,
      label: "Paused",
    },
  };

  const config = statusConfig[status] || {
    color:
      "bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400",
    icon: <Clock size={10} className="mr-1" />,
    label: status.replace(/_/g, " "),
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;