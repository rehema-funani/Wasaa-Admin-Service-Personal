import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Loader,
  X,
  Globe,
  Tag,
  Plus,
  HelpCircle,
  Info,
} from "lucide-react";
import supportService from "../../../api/services/support";

const FAQForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    categoryId: "",
    tags: [],
    language: "en",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    question?: string;
    answer?: string;
    categoryId?: string;
    language?: string;
  }>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [languageOptions] = useState([
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
  ]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await supportService.getCategories();

        setCategories(response.data.categories || []);
      } catch (err) {
        setError("Failed to fetch categories");
        console.error(err);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      fetchFAQ();
    }
  }, [id]);

  const fetchFAQ = async () => {
    setFetchLoading(true);

    try {
      const response = await supportService.getFAQById(id);

      setFormData({
        question: response.data.faq.question || "",
        answer: response.data.faq.answer || "",
        categoryId: response.data.faq.categoryId || "",
        tags: response.data.faq.tags || [],
        language: response.data.faq.language || "en",
      });
    } catch (err) {
      setError("Failed to fetch FAQ details");
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAddTag = () => {
    if (!inputTag.trim()) return;

    if (formData.tags.includes(inputTag.trim().toLowerCase())) {
      setInputTag("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, inputTag.trim().toLowerCase()],
    }));

    setInputTag("");
  };

  const handleRemoveTag = (tagToRemove: any) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: any) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const errors: {
      question?: string;
      answer?: string;
      categoryId?: string;
      language?: string;
    } = {};

    if (!formData.question.trim()) {
      errors.question = "Question is required";
    }

    if (!formData.answer.trim()) {
      errors.answer = "Answer is required";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
    }

    if (!formData.language) {
      errors.language = "Language is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditMode) {
        await supportService.updateFAQ(id, formData);
        setSuccess("FAQ updated successfully");
      } else {
        await supportService.createFAQ(formData);
        setSuccess("FAQ created successfully");

        if (!isEditMode) {
          setFormData({
            question: "",
            answer: "",
            categoryId: "",
            tags: [],
            language: "en",
          });
        }
      }

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/admin/support/faqs");
      }, 1500);
    } catch (err) {
      setError(
        formatErrorMessage(err) ||
          `Failed to ${isEditMode ? "update" : "create"} FAQ`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);

    try {
      await supportService.deleteFAQ(id);
      setSuccess("FAQ deleted successfully");

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/admin/support/faqs");
      }, 1500);
    } catch (err) {
      setError("Failed to delete FAQ");
      console.error(err);
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  // Helper to format error messages
  const formatErrorMessage = (err) => {
    return err?.response?.data?.message || err?.message || "An error occurred";
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader className="h-8 w-8 text-teal-500 dark:text-teal-400 animate-spin" />
        <span className="ml-2 text-gray-500 dark:text-gray-400">
          Loading FAQ details...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate("/admin/support/faqs")}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {isEditMode ? "Edit FAQ" : "Create New FAQ"}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isEditMode
                  ? "Update the details of this frequently asked question"
                  : "Add a new frequently asked question to help your users"}
              </p>
            </div>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Alert messages */}
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* Question field */}
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Question{" "}
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HelpCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="e.g. How do I reset my password?"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    validationErrors.question
                      ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                  } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2`}
                />
              </div>
              {validationErrors.question && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.question}
                </p>
              )}
            </div>

            {/* Answer field */}
            <div>
              <label
                htmlFor="answer"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Answer <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                rows={6}
                placeholder="Provide a clear and concise answer..."
                className={`block w-full px-3 py-2.5 border ${
                  validationErrors.answer
                    ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2`}
              />
              {validationErrors.answer && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.answer}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                You can use plain text. Markdown is not supported.
              </p>
            </div>

            {/* Category selector */}
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category{" "}
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={`block w-full px-3 py-2.5 border ${
                  validationErrors.categoryId
                    ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2`}
              >
                <option value="" className="text-gray-500 dark:text-gray-400">
                  Select a category
                </option>
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              {validationErrors.categoryId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.categoryId}
                </p>
              )}
            </div>

            {/* Tags input */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tags
              </label>
              <div className="flex items-center">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="tags"
                    value={inputTag}
                    onChange={(e) => setInputTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add a tag and press Enter"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    >
                      <Tag className="h-3.5 w-3.5 mr-1.5" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1.5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                Tags help users find related FAQs. Add keywords that describe
                this FAQ.
              </p>
            </div>

            {/* Language selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language{" "}
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        language: language.code,
                      }));
                      if (validationErrors.language) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          language: null,
                        }));
                      }
                    }}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm ${
                      formData.language === language.code
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    } transition-colors`}
                  >
                    <Globe className="h-4 w-4 mr-1.5" />
                    {language.name}
                  </button>
                ))}
              </div>
              {validationErrors.language && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.language}
                </p>
              )}
            </div>
          </div>

          {/* Form actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/support/faqs")}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-primary-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? "Update FAQ" : "Create FAQ"}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
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
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQForm;
