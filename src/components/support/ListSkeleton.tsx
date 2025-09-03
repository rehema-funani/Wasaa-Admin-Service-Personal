const ListSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y divide-gray-100 dark:divide-gray-600">
    {[1, 2, 3, 4, 5].map((item) => (
      <div key={item} className="p-4 animate-pulse">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
          <div className="w-20 h-5 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export default ListSkeleton;