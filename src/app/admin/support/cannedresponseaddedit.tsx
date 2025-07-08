import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  X,
  Plus,
  MessageSquare,
  Tag,
  Copy,
  Check,
  Info,
  RefreshCw
} from 'lucide-react';
import supportService from '../../../api/services/support';
import { useNavigate, useParams } from 'react-router-dom';

export default function CannedResponseForm({ isEditing = false }) {
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    tags: [],
    categoryId: '',
    isActive: true
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [previewValues, setPreviewValues] = useState({
    customerName: 'Alex Johnson',
    agentName: 'Sarah Parker',
    transactionId: 'TRX-12345',
    reason: 'insufficient funds',
    timeframe: '24',
    ticketId: 'SUP-67890'
  });
  const [copiedContent, setCopiedContent] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await supportService.getCategories();
        setCategories(categoriesResponse.data.categories || []);

        const tagsResponse = await supportService.getPopularTags();
        setPopularTags(tagsResponse.data.tags || []);

        if (isEditing) {
          const responseId = id;
          const responseData = await supportService.getCannedResponseById(responseId);
          setFormData(responseData.data.cannedResponse);
        }
      } catch (err) {
        setError('Failed to load form data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim().toLowerCase())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim().toLowerCase()]
        }));
      }
      setNewTag('');
    }
  };

  const addPopularTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const extractPlaceholders = (content) => {
    if (!content) return [];

    const placeholders = [];
    const regex = /\{\{([^}]+)\}\}/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }

    return placeholders;
  };

  const handlePlaceholderChange = (placeholder, value) => {
    setPreviewValues(prev => ({
      ...prev,
      [placeholder]: value
    }));
  };

  const replacePlaceholders = (content) => {
    if (!content) return '';

    return content.replace(/\{\{([^}]+)\}\}/g, (match, placeholder) => {
      return previewValues[placeholder] || match;
    });
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isEditing) {
        await supportService.updateCannedResponse(formData.id, formData);
        setSuccessMessage('Canned response updated successfully!');
      } else {
        await supportService.createCannedResponse(formData);
        setSuccessMessage('Canned response created successfully!');

        if (!isEditing) {
          setFormData({
            id: '',
            title: '',
            content: '',
            tags: [],
            categoryId: '',
            isActive: true
          });
        }
      }
    } catch (err) {
      setError('Failed to save canned response');
      console.error(err);
    } finally {
      setSaving(false);

      if (successMessage) {
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    }
  };

  const placeholders = extractPlaceholders(formData.content);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <button
              onClick={() => navigate('/admin/support/canned-responses')}
              className="mr-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-medium text-gray-900">
              {isEditing ? 'Edit Canned Response' : 'Create Canned Response'}
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            {isEditing
              ? 'Update this pre-written response for support agents'
              : 'Create a pre-written response to save time when answering common queries'
            }
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Fields */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Welcome Message"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., Hello {{customerName}}, thank you for contacting us..."
                      />
                      <div className="mt-1 text-xs text-gray-500 flex items-start">
                        <Info className="h-3 w-3 mr-1 mt-0.5" />
                        <span>
                          Use <code className="bg-gray-100 px-1 rounded">{'{{placeholder}}'}</code> for dynamic content (e.g., <code className="bg-gray-100 px-1 rounded">{'{{customerName}}'}</code>, <code className="bg-gray-100 px-1 rounded">{'{{agentName}}'}</code>)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories
                        .filter(category => category.isActive || category.id === formData.categoryId)
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                            {!category.isActive && ' (Inactive)'}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          id="newTag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          className="block w-full border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Add a tag and press Enter"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newTag.trim()) {
                              if (!formData.tags.includes(newTag.trim().toLowerCase())) {
                                setFormData(prev => ({
                                  ...prev,
                                  tags: [...prev.tags, newTag.trim().toLowerCase()]
                                }));
                              }
                              setNewTag('');
                            }
                          }}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {popularTags.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Popular tags:</p>
                          <div className="flex flex-wrap gap-1">
                            {popularTags
                              .filter(tag => !formData.tags.includes(tag.name))
                              .slice(0, 8)
                              .map(tag => (
                                <button
                                  key={tag.name}
                                  type="button"
                                  onClick={() => addPopularTag(tag.name)}
                                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  {tag.name}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isActive" className="font-medium text-gray-700">
                        Active
                      </label>
                      <p className="text-gray-500">
                        Only active responses can be used by support agents
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => console.log('Go back to list')}
                      className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="-ml-1 mr-2 h-4 w-4" />
                          {isEditing ? 'Update Response' : 'Create Response'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className="text-sm font-medium text-gray-900">Preview</h2>
                </div>

                {placeholders.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-medium text-gray-500 mb-2">Preview Variables</h3>
                    <div className="space-y-2">
                      {placeholders.map(placeholder => (
                        <div key={placeholder}>
                          <label className="block text-xs text-gray-500 mb-1">
                            {placeholder}
                          </label>
                          <input
                            type="text"
                            value={previewValues[placeholder] || ''}
                            onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={`Value for ${placeholder}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-medium text-gray-500">Message Preview</h3>
                    <button
                      type="button"
                      onClick={() => handleCopy(replacePlaceholders(formData.content))}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      disabled={!formData.content}
                    >
                      {copiedContent ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-indigo-50 rounded-md p-3 text-sm text-gray-800 border border-indigo-100 min-h-[100px] whitespace-pre-wrap">
                    {formData.content ? replacePlaceholders(formData.content) : (
                      <span className="text-gray-400 italic">
                        Preview will appear here as you type...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
