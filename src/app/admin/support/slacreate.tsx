import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Clock,
  Tag,
  AlertTriangle
} from 'lucide-react';
import supportService from '../../../api/services/support';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  color: string;
  icon: string;
  isActive: boolean;
}

interface SLAFormData {
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  categoryIds: string[];
  businessHours: boolean;
  responseTime: number;
  resolutionTime: number;
  isActive: boolean;
}

export default function SLACreatePage() {
  const navigate = useNavigate();

  // State
  const [formData, setFormData] = useState<SLAFormData>({
    name: '',
    description: '',
    priority: 'MEDIUM',
    categoryIds: [],
    businessHours: false,
    responseTime: 60,
    resolutionTime: 240,
    isActive: true
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await supportService.getCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle number values
    if (name === 'responseTime' || name === 'resolutionTime') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Mark field as touched
    setTouched({ ...touched, [name]: true });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    setTouched({ ...touched, [name]: true });
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCategories(selectedOptions);
    setFormData({ ...formData, categoryIds: selectedOptions });
    setTouched({ ...touched, categoryIds: true });
  };

  // Form validation
  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name) errors.name = 'Name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (formData.responseTime <= 0) errors.responseTime = 'Response time must be greater than 0';
    if (formData.resolutionTime <= 0) errors.resolutionTime = 'Resolution time must be greater than 0';
    if (formData.resolutionTime <= formData.responseTime) {
      errors.resolutionTime = 'Resolution time must be greater than response time';
    }
    if (formData.categoryIds.length === 0) errors.categoryIds = 'At least one category must be selected';

    return errors;
  };

  // Get validation error for a field
  const getError = (field: string) => {
    if (!touched[field]) return null;

    const errors = validate();
    return errors[field] || null;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      // Mark all fields as touched to show errors
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await supportService.createSLARule(formData);
      navigate(-1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create SLA rule');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/sla')}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to SLA Rules
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Create New SLA Rule</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${getError('name')
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      placeholder="e.g. Premium Support SLA"
                    />
                    {getError('name') && (
                      <p className="mt-1 text-sm text-red-600">{getError('name')}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${getError('description')
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      placeholder="Describe the purpose of this SLA rule"
                    ></textarea>
                    {getError('description') && (
                      <p className="mt-1 text-sm text-red-600">{getError('description')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Settings */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Time Settings</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="responseTime" className="block text-sm font-medium text-gray-700">
                      Response Time (minutes) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="responseTime"
                        name="responseTime"
                        min="1"
                        value={formData.responseTime}
                        onChange={handleChange}
                        className={`block w-full pl-10 sm:text-sm rounded-md ${getError('responseTime')
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                      />
                    </div>
                    {getError('responseTime') && (
                      <p className="mt-1 text-sm text-red-600">{getError('responseTime')}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum time to first response
                    </p>
                  </div>

                  <div>
                    <label htmlFor="resolutionTime" className="block text-sm font-medium text-gray-700">
                      Resolution Time (minutes) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="resolutionTime"
                        name="resolutionTime"
                        min="1"
                        value={formData.resolutionTime}
                        onChange={handleChange}
                        className={`block w-full pl-10 sm:text-sm rounded-md ${getError('resolutionTime')
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                      />
                    </div>
                    {getError('resolutionTime') && (
                      <p className="mt-1 text-sm text-red-600">{getError('resolutionTime')}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum time to resolve the ticket
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="businessHours"
                          name="businessHours"
                          type="checkbox"
                          checked={formData.businessHours}
                          onChange={handleCheckboxChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="businessHours" className="font-medium text-gray-700">
                          Business Hours Only
                        </label>
                        <p className="text-gray-500">
                          When enabled, SLA timers only run during configured business hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
                <div>
                  <label htmlFor="categoryIds" className="block text-sm font-medium text-gray-700">
                    Apply to Categories <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    {categoriesLoading ? (
                      <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none">
                        <div className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <select
                          id="categoryIds"
                          name="categoryIds"
                          multiple
                          size={Math.min(5, categories.length)}
                          value={selectedCategories}
                          onChange={handleCategoryChange}
                          className={`mt-1 block w-full py-2 px-3 border ${getError('categoryIds')
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            } bg-white rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          Hold Ctrl/Cmd to select multiple categories
                        </p>
                      </>
                    )}
                  </div>
                  {getError('categoryIds') && (
                    <p className="mt-1 text-sm text-red-600">{getError('categoryIds')}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isActive" className="font-medium text-gray-700">
                      Active
                    </label>
                    <p className="text-gray-500">
                      When enabled, this SLA rule will be applied to new tickets
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/sla')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create SLA Rule
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
