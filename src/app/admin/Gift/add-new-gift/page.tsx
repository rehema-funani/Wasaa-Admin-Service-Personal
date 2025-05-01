import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Gift,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Tag,
  Sparkles,
  Eye
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// Types with relaxed typing
interface Category {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  description: string;
  cost: number;
  monetaryValue: number;
  category: string;
  tags: string[];
  isActive: boolean;
  isLimited: boolean;
  limitedStartDate: string | null;
  limitedEndDate: string | null;
  [key: string]: any; // Allow any additional properties
}

interface GiftData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  animationUrl?: string;
  cost: number;
  monetaryValue: number;
  category: string;
  tags: string[];
  isActive: boolean;
  isLimited: boolean;
  limitedTimeOnly?: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Allow any additional properties
}

interface FormErrors {
  name?: string;
  cost?: string;
  limitedStartDate?: string;
  limitedEndDate?: string;
  image?: string;
  submit?: string;
  [key: string]: string | undefined;
}

// Mock categories for dropdown (would come from API)
const mockCategories: Category[] = [
  { id: 'basic', name: 'Basic' },
  { id: 'premium', name: 'Premium' },
  { id: 'seasonal', name: 'Seasonal' },
  { id: 'celebration', name: 'Celebration' },
  { id: 'sports', name: 'Sports' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'music', name: 'Music' }
];

// Mock gift data for edit mode
const mockGiftData: GiftData = {
  id: 'GIFT001',
  name: 'Super Heart',
  description: 'A pulsating heart that shows your love for the creator',
  imageUrl: '/gifts/heart.png',
  animationUrl: '/gifts/animations/heart.mp4',
  cost: 100,
  monetaryValue: 1.0,
  category: 'Basic',
  tags: ['love', 'popular', 'starter'],
  isActive: true,
  isLimited: false,
  createdAt: '2024-12-10T14:32:10Z',
  updatedAt: '2025-03-15T09:14:22Z'
};

