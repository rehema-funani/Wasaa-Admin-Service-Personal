import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Tag,
  Globe,
  AlertTriangle,
  CheckCircle,
  Loader,
  X,
  Grid3X3,
  Eye,
} from "lucide-react";
import supportService from "../../../api/services/support";

const FAQManagementPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [success, setSuccess] = useState(null);
  const [commonTags, setCommonTags] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchFAQs();
  }, [searchTerm, selectedLanguage, selectedTags, pagination.page]);

  const fetchFAQs = async () => {
    setLoading(true);

    try {
      const response = await supportService.getFAQs();
      setFaqs(response.data.faqs || []);
      setPagination({
        ...pagination,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 0,
      });

      const allTags = response.faqs?.flatMap((faq) => faq.tags) || [];
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

      const topTags = Object.entries(tagCounts)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 10)
        .map(([tag]) => tag);

      setCommonTags(topTags);
    } catch (err) {
      setError("Failed to fetch FAQs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const toggleExpandFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;

    try {
      await supportService.deleteFAQ(faqToDelete);
      setFaqs(faqs.filter((faq) => faq.id !== faqToDelete));
      setSuccess("FAQ deleted successfully");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete FAQ");
      console.error(err);
    } finally {
      setDeleteModalOpen(false);
      setFaqToDelete(null);
    }
  };

  const openDeleteModal = (id) => {
    setFaqToDelete(id);
    setDeleteModalOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLanguage("");
    setSelectedTags([]);
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              FAQ Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage frequently asked questions for your users
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/support/faqs/create")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-primary-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-900 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New FAQ
            </motion.button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 flex items-start"
          >
            <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                Dismiss
              </button>
            </div>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="h-5 w-5 text-red-500 dark:text-red-400" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 flex items-start"
          >
            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">
              {success}
            </p>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X className="h-5 w-5 text-green-500 dark:text-green-400" />
            </button>
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 text-teal-500 dark:text-teal-400 animate-spin" />
              <span className="ml-2 text-gray-500 dark:text-gray-400">
                Loading FAQs...
              </span>
            </div>
          ) : faqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <Grid3X3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No FAQs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                {searchTerm || selectedLanguage || selectedTags.length > 0
                  ? "Try adjusting your search filters to find what you're looking for."
                  : "Get started by adding your first FAQ to help your users."}
              </p>

              {searchTerm || selectedLanguage || selectedTags.length > 0 ? (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  onClick={() => navigate("/faqs/create")}
                  className="mt-4 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-primary-500 hover:shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Add New FAQ
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {faqs.map((faq) => (
                <li key={faq.id} className="group">
                  <div className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center mb-2">
                          <h3
                            className="text-base font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400"
                            onClick={() => toggleExpandFAQ(faq.id)}
                          >
                            {faq.question}
                          </h3>
                          <div className="ml-3 flex space-x-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              <Globe className="h-3 w-3 mr-1" />
                              {faq.language.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <p className="whitespace-pre-line">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="flex items-center">
                        <button
                          onClick={() => toggleExpandFAQ(faq.id)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>

                        <div className="relative hidden group-hover:block">
                          <button
                            onClick={() =>
                              navigate(`/admin/support/faqs/${faq.id}`)
                            }
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/admin/support/faqs/${faq.id}/edit`)
                            }
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => openDeleteModal(faq.id)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          {!loading && faqs.length > 0 && pagination.totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                  pagination.page === 1
                    ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Previous
              </button>

              <div className="flex items-center">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - pagination.page) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis
                    const showEllipsisBefore =
                      index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter =
                      index < array.length - 1 && array[index + 1] !== page + 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <span className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                            ...
                          </span>
                        )}

                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                            pagination.page === page
                              ? "bg-teal-500 text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {page}
                        </button>

                        {showEllipsisAfter && (
                          <span className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                            ...
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                  pagination.page === pagination.totalPages
                    ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white dark:bg-gray-800 p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400" />
                  </div>
                  <div className="ml-4 mt-0.5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Delete FAQ
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this FAQ? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setFaqToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagementPage;
