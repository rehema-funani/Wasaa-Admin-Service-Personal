const CategoryBadge = ({ category }) => {
  const categories = {
    technical: {
      color:
        "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
    },
    billing: {
      color:
        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
    },
    account: {
      color:
        "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800",
    },
    feature: {
      color:
        "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
    },
    general: {
      color:
        "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600",
    },
  };

  const config = categories[category] || categories.general;

  return (
    <div
      className={`px-2 py-0.5 text-xs font-medium rounded-full border ${config.color}`}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </div>
  );
};
export default CategoryBadge;