const page = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    cost: 100,
    monetaryValue: 1.0,
    category: 'Basic',
    tags: [],
    isActive: true,
    isLimited: false,
    limitedStartDate: null,
    limitedEndDate: null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [animationPreview, setAnimationPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [tagInput, setTagInput] = useState<string>('');

  // Fetch gift data for editing
  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);

      // In a real app, fetch gift from API
      // Example: const response = await giftService.getGift(id);

      // Simulate API call with mock data
      setTimeout(() => {
        // Format data for the form
        const gift = mockGiftData;
        setFormData({
          name: gift.name,
          description: gift.description,
          cost: gift.cost,
          monetaryValue: gift.monetaryValue,
          category: gift.category,
          tags: gift.tags || [],
          isActive: gift.isActive,
          isLimited: gift.isLimited,
          limitedStartDate: gift.isLimited && gift.limitedTimeOnly ? gift.limitedTimeOnly.startDate : null,
          limitedEndDate: gift.isLimited && gift.limitedTimeOnly ? gift.limitedTimeOnly.endDate : null
        });

        // Set previews
        setImagePreview(gift.imageUrl);
        setAnimationPreview(gift.animationUrl || null);

        setIsLoading(false);
      }, 600);
    }
  }, [id, isEditing]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Update monetary value when cost changes
    if (name === 'cost') {
      const cost = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        monetaryValue: parseFloat((cost / 100).toFixed(2))
      }));
    }
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add tag on Enter key
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();

      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }

      setTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // In a real app, you would upload the file to a server
      // For now, just show a preview using FileReader
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setImagePreview(event.target.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle animation upload
  const handleAnimationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // In a real app, you would upload the file to a server
      // For now, just show a preview using FileReader
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setAnimationPreview(event.target.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Gift name is required';
    }

    if (!formData.cost || formData.cost <= 0) {
      newErrors.cost = 'Cost must be greater than 0';
    }

    if (formData.isLimited) {
      if (!formData.limitedStartDate) {
        newErrors.limitedStartDate = 'Start date is required for limited time gifts';
      }

      if (!formData.limitedEndDate) {
        newErrors.limitedEndDate = 'End date is required for limited time gifts';
      }

      if (formData.limitedStartDate && formData.limitedEndDate) {
        const startDate = new Date(formData.limitedStartDate);
        const endDate = new Date(formData.limitedEndDate);

        if (endDate <= startDate) {
          newErrors.limitedEndDate = 'End date must be after start date';
        }
      }
    }

    if (!imagePreview) {
      newErrors.image = 'Gift image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Prepare data for saving
      const giftData = {
        ...formData,
        imageUrl: imagePreview,
        animationUrl: animationPreview,
        limitedTimeOnly: formData.isLimited ? {
          startDate: formData.limitedStartDate,
          endDate: formData.limitedEndDate
        } : null
      };

      // In a real app, call API to save gift
      // if (isEditing) {
      //   await giftService.updateGift(id, giftData);
      // } else {
      //   await giftService.createGift(giftData);
      // }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to gift listing
      navigate('/gifts');
    } catch (error) {
      console.error('Error saving gift:', error);
      setErrors({ submit: 'Failed to save gift. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <motion.div
        className="flex items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => navigate('/gifts')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
        >
          <ArrowLeft size={20} className="mr-2" strokeWidth={1.8} />
          Back to Gift List
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">
          {isEditing ? 'Edit Gift' : 'Create New Gift'}
        </h1>
      </motion.div>

      {errors.submit && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle size={20} className="mr-2 mt-0.5" strokeWidth={1.8} />
          <span>{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left two columns - Form fields */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>

              <div className="space-y-4">
                {/* Gift Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Gift Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter gift name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Gift Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter a description for this gift"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {mockCategories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                        <span>{tag}</span>
                        <button
                          type="button"
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X size={14} strokeWidth={1.8} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <Tag size={16} className="absolute left-3 top-2.5 text-gray-400" strokeWidth={1.8} />
                    <input
                      id="tags"
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyDown}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Type a tag and press Enter (e.g., love, premium)"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Tags make your gift easier to discover
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="text-lg font-medium text-gray-800 mb-4">Pricing</h2>

                <div className="space-y-4">
                  {/* Cost */}
                  <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                      Cost (Coins) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="cost"
                        name="cost"
                        type="number"
                        min="1"
                        value={formData.cost}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.cost ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="100"
                      />
                    </div>
                    {errors.cost && (
                      <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
                    )}
                  </div>

                  {/* Monetary Value */}
                  <div>
                    <label htmlFor="monetaryValue" className="block text-sm font-medium text-gray-700 mb-1">
                      Monetary Value ($)
                    </label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-2.5 text-gray-400" strokeWidth={1.8} />
                      <input
                        id="monetaryValue"
                        name="monetaryValue"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.monetaryValue}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                        readOnly
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Automatically calculated based on coin cost (100 coins = $1.00)
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="text-lg font-medium text-gray-800 mb-4">Availability</h2>

                <div className="space-y-4">
                  {/* Active Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Gift Status
                      </label>
                      <p className="text-xs text-gray-500">
                        Inactive gifts are not visible to users
                      </p>
                    </div>
                  </div>

                  {/* Limited Time */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <label htmlFor="isLimited" className="text-sm font-medium text-gray-700">
                        Limited Time Only
                      </label>
                      <p className="text-xs text-gray-500">
                        Gift will only be available during a specific period
                      </p>
                    </div>
                  </div>

                  {/* Limited Time Date Range */}
                  {formData.isLimited && (
                    <div className="pt-3 space-y-3">
                      <div>
                        <label htmlFor="limitedStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3 top-2.5 text-gray-400" strokeWidth={1.8} />
                          <input
                            id="limitedStartDate"
                            name="limitedStartDate"
                            type="date"
                            value={formData.limitedStartDate ? formData.limitedStartDate.split('T')[0] : ''}
                            onChange={handleDateChange}
                            className={`w-full pl-9 pr-3 py-2 border ${errors.limitedStartDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                        </div>
                        {errors.limitedStartDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.limitedStartDate}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="limitedEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                          End Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3 top-2.5 text-gray-400" strokeWidth={1.8} />
                          <input
                            id="limitedEndDate"
                            name="limitedEndDate"
                            type="date"
                            value={formData.limitedEndDate ? formData.limitedEndDate.split('T')[0] : ''}
                            onChange={handleDateChange}
                            className={`w-full pl-9 pr-3 py-2 border ${errors.limitedEndDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                        </div>
                        {errors.limitedEndDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.limitedEndDate}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h2 className="text-lg font-medium text-gray-800 mb-4">Gift Image</h2>

                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {/* In a real app, show the actual image */}
                        <Gift size={48} className="text-indigo-500" strokeWidth={1.5} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed ${errors.image ? 'border-red-300' : 'border-gray-300'} rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50`}
                      onClick={() => document.getElementById('imageUpload')?.click()}
                    >
                      <Upload size={32} className="text-gray-400 mb-2" strokeWidth={1.5} />
                      <p className="text-sm text-gray-500 mb-1">Click to upload gift image</p>
                      <p className="text-xs text-gray-400">PNG, JPG or GIF (max. 2MB)</p>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h2 className="text-lg font-medium text-gray-800 mb-4">Gift Animation</h2>

                <div className="space-y-4">
                  {animationPreview ? (
                    <div className="relative">
                      <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {/* In a real app, show the actual animation preview */}
                        <Sparkles size={48} className="text-indigo-500" strokeWidth={1.5} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setAnimationPreview(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => document.getElementById('animationUpload')?.click()}
                    >
                      <Upload size={32} className="text-gray-400 mb-2" strokeWidth={1.5} />
                      <p className="text-sm text-gray-500 mb-1">Click to upload gift animation</p>
                      <p className="text-xs text-gray-400">MP4 or WebM (max. 5MB)</p>
                      <input
                        id="animationUpload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleAnimationUpload}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right column - Preview */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-6 h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-lg font-medium text-gray-800 mb-4">Gift Preview</h2>

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                {imagePreview ? (
                  // In a real app, show the actual image
                  <Gift size={32} className="text-indigo-500" strokeWidth={1.5} />
                ) : (
                  <Eye size={32} className="text-indigo-300" strokeWidth={1.5} />
                )}
              </div>
              <h3 className="font-medium text-gray-800 text-center">
                {formData.name || 'Gift Name'}
              </h3>
              <p className="text-sm text-gray-500 text-center mt-1 mb-3 max-w-[200px] truncate">
                {formData.description || 'Gift description'}
              </p>

              <div className="flex flex-wrap justify-center gap-1 mb-4">
                {formData.tags.length > 0 ? formData.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                    {tag}
                  </span>
                )) : (
                  <span className="text-xs text-gray-400">No tags</span>
                )}
                {formData.tags.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                    +{formData.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="font-medium text-gray-800">{formData.category}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Price</p>
                <p className="font-medium text-gray-800">{formData.cost} coins</p>
                <p className="text-xs text-gray-500">${formData.monetaryValue}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className="flex items-center">
                  {formData.isActive ? (
                    <p className="font-medium text-green-600 flex items-center">
                      <CheckCircle size={16} className="mr-1" strokeWidth={1.8} />
                      Active
                    </p>
                  ) : (
                    <p className="font-medium text-gray-500 flex items-center">
                      <X size={16} className="mr-1" strokeWidth={1.8} />
                      Inactive
                    </p>
                  )}
                </div>
              </div>

              {formData.isLimited && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Available Period</p>
                  <p className="font-medium text-amber-600 flex items-center">
                    <Clock size={16} className="mr-1" strokeWidth={1.8} />
                    Limited Time Only
                  </p>
                  {formData.limitedStartDate && formData.limitedEndDate ? (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(formData.limitedStartDate).toLocaleDateString()} -
                      {new Date(formData.limitedEndDate).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Dates not set</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-6 flex justify-end gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <button
            type="button"
            onClick={() => navigate('/gifts')}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" strokeWidth={1.8} />
                {isEditing ? 'Update Gift' : 'Create Gift'}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default page;