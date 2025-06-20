import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Globe,
  HelpCircle,
  Info,
  Mail,
  MessageSquare,
  Save,
  Send,
  Users
} from 'lucide-react';
import { notificationService } from '../../../api/services/notification';

const CreateBroadcastPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [currentTab, setCurrentTab] = useState('content');

  const [broadcast, setBroadcast] = useState({
    name: '',
    templateId: '',
    subject: '',
    content: '',
    schedule: {
      sendAt: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    segmentId: '',
    data: {}
  });

  const [previewData, setPreviewData] = useState({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe'
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getTemplates();
      setTemplates(data);
      if (data.length > 0) {
        setBroadcast(prev => ({
          ...prev,
          templateId: data[0].id
        }));
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBroadcast(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setBroadcast(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [name]: value
      }
    }));
  };

  const handlePreviewDataChange = (e) => {
    const { name, value } = e.target;
    setPreviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = async (e) => {
    const templateId = e.target.value;
    setBroadcast(prev => ({
      ...prev,
      templateId
    }));

    if (templateId) {
      try {
        const template = await notificationService.getTemplateById(templateId);
        setBroadcast(prev => ({
          ...prev,
          subject: template.subject || '',
          content: template.content || ''
        }));
      } catch (error) {
        console.error('Failed to fetch template details:', error);
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const newBroadcast = { ...broadcast };

      // If not scheduling, remove schedule property
      if (!showSchedule) {
        delete newBroadcast.schedule;
      }

      const createdBroadcast = await notificationService.createBroadcast(newBroadcast);

      if (showSchedule && newBroadcast.schedule?.sendAt) {
        await notificationService.scheduleBroadcast(createdBroadcast.id, newBroadcast.schedule);
      }

      // Redirect to broadcasts list or show success
      alert('Broadcast created successfully!');
      // history.push('/broadcasts');
    } catch (error) {
      console.error('Failed to create broadcast:', error);
      alert('Failed to create broadcast. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendNow = async () => {
    setSubmitting(true);

    try {
      const newBroadcast = { ...broadcast };
      delete newBroadcast.schedule;

      const createdBroadcast = await notificationService.createBroadcast(newBroadcast);
      await notificationService.executeBroadcast(createdBroadcast.id);

      alert('Broadcast sent successfully!');
      // history.push('/broadcasts');
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      alert('Failed to send broadcast. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Mock templates for demo
  const mockTemplates = [
    { id: '1', name: 'Product Update Template' },
    { id: '2', name: 'Newsletter Template' },
    { id: '3', name: 'Welcome Email Template' },
    { id: '4', name: 'Feedback Request Template' }
  ];

  return (
    <div className="space-y-6 bg-white text-slate-800">
      <div className="flex items-center">
        <button
          onClick={() => { }}
          className="mr-4 p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-slate-900">Create Broadcast</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex space-x-4">
                  <button
                    className={`py-2 px-4 text-sm font-medium transition-colors ${currentTab === 'content'
                        ? 'text-emerald-500 border-b-2 border-emerald-500'
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                    onClick={() => setCurrentTab('content')}
                  >
                    Content
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium transition-colors ${currentTab === 'recipients'
                        ? 'text-emerald-500 border-b-2 border-emerald-500'
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                    onClick={() => setCurrentTab('recipients')}
                  >
                    Recipients
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium transition-colors ${currentTab === 'schedule'
                        ? 'text-emerald-500 border-b-2 border-emerald-500'
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                    onClick={() => setCurrentTab('schedule')}
                  >
                    Schedule
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {currentTab === 'content' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Broadcast Name
                        <span className="text-xs text-slate-400 font-normal ml-1">(Internal use only)</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={broadcast.name}
                        onChange={handleChange}
                        placeholder="e.g. June Newsletter"
                        className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Template
                      </label>
                      <div className="relative">
                        <select
                          name="templateId"
                          value={broadcast.templateId}
                          onChange={handleTemplateChange}
                          className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800"
                        >
                          <option value="">Select a template</option>
                          {(templates.length > 0 ? templates : mockTemplates).map(template => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={broadcast.subject}
                        onChange={handleChange}
                        placeholder="Enter subject line"
                        className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800"
                      />
                    </div>

                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700">
                          Content
                        </label>
                        <button
                          type="button"
                          className="text-xs text-emerald-500 hover:text-emerald-600 flex items-center"
                        >
                          <HelpCircle size={14} className="mr-1" />
                          Template Variables
                        </button>
                      </div>
                      <textarea
                        name="content"
                        value={broadcast.content}
                        onChange={handleChange}
                        placeholder="Enter email content. Use {{ variable }} for dynamic content."
                        className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800 h-64 font-mono text-sm"
                      />
                    </div>
                  </>
                )}

                {currentTab === 'recipients' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Recipient Group
                      </label>
                      <div className="relative">
                        <select
                          name="segmentId"
                          value={broadcast.segmentId}
                          onChange={handleChange}
                          className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800"
                        >
                          <option value="">All Subscribers</option>
                          <option value="active">Active Users</option>
                          <option value="inactive">Inactive Users</option>
                          <option value="premium">Premium Subscribers</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                      <div className="flex items-start">
                        <Users className="text-emerald-500 mt-1 mr-3" size={20} />
                        <div>
                          <h3 className="font-medium text-slate-800 mb-1">Estimated Recipients</h3>
                          <p className="text-sm text-slate-600 mb-2">
                            This broadcast will be sent to approximately <span className="text-slate-900 font-medium">2,547</span> recipients.
                          </p>
                          <button
                            type="button"
                            className="text-xs text-emerald-500 hover:text-emerald-600 flex items-center"
                          >
                            <Info size={14} className="mr-1" />
                            View recipient details
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentTab === 'schedule' && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="scheduleToggle"
                          checked={showSchedule}
                          onChange={() => setShowSchedule(!showSchedule)}
                          className="h-4 w-4 rounded border-gray-300 bg-white text-emerald-500 focus:ring-emerald-500 focus:ring-offset-white"
                        />
                        <label htmlFor="scheduleToggle" className="text-sm font-medium text-slate-700">
                          Schedule this broadcast for later
                        </label>
                      </div>

                      {showSchedule && (
                        <div className="pl-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Send Date & Time
                            </label>
                            <input
                              type="datetime-local"
                              name="sendAt"
                              value={broadcast.schedule.sendAt}
                              onChange={handleScheduleChange}
                              className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Timezone
                            </label>
                            <div className="relative">
                              <select
                                name="timezone"
                                value={broadcast.schedule.timezone}
                                onChange={handleScheduleChange}
                                className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800"
                              >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="Europe/Paris">Paris (CET)</option>
                                <option value="Asia/Tokyo">Tokyo (JST)</option>
                              </select>
                              <Globe className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                            </div>
                          </div>

                          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                            <div className="flex">
                              <Calendar className="text-emerald-500 mt-1 mr-3" size={20} />
                              <div>
                                <h3 className="font-medium text-slate-800 mb-1">Scheduled Time</h3>
                                <p className="text-sm text-slate-600">
                                  This broadcast will be sent on {' '}
                                  <span className="text-slate-900">
                                    {broadcast.schedule.sendAt ?
                                      new Date(broadcast.schedule.sendAt).toLocaleString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        timeZoneName: 'short',
                                        timeZone: broadcast.schedule.timezone
                                      }) : '(select a date and time)'}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => { }}
                  className="py-2 px-4 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center shadow-sm"
                >
                  Cancel
                </button>

                <div className="space-x-3 flex">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="py-2 px-4 bg-gray-100 text-slate-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center shadow-sm"
                  >
                    <Save size={18} className="mr-2" />
                    Save as Draft
                  </button>

                  {currentTab === 'schedule' && showSchedule ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center shadow-sm"
                    >
                      <Clock size={18} className="mr-2" />
                      Schedule
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendNow}
                      disabled={submitting}
                      className="py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center shadow-sm"
                    >
                      <Send size={18} className="mr-2" />
                      Send Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="font-medium text-slate-800">Preview</h2>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="py-1 px-3 text-xs bg-gray-100 text-slate-700 rounded hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Mail size={14} className="mr-1" />
                    Email
                  </button>
                  <button
                    type="button"
                    className="py-1 px-3 text-xs bg-gray-100 text-slate-700 rounded hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <MessageSquare size={14} className="mr-1" />
                    Push
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-700">Preview Data</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={previewData.email}
                        onChange={handlePreviewDataChange}
                        className="w-full bg-white border border-gray-300 rounded py-1.5 px-3 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={previewData.firstName}
                        onChange={handlePreviewDataChange}
                        className="w-full bg-white border border-gray-300 rounded py-1.5 px-3 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={previewData.lastName}
                        onChange={handlePreviewDataChange}
                        className="w-full bg-white border border-gray-300 rounded py-1.5 px-3 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="w-full py-2 px-4 bg-gray-100 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center shadow-sm"
                  >
                    <Check size={18} className="mr-2" />
                    Update Preview
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <div className="text-xs text-slate-500 truncate flex-1">
                      {broadcast.subject || 'Your Subject Line'}
                    </div>
                  </div>

                  <div className="bg-white p-4 h-96 overflow-auto border-t border-gray-200">
                    <div className="text-slate-900 text-sm whitespace-pre-wrap">
                      {broadcast.content
                        ? broadcast.content
                          .replace(/{{firstName}}/g, previewData.firstName)
                          .replace(/{{lastName}}/g, previewData.lastName)
                          .replace(/{{email}}/g, previewData.email)
                        : 'Select a template or enter content to see preview.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBroadcastPage;
