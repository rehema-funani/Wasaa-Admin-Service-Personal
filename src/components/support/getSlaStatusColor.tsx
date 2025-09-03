const getSlaStatusColor = (dueDate: string, status: string) => {
  if (status === "RESOLVED" || status === "CLOSED") {
    return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  }

  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) {
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
  } else if (diffHours < 1) {
    return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
  } else if (diffHours < 3) {
    return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400";
  } else {
    return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
  }
};

export default getSlaStatusColor;