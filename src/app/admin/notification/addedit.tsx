import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Key
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { notificationService } from '../../../api/services/notification';

// Updated interfaces to match the required payload structure
interface Audience {
  [key: string]: string; // Dynamic key-value pairs for audience targeting
}

interface Payload {
  [key: string]: string; // Dynamic key-value pairs for payload data
}

interface BroadcastFormData {
  title: string;
  template_code: string; // Changed to snake_case to match API
  channel: 'email' | 'sms' | 'push';
  scheduled_at: string; // Changed to snake_case to match API
  audience: Audience;
  payload: Payload;
  priority: 'low' | 'medium' | 'high';
  description?: string; // Optional field
}

const CHANNELS = ['email', 'sms', 'push'];
const COUNTRIES = ['KE', 'UG', 'TZ', 'RW', 'NG', 'GH', 'ZA', 'US', 'GB', 'CA', 'AU'];
const LANGUAGES = ['en', 'sw', 'fr', 'ar', 'es'];
const PRIORITIES = ['low', 'medium', 'high'];
const TEMPLATES = {
  email: ['WELCOME_EMAIL', 'NEWSLETTER_EMAIL', 'PASSWORD_RESET', 'ACCOUNT_UPDATE', 'TRANSACTION_RECEIPT'],
  sms: ['WELCOME_SMS', 'OTP_VERIFICATION', 'PAYMENT_CONFIRMATION', 'APPOINTMENT_REMINDER'],
  push: ['NEW_MESSAGE', 'TRANSACTION_ALERT', 'PROMO_NOTIFICATION', 'APP_UPDATE']
};

// Audience attribute options
const AUDIENCE_ATTRIBUTES = {
  gender: ['male', 'female', 'other'],
  country: COUNTRIES,
  kyc_level: ['none', 'basic', 'full'],
  age_group: ['18-24', '25-34', '35-44', '45-54', '55+'],
  subscription: ['free', 'basic', 'premium']
};

const AddEditBroadcastPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [audienceKey, setAudienceKey] = useState('');
  const [audienceValue, setAudienceValue] = useState('');
  const [payloadKey, setPayloadKey] = useState('');
  const [payloadValue, setPayloadValue] = useState('');

  const [formData, setFormData] = useState<BroadcastFormData>({
    title: '',
    template_code: '',
    channel: 'email',
    scheduled_at: new Date(Date.now() + 3600000).toISOString(),
    audience: {
      country: 'US'
    },
    payload: {},
    priority: 'medium',
    description: ''
  });

  useEffect(() => {
    if (isEditMode) {
      if (location.state?.broadcast) {
        const broadcast = location.state.broadcast;
        setFormData({
          ...broadcast,
          // Ensure date is properly formatted
          scheduled_at: broadcast.scheduled_at ? new Date(broadcast.scheduled_at).toISOString() : new Date(Date.now() + 3600000).toISOString()
        });
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
        template_code: Array.isArray(templateList) ? templateList[0] || '' : ''
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
          scheduled_at: new Date(broadcast.scheduled_at).toISOString()
        });
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAudienceFilter = () => {
    if (!audienceKey.trim() || !audienceValue.trim()) return;

    setFormData(prev => ({
      ...prev,
      audience: {
        ...prev.audience,
        [audienceKey.trim()]: audienceValue.trim()
      }
    }));

    setAudienceKey('');
    setAudienceValue('');
    setShowAudienceModal(false);
  };

  const handleRemoveAudienceFilter = (key: string) => {
    const newAudience = { ...formData.audience };
    delete newAudience[key];

    setFormData(prev => ({
      ...prev,
      audience: newAudience
    }));
  };

  const handleAddPayloadItem = () => {
    if (!payloadKey.trim() || !payloadValue.trim()) return;

    setFormData(prev => ({
      ...prev,
      payload: {
        ...prev.payload,
        [payloadKey.trim()]: payloadValue.trim()
      }
    }));

    setPayloadKey('');
    setPayloadValue('');
    setShowPayloadModal(false);
  };

  const handleRemovePayloadItem = (key: string) => {
    const newPayload = { ...formData.payload };
    delete newPayload[key];

    setFormData(prev => ({
      ...prev,
      payload: newPayload
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return false;
    }

    if (!formData.template_code) {
      toast.error('Please select a template');
      return false;
    }

    if (!formData.scheduled_at) {
      toast.error('Please set a schedule date and time');
      return false;
    }

    const scheduledDate = new Date(formData.scheduled_at);
    if (scheduledDate <= new Date()) {
      toast.error('Schedule time must be in the future');
      return false;
    }

    if (Object.keys(formData.audience).length === 0) {
      toast.error('Please define at least one audience filter');
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
      // Format the data according to the API requirements
      const broadcastData = {
        title: formData.title,
        template_code: formData.template_code,
        channel: formData.channel,
        scheduled_at: formData.scheduled_at,
        audience: formData.audience,
        payload: formData.payload,
        priority: formData.priority,
        // description: formData.description
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
        response = await notificationService.createBroadcast(broadcastData);
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
              <button
                type="submit"
                form="broadcast-form"
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                {isSaving ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Broadcast' : 'Create Broadcast')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden"
        >
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isEditMode ? 'Edit Broadcast' : 'Create New Broadcast'}
              </h1>
              <p className="text-gray-600">Configure your message to reach your target audience</p>
            </div>

            <form id="broadcast-form" onSubmit={handleSubmit} className="space-y-8">
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
                      placeholder="e.g., Welcome to our service"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

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
                    <label htmlFor="template_code" className="block text-sm font-medium text-gray-700 mb-2">
                      Message Template *
                    </label>
                    <div className="relative">
                      <select
                        id="template_code"
                        name="template_code"
                        value={formData.template_code}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all appearance-none"
                        disabled={isSaving}
                      >
                        <option value="">Select a template</option>
                        {TEMPLATES[formData.channel]?.map(template => (
                          <option key={template} value={template.toLowerCase()}>
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

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Audience Filters *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAudienceModal(true)}
                      className="flex items-center text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all"
                    >
                      <Plus size={12} className="mr-1" />
                      Add Filter
                    </button>
                  </div>

                  {Object.keys(formData.audience).length > 0 ? (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      {Object.entries(formData.audience).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-white p-2 rounded-lg">
                          <div className="flex items-center">
                            <Filter size={14} className="text-gray-500 mr-2" />
                            <span className="text-sm font-medium">{key}:</span>
                            <span className="text-sm ml-2">{value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAudienceFilter(key)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 text-center">
                      No audience filters added. Please add at least one filter.
                    </div>
                  )}
                </div>
              </div>

              {/* Payload Data */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Key size={18} className="mr-2 text-gray-500" />
                  Payload Data
                </h2>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Template Variables
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPayloadModal(true)}
                      className="flex items-center text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-all"
                    >
                      <Plus size={12} className="mr-1" />
                      Add Data
                    </button>
                  </div>

                  {Object.keys(formData.payload).length > 0 ? (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      {Object.entries(formData.payload).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-white p-2 rounded-lg">
                          <div className="flex items-center">
                            <Key size={14} className="text-gray-500 mr-2" />
                            <span className="text-sm font-medium">{key}:</span>
                            <span className="text-sm ml-2">{value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePayloadItem(key)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 text-center">
                      No payload data added. These values will be used to fill template variables.
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar size={18} className="mr-2 text-gray-500" />
                  Scheduling
                </h2>

                <div>
                  <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Date & Time *
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      id="scheduled_at"
                      name="scheduled_at"
                      value={formData.scheduled_at.slice(0, 16)} // Format for datetime-local input
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

              {/* Priority Settings */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BadgeCheck size={18} className="mr-2 text-gray-500" />
                  Priority Settings
                </h2>

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
                  <p className="mt-2 text-xs text-gray-500">
                    Sets the delivery priority of this broadcast. Higher priority broadcasts may be delivered faster.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div
          className="mt-6 bg-primary-50/70 backdrop-blur-sm rounded-2xl p-6 border border-primary-100"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Info size={18} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-900 mb-2">About Broadcasts</h3>
              <ul className="text-primary-700 text-sm space-y-1">
                <li>• Broadcasts will be sent using the selected template via the chosen channel</li>
                <li>• The audience is determined by the filters you set</li>
                <li>• Payload data is used to populate template variables</li>
                <li>• Scheduled broadcasts can be paused, edited, or canceled before sending</li>
                <li>• Ensure your templates are properly configured before sending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Audience Filter Modal */}
      {showAudienceModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAudienceModal(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Audience Filter</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="audienceKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Attribute
                </label>
                <select
                  id="audienceKey"
                  value={audienceKey}
                  onChange={(e) => setAudienceKey(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                >
                  <option value="">Select an attribute</option>
                  <option value="gender">Gender</option>
                  <option value="country">Country</option>
                  <option value="kyc_level">KYC Level</option>
                  <option value="age_group">Age Group</option>
                  <option value="subscription">Subscription Type</option>
                  <option value="custom">Custom Attribute...</option>
                </select>
              </div>

              {audienceKey === 'custom' ? (
                <div>
                  <label htmlFor="customAudienceKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Attribute Name
                  </label>
                  <input
                    type="text"
                    id="customAudienceKey"
                    value={audienceKey === 'custom' ? '' : audienceKey}
                    onChange={(e) => setAudienceKey(e.target.value)}
                    placeholder="e.g., subscription_status, region"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                  />
                </div>
              ) : null}

              <div>
                <label htmlFor="audienceValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Value
                </label>
                {audienceKey && AUDIENCE_ATTRIBUTES[audienceKey as keyof typeof AUDIENCE_ATTRIBUTES] ? (
                  <select
                    id="audienceValue"
                    value={audienceValue}
                    onChange={(e) => setAudienceValue(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                  >
                    <option value="">Select a value</option>
                    {AUDIENCE_ATTRIBUTES[audienceKey as keyof typeof AUDIENCE_ATTRIBUTES].map(value => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id="audienceValue"
                    value={audienceValue}
                    onChange={(e) => setAudienceValue(e.target.value)}
                    placeholder="e.g., male, premium, US"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                  />
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowAudienceModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddAudienceFilter}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                disabled={!audienceKey.trim() || !audienceValue.trim() || audienceKey === 'custom'}
              >
                Add Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payload Data Modal */}
      {showPayloadModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPayloadModal(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Payload Data</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="payloadKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Variable Name
                </label>
                <input
                  type="text"
                  id="payloadKey"
                  value={payloadKey}
                  onChange={(e) => setPayloadKey(e.target.value)}
                  placeholder="e.g., user_name, promo_code"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                />
              </div>

              <div>
                <label htmlFor="payloadValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Variable Value
                </label>
                <input
                  type="text"
                  id="payloadValue"
                  value={payloadValue}
                  onChange={(e) => setPayloadValue(e.target.value)}
                  placeholder="e.g., John Doe, SUMMER20"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:bg-white text-gray-900 transition-all"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowPayloadModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddPayloadItem}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                disabled={!payloadKey.trim() || !payloadValue.trim()}
              >
                Add Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEditBroadcastPage;
