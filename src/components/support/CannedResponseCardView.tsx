import React from 'react'
import { Copy, FileText, MoreHorizontal, Tag, User, Clock, MessageSquare, Check, X, Calendar, ArrowUpRight } from 'lucide-react';

const CannedResponseCardView = ({
    filteredResponses,
    handleCopy,
    renderCategoryBadge,
    renderCreatorAvatar,
    formatDate,
    creators,
    handleRenderTemplate,
    extractPlaceholders,
    highlightPlaceholders,
    setActiveMenu,
    renderActionMenu,
    expandedResponseId,
    setExpandedResponseId,
    copiedId,
    activeMenu,
    formatDateTime,

}) => {
  return (
    <div className="space-y-4">
      {filteredResponses.map((response) => (
        <div
          key={response.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="px-6 py-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mr-2 truncate">
                    {response.title}
                  </h3>
                  {!response.isActive && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Category & Metadata */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {renderCategoryBadge(response.category)}

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <User className="h-3.5 w-3.5 mr-1" />
                    <span className="flex items-center">
                      {renderCreatorAvatar(response.createdBy)}
                      <span className="ml-1">
                        {creators[response.createdBy]?.name || "Unknown"}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDate(response.updatedAt)}
                  </div>
                </div>

                {/* Tags */}
                {response.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {response.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-start space-x-2 ml-4">
                <div className="text-center px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {response.usageCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    uses
                  </div>
                </div>

                <div className="flex items-center text-right space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(response.content);
                    }}
                    className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {extractPlaceholders(response.content).length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenderTemplate(response);
                      }}
                      className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="Render Template"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(
                        activeMenu === response.id ? null : response.id
                      );
                    }}
                    className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  {renderActionMenu(response)}
                </div>
              </div>
            </div>

            <div
              className={`mt-3 bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-sm text-gray-700 dark:text-gray-300 ${
                expandedResponseId === response.id
                  ? ""
                  : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
              onClick={() =>
                expandedResponseId !== response.id &&
                setExpandedResponseId(response.id)
              }
            >
              {expandedResponseId === response.id ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Content
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(response.content);
                        }}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                      >
                        {copiedId === response.content ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedResponseId(null);
                        }}
                        className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap">
                    {highlightPlaceholders(response.content)}
                  </div>

                  {/* Detailed Info */}
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-3 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Created
                      </p>
                      <p className="flex items-center mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400 dark:text-gray-500" />
                        {formatDateTime(response.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Updated
                      </p>
                      <p className="flex items-center mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1 text-gray-400 dark:text-gray-500" />
                        {formatDateTime(response.updatedAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Placeholders
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {extractPlaceholders(response.content).map(
                          (placeholder) => (
                            <span
                              key={placeholder}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            >
                              {placeholder}
                            </span>
                          )
                        )}
                        {extractPlaceholders(response.content).length === 0 && (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            None
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Category Details
                      </p>
                      {response.category ? (
                        <div className="mt-1">
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            {response.category.description}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                              SLA: {response.category.firstResponseSla}m
                            </span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                              {response.category.defaultPriority}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic mt-1 inline-block">
                          No category assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="line-clamp-1">
                    {highlightPlaceholders(response.content.split("\n")[0])}
                    {response.content.includes("\n") && "..."}
                  </p>
                  <button
                    className="ml-2 flex-shrink-0 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedResponseId(response.id);
                    }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CannedResponseCardView
