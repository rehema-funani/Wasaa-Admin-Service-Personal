const getStatusBadge = (status: string) => {
  switch (status) {
    case "OPEN":
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            Open
          </span>
        </div>
      );
    case "IN_PROGRESS":
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            In Progress
          </span>
        </div>
      );
    case "RESOLVED":
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            Resolved
          </span>
        </div>
      );
    case "CLOSED":
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            Closed
          </span>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            {status}
          </span>
        </div>
      );
  }
};

export default getStatusBadge;