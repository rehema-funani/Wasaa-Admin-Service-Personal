const getPriorityBadge = (priority: string) => {
  let bgColor = "";
  let textColor = "";

  switch (priority) {
    case "CRITICAL":
      bgColor = "bg-red-50 dark:bg-red-900/30";
      textColor = "text-red-700 dark:text-red-400";
      break;
    case "HIGH":
      bgColor = "bg-orange-50 dark:bg-orange-900/30";
      textColor = "text-orange-700 dark:text-orange-400";
      break;
    case "MEDIUM":
      bgColor = "bg-yellow-50 dark:bg-yellow-900/30";
      textColor = "text-yellow-700 dark:text-yellow-400";
      break;
    case "LOW":
      bgColor = "bg-green-50 dark:bg-green-900/30";
      textColor = "text-green-700 dark:text-green-400";
      break;
    default:
      bgColor = "bg-gray-50 dark:bg-gray-700";
      textColor = "text-gray-700 dark:text-gray-300";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${bgColor} ${textColor}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
    </span>
  );
};

export default getPriorityBadge;