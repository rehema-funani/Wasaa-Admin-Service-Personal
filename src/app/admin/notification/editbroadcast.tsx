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
  Loader,
  X,
  CheckCircle,
  Target,
  BarChart,
  Zap,
  PlayCircle,
  PauseCircle,
  Eye
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { notificationService } from '../../../api/services/notification';

const EditBroadcastPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

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
    status: 'draft',
    recipient_count: 0
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

  // Fetch broadcast data when component mounts
  useEffect(() => {
    const fetchBroadcast = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const broadcast = await notificationService.getBroadcast(id);

        // Format the date for the datetime-local input
        let formattedDate = '';
        if (broadcast.scheduled_at) {
          const date = new Date(broadcast.scheduled_at);
          formattedDate = date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
        }

        // Initialize audience object structure if missing
        const audienceObj = {
          gender: broadcast.audience?.gender || '',
          country: broadcast.audience?.country || '',
          kyc_level: broadcast.audience?.kyc_level || ''
        };

        // Initialize payload object structure if missing
        const payloadObj = {
          key1: broadcast.payload?.key1 || '',
          key2: broadcast.payload?.key2 || ''
        };

        setFormData({
          ...broadcast,
          scheduled_at: formattedDate,
          audience: audienceObj,
          payload: payloadObj,
          priority: broadcast.priority || 'medium'
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load broadcast data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBroadcast();
  }, [id]);

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
        status: saveAsDraft ? 'draft' : formData.status === 'draft' ? 'scheduled' : formData.status
      };

      await notificationService.updateBroadcast(id, broadcastData);
      setSuccessMessage('Broadcast updated successfully!');
      setTimeout(() => {
        navigate(-1);
      }, 1500);

    } catch (err) {
      console.error(err);
      setError('Failed to update broadcast. Please try again.');
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 flex items-center">
            Draft
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600 flex items-center">
            <Calendar size={14} className="mr-1.5" />
            Scheduled
          </span>
        );
      case 'sending':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-600 flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-1.5 animate-pulse"></span>
            Sending
          </span>
        );
      case 'paused':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-600 flex items-center">
            <PauseCircle size={14} className="mr-1.5" />
            Paused
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-600 flex items-center">
            <CheckCircle size={14} className="mr-1.5" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-600 flex items-center">
            <AlertTriangle size={14} className="mr-1.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show template preview overlay
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Check if broadcast can be edited based on status
  const isEditable = ['draft', 'scheduled', 'paused'].includes(formData.status);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div>
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-blue-100 opacity-70 animate-pulse"></div>
            <div className="relative z-10 w-16 h-16 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mt-5 mb-2">Loading Broadcast</h3>
          <p className="text-slate-500 text-center">Retrieving your broadcast details...</p>

          <div className="w-full mt-6">
            <div className="h-2 bg-slate-100 rounded-full w-full mb-2.5 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse-width"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state for fetch failure
  if (error && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Failed to Load Broadcast</h3>
          <p className="text-slate-500 mt-2 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-indigo-100"
          >
            Return to Broadcasts
          </button>
        </div>
      </div>
    );
  }

  // Success message overlay
  if (successMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={24} className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Broadcast Updated</h3>
          <p className="text-slate-500 mt-2 text-center">{successMessage}</p>
          <p className="text-slate-400 text-sm mt-2 text-center">Redirecting to broadcast list...</p>

          <div className="w-full mt-6">
            <div className="h-2 bg-slate-100 rounded-full w-full mb-2.5 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-pulse-width"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Template preview overlay */}
      {showPreview && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-0 overflow-hidden relative">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div>
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Eye size={18} className="mr-2 text-blue-500" />
                Template Preview
              </h3>
              <button
                onClick={togglePreview}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[calc(100vh-150px)] overflow-auto">
              <div className="border border-slate-200 rounded-xl p-4 mb-4 bg-slate-50">
                <div className="font-medium text-slate-500 mb-1 text-sm">Template</div>
                <div className="font-semibold text-slate-800">{templateOptions.find(t => t.code === formData.template_code)?.name || 'Unknown Template'}</div>
              </div>

              {formData.channel === 'email' && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="border-b border-slate-200 p-3 bg-slate-50 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-slate-500">From: noreply@yourcompany.com</div>
                      <div className="text-sm text-slate-500">To: recipient@example.com</div>
                      <div className="text-sm font-medium text-slate-800">Subject: {formData.title}</div>
                    </div>
                    <Mail className="text-blue-500" size={20} />
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <img src="https://via.placeholder.com/600x100?text=Your+Company+Logo" alt="Company Logo" className="max-w-full h-auto rounded" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">{formData.title}</h2>
                    <p className="text-slate-600 mb-4">Dear Valued Customer,</p>
                    <p className="text-slate-600 mb-4">This is a preview of the email template "{templateOptions.find(t => t.code === formData.template_code)?.name}". The actual content will be populated when the broadcast is sent.</p>
                    {formData.payload.key1 && (
                      <p className="text-slate-600 mb-4">Custom data: {formData.payload.key1}</p>
                    )}
                    {formData.payload.key2 && (
                      <p className="text-slate-600 mb-4">Additional info: {formData.payload.key2}</p>
                    )}
                    <p className="text-slate-600 mb-4">Best regards,<br />Your Company Team</p>
                    <div className="mt-6 pt-6 border-t border-slate-200 text-sm text-slate-500">
                      <p>© 2025 Your Company. All rights reserved.</p>
                      <p className="mt-2">You received this email because you opted in to receive notifications.</p>
                    </div>
                  </div>
                </div>
              )}

              {formData.channel === 'sms' && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="border-b border-slate-200 p-3 bg-slate-50 flex justify-between items-center">
                    <div className="font-medium text-slate-800">SMS Preview</div>
                    <MessageSquare className="text-emerald-500" size={20} />
                  </div>
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-white">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 max-w-md mx-auto">
                      <p className="text-slate-800">
                        Your Company: {formData.title} - This is a preview of the SMS template.
                        {formData.payload.key1 ? ` ${formData.payload.key1}` : ''}
                      </p>
                      <p className="text-xs text-slate-500 mt-3">
                        Reply STOP to unsubscribe
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {formData.channel === 'push' && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="border-b border-slate-200 p-3 bg-slate-50 flex justify-between items-center">
                    <div className="font-medium text-slate-800">Push Notification Preview</div>
                    <Bell className="text-amber-500" size={20} />
                  </div>
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-white">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 max-w-md mx-auto">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                          <span className="font-bold text-slate-800">YC</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">Your Company</h3>
                          <p className="text-slate-600">{formData.title}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            Now • Tap to open
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={togglePreview}
                className="px-6 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-100 transition-colors"
              >
                Close Preview
              </button>
            </div>
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
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Edit Broadcast</span>
                  </h1>
                  <div className="ml-4">
                    {getStatusBadge(formData.status)}
                  </div>
                </div>
                <p className="text-slate-500 text-sm mt-1">Update and manage your broadcast settings</p>
              </div>
            </div>

            <button
              onClick={togglePreview}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-100 transition-all"
            >
              <Eye size={16} className="mr-2" />
              Preview Template
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Non-editable warning */}
        {!isEditable && (
          <div className="mb-6 bg-amber-50 backdrop-blur-sm border border-amber-100 rounded-xl p-4 flex items-start shadow-lg animate-fade-in">
            <div className="h-10 w-10 flex-shrink-0 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-amber-600" size={20} />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-amber-800 font-medium">Limited Editing</h3>
              <p className="text-amber-700 mt-1">
                This broadcast is currently {formData.status}. Some fields cannot be modified.
                {formData.status === 'sending' && ' You can pause the broadcast from the broadcasts list to make changes.'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)}>
          {/* Error alert */}
          {error && !isLoading && (
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
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
                          disabled={!isEditable}
                          placeholder="Enter a catchy title for your broadcast"
                          className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all shadow-sm hover:border-blue-300 text-slate-800 placeholder-slate-400 ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                            disabled={!isEditable}
                            className={`w-full px-4 py-3 appearance-none bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all shadow-sm hover:border-blue-300 text-slate-800 ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => isEditable && handleChannelChange('email')}
                        className={`relative p-6 rounded-xl border-2 transition-all ${formData.channel === 'email'
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md shadow-blue-100'
                            : 'border-slate-200 hover:border-blue-200 hover:bg-blue-50/30'
                          } group ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={!isEditable}
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
                        onClick={() => isEditable && handleChannelChange('sms')}
                        className={`relative p-6 rounded-xl border-2 transition-all ${formData.channel === 'sms'
                            ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-md shadow-emerald-100'
                            : 'border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30'
                          } group ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={!isEditable}
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
                        onClick={() => isEditable && handleChannelChange('push')}
                        className={`relative p-6 rounded-xl border-2 transition-all ${formData.channel === 'push'
                            ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-md shadow-amber-100'
                            : 'border-slate-200 hover:border-amber-200 hover:bg-amber-50/30'
                          } group ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={!isEditable}
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
                            disabled={!isEditable}
                            className={`w-full px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 appearance-none ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                            disabled={!isEditable}
                            className={`w-full px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 appearance-none ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                            disabled={!isEditable}
                            className={`w-full px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 appearance-none ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                            disabled={!isEditable}
                            placeholder="Enter value"
                            className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all shadow-sm hover:border-teal-300 text-slate-800 ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                            disabled={!isEditable}
                            placeholder="Enter value"
                            className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all shadow-sm hover:border-teal-300 text-slate-800 ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                          onClick={() => isEditable && handlePriorityChange(option.value)}
                          disabled={!isEditable}
                          className={`relative p-4 rounded-xl border-2 transition-all ${formData.priority === option.value
                              ? option.value === 'low' ? 'border-slate-500 bg-slate-50'
                                : option.value === 'medium' ? 'border-blue-500 bg-blue-50'
                                  : option.value === 'high' ? 'border-amber-500 bg-amber-50'
                                    : 'border-red-500 bg-red-50'
                              : 'border-slate-200 hover:border-slate-300'
                            } group ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                          disabled={!isEditable}
                          className={`w-full pl-12 pr-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all shadow-sm hover:border-violet-300 text-slate-800 bg-white ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
                        />
                      </div>

                      <div className="mt-4 flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <Clock size={16} className="text-violet-500" />
                        </div>
                        <p className="ml-3 text-sm text-slate-600">
                          {formData.status === 'draft' ? (
                            <>Leave empty to save as draft without scheduling. <span className="text-violet-600 font-medium">Broadcasts can be scheduled later from the dashboard.</span></>
                          ) : (
                            <>Current status: <span className="text-violet-600 font-medium">{formData.status}</span></>
                          )}
                        </p>
                      </div>

                      {formData.scheduled_at && (
                        <div className="mt-4 p-3 bg-white/80 backdrop-blur-sm border border-violet-200 rounded-lg shadow-sm">
                          <h4 className="text-sm font-medium text-violet-700">Broadcast Summary</h4>
                          <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Scheduled for:</span>
                              <span className="font-medium text-slate-800">{formatDate(formData.scheduled_at)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Channel:</span>
                              <span className="font-medium text-slate-800 capitalize">{formData.channel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Priority:</span>
                              <span className="font-medium text-slate-800 capitalize">{formData.priority}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Potential reach:</span>
                              <span className="font-medium text-slate-800">{formData.recipient_count > 0 ? formData.recipient_count.toLocaleString() : 'To be calculated'} users</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Broadcast status card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden sticky top-24">
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600"></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Broadcast Status</h3>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-slate-500">Current Status</span>
                        {getStatusBadge(formData.status)}
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-500">Created</span>
                        <span className="text-sm font-medium text-slate-700">{formatDate(formData.createdAt)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Last Updated</span>
                        <span className="text-sm font-medium text-slate-700">{formatDate(formData.updatedAt)}</span>
                      </div>

                      {formData.scheduled_at && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-slate-500">Scheduled For</span>
                          <span className="text-sm font-medium text-slate-700">{formatDate(formData.scheduled_at)}</span>
                        </div>
                      )}
                    </div>

                    {/* Channel info */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Delivery Details</h4>

                      <div className="flex items-center mb-2">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${formData.channel === 'email'
                            ? 'bg-blue-100 text-blue-600'
                            : formData.channel === 'sms'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-amber-100 text-amber-600'
                          }`}>
                          {formData.channel === 'email'
                            ? <Mail size={16} />
                            : formData.channel === 'sms'
                              ? <MessageSquare size={16} />
                              : <Bell size={16} />
                          }
                        </span>
                        <span className="text-sm font-medium text-slate-800 capitalize">{formData.channel}</span>
                      </div>

                      <div className="flex items-center mb-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">
                          <Users size={16} />
                        </span>
                        <span className="text-sm font-medium text-slate-800">
                          {formData.recipient_count > 0 ? formData.recipient_count.toLocaleString() : 'To be calculated'} recipients
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mr-2">
                          <BarChart size={16} />
                        </span>
                        <span className="text-sm font-medium text-slate-800">
                          {formData.status === 'completed' ? 'Analytics Available' : 'Pending Analytics'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {isEditable && (
                      <div className="space-y-3">
                        <button
                          type="submit"
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white font-medium transition-all flex items-center justify-center shadow-lg hover:shadow-blue-100"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Save size={18} className="mr-2" />
                              {formData.status === 'draft' ? 'Schedule Broadcast' : 'Save Changes'}
                            </>
                          )}
                        </button>

                        {formData.status === 'draft' && (
                          <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            className="w-full px-4 py-3 border-2 border-blue-200 bg-blue-50 rounded-xl text-blue-700 font-medium hover:bg-blue-100 transition-all flex items-center justify-center"
                            disabled={isSubmitting}
                          >
                            <Save size={18} className="mr-2" />
                            Save as Draft
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => navigate(-1)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center"
                        >
                          <ArrowLeft size={18} className="mr-2" />
                          Back to List
                        </button>
                      </div>
                    )}

                    {!isEditable && (
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-xl text-white font-medium transition-all flex items-center justify-center"
                      >
                        <ArrowLeft size={18} className="mr-2" />
                        Return to Broadcasts
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBroadcastPage;
