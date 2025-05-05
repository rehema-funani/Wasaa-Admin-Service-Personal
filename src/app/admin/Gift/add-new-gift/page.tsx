import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Eye,
  Plus,
  Image as ImageIcon,
  Film,
  ChevronDown,
  ChevronRight,
  Settings
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

const GiftManagementPage = () => {
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
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Toggle section
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  // Fetch gift data for editing
  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);

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

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/gifts')}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-blue-600 hover:bg-white transition-all duration-300"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              {isEditing ? 'Edit Gift' : 'Create New Gift'}
            </h1>
          </div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-2xl backdrop-blur-lg bg-red-50/80 border border-red-100 p-4 shadow-sm"
            >
              <div className="flex items-start">
                <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-red-700">{errors.submit}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Form fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <motion.div
                variants={itemVariants}
                className="rounded-2xl backdrop-blur-md bg-white/80 border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <Gift size={20} className="mr-2 text-blue-500" />
                    Basic Information
                  </h2>

                  <div className="space-y-5">
                    {/* Gift Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Gift Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                        placeholder="Enter a memorable gift name"
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Gift Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="Describe what makes this gift special"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="appearance-none w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          {mockCategories.map(category => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
                          <ChevronDown size={18} className="text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {formData.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            <span>#{tag}</span>
                            <button
                              type="button"
                              className="ml-1.5 p-0.5 rounded-full hover:bg-blue-100 transition-colors"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="relative">
                        <Tag size={18} className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          id="tags"
                          type="text"
                          value={tagInput}
                          onChange={handleTagInputChange}
                          onKeyDown={handleTagKeyDown}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="Add a tag and press Enter"
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-500 flex items-center">
                        <Sparkles size={14} className="mr-1 text-blue-400" />
                        Tags help users discover your gift
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Pricing & Availability */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pricing */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl backdrop-blur-md bg-white/80 border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                      <DollarSign size={20} className="mr-2 text-blue-500" />
                      Pricing
                    </h2>

                    <div className="space-y-5">
                      {/* Cost */}
                      <div>
                        <label htmlFor="cost" className="block text-sm font-medium text-slate-700 mb-2">
                          Cost (Coins) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className="text-slate-500">🪙</span>
                          </div>
                          <input
                            id="cost"
                            name="cost"
                            type="number"
                            min="1"
                            value={formData.cost}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border ${errors.cost ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                            placeholder="100"
                          />
                        </div>
                        {errors.cost && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.cost}
                          </p>
                        )}
                      </div>

                      {/* Monetary Value */}
                      <div>
                        <label htmlFor="monetaryValue" className="block text-sm font-medium text-slate-700 mb-2">
                          Monetary Value
                        </label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <DollarSign size={16} className="text-slate-500" />
                          </div>
                          <input
                            id="monetaryValue"
                            name="monetaryValue"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.monetaryValue}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 focus:border-transparent focus:outline-none transition-all duration-200"
                            readOnly
                          />
                        </div>
                        <p className="mt-2 text-xs text-slate-500 flex items-center">
                          <CheckCircle size={14} className="mr-1 text-blue-400" />
                          Automatically calculated (100 coins = $1.00)
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Availability */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl backdrop-blur-md bg-white/80 border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                      <Clock size={20} className="mr-2 text-blue-500" />
                      Availability
                    </h2>

                    <div className="space-y-5">
                      {/* Active Status */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-700">Gift Status</p>
                          <p className="text-xs text-slate-500 mt-0.5">Make this gift available to users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            className="sr-only peer"
                            checked={formData.isActive}
                            onChange={handleChange}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>

                      {/* Limited Time */}
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700">Limited Time Only</p>
                            <p className="text-xs text-slate-500 mt-0.5">Set availability period</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="isLimited"
                              className="sr-only peer"
                              checked={formData.isLimited}
                              onChange={handleChange}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </div>

                        {/* Limited Time Date Range */}
                        <AnimatePresence>
                          {formData.isLimited && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4 overflow-hidden"
                            >
                              <div>
                                <label htmlFor="limitedStartDate" className="block text-sm font-medium text-slate-700 mb-2">
                                  Start Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Calendar size={16} className="text-slate-500" />
                                  </div>
                                  <input
                                    id="limitedStartDate"
                                    name="limitedStartDate"
                                    type="date"
                                    value={formData.limitedStartDate ? formData.limitedStartDate.split('T')[0] : ''}
                                    onChange={handleDateChange}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border ${errors.limitedStartDate ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                                  />
                                </div>
                                {errors.limitedStartDate && (
                                  <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.limitedStartDate}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label htmlFor="limitedEndDate" className="block text-sm font-medium text-slate-700 mb-2">
                                  End Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Calendar size={16} className="text-slate-500" />
                                  </div>
                                  <input
                                    id="limitedEndDate"
                                    name="limitedEndDate"
                                    type="date"
                                    value={formData.limitedEndDate ? formData.limitedEndDate.split('T')[0] : ''}
                                    onChange={handleDateChange}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border ${errors.limitedEndDate ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200`}
                                  />
                                </div>
                                {errors.limitedEndDate && (
                                  <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle size={14} className="mr-1" />
                                    {errors.limitedEndDate}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Media Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gift Image */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl backdrop-blur-md bg-white/80 border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                      <ImageIcon size={20} className="mr-2 text-blue-500" />
                      Gift Image
                    </h2>

                    <div>
                      {imagePreview ? (
                        <div className="relative">
                          <div className="rounded-xl overflow-hidden bg-slate-100 aspect-video flex items-center justify-center">
                            <div className="p-8 bg-blue-50 rounded-full">
                              <Gift size={48} className="text-blue-500" strokeWidth={1.5} />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setImagePreview(null)}
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-full shadow hover:bg-white hover:text-red-600 transition-all duration-200"
                          >
                            <X size={16} strokeWidth={2} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`border-2 border-dashed ${errors.image ? 'border-red-300 bg-red-50/30' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'} rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 aspect-video`}
                          onClick={() => document.getElementById('imageUpload')?.click()}
                        >
                          <Upload size={36} className={errors.image ? 'text-red-400 mb-4' : 'text-blue-400 mb-4'} strokeWidth={1.5} />
                          <p className={`text-sm font-medium ${errors.image ? 'text-red-600' : 'text-slate-700'} mb-1`}>
                            {errors.image ? errors.image : 'Click to upload gift image'}
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG or GIF (max. 2MB)</p>
                          <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Gift Animation */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl backdrop-blur-md bg-white/80 border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                      <Film size={20} className="mr-2 text-blue-500" />
                      Gift Animation
                    </h2>

                    <div>
                      {animationPreview ? (
                        <div className="relative">
                          <div className="rounded-xl overflow-hidden bg-slate-100 aspect-video flex items-center justify-center">
                            <div className="p-8 bg-blue-50 rounded-full">
                              <Sparkles size={48} className="text-blue-500" strokeWidth={1.5} />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAnimationPreview(null)}
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-full shadow hover:bg-white hover:text-red-600 transition-all duration-200"
                          >
                            <X size={16} strokeWidth={2} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 aspect-video"
                          onClick={() => document.getElementById('animationUpload')?.click()}
                        >
                          <Upload size={36} className="text-blue-400 mb-4" strokeWidth={1.5} />
                          <p className="text-sm font-medium text-slate-700 mb-1">
                            Click to upload animation
                          </p>
                          <p className="text-xs text-slate-500">MP4 or WebM (max. 5MB)</p>
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
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right column - Preview */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-blue-50/80 via-white/80 to-blue-50/80 border border-slate-100 shadow-sm lg:sticky lg:top-6 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center justify-center">
                  <Eye size={20} className="mr-2 text-blue-500" />
                  Gift Preview
                </h2>

                <p className="text-center text-sm text-slate-500 mb-8">See how your gift will appear to users</p>

                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-6 shadow-md">
                    {imagePreview ? (
                      <Gift size={36} className="text-white" strokeWidth={1.5} />
                    ) : (
                      <Gift size={36} className="text-blue-100" strokeWidth={1.5} />
                    )}
                  </div>

                  <h3 className="font-bold text-blue-900 text-xl text-center">
                    {formData.name || 'Gift Name'}
                  </h3>

                  <p className="text-sm text-slate-600 text-center mt-2 mb-4 max-w-xs">
                    {formData.description || 'Gift description will appear here'}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {formData.tags.length > 0 ? formData.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                        #{tag}
                      </span>
                    )) : (
                      <span className="text-xs text-slate-400">No tags added yet</span>
                    )}
                    {formData.tags.length > 3 && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                        +{formData.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/70 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">Category</p>
                      <p className="text-sm font-semibold text-slate-900">{formData.category}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/70 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">Price</p>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900 flex items-center">
                          <span className="text-amber-500 mr-1.5">🪙</span>
                          {formData.cost}
                        </p>
                        <p className="text-xs text-slate-500">${formData.monetaryValue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/70 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">Status</p>
                      <div>
                        {formData.isActive ? (
                          <p className="text-sm font-semibold text-green-600 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                            Active
                          </p>
                        ) : (
                          <p className="text-sm font-semibold text-slate-500 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-slate-400 mr-1.5"></span>
                            Inactive
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {formData.isLimited && (
                    <div className="p-4 rounded-xl bg-white/70 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-500">Availability</p>
                        <p className="text-sm font-semibold text-amber-600 flex items-center">
                          <Clock size={14} className="mr-1.5" />
                          Limited Time
                        </p>
                      </div>
                      {formData.limitedStartDate && formData.limitedEndDate ? (
                        <div className="rounded-lg bg-amber-50 p-2 text-center">
                          <p className="text-xs text-amber-700">
                            {new Date(formData.limitedStartDate).toLocaleDateString()} - {new Date(formData.limitedEndDate).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-slate-100 p-2 text-center">
                          <p className="text-xs text-slate-500">Set dates to display period</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex justify-end gap-4"
          >
            <button
              type="button"
              onClick={() => navigate('/gifts')}
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-sm shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium text-sm shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {isEditing ? 'Update Gift' : 'Create Gift'}
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default GiftManagementPage;