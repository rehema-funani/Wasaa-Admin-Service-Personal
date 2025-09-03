const StatusBadge = ({ status }) => {
  const config = {
    new: {
      color:
        "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
      dot: "bg-indigo-500",
      label: "New",
    },
    assigned: {
      color:
        "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
      dot: "bg-blue-500",
      label: "Assigned",
    },
    in_progress: {
      color:
        "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
      dot: "bg-amber-500",
      label: "In Progress",
    },
    on_hold: {
      color:
        "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800",
      dot: "bg-purple-500",
      label: "On Hold",
    },
    resolved: {
      color:
        "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800",
      dot: "bg-green-500",
      label: "Resolved",
    },
    closed: {
      color:
        "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600",
      dot: "bg-gray-500",
      label: "Closed",
    },
  };

  const statusConfig = config[status] || config.new;

  return (
    <div
      className={`px-2 py-0.5 text-xs font-medium rounded-full border flex items-center ${statusConfig.color}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} mr-1.5`}
      ></span>
      {statusConfig.label}
    </div>
  );
};
export default StatusBadge;