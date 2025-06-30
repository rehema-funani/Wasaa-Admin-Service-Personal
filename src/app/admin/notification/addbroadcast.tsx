import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  Clock,
  Users,
  Save,
  Send,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart,
  Zap,
  X,
  Loader,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../../api/services/notification';

const AddBroadcastPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingTemplateDetails, setIsLoadingTemplateDetails] = useState(false);
  const [placeholders, setPlaceholders] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    template_id: '',
    template_code: '',
    channel: 'email',
    scheduled_at: '',
    audience: {
      gender: '',
      country: '',
      kyc_level: ''
    },
    payload: {},
    priority: 'medium',
  });

  const genderOptions = [
    { value: '', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const countryOptions = [
    { value: '', label: 'All Countries' },
    { value: 'KE', label: 'Kenya' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' }
  ];

  const kycLevelOptions = [
    { value: '', label: 'All KYC Levels' },
    { value: 'none', label: 'None' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'basic', label: 'Basic' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'full', label: 'Full' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', description: 'Non-urgent communications' },
    { value: 'medium', label: 'Medium', description: 'Standard priority for most broadcasts' },
    { value: 'high', label: 'High', description: 'Time-sensitive notifications' },
    { value: 'critical', label: 'Critical', description: 'Urgent alerts requiring immediate attention' }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (formData.template_id) {
      fetchTemplateDetails(formData.template_id);
    }
  }, [formData.template_id]);

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await notificationService.getTemplates();
      setTemplates(response || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates. Please try again.');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const fetchTemplateDetails = async (templateId) => {
    setIsLoadingTemplateDetails(true);
    try {
      const template = await notificationService.getTemplateById(templateId);
      setSelectedTemplate(template);

      const extractedPlaceholders = template.placeholders || {};
      setPlaceholders(extractedPlaceholders);

      const initialPayload = {};
      Object.keys(extractedPlaceholders).forEach(key => {
        initialPayload[key] = '';
      });

      setFormData(prev => ({
        ...prev,
        template_code: template.template_code,
        payload: initialPayload
      }));
    } catch (error) {
      console.error('Error fetching template details:', error);
      setError('Failed to load template details. Please try again.');
    } finally {
      setIsLoadingTemplateDetails(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTemplateChange = (e: any) => {
    const templateId = e.target.value;
    if (!templateId) {
      setFormData({
        ...formData,
        template_id: '',
        template_code: '',
        payload: {}
      });
      setSelectedTemplate(null);
      setPlaceholders({});
      return;
    }

    setFormData({
      ...formData,
      template_id: templateId
    });
  };

  const handleChannelChange = (channel) => {
    setFormData({
      ...formData,
      channel,
      template_id: '',
      template_code: '',
      payload: {}
    });
    setSelectedTemplate(null);
    setPlaceholders({});
  };

  const handlePriorityChange = (priority) => {
    setFormData({
      ...formData,
      priority
    });
  };

  const handleAudienceChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      audience: {
        ...formData.audience,
        [name]: value
      }
    });
  };

  const handlePayloadChange = (key, value) => {
    setFormData({
      ...formData,
      payload: {
        ...formData.payload,
        [key]: value
      }
    });
  };

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      scheduled_at: e.target.value
    });
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please enter a broadcast title');
      return;
    }

    if (!formData.template_code) {
      setError('Please select a template');
      return;
    }

    const hasAudienceFilter = Object.values(formData.audience).some(value => value !== '');
    if (!hasAudienceFilter) {
      setError('Please select at least one audience filter');
      return;
    }

    const missingPlaceholders = Object.keys(placeholders).filter(key => !formData.payload[key]);
    if (missingPlaceholders.length > 0) {
      setError(`Please fill in all required placeholders: ${missingPlaceholders.join(', ')}`);
      return;
    }

    if (!saveAsDraft && !formData.scheduled_at) {
      setError('Please set a scheduled date and time');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { template_id, ...submissionData } = formData;
      const broadcastData = {
        ...submissionData,
      };

      await notificationService.createBroadcast(broadcastData);
      setShowConfetti(true);
      setTimeout(() => {
        navigate(-1);
      }, 1000);

    } catch (err) {
      console.error(err);
      setError('Failed to create broadcast. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIcon = (step: any) => {
    switch (step) {
      case 1:
        return <Zap size={16} />;
      case 2:
        return <Target size={16} />;
      case 3:
        return <Calendar size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-3 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <ArrowLeft size={16} className="text-neutral-500 dark:text-neutral-400" />
              </button>
              <div>
                <h1 className="text-lg font-medium text-neutral-900 dark:text-white">
                  Create New Broadcast
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Set up a new broadcast to engage with your audience</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className="flex items-center"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step < activeStep
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400'
                    : step === activeStep
                      ? 'bg-blue-500 text-white ring-1 ring-blue-200 dark:ring-blue-900/50'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500'
                    }`}>
                    {step < activeStep ? (
                      <CheckCircle size={14} />
                    ) : (
                      getStepIcon(step)
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`w-6 h-px ${step < activeStep ? 'bg-blue-400 dark:bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={(e) => handleSubmit(e, false)}>
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-3 flex items-start">
              <AlertTriangle className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" size={16} />
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
              <button
                type="button"
                className="ml-3 text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                onClick={() => setError(null)}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Broadcast Details */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
              <div className="border-l-4 border-l-blue-500 dark:border-l-blue-600 p-4">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Broadcast Details</div>
                  <div className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">Step 1</div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Define the basic information for your broadcast</p>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Broadcast Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a title for your broadcast"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-neutral-800 dark:text-neutral-200 text-sm"
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">A clear title helps you identify this broadcast later</p>
                </div>

                <div>
                  <label htmlFor="template_id" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Communication Template
                  </label>
                  <div className="relative">
                    {isLoadingTemplates ? (
                      <div className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center">
                        <Loader size={14} className="text-blue-500 animate-spin mr-2" />
                        <span className="text-neutral-500 dark:text-neutral-400 text-sm">Loading templates...</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          id="template_id"
                          name="template_id"
                          value={formData.template_id}
                          onChange={handleTemplateChange}
                          className="w-full px-3 py-2 appearance-none bg-neutral-50 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-neutral-800 dark:text-neutral-200 text-sm pr-8"
                        >
                          <option value="">Select a template</option>
                          {templates.map(template => (
                            <option key={template._id} value={template._id}>
                              {template.template_code} - {template.channel}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    )}
                  </div>

                  {isLoadingTemplateDetails && (
                    <div className="mt-2 p-2 bg-neutral-50 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center">
                      <Loader size={14} className="text-blue-500 animate-spin mr-2" />
                      <span className="text-neutral-500 dark:text-neutral-400 text-xs">Loading template details...</span>
                    </div>
                  )}

                  {selectedTemplate && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          <span className="font-medium">Template:</span> {selectedTemplate.template_code}
                        </p>
                        <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${selectedTemplate.channel === 'email' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                          selectedTemplate.channel === 'sms' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                            'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                          {selectedTemplate.channel}
                        </span>
                      </div>

                      {selectedTemplate.content && (
                        <div className="mt-2 p-2 bg-white/70 dark:bg-neutral-800/70 rounded border border-blue-100 dark:border-blue-900/30 text-xs text-neutral-600 dark:text-neutral-300">
                          <p>{selectedTemplate.content}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Channel selection */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
              <div className="border-l-4 border-l-emerald-500 dark:border-l-emerald-600 p-4">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Communication Channel</div>
                  <div className="ml-2 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded">Step 2</div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Choose how you want to reach your audience</p>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChannelChange('email')}
                    className={`relative p-3 rounded-lg border transition-all ${formData.channel === 'email'
                      ? 'border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-neutral-50 dark:hover:bg-neutral-750'
                      } group`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${formData.channel === 'email'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400'
                        : 'bg-neutral-100 dark:bg-neutral-750 text-neutral-500 dark:text-neutral-400'
                        }`}>
                        <Mail size={16} />
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${formData.channel === 'email' ? 'text-blue-700 dark:text-blue-400' : 'text-neutral-700 dark:text-neutral-300'
                          }`}>Email</h3>
                        <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-500">Send detailed messages to inboxes</p>
                      </div>
                      {formData.channel === 'email' && (
                        <div className="ml-auto">
                          <div className="w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
                            <CheckCircle size={10} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChannelChange('sms')}
                    className={`relative p-3 rounded-lg border transition-all ${formData.channel === 'sms'
                      ? 'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-neutral-50 dark:hover:bg-neutral-750'
                      } group`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${formData.channel === 'sms'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400'
                        : 'bg-neutral-100 dark:bg-neutral-750 text-neutral-500 dark:text-neutral-400'
                        }`}>
                        <MessageSquare size={16} />
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${formData.channel === 'sms' ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-700 dark:text-neutral-300'
                          }`}>SMS</h3>
                        <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-500">Reach users on mobile devices</p>
                      </div>
                      {formData.channel === 'sms' && (
                        <div className="ml-auto">
                          <div className="w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center">
                            <CheckCircle size={10} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChannelChange('push')}
                    className={`relative p-3 rounded-lg border transition-all ${formData.channel === 'push'
                      ? 'border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-amber-200 dark:hover:border-amber-800 hover:bg-neutral-50 dark:hover:bg-neutral-750'
                      } group`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${formData.channel === 'push'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400'
                        : 'bg-neutral-100 dark:bg-neutral-750 text-neutral-500 dark:text-neutral-400'
                        }`}>
                        <Bell size={16} />
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${formData.channel === 'push' ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-700 dark:text-neutral-300'
                          }`}>Push Notification</h3>
                        <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-500">Send instant alerts to app users</p>
                      </div>
                      {formData.channel === 'push' && (
                        <div className="ml-auto">
                          <div className="w-4 h-4 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center">
                            <CheckCircle size={10} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
              <div className="border-l-4 border-l-violet-500 dark:border-l-violet-600 p-4">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Target Audience</div>
                  <div className="ml-2 px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs rounded">Demographics</div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Define demographic filters for your target audience</p>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Gender Selection */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Gender</label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.audience.gender}
                        onChange={handleAudienceChange}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all text-neutral-800 dark:text-neutral-200 text-sm pr-8"
                      >
                        {genderOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">Target users by gender identity</p>
                  </div>

                  {/* Country Selection */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Country</label>
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.audience.country}
                        onChange={handleAudienceChange}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all text-neutral-800 dark:text-neutral-200 text-sm pr-8"
                      >
                        {countryOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">Target users by geographic location</p>
                  </div>

                  {/* KYC Level Selection */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">KYC Level</label>
                    <div className="relative">
                      <select
                        name="kyc_level"
                        value={formData.audience.kyc_level}
                        onChange={handleAudienceChange}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all text-neutral-800 dark:text-neutral-200 text-sm pr-8"
                      >
                        {kycLevelOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">Target users by verification level</p>
                  </div>
                </div>

                {/* Active Audience Preview */}
                {(formData.audience.gender || formData.audience.country || formData.audience.kyc_level) && (
                  <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/30 rounded-lg">
                    <h4 className="text-xs font-medium text-violet-700 dark:text-violet-400 mb-2">Active Audience Filters</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.audience.gender && (
                        <span className="px-2 py-1 bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-400 rounded-md text-xs border border-violet-200 dark:border-violet-800/30">
                          Gender: {genderOptions.find(o => o.value === formData.audience.gender)?.label}
                        </span>
                      )}
                      {formData.audience.country && (
                        <span className="px-2 py-1 bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-400 rounded-md text-xs border border-violet-200 dark:border-violet-800/30">
                          Country: {countryOptions.find(o => o.value === formData.audience.country)?.label}
                        </span>
                      )}
                      {formData.audience.kyc_level && (
                        <span className="px-2 py-1 bg-white dark:bg-neutral-800 text-violet-700 dark:text-violet-400 rounded-md text-xs border border-violet-200 dark:border-violet-800/30">
                          KYC: {kycLevelOptions.find(o => o.value === formData.audience.kyc_level)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Placeholders */}
            {selectedTemplate && Object.keys(placeholders).length > 0 && (
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                <div className="border-l-4 border-l-teal-500 dark:border-l-teal-600 p-4">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Template Placeholders</div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Fill in the values for placeholders in your template</p>
                </div>

                <div className="p-4 space-y-4">
                  {selectedTemplate.content && (
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-4">
                      <h4 className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Template Preview:</h4>
                      <div className="text-neutral-800 dark:text-neutral-200 text-sm">
                        {selectedTemplate.content.split(/(\{\{[^}]+\}\})/).map((part, index) => {
                          if (part.match(/\{\{([^}]+)\}\}/)) {
                            const placeholder = part.replace(/\{\{|\}\}/g, '');
                            return (
                              <span key={index} className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 px-1 rounded border border-teal-200 dark:border-teal-800/30 text-xs">
                                {part}
                              </span>
                            );
                          }
                          return <span key={index}>{part}</span>;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(placeholders).map(([key, description]) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          <span>{key}</span>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-500 ml-1">({String(description)})</span>
                        </label>
                        <input
                          type="text"
                          value={formData.payload[key] || ''}
                          onChange={(e) => handlePayloadChange(key, e.target.value)}
                          placeholder={`Enter value for ${key}`}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all text-neutral-800 dark:text-neutral-200 text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-teal-50 dark:bg-teal-900/10 rounded-lg border border-teal-100 dark:border-teal-900/30 text-xs">
                    <p className="text-teal-700 dark:text-teal-400">
                      <span className="font-medium">Tip:</span> These values will replace the placeholders in your template content.
                      For example, <code className="bg-white dark:bg-neutral-800 px-1 py-0.5 rounded border border-teal-200 dark:border-teal-800/30 text-[10px]">{'{{date}}'}</code> will be replaced with the value you enter for "date".
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Priority Selection */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
              <div className="border-l-4 border-l-amber-500 dark:border-l-amber-600 p-4">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Delivery Priority</div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Set the importance level of this broadcast</p>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {priorityOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handlePriorityChange(option.value)}
                      className={`p-3 rounded-lg border transition-all ${formData.priority === option.value
                        ? option.value === 'low' ? 'border-neutral-500 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/80'
                          : option.value === 'medium' ? 'border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                            : option.value === 'high' ? 'border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10'
                              : 'border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                        }`}
                    >
                      <div className="flex items-center mb-1.5">
                        <h3 className={`text-sm font-medium ${formData.priority === option.value
                          ? option.value === 'low' ? 'text-neutral-700 dark:text-neutral-300'
                            : option.value === 'medium' ? 'text-blue-700 dark:text-blue-400'
                              : option.value === 'high' ? 'text-amber-700 dark:text-amber-400'
                                : 'text-red-700 dark:text-red-400'
                          : 'text-neutral-700 dark:text-neutral-300'
                          }`}>
                          {option.label}
                        </h3>
                        {formData.priority === option.value && (
                          <div className={`ml-auto w-3.5 h-3.5 rounded-full ${option.value === 'low' ? 'bg-neutral-500 dark:bg-neutral-400'
                            : option.value === 'medium' ? 'bg-blue-500 dark:bg-blue-400'
                              : option.value === 'high' ? 'bg-amber-500 dark:bg-amber-400'
                                : 'bg-red-500 dark:bg-red-400'
                            } flex items-center justify-center`}>
                            <CheckCircle size={8} className="text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-500">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
              <div className="border-l-4 border-l-blue-500 dark:border-l-blue-600 p-4">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Schedule</div>
                  <div className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">Step 3</div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Set when your broadcast should be delivered</p>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="scheduled_at" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Date and Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar size={14} className="text-neutral-400 dark:text-neutral-500" />
                      </div>
                      <input
                        type="datetime-local"
                        id="scheduled_at"
                        name="scheduled_at"
                        value={formData.scheduled_at}
                        onChange={handleDateChange}
                        className="w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-750 text-sm"
                      />
                    </div>

                    <div className="mt-2 flex items-start">
                      <Clock size={12} className="text-neutral-400 dark:text-neutral-500 mt-0.5 flex-shrink-0" />
                      <p className="ml-2 text-xs text-neutral-500 dark:text-neutral-500">
                        Leave empty to save as draft without scheduling.
                      </p>
                    </div>
                  </div>

                  {formData.scheduled_at && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                      <h4 className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">Broadcast Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-500 dark:text-neutral-500">Channel:</span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200 capitalize font-mono">{formData.channel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500 dark:text-neutral-500">Priority:</span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200 capitalize font-mono">{formData.priority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500 dark:text-neutral-500">Audience:</span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200 font-mono">
                            {(formData.audience.gender || formData.audience.country || formData.audience.kyc_level) ?
                              'Custom filter' : 'All users'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500 dark:text-neutral-500">Schedule:</span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200 font-mono">
                            {new Date(formData.scheduled_at).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/admin/communication/broadcasts')}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-all flex items-center"
            >
              <ArrowLeft size={14} className="mr-1.5" />
              Back
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="px-4 py-2 border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-blue-700 dark:text-blue-400 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all flex items-center"
                disabled={isSubmitting}
              >
                <Save size={14} className="mr-1.5" />
                Save as Draft
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg text-white text-sm transition-all flex items-center shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={14} className="animate-spin mr-1.5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={14} className="mr-1.5" />
                    Schedule Broadcast
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBroadcastPage;
