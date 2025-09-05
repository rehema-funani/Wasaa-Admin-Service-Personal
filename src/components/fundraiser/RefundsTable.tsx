import { motion } from "framer-motion";
import {
  Clock, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  FileText, 
  Loader,
  RotateCcw,
  Gift,
  Users,
  Calendar,
  AlertTriangle,
  Shield,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Imported Badge Components
const StatusBadge = ({ status, type }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  let icon = <info size={12} className="mr-1.5" />;
  
  if (type === "chargeback") {
    switch (status) {
      case "pending":
        bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        icon = <Clock size={12} className="mr-1.5" />;
        break;
      case "disputed":
        bgColor = "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
        icon = <AlertTriangle size={12} className="mr-1.5" />;
        break;
      case "settled":
        bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      case "lost":
        bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      default:
        break;
    }
  } else {
    switch (status) {
      case "completed":
        bgColor = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      case "approved":
        bgColor = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
        icon = <ThumbsUp size={12} className="mr-1.5" />;
        break;
      case "pending":
        bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        icon = <Clock size={12} className="mr-1.5" />;
        break;
      case "processing":
        bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        icon = <RotateCcw size={12} className="mr-1.5" />;
        break;
      case "rejected":
      case "cancelled":
        bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        icon = <ThumbsDown size={12} className="mr-1.5" />;
        break;
      default:
        break;
    }
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {status.charAt(0).