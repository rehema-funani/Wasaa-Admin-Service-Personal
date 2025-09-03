const GridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div
        key={item}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 animate-pulse"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded mb-4"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

export default GridSkeleton;