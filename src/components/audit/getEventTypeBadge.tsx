import { Database, Edit, FileText, LogIn, Terminal, Trash2 } from 'lucide-react';
import React from 'react'

const getEventTypeBadge = (eventType: string) => {
    if (eventType.includes("create")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-700 text-xs font-medium shadow-sm">
          <FileText size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else if (eventType.includes("update")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-700 text-xs font-medium shadow-sm">
          <Edit size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else if (eventType.includes("delete")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-700 text-xs font-medium shadow-sm">
          <Trash2 size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else if (eventType.includes("login")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-700 text-xs font-medium shadow-sm">
          <LogIn size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else if (eventType.includes("fetch")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-700 text-xs font-medium shadow-sm">
          <Database size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 text-xs font-medium shadow-sm">
          <Terminal size={12} />
          <span>{eventType}</span>
        </div>
      );
    }
  };

export default getEventTypeBadge
