import React from 'react'
import { ArrowUp, ArrowDown, User, Copy, FileText, Eye, Edit, Trash2 } from 'lucide-react';

const CannedResponseCompactView = ({
    filteredResponses,
    sortField,
    sortDirection,
    handleSort,
    renderCategoryBadge,
    formatDate,
    creators,
    handleCopy,
    handleRenderTemplate,
    extractPlaceholders,
    handleDelete,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("title")}
            >
              <div className="flex items-center">
                Title
                {sortField === "title" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("categoryName")}
            >
              <div className="flex items-center">
                Category
                {sortField === "categoryName" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("updatedAt")}
            >
              <div className="flex items-center">
                Last Updated
                {sortField === "updatedAt" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("usageCount")}
            >
              <div className="flex items-center">
                Usage
                {sortField === "usageCount" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
          {filteredResponses.map((response) => (
            <tr
              key={response.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      {response.title}
                      {!response.isActive && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                      {response.content.replace(/\n/g, " ")}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {response.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {response.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          +{response.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {response.category ? (
                  renderCategoryBadge(response.category)
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    —
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(response.updatedAt)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <User className="h-3 w-3 mr-1" />
                  {creators[response.createdBy]?.name || "Unknown"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {response.usageCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  uses
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-2">
                  <button
                    onClick={() => handleCopy(response.content)}
                    className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {extractPlaceholders(response.content).length > 0 && (
                    <button
                      onClick={() => handleRenderTemplate(response)}
                      className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="Render Template"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => console.log("View details", response.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => console.log("Edit", response.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(response.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CannedResponseCompactView
