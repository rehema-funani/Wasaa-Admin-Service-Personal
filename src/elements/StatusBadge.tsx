import { AlertTriangle, Calendar, CheckCircle, PauseCircle, RefreshCw } from 'lucide-react';
import React from 'react'

const getStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full">
          Draft
        </span>
      );
    case "scheduled":
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-full">
          <Calendar size={10} className="mr-1" />
          Scheduled
        </span>
      );
    case "sending":
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300 rounded-full">
          <RefreshCw size={10} className="mr-1 animate-spin" />
          Sending
        </span>
      );
    case "paused":
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-full">
          <PauseCircle size={10} className="mr-1" />
          Paused
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 rounded-full">
          <CheckCircle size={10} className="mr-1" />
          Completed
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-full">
          <AlertTriangle size={10} className="mr-1" />
          Failed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full">
          {status}
        </span>
      );
  }
};

export const StatusBadge = ({ status }: { status: string }) => {
  return <>{getStatusBadge(status)}</>;
};