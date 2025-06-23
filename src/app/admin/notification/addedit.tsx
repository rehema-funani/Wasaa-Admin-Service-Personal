import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Info,
  Calendar,
  Mail,
  MessageSquare,
  Bell,
  UserRound,
  Languages,
  Tag,
  Plus,
  X,
  AlarmClock,
  AlertTriangle,
  Globe,
  Filter,
  LayoutTemplate,
  BadgeCheck,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { notificationService } from '../../../api/services/notification';

interface Audience {
  segment: string;
  country: string;
  language: string;
  customFilters?: Record<string, any>;
}

interface Metadata {
  priority?: string;
  tags?: string[];
}

interface BroadcastFormData {
  title: string;
  description: string;
  templateCode: string;
  channel: 'email' | 'sms' | 'push';
  audience: Audience;
  scheduledAt: string;
  metadata?: Metadata;
  priority?: 'low' | 'normal' | 'high';
  adminOverride?: boolean;
}

const CHANNELS = ['email', 'sms', 'push'];
const SEGMENTS = ['all_users', 'newsletter_subscribers', 'new_users', 'inactive_users', 'premium_users'];
const COUNTRIES = ['KE', 'UG', 'TZ', 'RW', 'NG', 'GH', 'ZA', 'US', 'GB', 'CA', 'AU'];
const LANGUAGES = ['en', 'sw', 'fr', 'ar', 'es'];
const PRIORITIES = ['low', 'normal', 'high'];
const TEMPLATES = {
  email: ['WELCOME_EMAIL', 'NEWSLETTER_EMAIL', 'PASSWORD_RESET', 'ACCOUNT_UPDATE', 'TRANSACTION_RECEIPT'],
  sms: ['WELCOME_SMS', 'OTP_VERIFICATION', 'PAYMENT_CONFIRMATION', 'APPOINTMENT_REMINDER'],
  push: ['NEW_MESSAGE', 'TRANSACTION_ALERT', 'PROMO_NOTIFICATION', 'APP_UPDATE']
};

const AddEditBroadcastPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminBroadcast, setIsAdminBroadcast] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showCustomFilterModal, setShowCustomFilterModal] = useState(false);
  const [filterKey, setFilterKey] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const [formData, setFormData] = useState<BroadcastFormData>({
    title: '',
    description: '',
    templateCode: '',
    channel: 'email',
    audience: {
      segment: 'all_users',
      country: 'KE',
      language: 'en',
      customFilters: {}
    },
    scheduledAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    metadata: {
      priority: 'normal',
      tags: []
    },
    priority: 'normal',
    adminOverride: false
  });

  useEffect(() => {
    if (isEditMode) {
      if (location.state?.broadcast) {
        const broadcast = location.state.broadcast;

        let formattedDate = "";
        if (broadcast.scheduledAt && !isNaN(new Date(broadcast.scheduledAt).getTime())) {
          formattedDate = new Date(broadcast.scheduledAt).toISOString().slice(0, 16);
        }

        setFormData({
          ...broadcast,
          scheduledAt: formattedDate,
        });

        setIsAdminBroadcast(
          !!broadcast.metadata || !!broadcast.priority || !!broadcast.adminOverride
        );
      } else {
        fetchBroadcast();
      }
    }
  }, [id, isEditMode, location.state]);

  useEffect(() => {
    setFormData(prev => {
      const templateList = TEMPLATES?.[prev.channel];
      return {
        ...prev,
        templateCode: Array.isArray(templateList) ? templateList[0] || '' : ''
      };
    });
  }, [formData.channel]);

  const fetchBroadcast = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationService.getBroadcast(id);
      if (response && response.broadcast) {
        const broadcast = response.broadcast;
        setFormData({
          ...broadcast,
          scheduledAt: new Date(broadcast.scheduledAt).toISOString().slice(0, 16)
        });
        setIsAdminBroadcast(!!broadcast.metadata || !!broadcast.priority || !!broadcast.adminOverride);
      } else {
        setError('Could not find the requested broadcast');
        toast.error('Failed to load broadcast');
      }
    } catch (err) {
      setError('Failed to fetch broadcast data');
      console.error(err);
      toast.error('Error loading broadcast');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      if (name === 'isAdminBroadcast') {
        setIsAdminBroadcast(target.checked);
        return;
      }
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (name.startsWith('audience.')) {
      const audienceField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        audience: {
          ...prev.audience,
          [audienceField]: value
        }
      }));
    } else if (name === 'priority') {
      setFormData(prev => ({
        ...prev,
        priority: value as 'low' | 'normal' | 'high',
        metadata: {
          ...prev.metadata,
          priority: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;

    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tags: [...(prev.metadata?.tags || []), newTag.trim()]
      }
    }));

    setNewTag('');
    setShowTagInput(false);
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tags: prev.metadata?.tags?.filter(t => t !== tag) || []
      }
    }));
  };

  const handleAddCustomFilter = () => {
    if (!filterKey.trim() || !filterValue.trim()) return;

    setFormData(prev => ({
      ...prev,
      audience: {
        ...prev.audience,
        customFilters: {
          ...(prev.audience.customFilters || {}),
          [filterKey.trim()]: filterValue.trim()
        }
      }
    }));

    setFilterKey('');
    setFilterValue('');
    setShowCustomFilterModal(false);
  };

  const handleRemoveCustomFilter = (key: string) => {
    const newCustomFilters = { ...formData.audience.customFilters };
    delete newCustomFilters[key];

    setFormData(prev => ({
      ...prev,
      audience: {
        ...prev.audience,
        customFilters: newCustomFilters
      }
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return false;
    }

    if (!formData.templateCode) {
      toast.error('Please select a template');
      return false;
    }

    if (!formData.scheduledAt) {
      toast.error('Please set a schedule date and time');
      return false;
    }

    const scheduledDate = new Date(formData.scheduledAt);
    if (scheduledDate <= new Date()) {
      toast.error('Schedule time must be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const broadcastData = isAdminBroadcast
        ? {
          ...formData,
          scheduledAt: new Date(formData.scheduledAt).toISOString()
        }
        : {
          title: formData.title,
          description: formData.description,
          templateCode: formData.templateCode,
          channel: formData.channel,
          audience: {
            segment: formData.audience.segment,
            country: formData.audience.country,
            language: formData.audience.language
          },
          scheduledAt: new Date(formData.scheduledAt).toISOString()
        };

      let response;
      if (isEditMode && id) {
        response = await notificationService.updateBroadcast(id, broadcastData);
        toast.success('Broadcast updated successfully!', {
          style: {
            background: '#10B981',
            color: 'white',
            borderRadius: '12px'
          }
        });
      } else {
        if (isAdminBroadcast) {
          response = await notificationService.createAdminBroadcast(broadcastData);
        } else {
          response = await notificationService.createBroadcast(broadcastData);
        }
        toast.success('Broadcast created successfully!', {
          style: {
            background: '#10B981',
            color: 'white',
            borderRadius: '12px'
          }
        });
      }

      navigate('/admin/communication/broadcasts');
    } catch (err) {
      console.error(err);
      toast.error(isEditMode ? 'Failed to update broadcast' : 'Failed to create broadcast');
    } finally {
      setIsSaving(false);
    }
  };

  const getChannelIcon = (channel: string, active: boolean = false) => {
    const className = active ? "text-white" : "text-gray-600";

    switch (channel) {
      case 'email':
        return <Mail size={18} className={active ? "text-white" : "text-blue-600"} />;
      case 'sms':
        return <MessageSquare size={18} className={active ? "text-white" : "text-green-600"} />;
      case 'push':
        return <Bell size={18} className={active ? "text-white" : "text-amber-600"} />;
      default:
        return <Mail size={18} className={className} />;
    }
  };

  const getChannelBackground = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'bg-blue-100';
      case 'sms':
        return 'bg-green-100';
      case 'push':
        return 'bg-amber-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getChannelActiveBackground = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'bg-blue-600';
      case 'sms':
        return 'bg-green-600';
      case 'push':
        return 'bg-amber-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading broadcast data...</p>
        </div>
      </div>
    );
  }

  if (error && isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Back to Broadcasts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="font-medium">Back to Broadcasts</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                form="broadcast-form"
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                {isSaving ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Broadcast' : 'Create Broadcast')}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isEditMode ? 'Edit Broadcast' : 'Create New Broadcast'}
              </h1>
              <p className="text-gray-600">Configure your message to reach your target audience</p>
            </div>

            <form id="broadcast-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Broadcast Type Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      name="isAdminBroadcast"
                      checked={isAdminBroadcast}
                      onChange={(e) => setIsAdminBroadcast(e.target.checked)}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>Advanced Broadcast (Admin)</span>
                  </label>

                  {isAdminBroadcast && (
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full flex items-center">
                      <Sparkles size={12} className="mr-1" />
                      Advanced Options Enabled
                    </span>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Info size={18} className="mr-2 text-gray-500" />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Broadcast Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                      placeholder="e.g., Monthly Newsletter"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all resize-none"
                      placeholder="Describe the purpose of this broadcast..."
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

              {/* Channel & Template */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <LayoutTemplate size={18} className="mr-2 text-gray-500" />
                  Channel & Template
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Communication Channel *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {CHANNELS.map(channel => (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, channel: channel as any }))}
                          className={`flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all ${formData.channel === channel
                              ? `${getChannelActiveBackground(channel)} text-white shadow-sm`
                              : `${getChannelBackground(channel)} text-gray-700 hover:bg-gray-100`
                            }`}
                          disabled={isSaving}
                        >
                          <div className="w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center mr-2">
                            {getChannelIcon(channel)}
                          </div>
                          <span className="capitalize">{channel}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="templateCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Message Template *
                    </label>
                    <div className="relative">
                      <select
                        id="templateCode"
                        name="templateCode"
                        value={formData.templateCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all appearance-none"
                        disabled={isSaving}
                      >
                        <option value="">Select a template</option>
                        {TEMPLATES[formData.channel]?.map(template => (
                          <option key={template} value={template}>
                            {template.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <LayoutTemplate size={16} className="text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Templates contain the content that will be sent to your audience
                    </p>
                  </div>
                </div>
              </div>

              {/* Audience Targeting */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserRound size={18} className="mr-2 text-gray-500" />
                  Audience Targeting
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="audience.segment" className="block text-sm font-medium text-gray-700 mb-2">
                      Segment *
                    </label>
                    <div className="relative">
                      <select
                        id="audience.segment"
                        name="audience.segment"
                        value={formData?.audience?.segment}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all appearance-none"
                        disabled={isSaving}
                      >
                        {SEGMENTS.map(segment => (
                          <option key={segment} value={segment}>
                            {segment.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <UserRound size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="audience.country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <select
                        id="audience.country"
                        name="audience.country"
                        value={formData?.audience?.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all appearance-none"
                        disabled={isSaving}
                      >
                        {COUNTRIES.map(country => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <Globe size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="audience.language" className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <div className="relative">
                      <select
                        id="audience.language"
                        name="audience.language"
                        value={formData?.audience?.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all appearance-none"
                        disabled={isSaving}
                      >
                        {LANGUAGES.map(language => (
                          <option key={language} value={language}>
                            {language.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <Languages size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {isAdminBroadcast && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Custom Filters
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCustomFilterModal(true)}
                        className="flex items-center text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all"
                      >
                        <Plus size={12} className="mr-1" />
                        Add Filter
                      </button>
                    </div>

                    {formData.audience.customFilters && Object.keys(formData.audience.customFilters).length > 0 ? (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        {Object.entries(formData.audience.customFilters).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between bg-white p-2 rounded-lg">
                            <div className="flex items-center">
                              <Filter size={14} className="text-gray-500 mr-2" />
                              <span className="text-sm font-medium">{key}:</span>
                              <span className="text-sm ml-2">{value}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomFilter(key)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 text-center">
                        No custom filters added
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Scheduling */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar size={18} className="mr-2 text-gray-500" />
                  Scheduling
                </h2>

                <div>
                  <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Date & Time *
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      id="scheduledAt"
                      name="scheduledAt"
                      value={formData.scheduledAt}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                      disabled={isSaving}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <AlarmClock size={16} className="text-gray-400" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    The broadcast will be sent at the scheduled time. You can still edit it before that time.
                  </p>
                </div>
              </div>

              {/* Admin Options */}
              {isAdminBroadcast && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BadgeCheck size={18} className="mr-2 text-gray-500" />
                    Advanced Options
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <div className="relative">
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all appearance-none"
                          disabled={isSaving}
                        >
                          {PRIORITIES.map(priority => (
                            <option key={priority} value={priority}>
                              {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <AlertTriangle size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Override
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="adminOverride"
                          name="adminOverride"
                          checked={formData.adminOverride}
                          onChange={handleInputChange}
                          className="rounded text-primary-600 focus:ring-primary-500"
                          disabled={isSaving}
                        />
                        <label htmlFor="adminOverride" className="text-sm text-gray-700">
                          Override user preferences
                        </label>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        This will send the broadcast even to users who have opted out of communications.
                        Use with caution for critical updates only.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTagInput(true)}
                        className="flex items-center text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all"
                        disabled={showTagInput}
                      >
                        <Plus size={12} className="mr-1" />
                        Add Tag
                      </button>
                    </div>

                    <div className="min-h-12 bg-gray-50 rounded-xl p-4">
                      {showTagInput ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Enter tag"
                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="ml-2 p-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowTagInput(false)}
                            className="ml-1 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.metadata?.tags && formData.metadata.tags.length > 0 ? (
                            formData.metadata.tags.map(tag => (
                              <div key={tag} className="flex items-center px-3 py-1 bg-gray-100 rounded-lg">
                                <Tag size={12} className="text-gray-500 mr-2" />
                                <span className="text-sm">{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-2 text-gray-400 hover:text-red-500"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">No tags added</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="mt-6 bg-primary-50/70 backdrop-blur-sm rounded-2xl p-6 border border-primary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Info size={18} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-900 mb-2">About Broadcasts</h3>
              <ul className="text-primary-700 text-sm space-y-1">
                <li>• Broadcasts will be sent using the selected template via the chosen channel</li>
                <li>• The audience is determined by segment, country, and language filters</li>
                <li>• Advanced broadcasts allow for additional filtering and metadata</li>
                <li>• Scheduled broadcasts can be paused, edited, or canceled before sending</li>
                <li>• Ensure your templates are properly configured before sending</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Filter Modal */}
      <AnimatePresence>
        {showCustomFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomFilterModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Filter</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="filterKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Key
                  </label>
                  <input
                    type="text"
                    id="filterKey"
                    value={filterKey}
                    onChange={(e) => setFilterKey(e.target.value)}
                    placeholder="e.g., lastLogin, userType"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="filterValue" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Value
                  </label>
                  <input
                    type="text"
                    id="filterValue"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="e.g., >7days, premium"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCustomFilterModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddCustomFilter}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                  disabled={!filterKey.trim() || !filterValue.trim()}
                >
                  Add Filter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple Check icon component for tag adding
const Check = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default AddEditBroadcastPage;
