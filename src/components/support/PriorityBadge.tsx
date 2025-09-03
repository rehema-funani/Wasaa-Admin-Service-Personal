import { ArrowUpRight, Flag, HelpCircle, Zap } from "lucide-react";

const PriorityBadge = ({ priority }) => {
  const config = {
    urgent: {
      color:
        "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
      icon: <Zap size={12} className="mr-1 text-red-500" />,
    },
    high: {
      color:
        "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800",
      icon: <ArrowUpRight size={12} className="mr-1 text-orange-500" />,
    },
    medium: {
      color:
        "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
      icon: <Flag size={12} className="mr-1 text-amber-500" />,
    },
    low: {
      color:
        "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
      icon: <HelpCircle size={12} className="mr-1 text-blue-500" />,
    },
  };

  return (
    <div
      className={`px-2 py-0.5 text-xs font-medium rounded-full border flex items-center ${config[priority].color}`}
    >
      {config[priority].icon}
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </div>
  );
};
export default PriorityBadge;