import { CheckCircle, Clock, Timer, XCircle } from "lucide-react";

const SlaStatusBadge = ({ status }) => {
  const config = {
    on_track: {
      color:
        "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800",
      icon: <CheckCircle size={12} className="mr-1 text-green-500" />,
    },
    at_risk: {
      color:
        "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
      icon: <Timer size={12} className="mr-1 text-amber-500" />,
    },
    breached: {
      color:
        "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
      icon: <XCircle size={12} className="mr-1 text-red-500" />,
    },
    paused: {
      color:
        "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600",
      icon: <Clock size={12} className="mr-1 text-gray-500" />,
    },
  };

  return (
    <div
      className={`px-2 py-0.5 text-xs font-medium rounded-full border flex items-center ${config[status].color}`}
    >
      {config[status].icon}
      {status === "at_risk"
        ? "At Risk"
        : status === "on_track"
        ? "On Track"
        : status === "breached"
        ? "Breached"
        : "Paused"}
    </div>
  );
};
export default SlaStatusBadge;