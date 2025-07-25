import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  X,
  Clock,
  AlertTriangle,
  Folder,
  Plus,
  Smartphone,
  Briefcase,
  Settings,
  CreditCard,
  MessageCircle,
  HelpCircle,
  Shield,
  User,
  FileText
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
  firstResponseSla: number;
  resolutionSla: number;
  defaultPriority: string;
  autoAssignToRole: string | null;
  requiredSkills: string[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  parentId: string | null;
  firstResponseSla: number;
  resolutionSla: number;
  defaultPriority: string;
  color: string;
  icon: string;
  autoAssignToRole: string | null;
  requiredSkills: string[];
  isActive: boolean;
}

const colorOptions = [
  { value: '#4F46E5', label: 'Indigo' },
  { value: '#10B981', label: 'Green' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EF4444', label: 'Red' },
  { value: '#6366F1', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#0EA5E9', label: 'Sky' },
  { value: '#14B8A6', label: 'Teal' },
  { value: '#84CC16', label: 'Lime' },
  { value: '#FACC15', label: 'Yellow' },
  { value: '#F97316', label: 'Orange' },
  { value: '#8B5CF6', label: 'Violet' },
  { value: '#A855F7', label: 'Purple' },
  { value: '#D946EF', label: 'Fuchsia' },
  { value: '#F43F5E', label: 'Rose' },
  { value: '#64748B', label: 'Slate' },
  { value: '#4B5563', label: 'Gray' },
  { value: '#6D28D9', label: 'Violet' },
  { value: '#0369A1', label: 'Blue' },
  { value: '#059669', label: 'Emerald' },
  { value: '#B45309', label: 'Amber' },
  { value: '#B91C1C', label: 'Red' }
];

const iconOptions = [
  { value: 'folder', label: 'Folder', icon: <Folder /> },
  { value: 'smartphone', label: 'Smartphone', icon: <Smartphone /> },
  { value: 'briefcase', label: 'Business', icon: <Briefcase /> },
  { value: 'settings', label: 'Settings', icon: <Settings /> },
  { value: 'credit-card', label: 'Payment', icon: <CreditCard /> },
  { value: 'message-circle', label: 'Chat', icon: <MessageCircle /> },
  { value: 'help-circle', label: 'Help', icon: <HelpCircle /> },
  { value: 'shield', label: 'Security', icon: <Shield /> },
  { value: 'user', label: 'Account', icon: <User /> },
  { value: 'file-text', label: 'Document', icon: <FileText /> }
];

const roleOptions = [
  { value: '', label: 'None' },
  { value: 'support_agent', label: 'Support Agent' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'specialist', label: 'Specialist' },
  { value: 'admin', label: 'Administrator' }
];

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const parentIdFromQuery = queryParams.get('parentId') || null;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parentId: parentIdFromQuery,
    firstResponseSla: 30,
    resolutionSla: 120,
    defaultPriority: 'MEDIUM',
    color: '#4F46E5',
    icon: 'folder',
    autoAssignToRole: null,
    requiredSkills: [],
    isActive: true
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await supportService.getCategories();
        setCategories(response.data.categories);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'firstResponseSla' || name === 'resolutionSla') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else if (name === 'parentId' && value === '') {
      setFormData({ ...formData, parentId: null });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setTouched({ ...touched, [name]: true });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    setTouched({ ...touched, [name]: true });
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
    setTouched({ ...touched, color: true });
  };

  // Handle icon selection
  const handleIconSelect = (icon: string) => {
    setFormData({ ...formData, icon });
    setTouched({ ...touched, icon: true });
  };

  // Add a skill to required skills
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    // Check if skill already exists
    if (formData.requiredSkills.includes(newSkill.trim())) {
      return;
    }

    setFormData({
      ...formData,
      requiredSkills: [...formData.requiredSkills, newSkill.trim()]
    });
    setNewSkill('');
    setTouched({ ...touched, requiredSkills: true });
  };

  // Remove a skill from required skills
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(skill => skill !== skillToRemove)
    });
    setTouched({ ...touched, requiredSkills: true });
  };

  // Form validation
  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name) errors.name = 'Name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (formData.firstResponseSla <= 0) errors.firstResponseSla = 'First response SLA must be greater than 0';
    if (formData.resolutionSla <= 0) errors.resolutionSla = 'Resolution SLA must be greater than 0';
    if (formData.resolutionSla <= formData.firstResponseSla) {
      errors.resolutionSla = 'Resolution SLA must be greater than first response SLA';
    }

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
      await supportService.createCategory(formData);
      navigate('/categories');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Find selected parent category
  const selectedParentCategory = formData.parentId
    ? categories.find(category => category.id === formData.parentId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Categories
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              {formData.parentId ? 'Create Subcategory' : 'Create New Category'}
            </h1>
            {selectedParentCategory && (
              <p className="mt-1 text-sm text-gray-500">
                Parent: {selectedParentCategory.name}
              </p>
            )}
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
                  <div className="sm:col-span-2">
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
                      placeholder="e.g. Mobile App Issues"
                    />
                    {getError('name') && (
                      <p className="mt-1 text-sm text-red-600">{getError('name')}</p>
                    )}
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
                      placeholder="Describe the purpose of this category"
                    ></textarea>
                    {getError('description') && (
                      <p className="mt-1 text-sm text-red-600">{getError('description')}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
                      Parent Category
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
                        <select
                          id="parentId"
                          name="parentId"
                          value={formData.parentId || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">None (Top Level)</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="defaultPriority" className="block text-sm font-medium text-gray-700">
                      Default Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="defaultPriority"
                      name="defaultPriority"
                      value={formData.defaultPriority}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SLA Settings */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">SLA Settings</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstResponseSla" className="block text-sm font-medium text-gray-700">
                      First Response SLA (minutes) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="firstResponseSla"
                        name="firstResponseSla"
                        min="1"
                        value={formData.firstResponseSla}
                        onChange={handleChange}
                        className={`block w-full pl-10 sm:text-sm rounded-md ${getError('firstResponseSla')
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                      />
                    </div>
                    {getError('firstResponseSla') && (
                      <p className="mt-1 text-sm text-red-600">{getError('firstResponseSla')}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum time to first response
                    </p>
                  </div>

                  <div>
                    <label htmlFor="resolutionSla" className="block text-sm font-medium text-gray-700">
                      Resolution SLA (minutes) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="resolutionSla"
                        name="resolutionSla"
                        min="1"
                        value={formData.resolutionSla}
                        onChange={handleChange}
                        className={`block w-full pl-10 sm:text-sm rounded-md ${getError('resolutionSla')
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                      />
                    </div>
                    {getError('resolutionSla') && (
                      <p className="mt-1 text-sm text-red-600">{getError('resolutionSla')}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum time to resolve the ticket
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Appearance</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {colorOptions.map((color) => (
                        <div
                          key={color.value}
                          className={`h-8 w-8 rounded-full cursor-pointer flex items-center justify-center ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                            }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => handleColorSelect(color.value)}
                          title={color.label}
                        >
                          {formData.color === color.value && (
                            <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {iconOptions.map((iconOption) => (
                        <div
                          key={iconOption.value}
                          className={`h-10 w-10 rounded-md cursor-pointer flex items-center justify-center border ${formData.icon === iconOption.value
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                              : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500'
                            }`}
                          onClick={() => handleIconSelect(iconOption.value)}
                          title={iconOption.label}
                        >
                          {iconOption.icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Settings */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Assignment Settings</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="autoAssignToRole" className="block text-sm font-medium text-gray-700">
                      Auto-assign to Role
                    </label>
                    <select
                      id="autoAssignToRole"
                      name="autoAssignToRole"
                      value={formData.autoAssignToRole || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {roleOptions.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Tickets will be automatically assigned to users with this role
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Required Skills
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                        placeholder="Add a skill (e.g. technical)"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                          >
                            <span className="sr-only">Remove {skill}</span>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {formData.requiredSkills.length === 0 && (
                        <span className="text-xs text-gray-500 italic">No skills added</span>
                      )}
                    </div>
                  </div>
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
                      When enabled, this category will be available for ticket classification
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/categories')}
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
                    Create Category
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
