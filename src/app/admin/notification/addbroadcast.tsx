import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../../api/services/notification';

const AddBroadcastPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    template_code: '',
    channel: 'email',
    scheduled_at: '',
    audience: {
      gender: '',
      country: '',
      kyc_level: ''
    },
    payload: {
      key1: '',
      key2: ''
    },
    priority: 'medium',
    status: 'draft'
  });

  // Template options - in a real app, these would likely come from an API
  const templateOptions = [
    { code: 'welcome_template', name: 'Welcome Template', description: 'Send a warm welcome to new users' },
    { code: 'password_reset', name: 'Password Reset', description: 'Help users recover their account access' },
    { code: 'order_confirmation', name: 'Order Confirmation', description: 'Confirm successful transactions' },
    { code: 'promotion_announcement', name: 'Promotion Announcement', description: 'Highlight special offers and promotions' }
  ];

  // Audience filter options
  const genderOptions = [
    { value: '', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const countryOptions = [
    { value: '', label: 'All Countries' },
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleChannelChange = (channel) => {
    setFormData({
      ...formData,
      channel
    });
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

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a broadcast title');
      return;
    }

    if (!formData.template_code) {
      setError('Please select a template');
      return;
    }

    // Check if at least one audience filter is set
    const hasAudienceFilter = Object.values(formData.audience).some(value => value !== '');
    if (!hasAudienceFilter) {
      setError('Please select at least one audience filter');
      return;
    }

    if (!saveAsDraft && !formData.scheduled_at) {
      setError('Please set a scheduled date and time');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const broadcastData = {
        ...formData,
        status: saveAsDraft ? 'draft' : 'scheduled'
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

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email':
        return <Mail className="text-blue-500" />;
      case 'sms':
        return <MessageSquare className="text-emerald-500" />;
      case 'push':
        return <Bell className="text-amber-500" />;
      default:
        return <Mail className="text-slate-500" />;
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 1:
        return <Zap size={20} />;
      case 2:
        return <Target size={20} />;
      case 3:
        return <Calendar size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className={`absolute animate-confetti-${i % 5} bg-${i % 2 ? 'blue' : i % 3 ? 'emerald' : 'amber'}-${300 + (i % 3) * 100} w-2 h-2 rounded-full`}
                style={{
                  top: `-10px`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white sticky top-0 border-b border-slate-100 z-10 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-full hover:bg-slate-100 transition-colors group"
              >
                <ArrowLeft size={20} className="text-slate-500 group-hover:text-slate-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Create New Broadcast</span>
                  <span className="ml-3 flex h-6 items-center">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                    </span>
                  </span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Set up a new broadcast to engage with your audience</p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="hidden md:flex items-center space-x-2">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`flex items-center ${step < activeStep ? 'text-blue-500' : step === activeStep ? 'text-blue-700' : 'text-slate-400'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step < activeStep
                      ? 'bg-blue-100 text-blue-600'
                      : step === activeStep
                        ? 'bg-blue-600 text-white ring-2 ring-blue-100 ring-offset-2'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                    {step < activeStep ? (
                      <CheckCircle size={16} />
                    ) : (
                      getStepIcon(step)
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`w-10 h-1 ${step < activeStep ? 'bg-blue-400' : 'bg-slate-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => handleSubmit(e, false)}>
          {/* Error alert */}
          {error && (
            <div className="mb-6 bg-red-50 backdrop-blur-sm border border-red-100 rounded-xl p-4 flex items-start shadow-lg animate-fade-in">
              <div className="h-10 w-10 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
              <button
                type="button"
                className="ml-4 text-red-500 hover:text-red-700"
                onClick={() => setError(null)}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Form sections */}
          <div className="space-y-8">
            {/* Broadcast details */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-all hover:shadow-xl group">
              {/* Section header with gradient accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Zap className="text-blue-600" size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Broadcast Details</h2>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 ml-13">Define the basic information for your broadcast</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">Step 1 of 3</span>
                </div>

                <div className="space-y-6">
                  <div className="group/field">
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2 group-hover/field:text-blue-600 transition-colors">
                      Broadcast Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a catchy title for your broadcast"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all shadow-sm hover:border-blue-300 text-slate-800 placeholder-slate-400"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">A clear title helps you identify this broadcast later</p>
                  </div>

                  <div className="group/field">
                    <label htmlFor="template_code" className="block text-sm font-medium text-slate-700 mb-2 group-hover/field:text-blue-600 transition-colors">
                      Communication Template
                    </label>
                    <div className="relative">
                      <select
                        id="template_code"
                        name="template_code"
                        value={formData.template_code}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 appearance-none bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all shadow-sm hover:border-blue-300 text-slate-800"
                      >
                        <option value="">Select a template</option>
                        {templateOptions.map(template => (
                          <option key={template.code} value={template.code}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {formData.template_code && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-sm text-blue-700">
                          {templateOptions.find(t => t.code === formData.template_code)?.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Channel selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-all hover:shadow-xl">
              {/* Section header with gradient accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                        <MessageSquare className="text-emerald-600" size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Communication Channel</h2>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 ml-13">Choose how you want to reach your audience</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">Step 2 of 3</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleChannelChange('email')}
                    className={`relative p-6 rounded-xl border-2 transition-all ${formData.channel === 'email'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md shadow-blue-100'
                        : 'border-slate-200 hover:border-blue-200 hover:bg-blue-50/30'
                      } group`}
                  >
                    <div className="absolute top-3 right-3">
                      {formData.channel === 'email' && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <CheckCircle size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${formData.channel === 'email'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-500 group-hover:bg-blue-200 transition-colors'
                      }`}>
                      <Mail size={24} />
                    </div>
                    <h3 className={`font-semibold text-lg ${formData.channel === 'email' ? 'text-blue-700' : 'text-slate-700'
                      }`}>Email</h3>
                    <p className="text-sm mt-1 text-slate-500">Send detailed messages to your users' inboxes</p>

                    {formData.channel === 'email' && (
                      <div className="mt-3 text-xs text-blue-600 flex items-center">
                        <span>Average open rate:</span>
                        <span className="ml-1 font-semibold">24.8%</span>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChannelChange('sms')}
                    className={`relative p-6 rounded-xl border-2 transition-all ${formData.channel === 'sms'
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-md shadow-emerald-100'
                        : 'border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30'
                      } group`}
                  >
                    <div className="absolute top-3 right-3">
                      {formData.channel === 'sms' && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <CheckCircle size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${formData.channel === 'sms'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-100 text-emerald-500 group-hover:bg-emerald-200 transition-colors'
                      }`}>
                      <MessageSquare size={24} />
                    </div>
                    <h3 className={`font-semibold text-lg ${formData.channel === 'sms' ? 'text-emerald-700' : 'text-slate-700'
                      }`}>SMS</h3>
                    <p className="text-sm mt-1 text-slate-500">Reach users directly on their mobile devices</p>

                    {formData.channel === 'sms' && (
                      <div className="mt-3 text-xs text-emerald-600 flex items-center">
                        <span>Average response rate:</span>
                        <span className="ml-1 font-semibold">19.2%</span>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChannelChange('push')}
                    className={`relative p-6 rounded-xl border-2 transition-all ${formData.channel === 'push'
                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-md shadow-amber-100'
                        : 'border-slate-200 hover:border-amber-200 hover:bg-amber-50/30'
                      } group`}
                  >
                    <div className="absolute top-3 right-3">
                      {formData.channel === 'push' && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                          <CheckCircle size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${formData.channel === 'push'
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100 text-amber-500 group-hover:bg-amber-200 transition-colors'
                      }`}>
                      <Bell size={24} />
                    </div>
                    <h3 className={`font-semibold text-lg ${formData.channel === 'push' ? 'text-amber-700' : 'text-slate-700'
                      }`}>Push Notification</h3>
                    <p className="text-sm mt-1 text-slate-500">Send instant alerts to users of your app</p>

                    {formData.channel === 'push' && (
                      <div className="mt-3 text-xs text-amber-600 flex items-center">
                        <span>Average click rate:</span>
                        <span className="ml-1 font-semibold">12.5%</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Audience selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-all hover:shadow-xl">
              {/* Section header with gradient accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <Target className="text-indigo-600" size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Target Audience</h2>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 ml-13">Define demographic filters for your target audience</p>
                  </div>

                  <div className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center">
                    <Users size={14} className="mr-1.5" />
                    <span>Demographic Targeting</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Gender Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Gender</label>
                    <div className="bg-slate-50 rounded-xl p-1 border border-slate-200">
                      <select
                        name="gender"
                        value={formData.audience.gender}
                        onChange={handleAudienceChange}
                        className="w-full px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 appearance-none"
                      >
                        {genderOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-slate-500">Target users by gender identity</p>
                  </div>

                  {/* Country Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Country</label>
                    <div className="bg-slate-50 rounded-xl p-1 border border-slate-200">
                      <select
                        name="country"
                        value={formData.audience.country}
                        onChange={handleAudienceChange}
                        className="w-full px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 appearance-none"
                      >
                        {countryOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-slate-500">Target users by geographic location</p>
                  </div>

                  {/* KYC Level Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">KYC Level</label>
                    <div className="bg-slate-50 rounded-xl p-1 border border-slate-200">
                      <select
                        name="kyc_level"
                        value={formData.audience.kyc_level}
                        onChange={handleAudienceChange}
                        className="w-full px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 appearance-none"
                      >
                        {kycLevelOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-slate-500">Target users by verification level</p>
                  </div>
                </div>

                {/* Active Audience Preview */}
                {(formData.audience.gender || formData.audience.country || formData.audience.kyc_level) && (
                  <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <h4 className="text-sm font-semibold text-indigo-700 mb-3">Active Audience Filters</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.audience.gender && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          Gender: {genderOptions.find(o => o.value === formData.audience.gender)?.label}
                        </span>
                      )}
                      {formData.audience.country && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          Country: {countryOptions.find(o => o.value === formData.audience.country)?.label}
                        </span>
                      )}
                      {formData.audience.kyc_level && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          KYC: {kycLevelOptions.find(o => o.value === formData.audience.kyc_level)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payload Data */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-all hover:shadow-xl">
              {/* Section header with gradient accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600"></div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                        <BarChart className="text-teal-600" size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Dynamic Content</h2>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 ml-13">Add custom data to personalize your broadcast</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">Key 1</label>
                      <input
                        type="text"
                        value="key1"
                        disabled
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">Value 1</label>
                      <input
                        type="text"
                        value={formData.payload.key1}
                        onChange={(e) => handlePayloadChange('key1', e.target.value)}
                        placeholder="Enter value"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all shadow-sm hover:border-teal-300 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">Key 2</label>
                      <input
                        type="text"
                        value="key2"
                        disabled
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">Value 2</label>
                      <input
                        type="text"
                        value={formData.payload.key2}
                        onChange={(e) => handlePayloadChange('key2', e.target.value)}
                        placeholder="Enter value"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all shadow-sm hover:border-teal-300 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <p className="text-sm text-teal-700">
                      <span className="font-medium">Tip:</span> These values will be used to personalize your message content. They can reference specific data points or custom content for your message.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-all hover:shadow-xl">
              {/* Section header with gradient accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"></div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <Zap className="text-amber-600" size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Delivery Priority</h2>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 ml-13">Set the importance level of this broadcast</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {priorityOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handlePriorityChange(option.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${formData.priority === option.value
                          ? option.value === 'low' ? 'border-slate-500 bg-slate-50'
                            : option.value === 'medium' ? 'border-blue-500 bg-blue-50'
                              : option.value === 'high' ? 'border-amber-500 bg-amber-50'
                                : 'border-red-500 bg-red-50'
                          : 'border-slate-200 hover:border-slate-300'
                        } group`}
                    >
                      <div className="absolute top-3 right-3">
                        {formData.priority === option.value && (
                          <div className={`w-5 h-5 rounded-full ${option.value === 'low' ? 'bg-slate-500'
                              : option.value === 'medium' ? 'bg-blue-500'
                                : option.value === 'high' ? 'bg-amber-500'
                                  : 'bg-red-500'
                            } flex items-center justify-center`}>
                            <CheckCircle size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className={`font-medium text-center ${formData.priority === option.value
                          ? option.value === 'low' ? 'text-slate-700'
                            : option.value === 'medium' ? 'text-blue-700'
                              : option.value === 'high' ? 'text-amber-700'
                                : 'text-red-700'
                          : 'text-slate-700'
                        }`}>
                        {option.label}
                      </h3>
                      <p className="text-xs mt-2 text-slate-500 text-center">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-all hover:shadow-xl">
              {/* Section header with gradient accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-600"></div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mr-3">
                        <Calendar className="text-violet-600" size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">Schedule</h2>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 ml-13">Set when your broadcast should be delivered</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 rounded-xl border border-violet-100">
                  <label htmlFor="scheduled_at" className="block text-sm font-medium text-slate-700 mb-2">
                    Date and Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Calendar size={18} className="text-violet-500" />
                    </div>
                    <input
                      type="datetime-local"
                      id="scheduled_at"
                      name="scheduled_at"
                      value={formData.scheduled_at}
                      onChange={handleDateChange}
                      className="w-full pl-12 pr-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all shadow-sm hover:border-violet-300 text-slate-800 bg-white"
                    />
                  </div>

                  <div className="mt-4 flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Clock size={16} className="text-violet-500" />
                    </div>
                    <p className="ml-3 text-sm text-slate-600">
                      Leave empty to save as draft without scheduling.
                      <span className="text-violet-600 font-medium"> Broadcasts can be scheduled later from the dashboard.</span>
                    </p>
                  </div>

                  {formData.scheduled_at && (
                    <div className="mt-4 p-3 bg-white/80 backdrop-blur-sm border border-violet-200 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-violet-700">Broadcast Summary</h4>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Channel:</span>
                          <span className="font-medium text-slate-800 capitalize">{formData.channel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Priority:</span>
                          <span className="font-medium text-slate-800 capitalize">{formData.priority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Audience:</span>
                          <span className="font-medium text-slate-800">
                            {(formData.audience.gender || formData.audience.country || formData.audience.kyc_level) ?
                              'Custom demographic filter' : 'No filter set'}
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
          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/admin/communication/broadcasts')}
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Broadcasts
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="px-6 py-3 border-2 border-blue-200 bg-blue-50 rounded-xl text-blue-700 font-medium hover:bg-blue-100 transition-all flex items-center shadow-sm"
                disabled={isSubmitting}
              >
                <Save size={18} className="mr-2" />
                Save as Draft
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white font-medium transition-all flex items-center shadow-lg hover:shadow-indigo-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
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
